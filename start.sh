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

# Exécuter les migrations Prisma
echo "Running Prisma migrations..."
npx prisma migrate deploy --preview-feature

# Vérifier que les tables ont été créées
echo "Verifying database schema..."
npx prisma db pull

# Démarrer l'application
echo "Starting the application..."
node build/index.js 