import config from 'config'
import log from '@adapter/common/src/winston'

const { IP_DEFAULT, BUCKET_DEFAULT, ADMIN_DEFAULT = BUCKET_DEFAULT, PASSWORD_DEFAULT = ADMIN_DEFAULT || BUCKET_DEFAULT } = config.get('couchbase')
const couchbase = require('couchbase')
const lounge = require('lounge')
const cluster = new couchbase.Cluster(`couchbase://${IP_DEFAULT}`)
log.silly('connect lounge')
cluster.authenticate(ADMIN_DEFAULT, PASSWORD_DEFAULT)
const bucket = cluster.openBucket(BUCKET_DEFAULT)
lounge.connect({
  bucket,
}, null)

export {
  bucket,
  lounge,
}
