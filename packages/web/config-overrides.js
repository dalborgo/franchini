const { NODE_ENV } = process.env
if (NODE_ENV !== 'production') {
  const { override } = require('customize-cra')
  const { addReactRefresh } = require('customize-cra-react-refresh')
  module.exports = override(
    addReactRefresh()
  )
}

