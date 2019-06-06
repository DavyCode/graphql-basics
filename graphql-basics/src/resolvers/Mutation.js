import uuidv4 from 'uuid/v4'

const Mutation =  {
  createUser: (parent , args, {db}, info) => {
    const userExist = db.users.some(user => user.email === args.data.email)

    if(userExist) {
      throw new Error('User already exist with the provided email :' + args.data.email)
    }

    const newUser = {
      id: uuidv4(), 
      ...args.data
    } 
    db.users.push(newUser)
    return newUser
  },
  updateUser: (parent, args, { db }, info) => {
    const { id, data } = args;
    const { email, name, username, address, country, zipcode, phone, website, company, married} = data;

    const user = db.users.find(user => user.id === id)

    if(!user) throw new Error("User not found")

    // use validation here  
    if(typeof email === 'string') {
      const emailUsed = db.users.some(user => user.email === email)
      if(emailUsed) {
        throw new Error("Email taken already")
      }

      user.email = email
    }

    if(typeof name === 'string') {
      user.name = name
    }
    if(typeof username === 'string') {
      user.username = username
    }
    if(typeof address === 'string') {
      user.address = address
    }
    if(typeof country === 'string') {
      user.country = country
    }
    if(typeof zipcode === 'float') {
      user.zipcode = zipcode
    }
    if(typeof phone === 'string') {
      user.phone = phone
    }
    if(typeof website !== 'undefined') {
      user.website = website
    }
    if(typeof company === 'string') {
      user.company = company
    }
    if(typeof married === 'boolean') {
      user.married = married
    }

    return user
  },
  deleteUser: (parent, args, {db}, info) => {
    const userIndex = db.users.findIndex(user => user.id === args.id)
    if(userIndex === -1) {
      throw new Error("No user found")
    }

    const deletedUser = db.users.splice(userIndex, 1)
    
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id
      return !match
    })
    return deletedUser[0];
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