const prisma = require('../../lib/prisma');

class RoleService {
  async create(data) {
    return await prisma.role.create({
      data: { name: data.name }
    });
  }

  async getAll() {
    return await prisma.role.findMany();
  }

  async getById(id) {
    return await prisma.role.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async update(id, data) {
    return await prisma.role.update({
      where: { id: parseInt(id) },
      data: { name: data.name },
    });
  }

  async delete(id) {

    await prisma.user.updateMany({
      where: {roles: {some: { id: parseInt(id) } }},
      data: {roles: { disconnect: { id: parseInt(id) }}}
    });

    await prisma.page.updateMany({
      where: {allowedRoles: {some: { id: parseInt(id) }}},
      data: {allowedRoles: {disconnect: { id: parseInt(id) }}}
    });

    await prisma.role.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new RoleService();