import React from 'react'
import 'fontsource-roboto'
import { CssBaseline, Typography } from '@material-ui/core'
import useSWR, { SWRConfig } from 'swr'
import { cFunctions } from '@adapter/common'
const isProd = cFunctions.isProd()
const REACT_APP = isProd ? 'REACT_APP' : 'REACT_APP_DEV'
const POLLING_MILLI = process.env[`${REACT_APP}_POLLING_MILLI`] || 300000

const Main = () => {
  const { data, error } = useSWR('http://localhost:4000/franchini/get_recipes')
  
  if (error) return <Typography>failed to load</Typography>
  if (!data) return <Typography>loading...</Typography>
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

function App () {
  return (
    <>
      <CssBaseline/>
      <SWRConfig
        value={{
          refreshInterval: POLLING_MILLI,
          fetcher: (...args) => fetch(...args).then(res => res.json())
        }}
      >
        <Main/>
      </SWRConfig>
    </>
  )
}

export default App
