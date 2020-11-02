import React from 'react';
import {
  AppBar,
  Button,
  Container,
  Link,
  Box,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import ProTip from './ProTip';
import SimpleMap from './map';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function App() {
  const classes = useStyles();

  function login() {
    fetch('/google/login', {
      method: "GET"
    })
      .then(response => response.text())
      .then(data => window.location.href = data);
  }

  return (
  <div>
    <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        YesOK
      </Typography>
      <Button color="inherit" onClick={login}>Login</Button>
    </Toolbar>
    </AppBar>
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Example text
        </Typography>
        <ProTip />
        <SimpleMap />
        <Copyright />
      </Box>
    </Container>
  </div>
  );
}
