import getUserId from '../utils/getUserId'

const Query =  {
  users: (parent, args, {prisma}, info) => {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    // if(args.query) {
    //   opArgs.where = {
    //     AND: [{
    //       name_contains: args.query
    //     },{
    //       email_contains: args.query
    //     }]
    //   }
    // }
    if(args.query) {
      opArgs.where = {
          name_contains: args.query
        }
    }

    return prisma.query.users(opArgs, info)
  }, 
  posts: async (parent, args, { prisma }, info) => {
    const opArgs = {
      where: {
        published: true
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    // if (args.query) {
    //   opArgs.where.OR = [{  // OR operator is currently not supported on document DB
    //     title_contains: opArgs.query
    //   }, {
    //     body_contains: opArgs.query
    //   }]
    // }

    if(!args.query) {
      let posts = await prisma.query.posts(opArgs, info)
      return posts
    }

    opArgs.where.title_contains = opArgs.query
    let posts = await prisma.query.posts(opArgs, info)

    if(posts.length > 0) {
      return posts
    }
    
    return prisma.query.posts({
      where: {
        published: true,
        body_contains : opArgs.query
      }
    }, info)
  },
  comments: (parent, args, {prisma}, info) => {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if(args.query) {
      opArgs.where = {
        id : opArgs.query
      }
    }
    return prisma.query.comments(opArgs, info)
  },
  post: async (parent, args, { prisma, request }, info) => {  //todo refactor
    const userId = getUserId(request, false)

    // const post = await prisma.query.posts({ // OR operator is currently not supported on document DB
    //   where: {
    //     id: args.id,
    //     OR: [{  
    //       published: true
    //     }, {
    //       author: {
    //         id: userId
    //       }
    //     }]
    //   }
    // })

    const post = await prisma.query.posts({
      where: userId ? {
        id: args.id,
        author: {
          id: userId
        }
      } : {
        id: args.id,
        published: true
      }
    }, info)

    if(post.length === 0) {
      throw new Error('Post not found')
    }

    return post[0]
  },
  currentUser: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    const user = await prisma.query.users({
      where: {
        id: userId
      }
    })

    if(!user) {
      throw new Error('User not found')
    }

    return user
  },
  userPosts: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)
    const opArgs = {
      where: {
        author: {
          id: userId
        }
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    if(!args.query) {
      return prisma.query.posts(opArgs, info)
    }

    opArgs.where.title_contains = opArgs.query
    let userPost = await prisma.query.posts(opArgs, info)

    if(userPost.length > 0) {
      return userPost
    }

    return prisma.query.posts({
      where: {
        author: {
          id: userId
        },
        body_contains: opArgs.query
      }
    }, info)
  }
  
  
  
}

export { Query as default }