#!/bin/sh

# Afficher la version de Prisma
echo "Prisma version:"
npx prisma -v

# Vérifier la connexion à la base de données
echo "Checking database connection..."
npx prisma db pull --force

# Générer le client Prisma (au cas où)
echo "Generating Prisma Client..."
npx prisma generate

# Pousser le schéma vers la base de données
echo "Pushing schema to database..."
npx prisma db push --accept-data-loss

# Vérifier que les tables ont été créées
echo "Verifying database schema..."
npx prisma db pull

# Démarrer l'application
echo "Starting the application..."
node build/index.js 