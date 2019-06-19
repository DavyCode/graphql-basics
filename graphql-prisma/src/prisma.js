import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'
// Instantiate `Prisma` based on concrete service
const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.SECRET_TOKEN,
  fragmentReplacements
})

export { prisma as default }