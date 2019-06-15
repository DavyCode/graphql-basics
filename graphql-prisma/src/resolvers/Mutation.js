import uuidv4 from 'uuid/v4'

const Mutation =  {
  createUser: async (parent , args, {prisma}, info) => {
    const userExist = await prisma.exists.User({ email: args.data.email })

    if (userExist) {
      throw new Error("User already exist!!!")
    }

    return prisma.mutation.createUser({ data: args.data}, info)
  },
  updateUser: (parent, args, { prisma }, info) => {
    return prisma.mutation.updateUser({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  },
  deleteUser: async (parent, args, {prisma}, info) => {
    const userExist = await prisma.exists.User({ id: args.id})

    if(!userExist) {
      throw new Error("User not found!!!")
    }

    return prisma.mutation.deleteUser({ 
      where : {
        id: args.id
      }
    }, info) 
  },
  createPost: (parent, args, { db, pubsub }, info) => {
    const userExist = db.users.some(user => user.id === args.author)
    
    if(!userExist) {
      throw new Error('Author with this id does not exist')
    }

    const newPost = {
      id: uuidv4(), 
      ...args
    } 
    db.posts.push(newPost)

    if (args.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: newPost
        }
      })
    }

    return newPost
  },
  updatePost: (parent, args, { db, pubsub }, info) => {
    const { id, data} = args;
    const { title, body, published } = data;
    
    const selectedPost = db.posts.find(post => post.id === id) 
    const originalPost = { ...selectedPost }
    
    if(!selectedPost) {
      throw new Error("Post not found")
    }

    if(typeof title === 'string') {
      selectedPost.title = title
    }
    if(typeof body === 'string') {
      selectedPost.body = body
    }

    if(typeof published === 'boolean') {
      selectedPost.published = data.published

      if(originalPost.published && !selectedPost.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      }
      else if (!originalPost.published && selectedPost.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: selectedPost
          }
        })
      }
    }
    else if (selectedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: selectedPost
        }
      })
    }
    // pubsub.publish(`updatepost ${selectedPost.id}`, { 
    //   updatePost: {
    //     mutation: 'UPDATED',
    //     data: selectedPost
    //   } 
    // })
    
    return selectedPost
  },
  deletePost: (parent, args, {db, pubsub}, info) => {
    const postIndex = db.posts.findIndex(post => post.id === args.id)
    if (postIndex === -1) {
      throw new Error("This post wasnt found!!!")
    }

    const [deletedPost] = db.posts.splice(postIndex, 1)

    if(deletedPost.published) {
      pubsub.publish(`post`,
      {
        post: {
          mutation: 'DELETED',
          data: deletedPost
        }
      })
    }
    return deletedPost
  }
}

export { Mutation as default}