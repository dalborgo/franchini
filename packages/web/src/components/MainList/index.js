import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import map from 'lodash/map'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    whiteSpace: 'nowrap',
    boxShadow: 'none',
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
  },
  title: {
    overflowX: 'auto',
    top: 'auto',
    bottom: 0,
    scrollbarWidth: 'thin',
  },
}))

const Row = ({ row }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={1}>
        {row.codplu}
      </Grid>
      <Grid item xs={4}>
        {row.descr}
      </Grid>
      <Grid item xs={7}>
        {row.recipe}
      </Grid>
    </Grid>
  )
}

const Header = ({ name, code }) => {
  const classes = useStyles()
  
  return (
    <div className={classes.root}>
      <Toolbar
        style={
          {
            backgroundColor: 'lightgray',
            minHeight: 0,
            marginTop: 40,
            marginBottom: 40,
          }
        }
        variant="dense"
      >
        <Typography variant="h6">
          {code} {name}
        </Typography>
      </Toolbar>
    </div>
  )
}
const MainList = props => {
  const { list } = props
  const classes = useStyles()
  let listCategory = {}
  const refs = useMemo(() => list.reduce((acc, value) => {
    listCategory[value.codmer] = value.merc
    acc[value.codmer] = React.createRef()
    return acc
  }, {}), [list, listCategory])
  
  const handleClick = id =>
    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  let catPrev
  return (
    <div className={classes.root}>
      <AppBar className={classes.title} color="default" elevation={0} position="fixed">
        <Toolbar variant="dense">
          {
            map(listCategory, (item, key) => (
              <span key={key}>
                <Box boxShadow={0} clone><Button
                  className={classes.button}
                  onClick={() => handleClick(key)}
                  size="small"
                  type="button"
                  variant="contained"
                >
                  {item}
                </Button></Box>
              </span>
            ))
          }
        </Toolbar>
      </AppBar>
      {
        list.map((row, index) => {
          const header = catPrev !== row.codmer ? (
            <div ref={refs[row.codmer]}>
              <Header
                code={row.codmer}
                name={row.merc}
              />
            </div>
          ) : null
          catPrev = row.codmer
          return (
            <div key={index}>
              {header}
              <Row row={row}/>
            </div>
          )
        })
      }
    </div>
  )
}

export default MainList