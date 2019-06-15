const Query =  {
  users: (parent, args, {prisma}, info) => {
    const opArgs = {}

    if(args.query) {
      opArgs.where = {
        AND: [{
          name_contains: args.query
        },{
          email_contains: args.query
        }]
        // OR: [{
        //   name_contains: args.query
        // },{
        //   email_contains: args.query
        // }]
      }
    }

    return prisma.query.users(opArgs, info)
  }, 
  posts: (parent, args, {prisma}, info) => {
    const opArgs = {};

    if(args.query) {
      opArgs.where = {
        title_contains : opArgs.query
      }
    }

    return prisma.query.posts(opArgs, info)
  },
  comments: (parent, args, {prisma}, info) => {
    const opArgs = {};

    if(args.query) {
      opArgs.where = {
        id : opArgs.query
      }
    }
    return prisma.query.comments(opArgs, info)
  }
  
}

export { Query as default }