import { GraphQLServer, MockList} from 'graphql-yoga';
import faker from 'faker'
import uuidv4 from 'uuid/v4'

var randomCard = faker.helpers.createCard();
// console.log({randomCard})
// scaler types - String, Boolean, Int, Float, ID 

let users = [
  {
    id: 1,
    name: 'Lenny Kuhic',
    username: 'Destiney_Wintheiser',
    email: 'Tyree92@yahoo.com',
    address: 'Vicenta View 6949 Charles Valley 69987 Walter Shoal Apt. 140 Suite 719 Lake Wyattville Nevada',
    country: 'United States Minor Outlying Islands',
    zipcode: '91083',
    phone: '693-479-3529',
    website: 'camden.com',
    company: 'Abbott, Walter and Heller',
    married: true
    },
  {
    id: 2,
    name: 'Whitney Harvey',
    username: 'Carolyne.Murphy36',
    email: 'Idell.Stark@gmail.com',
    address: 'Rudolph Wells 78210 Krajcik Squares 004 Osborne Motorway Apt. 881 Apt. 348 Alejandrintown Kentucky',
    country: 'Jordan',
    zipcode: '58234',
    phone: '163.757.9998 x8456',
    website: 'geoffrey.info',
    company: 'Terry, Kuvalis and Gulgowski',
    married: false
  }
]

let posts = [
  { 
    id: 1,
    title: "The days of old",
    published: false,
    body: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
    timestamp: Date.now(),
    author: 1
  },
  {
    id: 2,
    title: "The gods must be crazy",
    published: true,
    body: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
    timestamp: Date.now() - 840000,
    author: 2
  }, 
  {
    id: 3,
    title: "Why do we use it?",
    published: true,
    body: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    timestamp: Date.now() - 8400000,
    author: 1
  }
]



//Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String) :[User!]!
    posts(query: String) :[Post!]!
    listOfStrings: [String]
    getSum(x: Int, y: Int): Int!
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!

    createPost(
      title: String!
      published: Boolean!
      body: String!
      timestamp: String!
      author: ID!
    ): Post!

    deleteUser(id: ID): User!
  }

  input CreateUserInput {
    name: String! 
    email: String! 
    username: String!
    address: String!
    country: String!
    zipcode: Float!
    phone: String!
    website: String
    company: String!
    married: Boolean!
  }

  type User {
    id: ID,
    name: String!
    username: String!
    email: String!
    address: String!
    country: String!
    zipcode: Float!
    phone: String!
    website: String
    company: String!
    married: Boolean!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    published: Boolean!
    body: String!
    timestamp: String!
    author: User!
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
    users: (parent, args, ctx, info) => {
      if(!args.query) return users;

      return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts: (parent, args, ctx, info) => {
      if(!args.query) return posts;

      return posts.filter(post => post.body.toLowerCase().includes(args.query.toLowerCase()))
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
  },
  Mutation: {
    createUser: (parent , args, ctx, info) => {
      const userExist = users.some(user => user.email === args.data.email)

      if(userExist) {
        throw new Error('User already exist with the provided email :' + args.data.email)
      }

      const newUser = {
        id: uuidv4(), 
        ...args.data
      } 
      users.push(newUser)
      return newUser
    },
    deleteUser: (parent, args, ctx, info) => {
      const userIndex = users.findIndex(user => user.id === args.id)
      if(userIndex === -1) {
        throw new Error("No user found")
      }

      const deletedUser = users.splice(userIndex, 1)

      posts = posts.filter(post => {
        const match = post.author === args.id
        return !match
      })
      return deletedUser[0];
    },
    createPost: (parent, args, ctx, info) => {
      const userExist = users.some(user => user.id === args.author)
      
      if(!userExist) {
        throw new Error('Author with this id does not exist')
      }

      const newPost = {
        id: uuidv4(), 
        ...args
      } 
      posts.push(newPost)
      return newPost
    }
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find(user => user.id === parent.author)
    }
  },
  User: {
    posts: (parent, args, ctx, info) => {
      return posts.filter(post => post.author === parent.id)
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