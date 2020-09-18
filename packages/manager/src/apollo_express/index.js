import express from 'express'
import session from 'express-session'
import { bucket } from './db'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import schemaDirectives from './directives'
import config from 'config'
import { cFunctions } from '@adapter/common'
import log from '@adapter/common/src/winston'
import indexRouter from './routes'
import appRouter from './routes/main'
import http from 'http'
import { couchbase } from '@adapter/io'

const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const { MAXAGE_MINUTES, ORIGIN, NAMESPACE, BODY_LIMIT = '100kb', PORT, IP } = config.get('apollo_express')
const { BUCKET_DEFAULT, IP_DEFAULT } = config.get('couchbase')
const path = require('path')
const cors = require('cors')
const CouchbaseStore = require('connect-couchbase')(session)
const corsDef = { origin: ORIGIN, credentials: true }

bucket.on('error', err => {
  log.error(err)
})

bucket.on('connect', () => {
  const app = express()
  app.disable('x-powered-by')
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  const couchbaseStore = new CouchbaseStore({
    db: bucket,
    prefix: 'sess::',
  })
  app.use(cors(corsDef))
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json({ limit: BODY_LIMIT }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(session({
    cookie: {
      maxAge: parseInt(MAXAGE_MINUTES) * 60 * 1000,
      sameSite: true,
      secure: false, //true if https server
    },
    name: `${NAMESPACE}_session`,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    secret: 'aplocandiemete',
    store: couchbaseStore,
  }))
  const server = new ApolloServer({
    context: ({ req, res }) => ({ req, res }),
    debug: !cFunctions.isProd(),
    introspection: true,
    playground: cFunctions.isProd()
      ? false
      : {
        settings: {
          'request.credentials': 'include',
        },
      },
    resolvers,
    schemaDirectives,
    subscriptions: {
      onConnect: (connectionParams, webSocket, context) => {
        console.log('onConnect')
        // ...
      },
      onDisconnect: (webSocket, context) => {
        console.log('onDisconnect')
        // ...
      },
    },
    typeDefs,
  })
  app.use('/', indexRouter)
  app.use(`/${NAMESPACE}`, appRouter)

  server.applyMiddleware({ app, cors: corsDef })
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    log.error(err)
    res.status(err.status || 500)
    res.json({ ok: false, message: err.message, err })
  })
  app.use(function (req, res) {
    const err = createError(404)
    log.warn(`${err.message} ${req.originalUrl}`)
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.render('error')
  })
  /*app.listen({ port: PORT }, async () => {
    const label = cFunctions.isProd() ? 'Production' : 'Development'
    log.info(`Apollo Express ${NAMESPACE} listening on port ${PORT}`)
    log.hint(`Environment: ${label}`)
    {
      const { ok, results, message } = await couchbase.getVersion()
      if (ok) {
        log.hint(`Couchbase: ${IP_DEFAULT} / ${BUCKET_DEFAULT} / ${results}`)
      } else {
        log.warn(message)
        log.hint(`Couchbase: ${IP_DEFAULT} / ${BUCKET_DEFAULT}`)
      }
    }
    {
      const { ok, results, message } = await couchbase.getIndexStatus()
      if (ok) {
        log.hint('Index Status', results)
      } else {
        log.warn(message)
      }
    }
    !cFunctions.isProd() && log.hint(`GraphQl Url: http://${IP}:${PORT}${server.graphqlPath}`)
  })*/

  const httpServer = http.createServer(app)
  server.installSubscriptionHandlers(httpServer)
  httpServer.listen(PORT, async () => {
    const label = cFunctions.isProd() ? 'Production' : 'Development'
    log.info(`Apollo Express ${NAMESPACE} listening on port ${PORT}`)
    log.info('Subscriptions ready!')
    log.hint(`Environment: ${label}`)
    {
      const { ok, results, message } = await couchbase.getVersion()
      if (ok) {
        log.hint(`Couchbase: ${IP_DEFAULT} / ${BUCKET_DEFAULT} / ${results}`)
      } else {
        log.warn(message)
        log.hint(`Couchbase: ${IP_DEFAULT} / ${BUCKET_DEFAULT}`)
      }
    }
    {
      const { ok, results, message } = await couchbase.getIndexStatus()
      if (ok) {
        log.hint('Index Status', results)
      } else {
        log.warn(message)
      }
    }
    !cFunctions.isProd() && log.hint(`GraphQl Url: http://${IP}:${PORT}${server.graphqlPath}`)
    !cFunctions.isProd() && log.hint(`Subscriptions Url: ws://${IP}:${PORT}${server.graphqlPath}`)
  })
})
