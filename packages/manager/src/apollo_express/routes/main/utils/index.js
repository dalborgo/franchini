import * as Models from '../../../models'
import { couchIndices } from '@adapter/io'
import { bucket } from '../../../db'
import log from '@adapter/common/src/winston'
import get from 'lodash/get'
import Q from 'q'

function addRouters (router) {
  router.get('/utils/ensure_indices', async (req, res) => {
    const promises = [], output = []
    let ok = true
    const { _name } = bucket
    const options = { connection: bucket }

    //region CUSTOM SKIP
    const skipModels = []
    //endregion

    //region STANDARD INDICES
    const primaryQuery = couchIndices.createPrimaryIndex(_name, options, true, true)
    promises.push(primaryQuery)
    const typeQuery = couchIndices.createIndex(`CREATE INDEX \`${_name}_index__type\` ON \`${_name}\`(\`_type\`) WITH {"defer_build":true}`, options, true)
    promises.push(typeQuery)
    for (let model in Models) {
      const modelName = Models[model].modelName
      if (skipModels.includes(modelName)) {continue}
      const query = couchIndices.createIndex(`CREATE INDEX \`${_name}_index__type_${modelName}\` ON \`${_name}\`(\`_type\`) WHERE _type = '${modelName}' WITH {"defer_build":true}`, { connection: bucket }, true)
      promises.push(query)
    }
    //endregion

    //region CUSTOM INDICES
    //endregion

    const results = await Q.allSettled(promises)
    results.forEach(result => {
      log.debug(result)
      if (result.state === 'fulfilled') {
        output.push(result.state)
      } else {
        ok = false
        const responseBody = get(result, 'reason.responseBody')
        const { errors } = JSON.parse(result.reason.responseBody)
        if (responseBody && errors['0']) {
          output.push(errors['0'])
        } else {
          output.push(result)
        }
      }
    })
    if (ok) {
      res.send({ ok, results: output })
    } else {
      res.send({ ok, message: 'Some errors occurred!', err: output })
    }
  })
  router.get('/utils/build_indices', async (req, res) => {
    const { ok, message, results } = await couchIndices.buildIndices({ connection: bucket })
    if (!ok) {return res.send({ ok, message })}
    res.send({ ok, results })
  })
}

export default {
  addRouters,
}
