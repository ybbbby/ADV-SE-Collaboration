import React from 'react'
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
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    padding: 0,
    marginTop: theme.spacing(3),
    boxShadow:
      '0px 0px 0px -1px rgba(0,0,0,0.2), -2px -1px 1px -1px rgba(0,0,0,0.14), 0px 1px 4px 1px rgba(0,0,0,0.12)',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
}))

export default function Categories() {
  const classes = useStyles()

  return (
    <List component="nav" className={classes.root}>
      <Link to="/" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Favourites" />
        </ListItem>
      </Link>
      <Divider />
      <Link to="/eventsnearby/togo" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <FormatListNumberedIcon />
          </ListItemIcon>
          <ListItemText primary="To go" />
        </ListItem>
      </Link>
      <Divider />
      <Link to="/eventsnearby/history" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>
      </Link>
    </List>
  )
}
