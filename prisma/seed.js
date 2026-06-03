const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = require('../src/lib/prisma');

async function main() {
  const SALT_ROUNDS = 10;

  // 1. Créer le rôle ADMIN s'il n'existe pas
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  }); 

  // 2. Créer le rôle MEMBRE par défaut
  const membreRole = await prisma.role.upsert({
    where: { name: 'MEMBRE' },
    update: {},
    create: { name: 'MEMBRE' },
  });

  // 4. Créer l'utilisateur Admin par défaut
  const adminPassword = "02468";
  const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@monsite.com' },
    update: {},
    create: {
      email: 'admin@monsite.com',
      name: 'Administrateur',
      password: hashedPassword,
      roles: {
        connect: { id: adminRole.id },
      },
    },
  });

  console.log('✅ Utilisateurs et rôles créés');

  // 5. Créer des groupes de navigation
  const servicesGroup = await prisma.navGroup.upsert({
    where: { id: 1 },
    update: { name: 'Services', order: 1 },
    create: { name: 'Services', order: 1 }
  });

  const ressourcesGroup = await prisma.navGroup.upsert({
    where: { id: 2 },
    update: { name: 'Ressources', order: 2 },
    create: { name: 'Ressources', order: 2 }
  });

  console.log('✅ Groupes de navigation créés');

  // 6. Créer des pages
  await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Accueil',
      slug: 'home',
      location: 'HEADER',
      order: 1,
      type: 'SIMPLE',
      layout: JSON.stringify([])
    }
  });

  await prisma.place.upsert({
  where: { userId: adminUser.id },
  update: {
    name: 'IUT de Calais',
    address: '19 Rue Louis David, 62100 Calais',
    type: 'Établissement supérieur',
    latitude: 50.9519,
    longitude: 1.8589
  },
  create: {
    name: 'IUT de Calais',
    address: '19 Rue Louis David, 62100 Calais',
    type: 'Établissement supérieur',
    latitude: 50.9519,
    longitude: 1.8589,
    user: {
      connect: {
        id: adminUser.id
      }
    }
  }
});

  console.log('✅ Place créée');
  console.log('✅ Pages créées');
  console.log('✅ Seed complété avec succès!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });