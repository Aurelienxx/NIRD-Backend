const prisma = require('../../lib/prisma');

class NavGroupService {
  async create(data) {
    return await prisma.navGroup.create({
      data: { 
        name: data.name,
        order: data.order || 0
      },
      include: { pages: true }
    });
  }

  async getAll() {
    return await prisma.navGroup.findMany({
      include: { pages: true },
      orderBy: { order: 'asc' }
    });
  }

  async getById(id) {
    return await prisma.navGroup.findUnique({
      where: { id: parseInt(id) },
      include: { pages: true }
    });
  }

  async update(id, data) {
    return await prisma.navGroup.update({
      where: { id: parseInt(id) },
      data: { 
        name: data.name,
        order: data.order
      },
      include: { pages: true }
    });
  }

  async delete(id) {
    // Dédetacher les pages de ce groupe
    await prisma.page.updateMany({
      where: { navGroupId: parseInt(id) },
      data: { navGroupId: null }
    });

    await prisma.navGroup.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new NavGroupService();
