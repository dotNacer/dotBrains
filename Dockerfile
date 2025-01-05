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

# Mettre à jour DATABASE_URL dans le fichier .env
RUN if [ -f .env.example ]; then \
    cat .env.example > .env && \
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|g" .env; \
else \
    echo "DATABASE_URL=\"${DATABASE_URL}\"" > .env; \
fi

# Générer le client Prisma
RUN npx prisma generate

# Construire l'application
RUN npm run build

# Exposer le port (par défaut pour SvelteKit)
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "build/index.js"]