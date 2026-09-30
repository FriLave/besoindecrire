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

> **Schéma de base** : le projet n'a pas encore de migrations (le schéma est créé par le mode `push` de Payload, actif seulement en développement). Tant que les migrations ne sont pas ajoutées, une base de production vierge n'a pas de tables. Lors d'un déploiement, une fois les migrations générées (`pnpm payload migrate:create`), les appliquer au démarrage avec l'option `prodMigrations` de `postgresAdapter` (fonctionne en image standalone, sans CLI Payload).

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
- **Stockage S3 obligatoire** (pas encore implémenté, cf. migrations/S3) : le disque de Vercel n'est pas persistant, donc `public/media` et `private-files/` (le téléchargement payant lit le disque local) ne fonctionnent pas en l'état.
- Variables d'env du projet, dont `CRON_SECRET` (Vercel l'envoie en `Authorization: Bearer`).

`vercel.json` déclenche chaque jour à 3 h `GET /api/payload-jobs/run?queue=maintenance` : cet endpoint planifie les tâches dues (`handleSchedules`) puis exécute la queue. Sur Vercel, `autoRun` et `instrumentation.ts` sont désactivés (pas de process long). L'accès est accepté avec `CRON_SECRET` uniquement quand `VERCEL` est défini. Les plans Hobby limitent les crons à une exécution par jour.

### Checklist de mise en production

- [ ] `NEXT_PUBLIC_SERVER_URL` et domaine canonique (`siteUrl` dans les réglages du site) corrects, en https.
- [ ] `noIndex` désactivé dans les réglages du site (activé en préproduction).
- [ ] SMTP renseigné (`SMTP_*`, `EMAIL_FROM_*`) : sans lui, les emails (dont les liens de téléchargement) sont seulement loggés.
- [ ] Module paiement : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, webhook Stripe vers `https://<domaine>/api/webhooks/stripe`.
- [ ] Vercel : `CRON_SECRET` défini.
- [ ] Secrets (`PAYLOAD_SECRET`, `PREVIEW_SECRET`) générés aléatoirement, mot de passe Postgres changé.
- [ ] Sauvegardes de la base et des volumes en place (à venir).
- [ ] Données de démo retirées, textes légaux relus.

## Zone client

`src/client/` est la **zone appartenant au client fork**. C'est le seul endroit à éditer
pour donner son identité à un nouveau projet (nom du site, description par défaut, etc.) :
le reste du code (`src/collections`, `src/blocks`, `src/utilities`...) est du code amont
partagé, à ne pas modifier pour une simple personnalisation client.

## Scripts utiles

```bash
pnpm dev                 # lance Payload + Next.js en développement
pnpm build                # build de production (Next.js)
pnpm start                # démarre le serveur en production
pnpm generate:types        # régénère les types TypeScript depuis la config Payload
pnpm generate:importmap    # régénère l'import map des composants admin custom
pnpm payload migrate       # applique les migrations de base de données
pnpm payload migrate:create # crée une nouvelle migration
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
