import { attemptSignIn, signOut } from '../apollo_auth'
import { User } from '../models'
import { CustomUserInputError, CustomValidationError } from '../errors'
import { cErrors, cFunctions } from '@adapter/common'
import pubsub from './pubsub'

const USER_ADDED = 'USER_ADDED'
const { createWriteStream } = require('fs')
const path = require('path')
const USER_GUEST = {
  id: 'guest',
  username: 'guest',
  role: 'GUEST',
}

export default {
  Query: {
    me: (root, args, { req }) => {
      const { userId } = req.session
      if (userId) {
        return User.findById(userId)
      } else {
        return USER_GUEST
      }
    },
    users: async () => {
      return User.getAll()
    },
    usersResultCursor: async (_, { after, dir, first }) => {
      if (first < 0) {
        throw new CustomUserInputError('"first" field must be positive!', { first })
      }
      const allUsers = await User.getAll()
      return cFunctions.cursorPaginator(allUsers, after, dir, first)
    },
    user: async (root, { id }) => {
      return User.findById(id)
    },
  },
  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(USER_ADDED),
    },
  },
  Mutation: {
    add: async (root, args) => {
      const existUser = await User.findById(args.input.username)
      existUser && cErrors.throwError(new CustomValidationError(`User ${existUser.username} already exists!`, 'DUP_USERNAME'))
      const user = new User(args.input)
      const userAdded = await user.save()
      await pubsub.publish(USER_ADDED, { userAdded: { ...userAdded, id: userAdded.id } }) //redis require id virtual
      return userAdded
    },
    del: async (root, { id }) => {
      return User.remove(id)
    },
    edit: async (root, { input }) => {
      const user = await User.findById(input.username)
      const newUser = Object.assign(user, input)
      return newUser.save()
    },
    /* newPass: async (root, args) => {
       const user = await User.findById(args.id)
       await Q.ninvoke(user, 'save')
       return user
     },*/
    signIn: async (root, args, { req }) => {
      const user = await attemptSignIn(args.username, args.password)
      req.session.userId = user.id
      return user
    },
    signOut: async (root, args, { req, res }) => {
      await signOut(req, res)
      return USER_GUEST
    },
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename } = await file
      await new Promise(res =>
        createReadStream()
          .pipe(createWriteStream(path.join(__dirname, '../public', filename)))
          .on('close', res)
      )
      return true
    },
    /* signUp: async (root, args, { req }) => {
       const user = await Q.ninvoke(User, 'create', args)
       req.session.userId = user.id()
       return user
     },*/
  },
}
