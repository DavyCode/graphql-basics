import { GraphQLServer, MockList} from 'graphql-yoga';

//Type definitions (schema)
const typeDefs = `
  type Query {
    listOfStrings: [String]
    getSum(x: Int, y: Int): Int!
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`
const mocks = {
  Query: () => ({
    listOfStrings: () => new MockList([2, 6]),
  }),
}
//resolvers
const resolvers = {
  Query: {
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
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
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