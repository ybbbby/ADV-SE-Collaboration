import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  Snackbar,
  Badge,
  Box,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import { red } from '@material-ui/core/colors'
import { withStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import ShareModal from '../ShareModal/ShareModal'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const styles = (theme) => ({
  root: {
    boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
  },
  expand: {
    marginLeft: 'auto',
    textDecoration: 'none',
  },
  cardImage: {
    width: '100%',
    height: 0,
    paddingBottom: '56.25%',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  content: {
    margin: '-24% 16px 0',
    padding: '24px',
    position: 'relative',
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow:
      '0 2px 4px -2px rgba(0,0,0,0.24), 0 4px 24px -2px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontWeight: '800',
  },
})

class EventCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      like: false,
      likeButtonColor: 'rgba(0, 0, 0, 0.54)',
      alertOpen: false,
      shareModalOpen: false,
    }
    this.clickLike = this.clickLike.bind(this)
  }

  clickLike() {
    if (!this.props.user) {
      this.props.openLogin(true)
      return
    }
    const currentStatus = this.state.like
    const color = currentStatus ? 'rgba(0, 0, 0, 0.54)' : red[500]
    this.setState({
      like: !currentStatus,
      likeButtonColor: color,
      alertOpen: true,
    })
  }

  closeShare = () => {
    this.setState({
      shareModalOpen: false,
    })
  }

  closeAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({
      alertOpen: false,
    })
  }

  openLogin = () => {
    if (!this.props.user) {
      this.props.openLogin(true)
    }
  }

  render() {
    const { classes, user, config } = this.props
    const { shareModalOpen, alertOpen, likeButtonColor, like } = this.state

    return (
      <>
        <Badge
          badgeContent={'host'}
          color="primary"
          invisible={!user || config.host !== user}
          style={{ display: 'block' }}
        >
          <Card className={classes.root}>
            <CardActionArea>
              <Link
                to={user ? `/event/${config.id}` : '#'}
                className={classes.expand}
              >
                <Box minHeight={250} position={'relative'}>
                  <CardMedia
                    className={classes.cardImage}
                    image={config.image}
                  />
                  <CardContent className={classes.content}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="p"
                    >
                      {config.time}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      color="textPrimary"
                      className={classes.title}
                    >
                      {config.name}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="textSecondary"
                      component="p"
                    >
                      {config.address}
                    </Typography>
                  </CardContent>
                </Box>
              </Link>
            </CardActionArea>
            <CardActions disableSpacing>
              <IconButton
                aria-label="add to favorites"
                onClick={this.clickLike}
              >
                <FavoriteIcon style={{ color: likeButtonColor }} />
              </IconButton>
              <IconButton
                aria-label="share"
                onClick={() =>
                  this.setState({
                    shareModalOpen: true,
                  })
                }
              >
                <ShareIcon />
              </IconButton>
              <Link
                to={user ? `/event/${config.id}` : '#'}
                className={classes.expand}
              >
                <Button size="small" color="primary" onClick={this.openLogin}>
                  Learn More
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Badge>
        <ShareModal
          url={`localhost:2000/event/${config.id}`}
          handleClose={this.closeShare}
          open={shareModalOpen}
        />
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={this.closeAlert}
        >
          {like ? (
            <Alert onClose={this.closeAlert} severity="success">
              Saved to your favourite events!
            </Alert>
          ) : (
            <Alert onClose={this.closeAlert} severity="info">
              Remove this event from your favourite events!
            </Alert>
          )}
        </Snackbar>
      </>
    )
  }
}

EventCard.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(EventCard)
