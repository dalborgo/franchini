import { cFunctions } from '@adapter/common'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import log from '@adapter/common/src/winston'

const { PubSub } = require('apollo-server-express')
const Redis = require('ioredis')
let pubsub
const options = {
  retryStrategy: times => Math.min(times * 50, 2000),
}
if (cFunctions.isProd()) {
  pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  })
} else {
  log.warn('Dev PubSub')
  pubsub = new PubSub()
}

export default pubsub
