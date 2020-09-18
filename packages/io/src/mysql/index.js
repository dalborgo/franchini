import config from 'config'
import mysql from 'mysql'
import fs from 'fs'
import path from 'path'
import log from '@adapter/common/src/winston'

!config.has('mysql') && log.silly('mysql config is not defined!')
const { DB_DATABASE, DB_PASS, DB_USER, DB_SERVER, PORT = 3306 } = config.has('mysql') ? config.get('mysql') : {}

async function createTables () {
  const files = [], logs = []
  const _path = path.resolve('files/queries')
  fs.readdirSync(_path).forEach(file => {
    files.push(`${_path}/${file}`)
  })
  for (const item of files) {
    try {
      await executeQuery(fs.readFileSync(item).toString())
      logs.push(`${item}: OK!`)
    } catch (err) {
      logs.push(err instanceof Error ? err.message : err.err.sqlMessage)
    }
  }
  return logs.join('\n')
}

const deb = require('debug')('ms:res')
const debQ = require('debug')('ms:q')
const debR = require('debug')('ms:req')

const getConnection = () => mysql.createConnection({
  database: DB_DATABASE,
  host: DB_SERVER,
  multipleStatements: true,
  password: DB_PASS,
  port: PORT,
  user: DB_USER,
})

function executeQuery (query) {
  if (!query) {
    return { ok: false, err: {}, message: 'MySql executeQuery: query undefined!' }
  }
  return new Promise((resolve, reject) => {
    const connection = getConnection()
    debQ(query)
    debR('start request')
    connection.query(query, function (err, results) {
      debR('end request')
      if (err) {
        deb('executeQuery:', err.code)
        reject({ ok: false, err, message: err.message })
      } else {
        const out = { ok: true, results }
        deb(out)
        resolve(out)
      }
    })
    connection.end()
  })
}

export default {
  executeQuery,
  createTables,
}
