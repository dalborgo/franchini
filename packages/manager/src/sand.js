/*import { borin } from './tasks'
import config from 'config'
import { cron } from './listeners'

const rchPrinters = config.get('rch')*/
//import {log} from '@adapter/common'
require('./apollo_express')
/*import {cDate} from '@adapter/common'

console.log(cDate.mom(null, null,'YYYYMMDD', [-14,'d']))*/
//console.log(cDate.mom('ciao'))
//require('./server')
/*const prova = {
  miao: 14,
  ciao: 34,
}*/
/*

log.debug('ciao')
log.debug('prova', prova)
log.debug('prova', prova)
log.info('prova', prova)
*/
/*log.warn('prova', prova)
log.info('prova', prova)
log.debug('prova', prova)
log.verbose('prova', prova)*/
//log.error('errore 22')

/*
try {
  throw new Error('errore')
} catch (err) {
  log.error(err)
}
*/


//region VIVIANI
/*const LISTENER_TIMEOUT_MILLI = 10000

async function start () {
  try {
    mysql.startListener(start).then(instance => {
      instance.addTrigger(mysql.createTrigger({
        statement: 'ALL',
        expression: 'adapter.num_bolla_fornitore.*',
        onEvent: async event => {
          const { timestamp, type } = event
          console.log('event:', event)
          if (['INSERT', 'UPDATE'].includes(type)) {
            console.log(cDate.mom(timestamp))
            const { ok, results } = await viviani.vivianiUpdateSupTable()
            console.log('ok', ok)
            console.log(`Updated ${results.length} rows!`)
          }
        },
      }))
      console.log('Mysql listener: waiting for mysql events...')
    }).catch(err => {
      console.error('Mysql listener error:', err.message)
      if (err.code === 'ECONNREFUSED') {
        setTimeout(() => {start()}, LISTENER_TIMEOUT_MILLI)
      }
    })
  } catch (err) {
    console.error(err.message)
  }
}

start().then()*/
//endregion

//region OMBRELLI
/*const LISTENER_TIMEOUT_MILLI = 10000
const { DB_DATABASE } = config.get('mysql')
async function start () {
  try {
    const first = await ombrelli.elaborate()
    console.log('First execution:', JSON.stringify(first, null, 2))
    mysql.startListener(start).then(instance => {
      instance.addTrigger(mysql.createTrigger({
        statement: 'ALL',
        expression: `${DB_DATABASE}.wp_posts.post_status`,
        onEvent: async event => {
          const { affectedRows, timestamp, type } = event
          if (['INSERT', 'UPDATE'].includes(type)) {
            for (let { after: { ID, post_status, post_type } } of affectedRows) {
              if (post_type === 'shop_order' && post_status === 'wc-processing') {
                console.log(cDate.mom(timestamp))
                console.log('Order Id:', ID)
                console.log('Status:', post_status)
                const resp = await ombrelli.elaborate(ID)
                console.log(JSON.stringify(resp, null, 2))
              }
            }
          }
        },
      }))
      console.log('Mysql listener: waiting for mysql events...')
    }).catch(err => {
      console.error('Mysql listener error:', err.message)
      if (err.code === 'ECONNREFUSED') {
        setTimeout(() => {start()}, LISTENER_TIMEOUT_MILLI)
      }
    })
  } catch (err) {
    console.error(err.message)
  }
}

start().then()*/
//endregion

//region BORIN
//region SINGLE CRON
/*async function tasks () {
  try {
    const results = {}
    results.alignProductTask = await borin.borinArticlesToMexal()
    for (let printerName in rchPrinters) {
      results[`alignFeed${printerName}`] = await borin.borinFeesToMexal(['251019'], printerName)
    }
    return { ok: true, results }
  } catch ({ message }) {
    return { ok: false, message }
  }
}*/
//endregion
//region MULTI CRON
/*async function articles () {
  try {
    return await borin.borinArticlesToMexal()
  } catch ({ message }) {
    return { ok: false, message }
  }
}

const minutes = [
  [30],
  [45],
]

let cont = 0
cron.startCron('alignArticles', { second: [15] }, { second: 30 }, articles)
for (let printerName in rchPrinters) {
  const task = printerName => async () => {
    try { return await borin.borinFeesToMexal(['251019'], printerName)} catch ({ message }) {
      return {
        ok: false,
        message,
      }
    }
  }
  cron.startCron(`alignFeed${printerName}`, { second: minutes[cont++] }, { second: 30 }, task(printerName))
}*/
//endregion

/*void (async () => {
  try {
    const res = await borin.borinArticlesToMexal()
    console.log('Allineamento prodotti: ', res)
    for (let printerName in rchPrinters) {
      const res = await borin.borinFeesToMexal(['251019'], printerName)
      console.log(`Allineamento corrispettivi ${printerName}: `, res)
    }
  } catch (err) {
    console.error(err.message)
  }
})()*/
//endregion

/*(async () => {
  const res = await couchbase.execQueryService('Select * from viviani limit 1')
  console.log(JSON.stringify(res, null, 2))
})()*/
/*
borin.borinFeesToMexal().then(r => {
  console.log(r)
}).catch(err => {
  console.error(err.message)
})
*/

/*(async () => {
  const res = await ombrelli.elaborate()
  console.log(JSON.stringify(res, null, 2))
})()*/

//import { mysql, ioFormatters } from '@adapter/io'

//const { IP_DEFAULT, BUCKET_DEFAULT } = config.get('couchbase')

/*ombrelli.ombrelliElaborate().then(r => {
  //debug.to_file(JSON.stringify(r, null, 2))
  console.log(JSON.stringify(r, null, 2))
}).catch(err => {
  console.error(err.message)
})*/

/*cron.startCron('TEST', 0, (input) => ({ok:true, results: input}), 'test!')*/
/*


function prova (id) {
  return new Promise((resolve, reject) => {
    console.log('entro '+id)
    setTimeout(() => resolve('fatto '+ id), id === 'SF_BOLLA_601.12345_11' ? 10000 : 1000)
  })
}
*/
/*astenposViews.getCategories().then(r => {
  console.log(r)
}).catch(err => {
  console.error(err.message)
})*/

/*
command.execCommand('dir').then(r => {
  console.log(r.results)
}).catch(err => {
  console.error(err.message)
})
*/

/*
rchViews.getDGFE_CH('090919').then(res => {
  console.log('dgfe:', res)
  const results = rchFormatters.arrFromDGFE(res)
  const rows = normalizers.prepareRCHClosingMetadata(results)
  let query = []
  rows.forEach(row => {
    query = query.concat(Object.values(row))
  })
  console.log('rows:', query)

  //mysql.executeQuery(ioFormatters.replaceInto(obj, 'corrispettivo')).then(deb)
}).catch((err) => {
  console.error(err.toString())
  process.exit(0)
})
*/

/*
couchbase.wsChanges(viviani.vivianiBolleToMexal,{
  channels: 'bolla'
}, 'VIVIANI-BOLLE')
*/

/*
mysqlManager.startListener().then(() => {
  console.log('Mysql listener: waiting for mysql events...')
  cron.startCron('TEST', 0)
  cron.startCron('TEST2', 30)
}).catch(err => {
  console.error('Mysql listener error:', err.message)
})

*/

/*const init = async () => {
  try {
    let norm_astenpos, norm_stelle
    {
      const {ok, results, message} = await astenposViews.getAstenposMetaData()
      if (ok) {
        norm_astenpos = normalizers.prepareAstenposMetadata(results)
        //return await mysql.executeQuery(ioFormatters.replaceInto(norm, 'articolo'))
      } else {
        console.error(message)
      }
    }
    {
      const {ok, results, message} = await stelleViews.getStelleMetadata()
      if (ok) {
        norm_stelle = normalizers.prepareStelleMetadata(results)
        console.log('norm_stelle:', norm_stelle)
        //return await mysql.executeQuery(ioFormatters.replaceInto(norm, 'articolo'))
      } else {
        console.error(message)
      }
    }
    /!* const norm_astenpos = [{
       id: 'PRODUCT_cuvee-royal-bicch::vini-bicchiere',
       art_description: 'CUVEE ROYAL BICCH',
       cat_description: 'Vini Bicchiere',
       um: 'PZ',
       type: 'M',
       ext_code: 'PRODUCT_cuvee-royal-bicch::vini-bicchiere2',
       net_price_1: 5,
       net_price_2: 0,
       net_price_3: 0,
       net_price_4: 0,
       net_price_5: 0,
       net_price_6: 0,
       net_price_7: 0,
       net_price_8: 0,
       net_price_9: 0,
       cost: 0,
       vat: 10,
       vat_nature: '',
       alias_astenpos: 'PRODUCT_cuvee',
       alias_1: ''
     }]
     const norm_stelle = [{
       id: 230,
       art_description: 'CUVEE ROYAL BICCH',
       cat_description: '',
       um: 'PZ',
       type: 'M',
       ext_code: 'PRODUCT_cuvee-royal-bicch::vini-bicchiere',
       net_price_1: 8,
       net_price_2: 0,
       net_price_3: 0,
       net_price_4: 0,
       net_price_5: 0,
       net_price_6: 0,
       net_price_7: 0,
       net_price_8: 0,
       net_price_9: 0,
       cost: 0,
       vat: 10,
       vat_nature: 'Standard 10',
       alias_stelle: '230',
       alias_1: ''
     }]*!/
    /!* const norm_union = _(norm_astenpos)
       .concat(norm_stelle)
       .groupBy('ext_code')
       .map(_.spread(_.merge))
       .groupBy('art_description')
       .map(_.spread(_.merge))
       .value()*!/
    const norm_union = compose(
      map(spread(merge)),
      groupBy('art_description'),
      map(spread(merge)),
      groupBy('ext_code'),
      concat(norm_astenpos)
    )
    return await mysql.executeQuery(ioFormatters.replaceInto(norm_union(norm_stelle), 'articolo', ['ext_code']))
  } catch (err) {
    console.error(err)
    return err
  }
}
init().then(r => deb('results:', r))*/
/*setTimeout(async () => {
  try {
    const obj = {
      vendite: 122.4
    }
    const res = await mysql.executeQuery(ioFormatters.replaceInto(obj, 'corrispettivo'))
    console.log(res)
  } catch (err) {
    console.error(err.message)t
  }
}, 5000)*/
/*viewsRCH.getConf().then(r => {
  console.log(r)
}).catch((err) => {
  console.error(err)
})*/


