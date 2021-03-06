import Q from 'q'
import { customAlphabet, urlAlphabet } from 'nanoid'
import * as paginator from './paginator'
import camelCase from 'lodash/camelCase'
import deburr from 'lodash/deburr'
import { chain } from 'lodash'
import log from '../log'

const isProd = () => process.env.NODE_ENV === 'production'
const generator = require('generate-password')

const getUUID = (length = 21, alphabet = urlAlphabet) => customAlphabet(alphabet, length)
const getAuth = (user, password) => `Basic ${new Buffer(`${user}:${password}`).toString('base64')}`
const toBase64 = str => Buffer.from(str).toString('base64')
const fromBase64 = b64Encoded => Buffer.from(b64Encoded, 'base64').toString()
const camelDeburr = val => camelCase(deburr(val))

async function createChain (arr, extraParams = [], callback, initValue = []) {
  const promises = []
  arr.forEach(params => {
    if (!Array.isArray(params)) {
      params = [params]
    }
    if (!Array.isArray(extraParams)) {
      extraParams = [extraParams]
    }
    promises.push(callback.apply(null, [...params, ...extraParams]))
  })
  return promises.reduce(Q.when, Q(initValue))
}

const generateString = (length = 8, numbers = true, uppercase = true, excludeSimilarCharacters = true, strict = true) => {
  return generator.generate({
    excludeSimilarCharacters,
    length,
    numbers,
    strict,
    uppercase,
  })
}

const isObj = obj => typeof obj === 'object'
const isFunc = obj => typeof obj === 'function'
const isError = obj => obj instanceof Error
const isString = obj => typeof obj === 'string' || obj instanceof String

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function checkDuplicate (values, comparator) {
  const res = []
  if (!isFunc(comparator)) {
    log.warn('Invalid comparator!')
    return res
  }
  for (let index = 0; index < values.length; index++) {
    const isDup = chain(values).filter((_, i) => i !== index).some(comparator(values, index)).value()
    isDup && res.push(index)
  }
  return res
}

export default {
  camelDeburr,
  checkDuplicate,
  createChain,
  cursorPaginator: paginator.cursorPaginator,
  cursorPaginatorBoost: paginator.cursorPaginatorBoost,
  fromBase64,
  generateString,
  getAuth,
  getUUID,
  isError,
  isFunc,
  isObj,
  isProd,
  isString,
  sleep,
  toBase64,
}
