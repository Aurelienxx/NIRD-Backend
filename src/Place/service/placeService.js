const prisma = require('../../lib/prisma');

class PlaceService {
  async create(data) {
    return prisma.place.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        location: data.location,
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude,
        user: {
          connect: {
            id: parseInt(data.userId)
          }
        }
      }
    });
  }

  async getAll() {
    return prisma.place.findMany({
      include: {
        user: true
      }
    });
  }

  async getAllLocations() {
    return prisma.place.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        location: true,
        type: true,
      }
    });
  }

  async getById(id) {
    return prisma.place.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true
      }
    });
  }

  async update(id, data) {
    return prisma.place.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        location: data.location,
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude
      }
    });
  }

  async delete(id) {
    return prisma.place.delete({
      where: { id: parseInt(id) }
    });
  }

  async getByUserId(userId) {
    return prisma.place.findUnique({
      where: {
        userId: parseInt(userId)
      },
      include: {
        user: true
      }
    });
  }
}

module.exports = new PlaceService();