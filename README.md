# Payload CMS – Boilerplate site vitrine

Boilerplate resellable **Payload CMS** pour construire des sites vitrine. Chaque nouveau
client démarre par un fork de ce dépôt : tout le contenu éditable des pages passe par des
Blocks configurés dans l'admin, afin qu'un utilisateur non-technique puisse modifier son
site sans toucher au code.

Ce dépôt est forké depuis le template officiel Payload `website`, débarrassé du blog, de
la recherche et de la marque Payload. Voir `CLAUDE.md` pour la vision produit complète et
les conventions de code.

## Prérequis

- [Node.js](https://nodejs.org) 24 (voir `.nvmrc` — `nvm use`)
- [pnpm](https://pnpm.io)
- [Docker](https://www.docker.com) (pour Postgres en local via `docker-compose.yml`)

## Mise en route

1. Copier les variables d'environnement :

   ```bash
   cp .env.example .env
   ```

2. Démarrer Postgres :

   ```bash
   docker compose up -d
   ```

3. Installer les dépendances et lancer le serveur de développement :

   ```bash
   pnpm install
   pnpm dev
   ```

4. Ouvrir `http://localhost:3000/admin` et créer le premier compte administrateur
   (première inscription, `/admin/create-first-user`).

5. Optionnel : peupler la base avec du contenu de démonstration. En développement
   uniquement (l'endpoint est désactivé en production), une fois connecté à l'admin avec un compte superadmin :

   ```bash
   curl -X POST http://localhost:3000/next/seed \
     -H "Cookie: payload-token=<votre token de session>"
   ```

   Attention : cette opération est destructive, elle vide les collections avant de les
   repeupler.

## CI

`.github/workflows/ci.yml` (push et PR) : `quality` (`pnpm check`), `test` (Postgres 16, `test:int`, seed, build, `test:e2e`, rapport Playwright en artefact si échec) et `lighthouse` (build de prod seedé, `lhci autorun` selon `lighthouserc.json` : SEO/accessibilité/bonnes pratiques bloquants, performance en avertissement). Dependabot regroupe `payload`/`@payloadcms/*` et `next`.

`pnpm seed:local` peuple la base de démo via la Local API (sans serveur, sans passer par `/next/seed`, qui reste désactivé en production). Destructif.

## Déploiement

Deux options, selon le client : Docker (par défaut) ou Vercel.

> **Schéma de base** : voir « Migrations de base de données » ci-dessous. En production, les migrations commitées s'appliquent toutes seules au démarrage (`prodMigrations`) : une base vierge est initialisée par le conteneur Docker ou au cold start Vercel. Sur Vercel, on peut aussi appliquer les migrations pendant le build avec le build command `pnpm migrate && pnpm build` (nécessite `DATABASE_URL` au build).

### Docker

```bash
cp .env.example .env     # renseigner PAYLOAD_SECRET, PREVIEW_SECRET, NEXT_PUBLIC_SERVER_URL (https://...), SMTP_*, STRIPE_*
# optionnel : POSTGRES_PASSWORD=... et APP_PORT=... dans l'env du shell ou `--env-file`
docker compose -f docker-compose.prod.yml up --build -d
```

- L'app écoute sur le port 3000 (`APP_PORT`), `DATABASE_URL` est forcée vers le service `postgres` par le compose. Volumes : `media` (`public/media`), `private-files` (PDF payants) et `postgres-data`.
- Le build n'a pas besoin de base : `SKIP_BUILD_DB=1` (posé par le `Dockerfile`) fait renvoyer `[]` aux `generateStaticParams`. Les pages sont générées à la première requête puis mises en cache (ISR), et revalidées à la publication.
- Healthcheck : `GET /api/health` (200 + ping base). Le cron Payload (purge RGPD, queue `maintenance`) démarre avec le process (`src/instrumentation.ts`).
- Premier compte : `https://<domaine>/admin/create-first-user`.
- Données de démo (hors production uniquement, destructif) : `pnpm seed:local` depuis un poste ayant accès à la base.
- Reverse proxy : placer Caddy ou Traefik devant le service `app` pour le TLS (ne pas exposer le port 3000 tel quel) et le faire pointer sur `app:3000`.

### Vercel

Prérequis :

- Postgres managé (Neon, Supabase...) dans `DATABASE_URL`.
- **Stockage distant obligatoire** : le disque de Vercel n'est pas persistant. Voir « Stockage des fichiers » (Vercel Blob ou S3/R2 pour les médias, S3/R2 pour les PDF payants).
- Variables d'env du projet, dont `CRON_SECRET` (Vercel l'envoie en `Authorization: Bearer`).

`vercel.json` déclenche chaque jour à 3 h `GET /api/payload-jobs/run?queue=maintenance` : cet endpoint planifie les tâches dues (`handleSchedules`) puis exécute la queue. Sur Vercel, `autoRun` et `instrumentation.ts` sont désactivés (pas de process long). L'accès est accepté avec `CRON_SECRET` uniquement quand `VERCEL` est défini. Les plans Hobby limitent les crons à une exécution par jour.

### Sauvegardes

Le service `backup` de `docker-compose.prod.yml` (image `postgres:16-alpine` + `rclone`) lance `pg_dump -Fc` chaque jour à 2 h UTC (`BACKUP_CRON`, avant la purge de 3 h). Variables : voir `.env.example`.

- **Mode local** (défaut) : dumps `payload-<horodatage UTC>.dump` dans le volume `backups`. Sans copie hors de la machine, ce mode ne protège pas d'une perte du serveur : copier le volume ailleurs.
- **Mode S3** : si `BACKUP_S3_BUCKET` est défini (+ `BACKUP_S3_ENDPOINT`, `BACKUP_S3_REGION`, `BACKUP_S3_ACCESS_KEY_ID`, `BACKUP_S3_SECRET_ACCESS_KEY`, `BACKUP_S3_PREFIX` optionnel), le dump est envoyé vers le bucket (tout stockage compatible S3) et la copie locale supprimée.
- **Rétention** : `BACKUP_RETENTION_DAYS` (30 par défaut), appliquée au volume local ou au bucket à chaque sauvegarde.
- Sauvegarde immédiate : `docker compose -f docker-compose.prod.yml run --rm backup backup.sh`.
- Les médias (`media`, `private-files`) ne sont pas inclus : les sauvegarder séparément (snapshot des volumes, volume `garage-data` si Garage), ou passer en stockage S3 avec versioning/réplication chez le fournisseur.

**Restauration** (destructive : `--clean` remplace les objets de la base cible) :

```bash
# lister les dumps locaux
docker compose -f docker-compose.prod.yml run --rm backup ls /backups
# depuis le volume (ou depuis le bucket : donner le nom de l'objet, sans préfixe)
docker compose -f docker-compose.prod.yml run --rm backup restore.sh /backups/payload-20260101T020000Z.dump
```

Ajouter `--yes` pour ne pas demander de confirmation. Arrêter `app` avant de restaurer en production. Pour restaurer dans une autre base, surcharger `DATABASE_URL` (`run --rm -e DATABASE_URL=postgres://payload:<mdp>@postgres:5432/restored backup restore.sh ...`, après `create database restored`).

**Test de restauration à chaque livraison** : lancer une sauvegarde, la restaurer dans une base vide (`restored`, voir ci-dessus), comparer `select count(*) from pages` entre les deux bases, puis supprimer la base jetable.

**Vercel** : le service compose ne s'applique pas. S'appuyer sur les sauvegardes du Postgres managé (Neon ou Supabase : restauration à un instant donné, PITR) et vérifier la durée de rétention du plan choisi.

### Checklist de mise en production

- [ ] `NEXT_PUBLIC_SERVER_URL` et domaine canonique (`siteUrl` dans les réglages du site) corrects, en https.
- [ ] `noIndex` désactivé dans les réglages du site (activé en préproduction).
- [ ] SMTP renseigné (`SMTP_*`, `EMAIL_FROM_*`) : sans lui, les emails (dont les liens de téléchargement) sont seulement loggés.
- [ ] Module paiement : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, webhook Stripe vers `https://<domaine>/api/webhooks/stripe`.
- [ ] Vercel : `CRON_SECRET` défini.
- [ ] Secrets (`PAYLOAD_SECRET`, `PREVIEW_SECRET`) générés aléatoirement, mot de passe Postgres changé.
- [ ] Sauvegardes en place et restauration testée (voir « Sauvegardes »).
- [ ] Données de démo retirées, textes légaux relus.

## Stockage des fichiers

`STORAGE_DRIVER` choisit où vont les médias (`media`) et les PDF payants (`private-files`). Code : `src/storage/`.

| Driver           | Usage                                       | Variables                                                                                                                                 |
| ---------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `local` (défaut) | disque : `public/media` et `private-files/` | aucune                                                                                                                                    |
| `s3`             | AWS, R2, Scaleway, OVH, Garage, MinIO       | `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_ENDPOINT` (hors AWS), `S3_FORCE_PATH_STYLE=true` (Garage/MinIO) |
| `vercel-blob`    | médias uniquement                           | `BLOB_READ_WRITE_TOKEN`                                                                                                                   |

- `STORAGE_DRIVER_PRIVATE` (défaut : `STORAGE_DRIVER`) permet un driver différent pour les PDF payants.
- **Vercel Blob ne gère que des blobs publics** (`access: 'public'` seulement dans `@payloadcms/storage-vercel-blob` 3.90) : une URL non devinable mais publique ferait fuiter les PDF payants. Avec le module paiement, `STORAGE_DRIVER=vercel-blob` exige donc `STORAGE_DRIVER_PRIVATE=s3`, sinon l'app refuse de démarrer.
- **Médias (publics)** : si `S3_PUBLIC_URL` (CDN, domaine public R2) est défini, les URLs pointent directement vers lui (plus rapide, `next/image` l'autorise automatiquement). Sinon, ils passent par Payload (`/api/media/file/...`).
- **PDF payants** : jamais d'URL directe. Bucket privé, lecture uniquement via Payload (accès admin) ou `/api/downloads/:token` (lien signé). `S3_PRIVATE_BUCKET` optionnel : par défaut même bucket, sous le préfixe `private-files/`.
- Le schéma de base est identique quel que soit le driver (champs cachés `prefix` et `_objectKey`) : changer de driver ne demande pas de migration.

### Garage en local

```bash
docker compose up -d garage && pnpm storage:init
```

Le script (idempotent) configure Garage (layout, clé, buckets `media` et `private-files`) et affiche les lignes à coller dans `.env` (`STORAGE_DRIVER=s3`...). Sans cela, `.env` reste en `local`. En local, ne pas définir `S3_PUBLIC_URL` : Next.js refuse de charger des images depuis une adresse loopback.

### Recettes Vercel

- Vercel Blob (médias) + S3/R2 (PDF payants) : `STORAGE_DRIVER=vercel-blob`, `BLOB_READ_WRITE_TOKEN`, `STORAGE_DRIVER_PRIVATE=s3` + `S3_*`.
- S3/R2 pour tout : `STORAGE_DRIVER=s3` + `S3_*` (+ `S3_PUBLIC_URL` pour servir les médias en direct).

### Docker auto-hébergé

`docker compose -f docker-compose.prod.yml --profile storage up -d` ajoute Garage (volumes `garage-meta`, `garage-data`). Sans profil : volumes disque (`local`) ou S3 externe. Le stockage n'est pas dans `pg_dump` : sauvegarder le volume `garage-data`, ou s'appuyer sur le versioning/la réplication du fournisseur S3. Initialiser les buckets comme en local (`docker compose -f docker-compose.prod.yml exec garage /garage ...`, voir `scripts/storage/garage-init.sh`) et changer `rpc_secret` dans `docker/garage/garage.toml`.

### Migrer des fichiers existants vers S3

Copier les dossiers en gardant les noms de fichiers : `rclone sync public/media s3:media` et `rclone sync private-files s3:private-files` (ou `aws s3 sync`). Avec `S3_PRIVATE_BUCKET` absent, cibler `s3:<bucket>/private-files`.

## Zone client

`src/client/` est la **zone appartenant au client fork**. C'est le seul endroit à éditer
pour donner son identité à un nouveau projet (nom du site, description par défaut, etc.) :
le reste du code (`src/collections`, `src/blocks`, `src/utilities`...) est du code amont
partagé, à ne pas modifier pour une simple personnalisation client.

### Nouveau client : `pnpm client:init`

```bash
pnpm client:init          # interactif : nom, description, couleur de marque (#hex ou oklch), blog ?, paiement ?, domaine de prod
pnpm client:init --yes    # garde les valeurs actuelles (idempotent)
pnpm client:init --force  # régénère aussi PAYLOAD_SECRET / PREVIEW_SECRET dans un .env existant
```

Réécrit `src/client/site.ts`, les couleurs `--brand` / `--brand-foreground` (clair et sombre) de
`src/client/theme.css`, `src/client/modules.ts` et le `name` de `package.json`. Crée `.env`
depuis `.env.example` avec des secrets aléatoires s'il n'existe pas. Ensuite : `docker compose up -d`,
`pnpm dev`, `/admin/create-first-user`, éventuellement `pnpm seed:local` (destructif), puis
renseigner les réglages du site (`siteUrl`, onglet Légal). Changer les modules ne demande pas de
`pnpm generate:types` : les types couvrent tous les modules.

## Migrations de base de données

- **Dev** : le mode `push` de Payload synchronise la base avec la config automatiquement, rien à faire.
- **Après tout changement de schéma** (champ, collection, block, module) : `pnpm migrate:create`, puis commiter `src/migrations/`. Sans cela la production n'aura pas le changement, et la CI échoue (« Schema drift »).
- **Attention** : une base créée par `push` (dev) ne doit pas servir à un `pnpm start`/`dev:prod` : Payload y détecte le schéma poussé et demande confirmation (perte de données). Pour tester la prod en local, utiliser une base vierge (`pnpm migrate` d'abord).
- **Production** : les migrations en attente sont appliquées à l'init de Payload (`prodMigrations`), sans CLI.
- `migrate*` forcent `PAYLOAD_ALL_MODULES=1` (comme `generate:types`) : les migrations couvrent toujours tous les modules (blog, paiements...). Un fork qui désinstalle un module garde ses tables inertes et ne génère jamais de migration qui les supprime.
- **CI** : `pnpm migrate` sur base vierge, puis `pnpm migrate:create --skip-empty` ne doit rien produire. Les tests tournent ensuite avec `PAYLOAD_PUSH=0` (pas de `push` concurrent, d'où plus de courses). En local, `PAYLOAD_PUSH=0 pnpm migrate && PAYLOAD_PUSH=0 pnpm test:int` reproduit ce mode.

## Scripts utiles

```bash
pnpm dev                 # lance Payload + Next.js en développement
pnpm build                # build de production (Next.js)
pnpm start                # démarre le serveur en production
pnpm generate:types        # régénère les types TypeScript depuis la config Payload
pnpm generate:importmap    # régénère l'import map des composants admin custom
pnpm storage:init          # Garage local : buckets + clé, affiche les variables S3
pnpm migrate               # applique les migrations en attente
pnpm migrate:create        # crée une migration après un changement de schéma (à commiter)
pnpm migrate:status        # état des migrations
pnpm test:int              # tests d'intégration (Vitest)
pnpm test:e2e              # tests end-to-end (Playwright)
```

## Qualité de code

- `pnpm check` = `tsc --noEmit` + ESLint + Prettier (`format:check`). À lancer avant chaque livraison.
- Politique **zéro warning** : `pnpm lint` échoue au moindre warning (`--max-warnings 0`). Règles typées (promesses, `any`, imports de types, exhaustivité des `switch`) sur `src/` et `tests/`.
- `pnpm format` reformate le projet ; `pnpm lint:fix` applique les corrections automatiques.
- Hook pre-commit (`simple-git-hooks` + `lint-staged`, installé par `pnpm install` via `prepare`) : ESLint `--fix` + Prettier sur les fichiers indexés.

## Stack

- Payload CMS (config TypeScript) + admin
- Next.js App Router (SSG/ISR, revalidation à la demande)
- Postgres via `@payloadcms/db-postgres`
- Tailwind CSS + shadcn/ui

Après toute modification d'une collection, d'un global ou d'un block, relancer
`pnpm generate:types` (et une migration si le schéma change).

## Conformité légale (France)

Inclus, prêt à remplir :

- Onglet **Réglages du site > Légal** : éditeur (société ou EI), hébergeur, profession réglementée et DPO (optionnels), et pages légales liées au pied de page.
- Blocks `LegalNotice` (mentions légales, LCEN art. 1-1) et `PrivacyPolicy` (RGPD art. 13), rendus depuis ces réglages. Les textes juridiques sont des gabarits fixes (`src/i18n/legal.ts`) : **indicatifs, à faire valider par le client, ils ne constituent pas un conseil juridique**. Un champ « Contenu complémentaire » permet d'ajouter du texte.
- Pages seedées (fr/en) : mentions légales, politique de confidentialité, CGU génériques, avec des données de démo factices (« Exemple SAS »).
- Mention RGPD éditable sous le formulaire de contact, sans case à cocher (base légale : demande de l'utilisateur).
- Tâche Payload `purgeFormSubmissions` : supprime les messages du formulaire de plus de 3 ans (durée CNIL pour les prospects). Elle est planifiée chaque jour à 3 h (queue `maintenance`) par le cron intégré de Payload (`autoRun`), qui demande un process Node long-vivant (`pnpm start` / Docker) : limite connue en serverless.

À renseigner par le client : tout l'onglet Légal (SIREN, RCS/RNE, capital, directeur de publication, hébergeur...), relecture des textes, et remplacement des données de démo avant mise en ligne.

**Pas de bannière cookies par défaut** : le site n'utilise que des traceurs exemptés (session admin, thème en stockage local). Dès qu'on ajoute GA, un pixel, un embed YouTube/Maps ou reCAPTCHA, ajouter un CMP (bouton « Refuser » au même niveau que « Accepter », choix conservé 6 mois) et mettre à jour la politique de confidentialité.

Avec le module de paiement activé : CGV, médiateur de la consommation et mention de renonciation au droit de rétractation (C. conso L221-28) deviennent obligatoires.

Sources : [CNIL — FAQ cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ), [CNIL — mesure d'audience exemptée](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience), [CNIL — durées de conservation](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees), [service-public — mentions obligatoires d'un site](https://entreprendre.service-public.fr/vosdroits/F31228).
