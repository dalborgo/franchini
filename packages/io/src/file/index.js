import Q from 'q'
import fs from 'fs'
import Docxtemplater from 'docxtemplater'
import log from '@adapter/common/src/winston'
import pdftk from 'node-pdftk'
import PizZip from 'pizzip'
import toPdf from 'office-to-pdf'

async function fillDocxTemplate (templatePath, data, undefString = 'XXX') {
  try {
    const nullGetter = part => part.module ? '' : undefString
    const template = await Q.ninvoke(fs, 'readFile', templatePath)
    const zip = new PizZip(template)
    const results = new Docxtemplater(zip, { linebreaks: true, nullGetter })
      .setData(data)
      .render()
      .getZip()
      .generate({ type: 'nodebuffer' })
    return { ok: true, results }
  } catch (err) {
    log.error(err.message)
    return { ok: false, message: err.message, err }
  }
}

async function docxToPdf (buffer) {
  try {
    const results = await toPdf(buffer)
    return { ok: true, results }
  } catch (err) {
    log.error(err.message)
    return { ok: false, message: err.message, err }
  }
}

/**
 *source:{
 * A: buffer,
 * B: buffer,
 * ...
 * }
 */
async function mergePdf (source) {
  try {
    const results = await pdftk.input(source)
    return { ok: true, results }
  } catch (err) {
    log.error(err.message)
    return { ok: false, message: err.message, err }
  }
}

export default {
  docxToPdf,
  fillDocxTemplate,
  mergePdf,
}
