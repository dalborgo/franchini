import { couchbase } from '@adapter/io'

const writeOC = async rows => {
  try {
    for (let row of rows) {
      console.log('row:', row)
    }
    //endregion
    return {
      ok: true,
      results: {
        lineAffected: 'miao',
      },
    }
  } catch (err) {
    console.error(err)
    return { ok: false, message: err.message, err }
  }
}

void (async () => {
  //cron executed at 1am o'clock. If an error occurred, it tries again 30 mins later
  couchbase.longPollChanges(
    writeOC,
    {
      channels: 'prints',
      include_docs: true,
      timeout: 30000,
    },
    'OC TO MEXAL'
  )
})()
/*const mio=fs.readFileSync(path.resolve('files/queries/articolo.sql'))
console.log('mio:', mio.toString())*/
//mysql.executeQuery(formatters.replaceInto(art, 'articolo'))
//mysql.executeQuery(mio.toString()).then(deb)
//mysql.createTables().then(deb)
/*
import mysql from './mysql'
import { formatters } from './helpers'
import fs from 'fs'
import path from 'path'

const deb = require('debug')('ms:b')
const art = {
  id: 162,
  description: 'Camomilla',
  ext_code: '162',
  net_price: 1.600000023841858,
  vat: 10,
  department_id: 3,
  department_description: 'Bar2',
  department_vat_rate: 10,
  category_id: 109
}
*/
