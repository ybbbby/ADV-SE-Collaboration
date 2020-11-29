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
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined'
import HistoryIcon from '@material-ui/icons/History'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import { Link } from 'react-router-dom'
import LoginModal from '../LoginModal/LoginModal'
import logout from '../../api/logout'

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

  const clickLogout = () => {
    logout().then((data) => {
      if (data) {
        localStorage.clear()
        window.location.href = '/'
      }
    })
  }

  return (
    <List component="nav" className={classes.root}>
      <Link to={isLogin ? '/' : '#'} className={classes.link}>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <HomeOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </Link>
      <Divider />
      <Link to={isLogin ? '/events/liked' : '#'} className={classes.link}>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <FavoriteBorderOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Favourites" />
        </ListItem>
      </Link>
      <Divider />
      <Link to={isLogin ? '/events/ongoing' : '#'} className={classes.link}>
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
          <ListItem button onClick={clickLogout}>
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
