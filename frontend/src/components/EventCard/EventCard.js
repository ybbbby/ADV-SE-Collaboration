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
    borderRadius: '10px',
    boxShadow:
      '0px 0px 0px -1px rgba(0,0,0,0.2), -2px -1px 1px -1px rgba(0,0,0,0.14), 0px 1px 4px 1px rgba(0,0,0,0.12);',
  },
  expand: {
    marginLeft: 'auto',
    textDecoration: 'none',
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

  render() {
    const { classes } = this.props
    return (
      <>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="180"
              image="https://cdn.vox-cdn.com/thumbor/lopA7fKDwAh9iqR0hqVsHWpnPfQ=/0x0:4133x3074/1820x1213/filters:focal(1737x1207:2397x1867):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65573297/GettyImages_1019226434.0.jpg"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Party in Hells Kitchen
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Sat, Nov 7, 2020 3:00 AM EST
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites" onClick={this.clickLike}>
              <FavoriteIcon style={{ color: this.state.likeButtonColor }} />
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
            <Link to="/event/1" className={classes.expand}>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </Link>
          </CardActions>
        </Card>
        <ShareModal
          url="https://www.google.com/"
          handleClose={this.closeShare}
          open={this.state.shareModalOpen}
        />
        <Snackbar
          open={this.state.alertOpen}
          autoHideDuration={3000}
          onClose={this.closeAlert}
        >
          <Alert onClose={this.closeAlert} severity="success">
            Saved to your favourite events!
          </Alert>
        </Snackbar>
      </>
    )
  }
}

EventCard.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(EventCard)
