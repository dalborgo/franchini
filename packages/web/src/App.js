import React from 'react'
import 'fontsource-roboto'
import { CssBaseline, Typography, Container, makeStyles } from '@material-ui/core'
import useSWR, { SWRConfig } from 'swr'
import { cFunctions, log } from '@adapter/common'
import { ErrorBoundary } from 'react-error-boundary'
import Error500 from './Error500'
import { MainList } from './components'

const isProd = cFunctions.isProd()
const REACT_APP = isProd ? 'REACT_APP' : 'REACT_APP_DEV'
const POLLING_MILLI = process.env[`${REACT_APP}_POLLING_MILLI`] || 300000
log.info(`Polling ${POLLING_MILLI}`)

const myErrorHandler = (error, componentStack) => {
  log.error('Global error', error)
  log.error('Global componentStack', componentStack)
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
  },
}))

const Layout = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <Container className={classes.main} component="main">
        <Main/>
      </Container>
    </div>
  )
}

const Main = () => {
  const { data, error } = useSWR('http://localhost:4000/franchini/get_recipes')
  
  if (error) {return <Typography>errore nel caricamento dati!</Typography>}
  if (!data) {return <Typography>caricamento...</Typography>}
  if (data?.err) {
    return <pre>{JSON.stringify(data.err, null, 2)}</pre>
  } else {
    return <MainList list={data?.results}/>
  }
}

function App () {
  return (
    <ErrorBoundary FallbackComponent={Error500} onError={myErrorHandler}>
      <SWRConfig
        value={
          {
            refreshInterval: POLLING_MILLI,
            fetcher: (...args) => fetch(...args).then(res => res.json()),
          }
        }
      >
        <Layout/>
      </SWRConfig>
    </ErrorBoundary>
  )
}

export default App
