import { reqAuthGet, reqAuthPost } from '../auth'
import utils from './utils'
import User from '../../models/user'

const express = require('express')
const router = express.Router()
require('express-async-errors')

utils.addRouters(router)

router.get('/', function (req, res) {
  res.redirect('/')
})

router.get('/test_user/:pass', async function (req, res) {
  const { pass } = req.params
  console.log(pass)
  const user = await User.findById('dalborgo2')
  console.log(user.password)
  const result = await user.matchPassword(pass)
  res.send(result)
})

router.get('/reserved', reqAuthGet, function (req, res) {
  res.send('reserved')
})

router.get('/reserved', reqAuthPost, function (req, res) {
  res.send('reserved')
})

export default router


