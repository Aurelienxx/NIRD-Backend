const prisma = require('../../lib/prisma');

class DocumentService {
  async create(data) {
    return await prisma.document.create({
      data: {
        title: data.title,
        description: data.description,
        fileData: data.fileData,
        fileName: data.fileName,
        fileType: data.fileType,
        authorId: parseInt(data.authorId),
        tags: data.tags || []
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async getAll() {
    return await prisma.document.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getById(id) {
    return await prisma.document.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async getByAuthorId(authorId) {
    return await prisma.document.findMany({
      where: { authorId: parseInt(authorId) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getByTag(tag) {
    return await prisma.document.findMany({
      where: {
        tags: {
          has: tag
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id, data) {
    return await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        fileData: data.fileData,
        fileName: data.fileName,
        fileType: data.fileType,
        tags: data.tags
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async delete(id) {
    return await prisma.document.delete({
      where: { id: parseInt(id) }
    });
  }

  async search(query) {
    return await prisma.document.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { fileName: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

module.exports = new DocumentService();
