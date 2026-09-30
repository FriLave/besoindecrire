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

## Stack

- Payload CMS (config TypeScript) + admin
- Next.js App Router (SSG/ISR, revalidation à la demande)
- Postgres via `@payloadcms/db-postgres`
- Tailwind CSS + shadcn/ui

Après toute modification d'une collection, d'un global ou d'un block, relancer
`pnpm generate:types` (et une migration si le schéma change).
