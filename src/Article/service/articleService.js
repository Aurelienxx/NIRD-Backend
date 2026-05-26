const prisma = require('../../lib/prisma');

class ArticleService {
  async create(data) {
    return await prisma.article.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content || '<p>Aucun contenu</p>',
        mediaUrl: data.mediaUrl || null,
        mediaType: data.mediaType || 'IMAGE',
        authorId: parseInt(data.authorId),
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date()
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
    return await prisma.article.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getById(id) {
    return await prisma.article.findUnique({
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
    return await prisma.article.findMany({
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
      orderBy: { updatedAt: 'desc' }
    });
  }

  async update(id, data) {
    return await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaType,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined
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
    return await prisma.article.delete({
      where: { id: parseInt(id) }
    });
  }

  async search(query) {
    return await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
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
      orderBy: { publishedAt: 'desc' }
    });
  }

  async getPublished() {
    return await prisma.article.findMany({
      where: {
        publishedAt: { lte: new Date() }
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
      orderBy: { updatedAt: 'desc' }
    });
  }
}

module.exports = new ArticleService();
