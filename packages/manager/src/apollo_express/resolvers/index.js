import user from './user'

export default [
  {
    Edge: {
      __resolveType () { //first parameter to identify the type of edge
        return 'userEdge'
      },
    },
  },
  user,
]
