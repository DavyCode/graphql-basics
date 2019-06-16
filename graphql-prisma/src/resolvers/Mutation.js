import bcrypt from 'bcryptjs'
import jwt from 'jwt-simple'
import getUserId from '../utils/getUserId'

const Mutation =  {
  createUser: async (parent , args, {prisma}, info) => {
    const userExist = await prisma.exists.User({ email: args.data.email })

    if (userExist) {
      throw new Error("User already exist!!!")
    }

    if(args.data.password.length < 8) {
      throw new Error("Password length too short!!!")
    }

    const password = await bcrypt.hash(args.data.password, 10)

    const user = await prisma.mutation.createUser({ 
      data: {
        ...args.data,
        password
      }
    })

    const token = await jwt.encode({ userId: user.id }, "arizabalaga", {expiresIn: '1 hour' })
    return {
      user,
      token
    }
  },
  login: async (parent, args, { prisma }, info) => {
    const user = await prisma.query.users({ 
      where : {
        email: args.data.email
      }
    })

    if(user.length === 0) {
      throw new Error("Wrong information supplied!!")
    }

    const isMatch = await bcrypt.compare( args.data.password, user[0].password)

    if(!isMatch) {
      throw new Error("Wrong information supplied!!")
    }

    const token = await jwt.encode({ userId: user[0].id }, "arizabalaga", {expiresIn: '1 hour' })

    return {
      user: user[0],
      token
    }
  },
  updateUser: async (parent, args, { prisma }, info) => {
    if (args.data.password && typeof args.data.password === 'string' && args.data.password.length > 7) {
      args.data.password = await bcrypt.hash(args.data.password, 10)
    }

    return prisma.mutation.updateUser({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  },
  deleteUser: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser({ 
      where: {
        id: userId
      }
    }, info) 
  },
  createComment: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)
    const postExist = await prisma.exists.Post({
      id: args.data.post,
      published: true
    })

    if(!postExist) {
      throw new Error('Post not found!!')
    }

    return prisma.mutation.createComment({
      data: {
        text : args.data.text,
        author: {
          connect: {
            id : userId
          }
        },
        post: {
          connect:{
              id: args.data.post
          }
        }
      }
    }, info)
  },
  updateComment: (parent, args, { prisma }, info) => {
    return prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: {
        text: args.data.text
      }
    }, info)
  }
  ,
  createPost: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info)
  },
  updatePost: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)
    const postExist = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    if(!postExist) {
      throw new Error('Post not found!!')
    }

    const isPublished = await prisma.exists.Post({ id: args.id, published: true})

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({ where: { post: { id: args.id } } })
    }

    return prisma.mutation.updatePost({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  },
  deletePost: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)
    const postExist = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    if(!postExist) {
      throw new Error('Post could not be deleted')
    }

    return prisma.mutation.deletePost({
      where: {
        id: args.id
      }
    }, info)
  }
}

export { Mutation as default}