const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = require('../../lib/prisma');

const SALT_ROUNDS = 10;

class UserService {
  // CREATE
  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,

        place: data.placeId
          ? { connect: { id: data.placeId } }
          : undefined,

        roles: {
          connect: [
            { name: 'MEMBRE' },
            ...(data.roleId ? [{ id: data.roleId }] : [])
          ]
        }
      },
      include: {
        roles: true,
        place: true
      }
    });
  }

  // READ (All)
  async getAll() {
    return await prisma.user.findMany({
      include: { roles: true, place: true },
      // On exclut souvent le mot de passe manuellement par sécurité dans le controller
    });
  }

  // READ (One by ID)
  async getById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { roles: true, place: true }
    });
  }

  // READ (One by Email)
  async getByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: { roles: true, place: true }
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

    // Gérer la relation avec place - on peut passer placeId directement
    // placeId peut être null pour déconnecter, ou un nombre pour connecter
    if (data.placeId !== undefined) {
      updateData.placeId = data.placeId;
    }

    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { roles: true, place: true }
    });
  }

  // DELETE
  async delete(id) {
    const userId = parseInt(id)

    await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: []
        },
        placeId: null
      }
    })

    return prisma.user.delete({
      where: { id: userId }
    })
  }
}

module.exports = new UserService();