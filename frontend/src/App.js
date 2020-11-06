import React from 'react'
import {
  AppBar,
  Button,
  Container,
  Link,
  Box,
  Toolbar,
  Typography,
  Grid,
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
    backgroundColor: '#fafafa',
  },
}))

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        YesOK
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default function App() {
  const classes = useStyles()

  function login() {
    fetch('/google/login', {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((data) => (window.location.href = data))
  }

  return (
    <div>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              YesOK
            </Typography>
            <Button color="inherit" onClick={login}>
              Login
            </Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Box my={4}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <UserCard />
                <Categories />
              </Grid>
              <Grid item xs={8}>
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
