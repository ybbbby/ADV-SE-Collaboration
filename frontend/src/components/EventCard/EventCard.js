import React from 'react'
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
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import ShareModal from '../ShareModal/ShareModal'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles(() => ({
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
}))

function EventCard(props) {
  const classes = useStyles()
  const { user, config, openLogin } = props
  const [like, setLike] = React.useState(config.liked)
  const [likeButtonColor, setLikeButtonColor] = React.useState(
    like ? red[500] : 'rgba(0, 0, 0, 0.54)'
  )
  const [alertOpen, setAlertOpen] = React.useState(false)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)

  const clickLike = () => {
    if (!user) {
      openLogin(true)
      return
    }
    const currentStatus = like
    const color = currentStatus ? 'rgba(0, 0, 0, 0.54)' : red[500]
    const url = `/user/event/${config.id}/like`
    const requestForm = new FormData()
    requestForm.append('like', !currentStatus)
    fetch(url, {
      method: 'POST',
      body: requestForm,
    })
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText)
        } else {
          return response.text()
        }
      })
      .then(() => {
        setLike(!currentStatus)
        setLikeButtonColor(color)
        setAlertOpen(true)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const closeAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setAlertOpen(false)
  }

  const setOpenLogin = () => {
    if (!user) {
      openLogin(true)
    }
  }

  return (
    <>
      <Badge
        badgeContent={'host'}
        color="primary"
        invisible={!user || config.user_email !== user}
        style={{ display: 'block' }}
      >
        <Card className={classes.root}>
          <CardActionArea>
            <Link
              to={user ? `/event/${config.id}` : '#'}
              className={classes.expand}
            >
              <Box minHeight={250} position={'relative'}>
                <CardMedia className={classes.cardImage} image={config.image} />
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
              onClick={() => clickLike()}
            >
              <FavoriteIcon style={{ color: likeButtonColor }} />
            </IconButton>
            <IconButton
              aria-label="share"
              onClick={() => setShareModalOpen(true)}
            >
              <ShareIcon />
            </IconButton>
            <Link
              to={user ? `/event/${config.id}` : '#'}
              className={classes.expand}
            >
              <Button
                size="small"
                color="primary"
                onClick={() => setOpenLogin()}
              >
                Learn More
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Badge>
      <ShareModal
        url={`localhost:2000/event/${config.id}`}
        handleClose={() => setShareModalOpen(false)}
        open={shareModalOpen}
      />
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => closeAlert()}
      >
        {like ? (
          <Alert onClose={() => closeAlert()} severity="success">
            Saved to your favourite events!
          </Alert>
        ) : (
          <Alert onClose={() => closeAlert()} severity="info">
            Remove this event from your favourite events!
          </Alert>
        )}
      </Snackbar>
    </>
  )
}

EventCard.propTypes = {
  user: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  openLogin: PropTypes.bool,
}

export default EventCard
