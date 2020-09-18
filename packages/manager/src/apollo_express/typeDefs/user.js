import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User @auth
    users: [User]
    usersResultCursor(
      after: String
      dir: CursorDir,
      first: Int
    ): ResultCursor
  }

  extend type Subscription {
    userAdded: User
  }

  type userEdge implements Edge {
    cursor: String!
    node: User
  }

  extend type Mutation {
    add(input: AddUserInput!): User @guest
    edit(input: EditUserInput!): User @auth
    del(id: ID!): User @guest
    newPass(id: ID!, password: String!): User @auth
    signUp(email: String!, username: String!, role: Roles!, password: String!): User @guest
    signIn(username: String!, password: String!): User @guest
    signOut: User @auth
    uploadFile(file: Upload!): Boolean @guest
  }

  input AddUserInput {
    email: String!
    username: String!
    password: String!
  }

  input EditUserInput {
    username: String!
    email: String!
    password: String
  }
  """
  the order of roles is important, the index correspond to the priority weight.
  """
  enum Roles {
    GUEST
    SUPER
  }

  type UserConnection {
    cursorNext: String!
    cursorPrevious: String!
    hasNext: Boolean!
    hasPrevious: Boolean!
    users: [User]
  }

  type User {
    id: ID!
    username: String!
    email: String
    role: Roles!
  }
`
