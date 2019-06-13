import { Prisma } from 'prisma-binding'

// Instantiate `Prisma` based on concrete service
const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'localhost:4466'
})

export { prisma as default }