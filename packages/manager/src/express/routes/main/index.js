import { reqAuthGet, reqAuthPost } from '../auth'
import { mysql } from '@adapter/io'

const express = require('express')
const router = express.Router()
require('express-async-errors')

router.get('/', function (req, res) {
  res.redirect('/')
})
router.get('/get_recipes', async function (req, res) {
  const query = 'SELECT '
                + 'plu.CodPLU AS codplu, '
                + 'catmerc.CodMer AS codmer, '
                + 'plu.Desc1 AS descr, '
                + 'plu.Desc2 AS descr2, '
                + 'catmerc.DesMer AS merc, '
                + 'plutxt.Testo AS recipe '
                + 'FROM '
                + 'catmerc '
                + 'INNER JOIN '
                + 'plu '
                + 'ON '
                + 'catmerc.CodMer = plu.CodMerc '
                + 'INNER JOIN '
                + 'plutxt '
                + 'ON '
                + 'plu.CodPLU = plutxt.CodPlu'
  
  const { ok, message, results } = await mysql.executeQuery(query)
  if (ok) {
    res.send({ results })
  } else {
    res.send({ ok, message })
  }
})

router.get('/reserved', reqAuthGet, function (req, res) {
  res.send('reserved')
})

router.get('/reserved', reqAuthPost, function (req, res) {
  res.send('reserved')
})

export default router


