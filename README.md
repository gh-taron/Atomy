# Site Web Réplique - Atomy (Partenaire : Lusine Sargsyan)

Ce projet est un clone fidèle, autonome, optimisé et 100% prêt à l'emploi de la page d'atterrissage Atomy pour la distributrice **Lusine Sargsyan** (Лусине Саргсян).

---

## 📁 Structure du Projet

```text
Atomy/
├── index.html                   # Page principale complète, lisible et personnalisée
├── README.md                    # Guide d'utilisation et de configuration
├── css/
│   └── style.css                # Styles Bootstrap et carrousels (avec polices locales)
├── js/
│   ├── app.js                   # Moteur JS complet (catalogue, carrousels, formulaire, chatbot intelligent)
│   └── country_select.js        # Sélecteur de nationalités et drapeaux
├── data/
│   ├── products.json            # Base des 190 produits Atomy (prix, PV, catégories)
│   └── products-details.json    # Fiches détaillées des produits (ingrédients, usage, etc.)
└── assets/                      # 57 ressources locales (logos, photos, certificats, avis)
    ├── media/
    │   └── consultant_bd41d427.jpg   # Photo du consultant
    └── static/websites/
        ├── fonts/               # Polices typographiques TildaSans
        └── images/              # Bannières, avis clients, certificats, carte
```

---

## 🤖 Gestion et Fonctionnement du Chatbot

Dans le site original, le chatbot dépendait d'un serveur tiers fermé (`mllm.me/api/chat/`). Pour rendre votre site **totalement autonome et infaillible**, le chatbot a été modernisé avec un moteur conversationnel intelligent côté client dans `js/app.js` :

### 1. Comment fonctionne le Chatbot actuellement (Mode Intelligent Autonome)
- **Bulle flottante avec statut en ligne :** Affiche le portrait et le nom de **Lusine Sargsyan**.
- **Message d'accueil & Boutons de raccourcis :**
  - 📝 *Бесплатная регистрация* : ouvre instantanément le formulaire d'inscription en 3 étapes.
  - 🚚 *Доставка и оплата* : explique les 819 points relais et la livraison offerte.
  - 🛒 *Каталог товаров* : recherche automatique dans les 190 produits Atomy.
  - 💬 *Написать в WhatsApp* : ouvre WhatsApp avec un message pré-rempli pour Lusine Sargsyan.
- **Réponses automatiques par mots-clés :** si un visiteur pose des questions sur l'inscription, les prix, les crèmes, le dentifrice, la livraison, le bot lui répond immédiatement et lui propose le bon bouton d'action.

### 2. Personnaliser le numéro WhatsApp du Chatbot
Dans [`index.html`](file:///c:/Users/taron/Desktop/Atomy/index.html), dans le bloc de configuration en bas de page :
```javascript
window.siteContent = {
    isAtmRegEnabled: false,
    consultantName: 'Lusine Sargsyan',
    consultantWa: '79595269800',       // Remplacez par votre numéro international
    consultantTg: 'lusine_sargsyan'     // Votre pseudo Telegram
};
```

---

## 🚀 Comment Lancer le Site

Pour des raisons de sécurité du navigateur (lecture de fichiers JSON locaux `products.json`), lancez le site avec un serveur local HTTP :

### Avec Python :
Dans le terminal (dossier `Atomy`) :
```bash
python -m http.server 8080
```
Puis ouvrez : [http://localhost:8080](http://localhost:8080)

### Avec Node.js :
```bash
npx serve .
```

---

## 👤 Informations Personnalisées
- **Nom du distributeur :** Lusine Sargsyan (Лусине Саргсян)
- **Rôle :** Partenaire et distributeur officiel Atomy
- **Photo du profil :** [`assets/media/consultant_bd41d427.jpg`](file:///c:/Users/taron/Desktop/Atomy/assets/media/consultant_bd41d427.jpg) (remplacez ce fichier pour changer votre portrait).
