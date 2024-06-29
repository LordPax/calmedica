# CalMedica Project

Bienvenue sur le projet CalMedica. Ce projet vise à fournir une solution de gestion médicale complète pour simplifier les tâches administratives et améliorer la qualité des soins.

## Développeurs du Projet

- **Ilies Slim**
- **Teddy Gauthier**
- **Maxime Pietrucci-Blacher**

## Description des features produites durant ce Hackathon

CalMedica est conçu pour aider les professionnels de la santé à gérer efficacement les informations des patients, planifier les rendez-vous, et simplifier la facturation. Voici quelques-unes des fonctionnalités clés :

- **Authentification** (Tout le monde) : S'authentifier à l'application / Dashboard
- **Chat** (par Teddy Gauthier) : Possibilité de converser avec une I.A au sein du dashboard
- **Microphone** (par Maxime Pietrucci-Blacher) : Possibilité d'ajouter un message vocal à la conversation
- **Historique** (par Ilies Slim): Visualisation de l'historique des messages d'un utilisateurs 
- **Gestion des sentiments** (Tout le monde): Possibilité d'analyser les messages de l'utilisateur et de déterminer grâce à une IA le pourcentage de justesse / le sentiment derrière ceux-ci
- **Affichage des status** (Tout le monde): Affichage des différents status de l'utilisateur selon le dernier message (neutre, positif ou négatif)
- **Upload des images** (Tout le monde): Possibilité d'inclure une image à la conversation en cours et d'obtenir une analyse de l'IA

## Technologies utilisées

* [Go](https://golang.org/)
* [Swag](https://github.com/swaggo/swag)
* [pnpm](https://pnpm.io/)
* [docker](https://www.docker.com/)
* [docker-compose](https://docs.docker.com/compose/)

## Initialisation du projet

1. Clonez le dépôt :
```bash
git clone https://github.com/LordPax/calmedica.git
```

2. Accédez au répertoire du projet :
```bash
cd calmedica
```

3. Lancer les conteneur docker
```bash
docker-compose up
```

## Installation front

Pour installer et exécuter ce projet localement, veuillez suivre les étapes ci-dessous :

1. Accédez au répertoire du projet :
```bash
cd front
```

2. Créez un fichier `.env` à la racine du répertoire `front` et ajoutez les variables d'environnement suivantes :
```bash
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_SOCKET_URL=ws://localhost:8080/ws
OPENAI_API_KEY=
```

3. Installez les dépendances :
```bash
pnpm install
```

4. Démarrez le serveur de développement :
```bash
pnpm run dev
```

## Installation back

1. Accédez au répertoire du projet :
```bash
cd back
```

2. Créez un fichier `.env` à la racine du répertoire `back` et ajoutez les variables d'environnement suivantes :
```bash
ALLOWED_ORIGINS='*'
GIN_MODE=debug

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=golang-app
DB_PORT=5432

COOKIE_SECURE=false
JWT_SECRET_KEY=123456789
BREVO_API_KEY=
BREVO_SENDER=noreply@calmedica.fr

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

OPENAI_API_KEY=

EDENAI_API_URL=
EDENAI_API_KEY=
```

3. Intaller les dépendances :
```bash
go mod tidy
go mod vendor
swag init
```

4. Build le projet :
```bash
go build
```

5. Lancer le projet :
```bash
./calmedica
```
