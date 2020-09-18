import Moment from 'moment'
import { extendMoment } from 'moment-range'
import compose from 'lodash/fp/compose'

const moment = extendMoment(Moment)

const inRange = (start, end, date) => {
  const range = moment().range(moment(start), moment(end))
  return range.contains(moment(date))
}

const add = tuple => tuple ? inp => inp.add(tuple[0], tuple[1]) : inp => inp
const format = format => format ? inp => inp.format(format) : inp => inp.format('llll')
const momInit = (val, type) => val && type ? moment(val, type) : val ? moment(val) : moment()

const mom = (val, type, formatType, addToDate) => compose(format(formatType), add(addToDate), momInit)(val, type, formatType, addToDate)

const now = (format = 'llll') => moment().format(format)
const fromNow = val => moment(val).fromNow()

const roundNearestMinutes = (val, minutes = 30) => {
  const start = moment(val, 'YYYY-MM-DD HH:mm')
  const remainder = minutes - (start.minute() % minutes)
  const resultDate = moment(start).add(remainder === minutes ? 0 : remainder, 'minutes')
  return resultDate.isValid() ? resultDate : null
}
export default {
  fromNow,
  inRange,
  mom,
  now,
  roundNearestMinutes,
}
