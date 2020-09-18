import keyBy from 'lodash/keyBy'
import get from 'lodash/get'
import fill from 'lodash/fill'
import { validation } from '@adapter/common'
import config from 'config'

const { REQ_ID } = config.get('express')
const debug = require('debug')
const { CORRISPETTIVI: table } = config.get('mexal')

function prepareStelleMetadata ({ products = [], departments = [], categories = [] }) {
  if (!REQ_ID) {throw Error('REQ_ID in express config is required for this operation!')}
  const catObj = keyBy(categories, 'id')
  const depObj = keyBy(departments, 'id')
  let np = fill(Array(9), 0) //support for nine net_price
  return products.map(p => {
    const { id, description: art_description, net_price, vat = 0, category_id, department_id, ext_code } = p
    np[0] = parseFloat(net_price.toFixed(2))
    const vat_nature = get(depObj, `[${department_id}].vat_rate`, '')
    const cat_description = get(catObj, `[${category_id}].description`, '')
    return {
      alias_1: '',
      alias_astenpos: '',
      alias_stelle: id.toString(),
      art_description: validation.escapeUnknownChar(art_description),
      cat_description,
      cost: 0,
      ext_code,
      id: id.toString(),
      id_richiesta: REQ_ID,
      net_price_1: np[0],
      net_price_2: np[1],
      net_price_3: np[2],
      net_price_4: np[3],
      net_price_5: np[4],
      net_price_6: np[5],
      net_price_7: np[6],
      net_price_8: np[7],
      net_price_9: np[8],
      processed: 1, //ok 1
      type: 'M',
      um: 'PZ',
      vat,
      vat_nature,
    }
  })
}

function prepareAstenposMetadata ({ products = [], departments = [], categories = [] }) {
  if (!REQ_ID) {throw Error('REQ_ID in express config is required for this operation!')}
  const catObj = keyBy(categories, '_id')
  const depObj = keyBy(departments, '_id')
  let np = fill(Array(9), 0) //support for nine net_price
  return products.map(p => {
    const { _id, category, display: art_description, prices, vat_department_id } = p
    for (let i = 0; i < np.length; i++) {
      np[i] = get(prices[i], 'price', 0) / 1000
    }
    const vat = get(depObj, `[${vat_department_id}].iva`, '')
    const cat_description = get(catObj, `[${category}].display`, '')
    return {
      alias_1: '',
      alias_astenpos: _id,
      alias_stelle: '',
      art_description,
      cat_description,
      cost: 0,
      ext_code: _id,
      id: _id,
      id_richiesta: REQ_ID,
      net_price_1: np[0],
      net_price_2: np[1],
      net_price_3: np[2],
      net_price_4: np[3],
      net_price_5: np[4],
      net_price_6: np[5],
      net_price_7: np[6],
      net_price_8: np[7],
      net_price_9: np[8],
      processed: 1, //ok 1
      type: 'M',
      um: 'PZ',
      vat,
      vat_nature: '',
    }
  })
}

function prepareRCHClosingMetadata (results, printerName, options = {}) {
  function getRowValues (det, curr, key) {
    const val = curr[key]
    switch (det) {
      case 'TOTALE VENDITE':
        return { riga_totale: val }
      case 'IMPONIBILE VENDITE':
        return { riga_imponibile: val }
      case 'IVA VENDITE':
        return { riga_totale_iva: val }
      default:
        return {}
    }
  }

  function getVatRows (curr, startId, baseRow) {
    const obj = {}
    for (let val in curr) {
      const matches = val.match(/^IVA (.+),.+: (.+)/) || val.match(/^IVA (.+): (.+)/)
      if (!matches) {continue}
      const [key, cod, det] = matches
      const [code_corr, perc] = cod.split(' ')
      if (!table[code_corr]) {continue}
      const { mexal: riga_mexal, iva } = table[code_corr]
      if (!riga_mexal) {continue}
      const riga_mexal_iva = iva || perc
      const rowValues = getRowValues(det, curr, key)
      obj[code_corr] = obj[code_corr]
        ? { ...rowValues, ...obj[code_corr] }
        : {
          ...rowValues,
          ...baseRow,
          id: `${startId}_${riga_mexal}`,
          is_iva: 1,
          riga_mexal,
          riga_mexal_iva,
        }
    }
    return obj
  }

  const res = results.reduce((prev, curr) => {
    if (!REQ_ID) {throw new Error('REQ_ID in express config is required for this operation!')}
    const startId = `${curr['DATA']}_${curr['CHIUSURA GIORNALIERA N.']}`,
      header = {
        data: curr['DATA'],
        gran_totale: curr['GRAN TOTALE'],
        id_richiesta: REQ_ID,
        nome_stampante: printerName,
        numero: curr['CHIUSURA GIORNALIERA N.'],
        ora: curr['ORA'],
        processed: 0,
        vendite: curr['VENDITE'],
      }
    const rows = getVatRows(curr, startId, header)
    {
      const riga_mexal = get(table, 'cassa.mexal')
      if (riga_mexal) {
        rows['cassa'] = {
          ...header,
          id: `${startId}_${riga_mexal}`,
          riga_totale: curr['VENDITE'],
          riga_mexal,
        }
      }
    }
    {
      const riga_mexal = get(table, 'corr_non_riscosso.mexal')
      if (riga_mexal) {
        rows['corr_non_riscosso'] = {
          ...header,
          id: `${startId}_${riga_mexal}`,
          riga_totale: curr['CORR.NON RISCOSSO'],
          riga_mexal,
        }
      }
    }
    prev.push(rows)
    return prev
  }, [])
  const deb = debug('man:closing')
  deb('res:', res)
  if (options.flat) {
    let resFlat = []
    res.forEach(row => {
      resFlat = resFlat.concat(Object.values(row))
    })
    return resFlat
  } else {
    return res
  }
}

export default {
  prepareStelleMetadata,
  prepareAstenposMetadata,
  prepareRCHClosingMetadata,
}
