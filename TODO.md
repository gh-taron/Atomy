# TODO — informations à fournir pour personnaliser le site Atomy

Remplis les champs ci-dessous et renvoie-moi ce fichier. Ne mets aucun mot de passe,
jeton privé ou clé secrète dans ce document ni dans le JavaScript du site.
Les coordonnées inconnues sont masquées : aucun visiteur n'est envoyé chez la distributrice de référence.

## 1. Identité et présentation

- [ ] Nom public exact : `…` (provisoire : Lusine Sargsyan).
- [ ] Nom en russe / autres langues : `…` (provisoire : Лусине Саргсян).
- [ ] Nom complet à afficher dans les mentions du partenaire : `…`.
- [ ] Statut et intitulé autorisés chez Atomy : `…`.
- [ ] Identifiant distributeur / sponsor Atomy, si nécessaire : `47222222`.
- [ ] Courte biographie et texte de présentation : `…`.
- [ ] Ta photo de profil : fichier ou URL ; la photo actuelle vient du site de référence. : j'ai changé la photo dans assets/media, tu peux check.
- [ ] Logo ou favicon personnel, si tu souhaites remplacer ceux d'Atomy : `…`.

## 2. Contacts

- [ ] WhatsApp : numéro international avec indicatif (`+32…`, `+33…`, etc.) : `…`.
- [ ] Telegram : lien complet (`https://t.me/ton_pseudo`) : `…`.
- [ ] MAX : vrai lien de profil officiel, si utilisé : `…`.
- [ ] E-mail de contact public : `…`.
- [ ] Téléphone public, si différent de WhatsApp : `…`.
- [ ] Autres réseaux souhaités et liens complets : `…`.
- [ ] Canaux à afficher / ne pas afficher : `…`.
- [ ] Message prérempli WhatsApp souhaité : `…`.
- [ ] Horaires de contact et langues parlées : `…`.

Les liens sont configurés dans `js/config.js`. Un lien vide reste masqué.
La configuration ne contient actuellement aucun des anciens numéros ou pseudos.

## 3. Marché et catalogue

- [ ] Pays réellement desservis : `…`.
- [ ] Langue principale et traductions souhaitées : `…` (interface : français, anglais et russe).
- [ ] Devise et prix officiels applicables : `…` (actuellement roubles, catalogue de référence).
- [ ] URL officielle Atomy de ton marché : `…` (actuellement `https://atomy.ru`).
- [ ] Lien officiel de connexion / inscription / parrainage : `…`.
- [ ] Conditions de livraison : coût, seuil éventuel, points relais, délais, restrictions : `…`.
- [ ] Conditions de paiement et de retour applicables : `…`.
- [ ] Coordonnées officielles du support dans ton marché : `…`.
- [ ] Source et date des prix, composition et informations produits : `…`.
- [ ] Conserver les 190 produits ou fournir un nouveau catalogue : `…`.
- [ ] Conserver les images produits externes ou les héberger localement : `…`.

Le catalogue comprend 190 produits. Leurs images restent hébergées sur le stockage
externe de référence. Les fiches et prix ne sont pas synchronisés automatiquement.

## 4. Inscription — indispensable pour recevoir de vraies demandes

- [ ] Résultat voulu : demande de contact, demande d'ouverture de compte ou redirection
      vers l'inscription officielle Atomy : `…`.
- [ ] Destinataire des demandes : personne, e-mail ou outil : `…`.
- [ ] Service souhaité / existant : backend, formulaire hébergé, CRM, etc. : `…`.
- [ ] Adresse de l'API et documentation, si elle existe : `…`.
- [ ] Champs réellement nécessaires et obligatoires : `…`.
- [ ] Processus après réception et délai de réponse réaliste : `…`.
- [ ] Message exact de confirmation : `…`.
- [ ] Besoin de confirmation e-mail, anti-spam ou limitation des demandes : `…`.

**État actuel : le formulaire est en aperçu. Aucune demande n'est envoyée ni stockée.**
Il ne crée pas de compte Atomy. Pour le connecter, compléter
`config.registration.endpoint` dans `js/config.js` avec une API que tu contrôles.
Elle reçoit un POST JSON avec identité, pays, naissance, téléphone international,
e-mail, adresse et consentements. Elle doit répondre en JSON `{ "success": true }`
uniquement après réception effective. Elle doit valider les champs, gérer l'anti-spam
et autoriser l'origine de ton site si elle est sur un autre domaine.
Les erreurs HTTP, réseau, délai d'attente et confirmations invalides restent des erreurs.
Un identifiant ou mot de passe de compte Atomy n'est jamais enregistré côté navigateur.

## 5. Contenus et preuves commerciales

- [ ] Vidéo de présentation : lien autorisé, langue et image de couverture : `…`.
- [ ] Photos et visuels à conserver / remplacer : `…`.
- [ ] Avis clients personnels, sources et autorisations : `…`.
- [ ] Certificats et comparaisons correspondant aux produits de ton marché : `…`.
- [ ] Justification et date des économies annoncées, note 4,9/5, nombre de clients,
      pays, points relais et autres chiffres : `…`.
- [ ] Confirmer ou remplacer les promesses « livraison gratuite », « inscription
      en deux minutes », « produits naturels / biologiques » : `…`.
- [ ] Proposition principale : achats, activité de partenaire ou les deux : `…`.

Les textes commerciaux, avis, certificats, carte russe et règles du site original
sont conservés pour la reproduction visuelle ; ils nécessitent ta validation.

## 6. Publication et partage

- [ ] Nom de domaine et URL définitive, sans paramètres Facebook : `…`.
- [ ] Hébergeur souhaité / existant : `…`.
- [ ] Titre du site et description pour recherche / réseaux sociaux : `…`.
- [ ] Image de partage : fichier ou URL (idéalement 1200 × 630) : `…`.
- [ ] Besoin de statistiques et service choisi : `…`.

Les métadonnées de partage sont mises à jour dans le navigateur pour la prévisualisation.
Pour les robots de partage, le titre, l'URL et l'image absolue devront également être
inscrits directement dans le HTML avant publication. Aucun suivi tiers n'est activé.

## 7. Mentions et données personnelles

- [ ] Identité du responsable du site, adresse et coordonnées publiques : `…`.
- [ ] Pays d'activité et, si applicable, nom / numéro de l'entreprise : `…`.
- [ ] Politique de confidentialité adaptée à ton traitement réel : `…`.
- [ ] Durée de conservation et procédure de suppression des demandes : `…`.
- [ ] Prestataires qui recevront les données et pays de stockage : `…`.
- [ ] Conditions du site et règles Atomy applicables à ton marché : `…`.
- [ ] Souhaites-tu proposer des communications commerciales ? `…`.

Les documents actuels reprennent les textes russes du modèle : ils ne décrivent pas
nécessairement ton activité. Le consentement aux communications commerciales est
facultatif. Tous les consentements commencent décochés.

## Corrections réalisées

- [x] Suppression du faux envoi / succès et du stockage local des demandes.
- [x] Téléphone international normalisé sans ajout d'un préfixe masqué.
- [x] Recherche du catalogue résistante aux caractères spéciaux.
- [x] Catalogue partagé avec le chatbot et bouton d'accès au catalogue fonctionnel.
- [x] Chargement des détails actualisé après ouverture rapide d'une fiche.
- [x] Image de remplacement locale, sans boucle en cas d'erreur.
- [x] Copie avec bouton explicite, solution de repli et confirmation sans image manquante.
- [x] Suppression des coordonnées actives de la distributrice de référence.
- [x] Image de partage existante et suppression de l'URL Facebook du modèle.
- [x] Bibliothèques séparées ; modules et styles applicatifs formatés.
- [x] Retrait des anciens jetons, statistiques et intégrations inutilisées.

## Traductions à fournir pour les contenus d’origine

- [ ] Versions autorisées en français et en anglais des fiches détaillées produits : `…`.
- [ ] Versions adaptées et validées des documents juridiques : `…`.
- [ ] Avis, certificats et visuels sans texte russe, si souhaité : `…`.


Enlever Map de la Russie et juste écrire que livraison gratuite à partir de 150€ d'achats