const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = require('../../lib/prisma');

const SALT_ROUNDS = 10;

class UserService {
  // CREATE
  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    
    // L'utilisateur reçoit toujours le rôle MEMBRE + le rôle sélectionné s'il existe
    const rolesToConnect = [{ name: 'MEMBRE' }];
    if (data.role && data.role !== 'MEMBRE') {
      rolesToConnect.push({ name: data.role });
    }
    
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        roles: {
          connect: rolesToConnect
        }
      },
      include: { roles: true }
    });
  }

  // READ (All)
  async getAll() {
    return await prisma.user.findMany({
      include: { roles: true },
      // On exclut souvent le mot de passe manuellement par sécurité dans le controller
    });
  }

  // READ (One by ID)
  async getById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { roles: true }
    });
  }

  // READ (One by Email)
  async getByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: { roles: true }
    });
  }
  // UPDATE
  async update(id, data) {
    const updateData = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    
    if (data.roles) {
      updateData.roles = {
        set: data.roles.map(r => ({ name: r }))
      };
    }

    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { roles: true }
    });
  }

  // DELETE
  async delete(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new UserService();