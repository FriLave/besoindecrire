# CLAUDE.md

Ce fichier donne le contexte du projet à Claude Code. Le but est de construire un **boilerplate Payload CMS** destiné à être revendu comme base pour des **sites vitrine**, où **tout le contenu éditable des pages passe par des Blocks**, afin que le client final puisse modifier son site sans toucher au code.

## 1. Vision du projet

- C'est un **produit**, pas un site unique : il doit être générique, propre, et facilement clonable/personnalisable pour chaque nouveau client.
- L'admin Payload doit permettre à un utilisateur non-technique de construire et modifier entièrement ses pages en assemblant des Blocks (texte, hero, galerie, témoignages, CTA, etc.).
- Objectif = zéro contenu en dur dans le code. Si un client doit changer un titre, une image, un texte, ça doit passer par l'admin.
- Le code doit rester assez simple pour être dupliqué/adapté rapidement d'un client à l'autre (pas de sur-ingénierie multi-tenant sauf demande explicite).
- **Le rendu et le SEO sont un argument de vente central** (le client paie pour un site rapide et bien référencé) : voir section 8, non négociable sur tout nouveau développement.

## 2. Portée actuelle du produit (scope)

- **Le cœur du boilerplate reste un site vitrine.** Pas de e-commerce complet (produits, panier, variantes, stock) tant qu'un besoin client réel ne le justifie pas.
- Le plugin officiel `@payloadcms/plugin-ecommerce` reste une option future si un client a un vrai besoin de boutique (catalogue produits, variantes, panier). Ne pas l'installer par défaut.
- Les besoins de paiement ponctuels et simples (ex: payer pour débloquer un PDF, un guide, une ressource) sont traités via un **module de paiement minimal maison** (voir section 7), pas via le plugin ecommerce — trop lourd pour ce cas d'usage.
- Faire évoluer le boilerplate **au fur et à mesure des besoins clients réels**, pas par anticipation. Chaque nouveau module (paiement, ecommerce complet, multilingue, etc.) doit rester optionnel/activable, jamais imposé au cœur vitrine.

## 3. Base de départ : template officiel Payload `website`

Le projet part du **template officiel Payload `website`** (`pnpx create-payload-app -t website`, ou clone de `templates/website` dans le repo Payload) plutôt que d'un projet from-scratch. Il couvre déjà une bonne partie de la plomberie exigée en section 8 (rendu/SEO) : layout builder par blocks, éditeur Lexical avec blocks intégrés, Draft Preview (versions + `drafts: true`), revalidation à la demande, Live Preview, plugin SEO, et front-end Tailwind/RSC déjà branché.

**À garder du template**
- Le pattern layout builder (config de block + composant de rendu + renderer central) — c'est la base de notre propre système de Blocks.
- L'éditeur Lexical et son support natif des blocks/médias/liens dans le rich text.
- Le système de Draft Preview (versions Payload, `drafts: true`) et le Live Preview.
- La revalidation à la demande (on-demand revalidation) déjà câblée entre Payload et Next.js.
- Le plugin SEO (`@payloadcms/plugin-seo`, si inclus) — à auditer et aligner avec les exigences de la section 8.
- La structure de dossiers (`src/blocks`, `src/collections`, `src/globals`, `src/fields`).

**À retirer / désactiver par défaut**
- Les collections orientées blog (`posts`, `categories`) et le block `Archive` si un client n'a pas besoin de blog — à garder en option activable, pas en socle imposé.
- Toutes les données de seed/démo (contenu, images d'exemple) — à nettoyer avant chaque nouvelle revente client.
- Le design system visuel par défaut du template (couleurs, typographie) — à remplacer par une base neutre et personnalisable par client.

**À renommer / étendre**
- Les blocks fournis par le template (`Hero`, `Content`, `Media`, `CallToAction`, `Archive`) sont à harmoniser avec notre convention de nommage et à compléter avec nos blocks produits (`FeatureGrid`, `Testimonials`, `FAQ`, `PricingTable`, `PaidDownloadBlock`, etc. — voir section 6).

**Process**
- Une fois forké et nettoyé, ce repo devient **la base git de référence** du boilerplate : les évolutions futures se font directement dessus, on ne re-clone pas le template à chaque nouveau projet.

## 4. Stack technique

- **Payload CMS** (dernière version stable, config TypeScript) comme CMS headless + admin.
- **Next.js (App Router)** comme frontend, en général dans le même repo que Payload (monorepo Payload/Next natif) sauf indication contraire.
- Base de données : Postgres (via Payload) par défaut, sauf mention contraire dans le projet.
- Stockage média : adapter local en dev, S3-compatible en prod.
- TypeScript strict partout. Types générés automatiquement par Payload (`payload generate:types`) — ne jamais dupliquer des types à la main pour des collections existantes.
- **UI : Tailwind CSS + shadcn/ui** comme socle de composants (voir section 9 pour les conventions d'usage).
- Stripe (mode Checkout simple) pour les besoins de paiement ponctuels — voir section 7. Pas de plugin ecommerce tant que non nécessaire.

## 5. Architecture "tout en Blocks"

- Chaque page éditable a un champ `layout` de type `blocks` dans sa collection (typiquement `pages`).
- Un Block = 1 config Payload (`src/blocks/<NomDuBlock>/config.ts`) + 1 composant React de rendu (`src/blocks/<NomDuBlock>/Component.tsx`) + son entrée dans le "block renderer" central (`src/blocks/RenderBlocks.tsx`).
- Convention de nommage : `PascalCase` pour le slug/nom du block (`Hero`, `FeatureGrid`, `Testimonials`, `CTABanner`, `FAQ`, `ContactForm`, `LogoCloud`, `PricingTable`, `PaidDownloadBlock`...).
- Chaque block doit être **autonome** : ses propres champs, ses propres styles, pas de dépendance cachée à un contenu codé en dur.
- Les blocks partagent des champs communs quand pertinent (ex: `paddingTop`/`paddingBottom`, `backgroundColor`) via des **fields réutilisables** dans `src/fields/` (pattern "field composition" Payload), pas du copier-coller.
- Toujours prévoir un block générique de secours (`RichTextBlock`) pour du contenu libre.
- Les Globals (`Header`, `Footer`, `SiteSettings`) sont aussi éditables depuis l'admin (logo, nav, réseaux sociaux, SEO par défaut, couleurs de marque si pertinent).
- **Chaque nouveau block par défaut doit être un Server Component.** Ne passer en Client Component (`"use client"`) que la partie interactive isolée (ex: un slider, un formulaire), jamais tout le block, pour ne pas alourdir le JS envoyé au client (voir section 8).

## 6. Collections & Globals de base attendus

- `pages` : slug, layout (blocks), champs SEO (title, description, image), statut (`draft`/`published`), preview.
- `media` : upload, alt text **obligatoire** (champ requis, jamais optionnel — impact direct SEO/accessibilité), largeur/hauteur stockées.
- `redirects` : collection pour gérer les redirections 301 quand un client renomme/supprime une page (slug source → destination). Indispensable pour ne pas casser le SEO existant lors des mises à jour client.
- `forms` / `form-submissions` (si `@payloadcms/plugin-form-builder` utilisé) pour les formulaires de contact générés depuis l'admin.
- Globals : `header` (logo, nav), `footer` (colonnes de liens, réseaux, mentions légales), `site-settings` (nom du site, SEO par défaut, favicon, couleurs si design system paramétrable, domaine canonique du site pour les URLs absolues).
- Prévoir un rôle `admin` et éventuellement un rôle `editor` restreint (accès uniquement au contenu, pas à la config technique).

## 7. Module paiement minimal — accès payant à un contenu (ex: PDF)

Cas d'usage : un client veut faire payer l'accès à une ressource téléchargeable (PDF, guide, ebook), sans avoir besoin d'un vrai système e-commerce (pas de panier, pas de catalogue produits).

**Ne pas utiliser `@payloadcms/plugin-ecommerce` pour ce cas** — utiliser Stripe Checkout directement, en mode paiement simple.

- **Collection `PaidDownloads`** : `title`, `description`, `price` (integer, en centimes), `file` (upload media, non exposé publiquement), `slug`.
- **Collection `Purchases`** : email de l'acheteur, relation vers `PaidDownloads`, `stripeSessionId`, `status` (`pending`/`paid`), `createdAt`. Sert de journal des achats et de base pour la vérification d'accès.
- **Block `PaidDownloadBlock`** : relation vers un document `PaidDownloads`, affiche titre/description/prix + bouton d'achat. Suit exactement le même pattern que les autres blocks (config + composant + entrée dans `RenderBlocks.tsx`).
- **Endpoint API custom** (`/api/checkout`) : crée une Stripe Checkout Session pour le `PaidDownload` demandé (`success_url` / `cancel_url`).
- **Webhook Stripe** (`/api/webhooks/stripe`) : à la confirmation du paiement (`checkout.session.completed`), crée/actualise l'entrée `Purchases` en `status: paid`, puis déclenche l'envoi d'un email avec un lien de téléchargement signé et à durée de vie limitée.
- **Le PDF n'est jamais servi via une URL publique directe.** Le téléchargement passe par un endpoint qui vérifie le token signé (et/ou l'achat en base) avant de streamer le fichier.
- Variables d'env par client : `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` — chaque client connecte son propre compte Stripe, pas de compte partagé.
- Ce module doit rester indépendant et activable/désactivable par projet (pas de dépendance dure depuis le reste du boilerplate vitrine).

## 8. Rendu & SEO (exigence non négociable)

Le produit vendu est un site vitrine : la performance de rendu et le référencement sont aussi importants que l'éditabilité en Blocks. Toute nouvelle fonctionnalité doit respecter ces règles.

**Stratégie de rendu**
- Les pages publiques (`pages`, articles, etc.) sont rendues en **SSG/ISR**, jamais en full client-side rendering. Utiliser `generateStaticParams` + `export const revalidate = <n>` (ou `fetch` avec `next: { revalidate }`).
- Revalidation ciblée à la publication : un hook Payload (`afterChange` sur `pages`) appelle une route de revalidation Next.js (`revalidatePath` / `revalidateTag`) pour que la page se mette à jour immédiatement après édition, sans attendre le revalidate périodique.
- Chaque Block reste un **Server Component par défaut** ; isoler le JS interactif (slider, accordéon, formulaire) dans un sous-composant client minimal.
- Preview / brouillon : utiliser le Live Preview de Payload pour que l'éditeur voit ses changements avant publication, sans impacter le rendu public en prod.

**Métadonnées & indexation**
- Chaque page expose ses champs SEO (`metaTitle`, `metaDescription`, `metaImage`) consommés par `generateMetadata` de Next.js : title, description, Open Graph, Twitter Card, URL canonique absolue (basée sur le domaine défini dans `site-settings`).
- Générer `sitemap.xml` dynamiquement (route Next.js `app/sitemap.ts`) à partir des pages publiées en Payload.
- Générer `robots.txt` dynamiquement (`app/robots.ts`), avec possibilité de le configurer depuis `site-settings` (ex: bloquer l'indexation en environnement de préprod).
- Ajouter des données structurées **JSON-LD** de base : `Organization`/`WebSite` au niveau global, `BreadcrumbList` par page, et un schéma dédié (`Product`, `Article`...) si un block le justifie.
- Prévoir une balise `<html lang="...">` correcte et, si multilingue plus tard, les balises `hreflang`.

**Performance / Core Web Vitals**
- Images : toujours via `next/image`, dimensions explicites (ou `fill` avec conteneur dimensionné) pour éviter le CLS, `priority` uniquement sur l'image above-the-fold (ex: Hero), lazy-loading par défaut ailleurs.
- Polices via `next/font` (self-hosted, pas de requête externe bloquante) pour éviter le layout shift et améliorer le LCP.
- Éviter le JS inutile : pas de librairie lourde pour un simple carrousel/accordéon si une primitive shadcn (souvent basée sur Radix, déjà accessible et légère) suffit.
- Vérifier régulièrement Lighthouse/PageSpeed sur les pages clés (accueil, page type) avant chaque livraison client.

## 9. Conventions de code

- Composants de rendu de blocks : fonctions pures, props typées via les types générés Payload (`Page['layout'][number]`), jamais de `any`.
- Séparer clairement : `src/blocks/*` (contenu éditable), `src/components/*` (UI générique/technique non éditable), `src/collections/*`, `src/globals/*`, `src/fields/*`.
- Styling : **Tailwind CSS** pour tout le layout/spacing/couleurs, avec un système de design tokens (couleurs, spacing, radius) centralisé via des variables CSS (`tailwind.config.ts` + `globals.css`) pour rester cohérent entre blocks et faciliter la personnalisation par client (thème = variables CSS à modifier, pas de refonte des composants).
- **shadcn/ui** comme socle de composants UI bas niveau (`Button`, `Card`, `Input`, `Dialog`, `Accordion`, etc.), installés via sa CLI dans `src/components/ui/*`. Ce sont des **primitives techniques non éditables** par l'utilisateur final — les Blocks les consomment mais ne les exposent jamais tels quels dans l'admin.
- Un Block ne réinvente pas un bouton/une card/un accordéon : il compose les primitives `src/components/ui/*` de shadcn plutôt que d'écrire du CSS/HTML brut, pour garder une UI cohérente à travers tous les blocks.
- Les fichiers générés par `shadcn` dans `src/components/ui/*` peuvent être adaptés (styles, variants) mais on évite de les dupliquer ou d'en créer des variantes ad hoc par block — on étend le composant partagé.
- Le thème (couleurs, radius, dark mode éventuel) est piloté par les variables CSS de shadcn/Tailwind, elles-mêmes idéalement reliées à `site-settings` (couleur de marque du client) plutôt que codées en dur.
- Accessibilité de base : alt text obligatoire, hiérarchie de titres cohérente dans chaque block (le premier bloc de page pose le H1, les suivants utilisent H2/H3) — impacte directement le SEO.

## 10. Commandes utiles

```bash
pnpm dev              # lance Payload + Next en dev
pnpm generate:types   # régénère les types TypeScript depuis la config Payload
pnpm payload migrate  # migrations DB
pnpm build            # build production
```

(Adapter selon le gestionnaire de paquets réellement utilisé dans le repo — vérifier le lockfile avant de supposer `pnpm`.)

## 11. À faire / à éviter

**À faire**
- Ajouter un nouveau block = créer sa config + son composant + l'enregistrer dans `RenderBlocks.tsx` + relancer `generate:types`.
- Documenter chaque nouveau block avec une courte description dans son fichier de config (`admin.description`) pour guider l'utilisateur final dans l'admin.
- Garder les blocks génériques et réutilisables d'un client à l'autre autant que possible.
- Garder les modules non-vitrine (paiement, futur e-commerce) isolés et optionnels — ne jamais les fondre dans le cœur du boilerplate.
- Systématiquement vérifier metadata, alt text, sitemap et Core Web Vitals avant de considérer un block/une page "terminée".

**À éviter**
- Ne jamais coder en dur du texte, une image ou un lien qui devrait être éditable par le client.
- Ne pas créer de collection ou de champ technique visible par l'éditeur non-technique sans le cacher (`admin.hidden` / rôles) ou l'expliquer clairement.
- Ne pas dupliquer la même logique de champ dans plusieurs blocks : factoriser dans `src/fields/`.
- Ne pas casser la compatibilité des types générés : toujours relancer `generate:types` après une modification de config.
- Ne pas installer `@payloadcms/plugin-ecommerce` ou complexifier l'admin tant qu'un besoin client réel ne le justifie pas.
- Ne jamais transformer un Block entier en Client Component par facilité — ça dégrade le rendu et le SEO.
- Ne jamais laisser une image sans dimensions ou sans alt, ni une page sans metaTitle/metaDescription.

## 12. Notes pour Claude Code

- Avant de créer un nouveau block, vérifier s'il n'en existe pas déjà un similaire dans `src/blocks/`.
- Après toute modification de collection/global/block, rappeler à l'utilisateur de lancer `generate:types` et, si besoin, une migration DB.
- Préférer des propositions de blocks génériques et paramétrables plutôt que des blocks ultra spécifiques à un seul client.
- Pour tout besoin de paiement, proposer d'abord le module minimal Stripe (section 7) avant de suggérer le plugin ecommerce complet.
- Pour tout nouveau block ou toute nouvelle page, vérifier systématiquement : rendu SSG/ISR (pas de client-side inutile), metadata SEO, alt text, dimensions d'image — voir section 8.
