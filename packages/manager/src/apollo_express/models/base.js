import { bucket, lounge } from '../db'
import { ioFormatters } from '@adapter/io'
import Q from 'q'
import isEqual from 'lodash/isEqual'
import { cFunctions } from '@adapter/common'

const couchbase = require('couchbase')
const nq = couchbase.N1qlQuery

export const baseSchema = lounge.schema({
  _type: String,
})
export const timeSchema = lounge.schema({
  _createdAt: { type: Date, default: new Date() },
  _updatedAt: Date,
})
export const cursorSchema = lounge.schema({
  _cursor: String,
})

baseSchema.pre('save', function (next) {
  this._type = this.modelName
  next()
})
timeSchema.pre('save', function (next) {
  this._updatedAt = new Date()
  next()
})
cursorSchema.pre('save', function (next) {
  this._cursor = cFunctions.toBase64(this.getDocumentKeyValue())
  next()
})

baseSchema.static('getAll', async function () {
  const { _name } = bucket
  const id = this.getDocumentKeyKey()
  const query = nq.fromString(`SELECT v.*, v.${id} id FROM ${_name} v WHERE _type = '${this.modelName}'`)
  const [results] = await Q.ninvoke(bucket, 'query', query)
  return results
})

baseSchema.static('count', async function (objs) {
  const { _name } = bucket
  const objToQuery = ioFormatters.objToQueryConditions(objs)
  const query = nq.fromString(`SELECT RAW COUNT(*) FROM ${_name} WHERE _type = '${this.modelName}'${objToQuery}`)
  const [counts] = await Q.ninvoke(bucket, 'query', query)
  return counts[0]
})

baseSchema.method('getId', function () {
  return this.getDocumentKeyValue()
})

baseSchema.method('getKey', function () {
  return this.getDocumentKeyValue(true)
})

baseSchema.method('isModified', async function (prop) {
  const sch = lounge.getModel(this.modelName)
  const origin = await sch.findById(this.id)
  if (!origin) {return true}
  if (this.get(prop) && origin.get(prop)) {
    return !isEqual(this[prop], origin[prop])
  }
  return !prop ? !isEqual(this, origin) : true
})

baseSchema.virtual('id', String, {
  get: function () {
    return this.getDocumentKeyValue()
  },
})
