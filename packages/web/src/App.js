import React from 'react'
import 'fontsource-roboto'
import { CssBaseline, Typography } from '@material-ui/core'
import useSWR, { SWRConfig } from 'swr'
import { cFunctions, log } from '@adapter/common'
import { ErrorBoundary } from 'react-error-boundary'
import Error500 from './Error500'

const isProd = cFunctions.isProd()
const REACT_APP = isProd ? 'REACT_APP' : 'REACT_APP_DEV'
const POLLING_MILLI = process.env[`${REACT_APP}_POLLING_MILLI`] || 300000
log.info(`Polling ${POLLING_MILLI}`)

const myErrorHandler = (error, componentStack) => {
  log.error('Global error', error)
  log.error('Global componentStack', componentStack)
}

const Main = () => {
  const { data, error } = useSWR('http://localhost:4000/franchini/get_recipes')
  
  if (error) return <Typography>failed to load</Typography>
  if (!data) return <Typography>loading...</Typography>
  if (data?.err) {
    return <pre>{JSON.stringify(data.err, null, 2)}</pre>
  } else {
    return <pre>{JSON.stringify(data?.results, null, 2)}</pre>
  }
}

function App () {
  return (
    <ErrorBoundary FallbackComponent={Error500} onError={myErrorHandler}>
      <CssBaseline/>
      <SWRConfig
        value={{
          refreshInterval: POLLING_MILLI,
          fetcher: (...args) => fetch(...args).then(res => res.json())
        }}
      >
        <Main/>
      </SWRConfig>
    </ErrorBoundary>
  )
}

export default App
