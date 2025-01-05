# Utiliser Node.js comme image de base
FROM node:20-slim

# Installer OpenSSL et les dépendances nécessaires
RUN apt-get update -y && apt-get install -y openssl

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers du projet
COPY . .

# Ajouter le contenu de .env.example au .env existant
RUN if [ -f .env.example ]; then cat .env.example >> .env; fi

# Définir DATABASE_URL comme argument
ENV DATABASE_URL=""

# Générer le client Prisma
RUN npx prisma generate

# Construire l'application
RUN npm run build

# Exposer le port (par défaut pour SvelteKit)
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "build"]