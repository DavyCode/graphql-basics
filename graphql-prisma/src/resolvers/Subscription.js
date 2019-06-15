const Subscription = {
  // count: {
  //   subscribe: (parent, args, { pubsub }, info) => {
  //     let count = 0

  //     setInterval(() => {
  //       count++
  //       pubsub.publish('count', {
  //         count
  //       })
  //     }, 3000)

  //     return pubsub.asyncIterator('count')
  //   }
  // },
  // updatePost: {
  //   subscribe: (parent, { postId }, { pubsub, db }, info) => {
  //     const postExist = db.posts.find(post => post.id === postId && post.published)

  //     if(!postExist) {
  //       throw new Error("Post not found")
  //     }

  //     // return pubsub.asyncIterator(`updatepost ${postId}`)
  //     return pubsub.asyncIterator(`post`)
  //   }
    
  // },
  post: {
    subscribe: (parent, args, { pubsub }, info) => {
      
      return pubsub.asyncIterator('post')
    }
    
  }

  
}

export { Subscription as default }