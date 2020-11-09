import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import HistoryIcon from '@material-ui/icons/History'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { Link } from 'react-router-dom'
import LoginModal from '../LoginModal/LoginModal'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    marginTop: theme.spacing(1.5),
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
}))

export default function Categories(props) {
  const classes = useStyles()
  const { isLogin } = props
  const [openLogin, setOpenLogin] = React.useState(false)

  const handleClick = () => {
    if (!isLogin) {
      setOpenLogin(true)
    }
  }

  const logout = () => {
    fetch('/google/logout', {
      method: 'GET',
    })
      .then((response) => (window.location.href = '/'))
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <List component="nav" className={classes.root}>
      <Link to={isLogin ? '/' : '#'} className={classes.link}>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Favourites" />
        </ListItem>
      </Link>
      <Divider />
      <Link to={isLogin ? '/events/togo' : '#'} className={classes.link}>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <FormatListNumberedIcon />
          </ListItemIcon>
          <ListItemText primary="To go" />
        </ListItem>
      </Link>
      <Divider />
      <Link to={isLogin ? '/events/history' : '#'} className={classes.link}>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>
      </Link>
      {isLogin ? (
        <>
          <Divider />
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      ) : (
        <LoginModal handleClose={() => setOpenLogin(false)} open={openLogin} />
      )}
    </List>
  )
}

Categories.propTypes = {
  isLogin: PropTypes.bool.isRequired,
}
