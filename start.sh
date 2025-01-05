#!/bin/sh

# Exécuter les migrations Prisma
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Démarrer l'application
echo "Starting the application..."
node build/index.js 