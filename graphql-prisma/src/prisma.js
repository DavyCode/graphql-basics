import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'
// Instantiate `Prisma` based on concrete service
const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: "arizabalaga",
  fragmentReplacements
})

export { prisma as default }