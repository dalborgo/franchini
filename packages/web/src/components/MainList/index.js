import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
import { colors } from './colors'
import parse from 'html-react-parser'

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
    '&:hover': {
      color: theme.palette.primary.dark,
    },
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
  const recipe = row.recipe.replace(/\^b\+/g, '<strong>').replace(/\^b-/g, '</strong>')
  return (
    <Grid container spacing={3}>
      <Grid item style={{ textAlign: 'center' }} xs={1}>
        {row.codplu}
      </Grid>
      <Grid item xs={3}>
        {row.descr}
      </Grid>
      <Grid item style={{ marginLeft: -12 }} xs={8}>
        {parse(recipe)}
      </Grid>
    </Grid>
  )
}

const Header = ({ name, code, bgColor }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Toolbar
        style={
          {
            backgroundColor: bgColor,
            minHeight: 0,
            marginTop: 40,
            marginBottom: 40,
            padding: 0,
            paddingTop: 7,
            paddingBottom: 7,
          }
        }
        variant="dense"
      >
        <Grid container>
          <Grid item style={{ textAlign: 'center', paddingRight: 15 }} xs={1}>
            {code}
          </Grid>
          <Grid item xs={3}>
            {name}
          </Grid>
          <Grid item xs={8}>
            INGREDIENTI
          </Grid>
        </Grid>
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
  const list_ = groupBy(list, value => value.codmer)
  let listCategory_ = Object.entries(listCategory).map((value, index) => {
    const [key, val] = value
    return { key, val }
  })
  listCategory_ = orderBy(listCategory_, ['val'])
  let cont = 0
  const handleClick = id =>
    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  //let catPrev
  return (
    <div className={classes.root}>
      <AppBar className={classes.title} color="default" elevation={0} position="fixed">
        <Toolbar variant="dense">
          {
            listCategory_.map((item, index) => (
              <span key={item.key}>
                <Button
                  className={classes.button}
                  onClick={() => handleClick(item.key)}
                  size="small"
                  style={
                    {
                      backgroundColor: colors[index % colors.length],
                    }
                  }
                  type="button"
                  variant="contained"
                >
                  {item.val}
                </Button>
              </span>
            ))
          }
        </Toolbar>
      </AppBar>
      {
        listCategory_.map((row, index) => {
          const res = []
          res.push(
            <div key={cont++} ref={refs[row.key]}>
              <Header
                bgColor={colors[index % colors.length]}
                code={row.key}
                name={row.val}
              />
            </div>
          )
          
          for (let row_ of list_[row.key]) {
            res.push(
              <div key={cont++}>
                <Row row={row_}/>
              </div>
            )
          }
          return res
        })
      }
    </div>
  )
}

export default MainList
