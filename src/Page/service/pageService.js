const prisma = require('../../lib/prisma');

class PageService {
  async create(data) {
    return await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        location: data.location || 'HIDDEN',
        order: data.order || 0,
        navGroupId: data.navGroupId ? parseInt(data.navGroupId) : null,
        layout: data.layout || JSON.stringify([]),
        type: data.type || 'SIMPLE',
        allowedRoles: data.roleIds ? {
          connect: data.roleIds.map(id => ({ id: parseInt(id) }))
        } : undefined
      },
      include: { 
        allowedRoles: true,
        navGroup: true,      }
    });
  }

  async getAll() {
    return await prisma.page.findMany({
      include: { 
        allowedRoles: true,
        navGroup: true,
      },
      orderBy: { order: 'asc' }
    });
  }

  async getById(id) {
    return await prisma.page.findUnique({
      where: { id: parseInt(id) },
      include: { 
        allowedRoles: true,
        navGroup: true,      }
    });
  }

  async update(id, data) {
    return await prisma.page.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        slug: data.slug,
        location: data.location,
        order: data.order,
        navGroupId: data.navGroupId ? parseInt(data.navGroupId) : null,
        layout: data.layout,
        type: data.type,
        allowedRoles: data.roleIds ? {
          set: data.roleIds.map(id => ({ id: parseInt(id) }))
        } : undefined
      },
      include: { 
        allowedRoles: true,
        navGroup: true,      }
    });
  }

  async delete(id) {
    // Supprimer la page
    await prisma.page.delete({
      where: { id: parseInt(id) }
    });
  }

  async getBySlug(slug) {
    return await prisma.page.findUnique({
      where: { slug: slug },
      include: { 
        allowedRoles: true,
        navGroup: true,
      }
    });
  }

async getSlugs(userRoleIds = []) {
  const pages = await prisma.page.findMany({
    where: {
      NOT: {
        location: 'HIDDEN'
      }
    },
    select: {
      id: true,
      slug: true,
      title: true,
      order: true,
      location: true,
      navGroup: {
        select: {
          id: true,
          name: true
        }
      },
      allowedRoles: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  });

  // Filtrer les pages selon les critères d'accès
  return pages
    .filter(p => {
      // Si la page n'a pas de rôles autorisés => accessible à tous
      if (p.allowedRoles.length === 0) {
        return true;
      }
      // Si la page a des rôles requis => vérifier que l'utilisateur a au moins un de ces rôles
      if (userRoleIds.length === 0) {
        return false; // Pas de rôles => pas d'accès aux pages protégées
      }
      return userRoleIds.some(userRoleId => 
        p.allowedRoles.some(allowedRole => allowedRole.id === userRoleId)
      );
    })
    .map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      order: p.order,
      location: p.location,
      group: p.navGroup ? p.navGroup.name : null,
      allowedRoles: p.allowedRoles
    }));
}
}
module.exports = new PageService();
