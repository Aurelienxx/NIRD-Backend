const prisma = require('../../lib/prisma');

class PlaceService {

  async create(data) {
    return prisma.place.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude
      }
    });
  }

  async getAll() {
    return prisma.place.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            roles: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
  }

  async getAllLocations() {
    return prisma.place.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        type: true
      }
    });
  }

  async getById(id) {
    return prisma.place.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            roles: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }

  async update(id, data) {
    return prisma.place.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude
      }
    });
  }

  async delete(id) {
    return prisma.place.delete({
      where: {
        id: parseInt(id)
      }
    });
  }

}

module.exports = new PlaceService();