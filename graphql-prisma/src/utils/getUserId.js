import jwt from 'jwt-simple'

const getUserId = (request, requireAuth = true) => {
  const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

  if (header) {
    const token = header.replace('Bearer ', '')
    const decoded = jwt.decode(token, 'arizabalaga')
    return decoded.userId
  }

  if (requireAuth) {
    throw new Error("Auth required!!!!")
  }

  return null
}

export { getUserId as default }