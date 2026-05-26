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

  // 3. Créer d'autres rôles
  const modRole = await prisma.role.upsert({
    where: { name: 'Modérateur' },
    update: {},
    create: { name: 'Modérateur' },
  });

  const authorRole = await prisma.role.upsert({
    where: { name: 'Auteur' },
    update: {},
    create: { name: 'Auteur' },
  });

  // 4. Créer l'utilisateur Admin par défaut
  const adminPassword = "02468"; // À CHANGER
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

  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      title: 'À propos',
      slug: 'about',
      location: 'HEADER',
      order: 2,
      navGroupId: servicesGroup.id,
      type: 'SIMPLE',
      layout: JSON.stringify([])
    }
  });

  await prisma.page.upsert({
    where: { slug: 'blog' },
    update: {},
    create: {
      title: 'Blog',
      slug: 'blog',
      location: 'BURGER',
      order: 3,
      navGroupId: ressourcesGroup.id,
      type: 'BLOG',
      layout: JSON.stringify([]),
      allowedRoles: {
        connect: [{ id: authorRole.id }, { id: membreRole.id }]
      }
    }
  });

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