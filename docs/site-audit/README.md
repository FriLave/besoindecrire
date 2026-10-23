# Audit initial — besoindecrire.com

Analyse du 2026-10-09. Base pour reprendre thème et contenus dans le boilerplate Payload.

## 1. Le client

- **Paulin Hassika** — accompagnant autobiographique depuis 2012, physicien, auteur, fondateur des **Éditions Besoin d'Écrire et de Lire (B.E.L.)**.
- Marque : **Besoin d'Écrire**. Baseline : *« Écrire sa vie. Comprendre son histoire. Devenir auteur. »* / *« Écrire pour se reconnaître. »*
- Conversion principale : **premier échange offert de 30 min** → `https://calendly.com/bdecrire/30min` (13 occurrences).
- Ton : sobre, littéraire, vouvoiement, phrases courtes, posture « non-directive » (je ne réécris pas, je ne corrige pas).

## 2. Stack actuelle

| Élément | Valeur |
|---|---|
| CMS | WordPress 7.0.6 |
| Thème | Astra (couleurs par défaut, non personnalisées) |
| Builder | Elementor 4.3.4 |
| Autres plugins | Popup Maker (popup « télécharger le guide gratuit »), SureForms, Site Kit by Google (Analytics), LiteSpeed Cache |
| Paiement | Liens Stripe Payment Links (PDF de livres) |
| Ressources gratuites | 6 mini-sites externes `*.zite.so` |
| Maison d'édition | blog externe `editionsbesoindecrireetdelire.over-blog.com` |

## 3. Thème / design system

**Seule la page d'accueil porte la vraie identité visuelle** : un bloc HTML/CSS sur mesure posé dans Elementor
(CSS complet copié dans [`theme-accueil.css`](./theme-accueil.css)). Les autres pages sont des pages Elementor/Astra
standard, sans cette charte → **c'est la page d'accueil qui fait référence pour le nouveau thème.**

### Palette

| Token | Hex | Usage |
|---|---|---|
| `--cream` | `#FAF7F2` | fond de page, nav (97 % opacité + blur) |
| `--ink` | `#1C1C1C` | texte, fond de la section « amorce » |
| `--sepia` | `#7A6A52` | texte secondaire, liens de nav, `em` des titres |
| `--sage` | `#4A5E52` | couleur d'action (boutons, labels, CTA) — hover `#3a4e43` |
| `--gold` | `#C8A96E` | accents (bordure gauche des légendes) |
| `--light-sepia` | `#F0EAE0` | fonds de blocs / photo |
| `--border` | `#E0D8CC` | bordures, séparateurs |
| `--white` | `#ffffff` | cartes |

### Typographie (Google Fonts)

- **Titres** : *Cormorant Garamond* 300 (aussi 400/600, italique 300/400). h1 `clamp(2.4rem, 4vw, 3.6rem)`, h2 `clamp(2rem, 3.5vw, 2.8rem)`, interligne 1.15–1.2. Mots-clés en *italique sépia*.
- **Texte** : *Lato* 300 (aussi 400/700), 16px, interligne 1.75.
- **Labels / nav / boutons** : Lato en capitales, 0.72–0.8rem, `letter-spacing` 0.1–0.18em.

### Motifs récurrents

- **Eyebrow / section-label** : petit texte vert sauge en capitales, précédé d'un trait de 20–28px.
- **Boutons** : `btn-primary` (fond sauge, blanc) et `btn-ghost` (bordure `--border`, texte sépia). `border-radius: 2px` partout (quasi carré).
- **Nav** : sticky, 64px, logo texte en Cormorant à gauche, liens d'ancre + CTA encadré « Premier échange → ».
- **Hero** : grille 2 colonnes (texte | photo 580px), `min-height: 92vh`, max 1200px.
- **Sections** : `padding: 6rem 2.5rem`, contenu max 1100px, paragraphes max 620px.
- **Amorce** : bande noire (`--ink`), citation en Cormorant italique blanc 85 %.
- **Cartes numérotées** « 01 / 02 / 03 », liste à flèches « → », cartes de formules (badge « La plus suivie »), cartes de témoignages (citation, nom, lieu, formule).

## 4. Arborescence et contenus

Le contenu de chaque page et article est extrait en Markdown dans [`pages/`](./pages) et [`posts/`](./posts).
Les pages sont toutes à plat (sans page parente).

### Menu principal (header Astra, pages internes)
Accueil · Bienvenue · Accompagnements · Auteurs accompagnés · Débloquer votre écriture · À propos · Mes livres · Blog · Qui suis-je

### Pages

| Slug | Titre | Mots | Contenu |
|---|---|---|---|
| `/` (`accueil-2`) | Accueil | 930 | Page longue avec ancres : hero → amorce → « Trois réalités rares » (3 piliers) → « Mon approche » (5 principes) → 3 formules → témoignages → portrait → CTA final. Charte de référence. |
| `bienvenue` | Bienvenue | 178 | Landing courte → appel gratuit Calendly. Recoupe largement le hero de l'accueil. |
| `accompagnement-ecriture` | Accompagnements | 346 | Détail des 3 formules + argument « accompagnement complet 12 mois ». |
| `temoignages` | Auteurs accompagnés | 565 | Fiches auteurs (nom, genre, titre du livre, formule, ville) + lien vers les Éditions B.E.L. |
| `debloquer-votre-ecriture` | Débloquer votre écriture | 368 | 6 guides gratuits (liens zite.so), revue de presse (Sud Ouest), CTA. |
| `a-propos` | À propos | 150 | Présentation de Besoin d'Écrire. Recoupe « Qui suis-je ». |
| `qui-suis-je` | Qui suis-je | 381 | Parcours, « Ce qui nourrit mon regard », « Ce que je crois », « Mon style de transmission ». |
| `mes-livres` | Mes livres | 1203 | 4 livres de l'auteur (dont *Jeanne, Entre plaines et gâtines* et *Kinta, et la sentence des 7*), chacun avec intention / cœur du livre / ce qu'il m'a appris / pour qui, et un PDF payant via Stripe. |

### Offre (3 formules)

| Formule | Durée | Pour qui |
|---|---|---|
| Découverte | 1 mois | « sentent l'appel mais ne savent pas par où entrer » |
| Trajectoire *(la plus suivie)* | 6 mois | « ont commencé mais n'arrivent pas à tenir seuls » |
| Premium | 12 mois | « veulent aller jusqu'au bout et devenir auteur » (écriture → ISBN → présence d'auteur) |

Aucun prix n'est affiché pour les formules : la vente passe par l'appel Calendly.

### Blog
Une seule catégorie, « Blog » (`/category/blog/`), avec **10 articles** publiés entre avril et juillet 2026 (580–860 mots chacun), sur l'écriture de soi, la biographie, l'histoire familiale et l'auto-édition.

### Médias
Logo `logo-BEL-JPG-scaled.jpg`, portrait `Photo-Linkedin-1.jpeg`, photos `DSC_2036`/`DSC_2043`, 3 captures `image_2025-12-21_*.png` (couvertures ?). Toutes les images sont sous `https://besoindecrire.com/wp-content/uploads/2025/{11,12}/`.

## 5. Problèmes constatés (à corriger dans la refonte)

1. **Deux chartes cohabitent** : l'accueil a la charte sur mesure, les autres pages le style Astra par défaut (vert `#80e68a`, ardoise). C'est le principal gain attendu de la refonte.
2. **Deux headers et deux footers sur l'accueil** : la nav et le footer custom s'ajoutent à ceux d'Astra (le menu apparaît en double).
3. **Pas de mentions légales ni de politique de confidentialité** (404), alors que Google Analytics (Site Kit) et des paiements Stripe sont en place. C'est une obligation légale en France (LCEN/RGPD) et il faudra un bandeau cookies.
4. **Aucun moyen de contact** hors Calendly : pas d'email, de téléphone ni de formulaire visible.
5. **Contenus en doublon** : Bienvenue ≈ hero de l'accueil, À propos ≈ Qui suis-je.
6. **Coquilles** sur « Auteurs accompagnés » (« Recueille », « Martiniques ») et texte de placeholder « Votre portrait à placer ici » dans le HTML de l'accueil (masqué par la photo, à vérifier visuellement).
7. **Dépendances externes éparpillées** : guides sur 6 domaines zite.so, PDF vendus via Stripe Payment Links, éditions sur over-blog.

## 6. Correspondance avec le boilerplate

| Besoin du site | Boilerplate |
|---|---|
| 8 pages éditoriales | collection `Pages` (blocs : hero, piliers, liste à flèches, formules, témoignages, CTA) |
| 10 articles + catégorie | `Posts` + `Categories` |
| PDF de livres payants (Stripe) | `PaidDownloads` + `Purchases` + `PrivateFiles` |
| Images | `Media` |
| Guides gratuits zite.so | à décider : les internaliser (pages ou PDF gratuits) ou garder les liens |

## 7. Pour plus tard

- Pas de captures d'écran : aucun navigateur Playwright n'est installé (`npx playwright install chrome` si besoin).
- Les prix des PDF Stripe ne sont pas visibles sans ouvrir chaque lien.
- Contenu brut réimportable via l'API REST : `https://besoindecrire.com/wp-json/wp/v2/{pages,posts}?per_page=100`.
- Médias en pleine résolution : à télécharger au moment de l'import.
