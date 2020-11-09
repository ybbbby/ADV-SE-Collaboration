import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Container,
  Link,
  Box,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { BrowserRouter as Router } from 'react-router-dom'
import UserCard from './components/UserCard/UserCard'
import Categories from './components/Categories/Categories'
import Routes from './routes'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
  appBar: {
    textAlign: 'center',
    boxShadow: 'inset 0px -1px 0px #f3f4f4',
  },
  toolBar: {
    minHeight: theme.spacing(5.5),
  },
  body: {
    paddingTop: theme.spacing(4),
  },
  card: {
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow:
      '0px 0px 0px -1px rgba(0,0,0,0.2), -2px -1px 1px -1px rgba(0,0,0,0.14), 0px 1px 4px 1px rgba(0,0,0,0.12);',
  },
}))

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      style={{ padding: '10px' }}
    >
      {'Copyright © '}
      <Link color="inherit" href="#">
        YesOK
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default function App() {
  const classes = useStyles()
  const [userData, setUserData] = useState({ picture: '', name: '', email: '' })
  const [isLogin, setLogin] = useState(false)

  useEffect(() => {
    fetch('/userinfo', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data)
        setLogin(true)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <div>
      <Router>
        <AppBar
          position="static"
          color={'transparent'}
          className={classes.appBar}
        >
          <Toolbar className={classes.toolBar}>
            <Typography variant="h6" className={classes.title}>
              YesOK
            </Typography>
          </Toolbar>
        </AppBar>
        <Container className={classes.body}>
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <UserCard data={userData} isLogin={isLogin} />
                    <Categories isLogin={isLogin} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={9}>
                <Routes />
              </Grid>
            </Grid>
            <Copyright />
          </Box>
        </Container>
      </Router>
    </div>
  )
}
