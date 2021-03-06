import '@babel/polyfill'
import { GraphQLServer, PubSub } from 'graphql-yoga';
// import db from './db'
import prisma from './prisma'
import { resolvers, fragmentReplacements } from './resolvers/index'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      pubsub,
      prisma,
      request
    }
  },
  fragmentReplacements
})

const options = {
  port: 8000,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
}

server.start({port: process.env.PORT || 3000 }, ({ port }) => {
  console.log(
    `Server started, listening on port ${port} for incoming requests.`,
  )
})