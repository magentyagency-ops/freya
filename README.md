# Freya Sports Partners — site institutionnel

Site statique de 28 pages, entièrement en anglais, généré par un petit outil maison sans dépendance (Node ≥ 20).
Le dossier `dist/` est celui qui est servi en production (voir `.openai/hosting.json`).

```bash
npm run dev     # http://localhost:4321 — reconstruit et recharge à chaque modification de src/
npm run build   # génère dist/ (CSS minifié) — à lancer avant chaque commit
npm run serve   # sert dist/ tel quel
```

> `dist/` est généré : ne jamais le modifier à la main, toute modification serait écrasée au build suivant.

## Structure

```
src/
  config.mjs            Nom, e-mail, URL, navigation, pied de page, avertissement réglementaire
  data/                 Contenus : stratégies, équipe, portefeuille, publications, postes, chiffres
  pages/                Une page par fichier (articles.mjs génère une page par publication)
  lib/                  Gabarit, composants, graphiques, visuels génératifs
  assets/css/           Design system (tokens → base → composants → pages → mouvement)
  assets/js/            Modules : texte animé, en-tête, WebGL, graphiques, formulaires, viz…
  assets/fonts/         Geist + Geist Mono (auto-hébergées, licence OFL)
scripts/build.mjs       Générateur
scripts/dev.mjs         Serveur local avec rechargement
```

## Modifier le contenu

| Je veux changer…                         | Fichier                                   |
|------------------------------------------|-------------------------------------------|
| E-mail, domaine, LinkedIn, date des données | `src/config.mjs`                       |
| Menus, pied de page, avertissement légal | `src/config.mjs`                          |
| Stratégies (tickets, horizons, allocation) | `src/data/strategies.mjs`               |
| Chiffres et courbes                      | `src/data/metrics.mjs`                    |
| Équipe, conseil consultatif              | `src/data/team.mjs`                       |
| Portefeuille (noms de code, KPIs)        | `src/data/portfolio.mjs`                  |
| Publications (liste)                     | `src/data/insights.mjs`                   |
| Publications (texte des articles)        | `src/data/articles.mjs`                   |
| Offres d'emploi                          | `src/data/careers.mjs`                    |
| Textes propres à une page                | `src/pages/<page>.mjs`                    |

Ajouter une publication : une entrée dans `insights.mjs` (+ son texte dans `articles.mjs`).
La page `article-<slug>.html`, sa carte, sa couverture générative et le plan du site sont créés automatiquement.

## ⚠ À compléter avant la mise en ligne

Le site contient des **contenus de démonstration** qu'il faut remplacer ou valider :

- **Équipe** (`team.mjs`) : les noms, parcours et fonctions sont **fictifs**.
- **Portefeuille** (`portfolio.mjs`) : participations **fictives**, présentées sous nom de code.
- **Chiffres** (`metrics.mjs`, pages Impact, Affaires, Approche) : **illustratifs**, signalés comme tels à l'écran.
- **Mentions légales** : les champs encadrés en pointillés bleus (RCS, AMF, hébergeur…) sont à renseigner.
- **`config.mjs`** : domaine de production (`site.url`, utilisé pour les balises canonical et Open Graph) et page LinkedIn.
- **Formulaires** : sans configuration, ils ouvrent un e-mail pré-rempli. Pour une réception directe,
  renseigner `formEndpoint` dans `config.mjs` (Formspree, Basin ou une API maison acceptant du JSON en POST).
- **Portail investisseurs** : la page `login.html` est une interface. Elle ne transmet aucune donnée ;
  la brancher sur le portail réel (ou rediriger le bouton vers celui-ci).

## Design system

- **Palette froide**, teinte unique 212° ; un seul accent, « glacier » (`--g-300` sur fond sombre, `--g-700` sur fond clair).
- **Trois thèmes de section** : `void` (noir profond), `dark`, `ice` (clair). Chaque section déclare `data-theme`,
  et l'en-tête adopte automatiquement le thème de la section qu'il survole.
- **Typographie** : Geist (titres très légers, approche serrée) + Geist Mono (libellés « instrument »).
- **Visuels** : aucune photo d'illustration. Tout est génératif et déterministe (surface WebGL, glyphes de stratégie,
  sigils runiques du portefeuille, couvertures des notes, portraits en trame).
- **Graphiques** : forme « emphase » (une série accent, le contexte en gris), couleurs validées (contraste
  et daltonisme), légende, info-bulles au survol et au clavier, tableau de données pour chaque figure.
- **Accessibilité** : mouvement réduit respecté, navigation au clavier, lien d'évitement, contrastes AA,
  le contenu reste lisible si le JavaScript ne se charge pas.
- **Astuce** : la touche **G** affiche la grille de composition à 12 colonnes.

## Freya Newsroom (`news.html` + `news-<slug>.html`)

- `npm run news` : collecte ~16 flux RSS (Guardian, BBC Sport, ESPN, espnW, CBS Sports, Front Office Sports, Sportico…),
  garde les sujets sport féminin, puis **l’IA choisit les 6 sujets du jour et rédige nos propres articles**
  (titre, chapô, corps, « Why it matters », chiffres clés), sources créditées et liées en bas d’article.
  Puis `npm run build`. « The wire » (colonne de droite) liste les derniers titres des autres médias.
- **Automatique** : `.github/workflows/news.yml` chaque jour à 05:00 UTC (build + commit de `dist/`).
- **Clé** : secret GitHub `OPENAI_API_KEY` (jamais dans le code). Modèle `gpt-4o-mini`, ~30 000 tokens/jour ≈ 1 centime.
  Nombre d’articles/jour : variable `NEWS_PER_DAY` (défaut 6). Sans clé : seule « the wire » est mise à jour.
- **Images** : visuels génératifs maison par sport (pas de photos d’agences, protégées par le droit d’auteur).
- Sources : tableau `FEEDS` dans `scripts/news.mjs`.
