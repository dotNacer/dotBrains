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

# Build-time arguments
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# S'assurer que le dossier prisma et ses fichiers sont accessibles
RUN chmod -R 777 /app/prisma

# Mettre à jour DATABASE_URL dans le fichier .env
RUN if [ -f .env.example ]; then \
    cat .env.example > .env && \
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|g" .env; \
else \
    echo "DATABASE_URL=\"${DATABASE_URL}\"" > .env; \
fi

# Vérifier que le schéma Prisma est présent
RUN ls -la /app/prisma/schema.prisma

# Générer le client Prisma
RUN npx prisma generate

# Construire l'application
RUN npm run build

# Exposer le port (par défaut pour SvelteKit)
EXPOSE 3000

# Script de démarrage qui exécute les migrations puis démarre l'application
COPY start.sh .
RUN chmod +x start.sh

# Commande pour démarrer l'application
CMD ["./start.sh"]