# Holy'n

Holy'n est une application de paris/prédictions permettant aux utilisateurs de créer, consulter et participer à des paris.

Il y a également une dimension sociale au site avec la possibilité d'ajouter d'autres utilisateurs en amis et de consulter un leaderboard des meilleurs parieurs du dernier mois.

Le projet utilise :

- Node.js
- Express
- Sequelize
- PostgreSQL
- Mustache.js pour le front

## Architecture du projet

La partie back et la partie front sont regroupées au sein du même projet, lancer ce projet suffit à pouvoir naviguer et utiliser le site.

Vous pouvez retrouver les développements relatifs au back dans les dossiers ```src/*```

Vous pouvez retrouver les développements relatifs au front dans les dossiers ```src/views/*``` et ```public/*```


## Installation

Après avoir récupéré le projet, installer les dépendances avec :

```bash
npm install
````

## Configuration du fichier `.env`

Avant de lancer le projet, il faut créer un fichier `.env` à la racine du projet.

Un modèle est disponible dans le fichier : ``` .example.env```

Il faut donc créer un fichier `.env` en suivant la structure du fichier `.example.env`, puis compléter les informations nécessaires, notamment celles liées à la base de données.

## Mise en place de la base de données

Une fois le fichier `.env` créé et correctement configuré, il faut lancer les migrations Sequelize afin de créer les tables de la base de données :

```bash
npx sequelize-cli db:migrate
```

Cette commande crée les tables nécessaires au fonctionnement du projet.

Ensuite, pour ajouter des données de test :

```bash
npx sequelize-cli db:seed:all
```

Cette commande insère des données de test dans la base de données.

## Annuler les migrations et les données de test

Pour retirer les données ajoutées par les seeders :

```bash
npx sequelize-cli db:seed:undo:all
```

Pour supprimer les tables créées par les migrations :

```bash
npx sequelize-cli db:migrate:undo:all
```

Attention : ces commandes modifient directement la base de données.

## Lancement du projet

Pour lancer le projet il est possible de lancer la commande : 

```bash
npm run dev
```