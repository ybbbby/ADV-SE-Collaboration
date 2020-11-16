import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Container,
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
import { Link } from 'react-router-dom'
import Routes from './routes'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logo: {
    flexGrow: 1,
    marginTop: '5px',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
  appBar: {
    textAlign: 'center',
    boxShadow: 'inset 0px -1px 0px #f3f4f4',
    backgroundColor: 'white',
  },
  toolBar: {
    minHeight: theme.spacing(6),
  },
  body: {
    paddingTop: theme.spacing(4),
  },
  card: {
    position: 'sticky',
    top: '80px',
    textAlign: 'center',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 8px 40px -12px',
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
      <Link to="/" style={{ color: 'black' }}>
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
        localStorage.setItem('userEmail', data['email'])
        setLogin(true)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <div>
      <Router>
        <AppBar position="sticky" className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <Typography variant="h6" className={classes.logo}>
              <Link to="/">
                <img
                  src={`${process.env.PUBLIC_URL}/logo.png`}
                  height="38"
                  alt="logo"
                />
              </Link>
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
