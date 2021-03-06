import { cDate, cFunctions } from '@adapter/common'
import log from '@adapter/common/src/winston'
import indexRouter from './routes'
import appRouter from './routes/main'

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const favicon = require('serve-favicon')
const config = require('config')
const { NAMESPACE, BODY_LIMIT = '100kb' } = config.get('express')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

morgan.token('data', function () {
  return cDate.now('DD/MM/YY HH:mm:ss')
})
morgan.token('remote-ip', function (req) {
  return req.ip.replace('::ffff:', '')
})
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(cors())
app.use(morgan(
  function (tokens, req, res) {
    return [
      '<-',
      tokens.data(req, res),
      tokens['remote-ip'](req, res),
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res, 0), 'ms',
    ].join(' ')
  }, {
    skip: function (req) {
      const regex = /^\/?[\w/?.&-=]+\/?((\bimages\b)|(\bimg\b)|(\bfavicon.ico\b)|(\bfavicon\b)|(\bcss\b)|(\bjs\b))\/[\w/?.%&-=]+$/
      if (regex.test(req.url)) {
        return true
      }
    },
  })
)
app.use(express.json({ limit: BODY_LIMIT }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use(`/${NAMESPACE}`, appRouter)

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  log.error(err)
  if (cFunctions.isProd()) {
    res.status(err.status || 500)
  } else {
    res.status(412 || err.status || 500)
  }
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

export default app
