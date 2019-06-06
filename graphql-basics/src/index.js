import { GraphQLServer, MockList, PubSub } from 'graphql-yoga';
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'

// const mocks = {
//   Query: () => ({
//     listOfStrings: () => new MockList([2, 6]),
//   }),
// }

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Subscription
  },
  context : {
    db,
    pubsub
  }
  // mocks
})

// const options = {
//   port: 8000,
//   endpoint: '/graphql',
//   subscriptions: '/subscriptions',
//   playground: '/playground',
// }

server.start({port: 3000}, ({ port }) => {
  console.log(
    `Server started, listening on port ${port} for incoming requests.`,
  )
})