const Query =  {
  users: (parent, args, ctx, info) => {
    if(!args.query) return ctx.db.users;

    return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
  },
  posts: (parent, args, {db}, info) => {
    if(!args.query) return db.posts;

    return db.posts.filter(post => post.body.toLowerCase().includes(args.query.toLowerCase()))
  },
  getSum: (parent, args, ctx, info) => {
    if(args.x && args.y)
      return args.x + args.y
    return 0
  },
  title() {
    return 'Outbox'
  },
  price() {
    return 1000.45
  },
  releaseYear() {
    return 2019
  },
  rating() {
    return 5.6
  },
  inStock() {
    return true
  }
}

export {Query as default}