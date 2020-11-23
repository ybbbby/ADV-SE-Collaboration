import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  SvgIcon,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import login from '../../api/login'

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  content: {
    padding: theme.spacing(5.5),
    textAlign: 'center',
  },
  loginButton: {
    margin: theme.spacing(1),
    padding: theme.spacing(1.5),
  },
  google: {
    verticalAlign: 'middle',
    marginRight: theme.spacing(1),
  },
}))

function GoogleIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
    </SvgIcon>
  )
}

function LoginModal(props) {
  const classes = useStyles()
  const { handleClose, open } = props

  function clickLogin() {
    login().then((data) => (window.location.href = data))
  }

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => handleClose()}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography variant="h4" gutterBottom>
          Welcome Back!
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Sign in to get personalized event recommendations based on your
          location. Explore, save and join the events you like, and interact
          with other users nearby.
        </Typography>
        <Button
          variant="outlined"
          className={classes.loginButton}
          onClick={clickLogin}
        >
          <GoogleIcon className={classes.google} />
          Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  )
}

LoginModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}

export default LoginModal
