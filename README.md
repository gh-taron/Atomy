# Atomy — site de partenaire

Reproduction de la page de référence, avec catalogue local et interface en russe.
Les informations à remplacer et les éléments requis avant publication sont dans
[TODO.md](TODO.md). La configuration publique est dans [js/config.js](js/config.js).

## Démarrage

Depuis ce dossier :

```sh
python -m http.server 8080
```

Ouvrir <http://localhost:8080>. Utiliser HTTP plutôt que l'ouverture directe du
fichier : les modules JavaScript et le catalogue JSON en ont besoin.

## Organisation

```text
index.html               structure de la page
js/
  app.js                 initialisation des composants
  config.js              identité, contacts, partage, API de demandes
  catalog.js             catalogue, recherche, fiches, liens directs
  registration.js        étapes, validation, transmission des demandes
  chat.js                assistant local à règles et suggestions produits
  countries.js           pays et sélecteur natif
  personalization.js     coordonnées et identité depuis la configuration
  ui.js                  navigation, carrousels, vidéo, bannière
  utils.js               recherche, téléphone, copie, envoi HTTP
  vendor/                Bootstrap et Swiper, conservés séparément
css/
  style.css              styles applicatifs lisibles
  vendor/                FastBootstrap et Swiper
assets/                  polices, visuels et image de remplacement
data/                    190 produits et leurs fiches détaillées
tests/                   tests de régression et parcours navigateur
```

Les fichiers vendor restent minifiés ; ils ne contiennent pas le code métier.
Le code applicatif est constitué de modules ES natifs, sans framework ni compilation.
Quelques fonctions sont exposées dans `app.js` pour les actions HTML existantes.
Les descriptions HTML proviennent des JSON éditoriaux locaux : ne pas les remplacer
par du contenu utilisateur non fiable sans nettoyage.

## État fonctionnel

Le catalogue, la recherche, les fiches, les carrousels, la FAQ et l'assistant local
fonctionnent côté navigateur. L'assistant répond par mots-clés ; il n'appelle pas d'IA.
Les coordonnées vides sont masquées, et ne dirigent pas vers celles du modèle.

**Le formulaire n'est pas connecté à un service de réception.** Par défaut il affiche
un aperçu explicite et ne transmet ni ne conserve les données. Après configuration
d'une API, la confirmation dépend d'une réponse HTTP réussie et d'un JSON
`{ "success": true }`. Il ne crée pas de compte Atomy. Voir le contrat dans TODO.md.
Aucun mot de passe de membre n'est conservé dans les cookies ou le stockage local.

Les images produits et la vidéo restent externes. Les données commerciales, règles,
textes juridiques et visuels de référence doivent être validés avant publication.
Les métadonnées absolues doivent être finalisées dans le HTML pour les robots sociaux.

## Vérification et formatage

```sh
npm install
npm test
npm run test:browser
npm run format
```

Les tests navigateur utilisent Chrome installé et démarrent un serveur local de test.
Pour un poste sans Chrome, adapter `playwright.config.js` et installer le navigateur
Playwright choisi. Aucun test ne transmet de données à un service réel.

## Langues

Le sélecteur en haut de page propose le français (par défaut), l’anglais et le russe.
Le choix est mémorisé localement avec la clé `atomy_language`. Le changement de langue
se fait sans rechargement et conserve les valeurs du formulaire et les filtres du catalogue.
Les traductions sont dans `js/locales/`, gérées par `js/i18n.js`. Les noms des 190 produits
sont traduits ; les prix restent en roubles. Les fiches détaillées, les documents juridiques
et les textes intégrés aux images restent en russe avec une indication de langue source.
Le chat est disponible dans les trois langues ; son historique repart de l’accueil
lorsqu’on change de langue.
