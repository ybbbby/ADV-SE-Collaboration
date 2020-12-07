import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Map from '../../components/GoogleMap/SimpleMap'
import CardMedia from '@material-ui/core/CardMedia'
import {
  Typography,
  Card,
  Box,
  Snackbar,
  IconButton,
  Divider,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import Button from '@material-ui/core/Button'
import UpdateInputModal from '../../components/UpdateInputModal/UpdateInputModal'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { format } from 'date-fns'
import MuiAlert from '@material-ui/lab/Alert'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import { useRouteMatch } from 'react-router-dom'
import LoginModal from '../../components/LoginModal/LoginModal'
import { red } from '@material-ui/core/colors'
import ShareModal from '../../components/ShareModal/ShareModal'
import Comment from '../../components/Comment/Comment'
import Participants from '../../components/Participants/Participants'
import getEvent from '../../api/getEvent'
import PeopleIcon from '@material-ui/icons/People'
import getEventAttendees from '../../api/getEventAttendees'
import updateEvent from '../../api/updateEvent'
import deleteEventApi from '../../api/deleteEvent'
import g from '../../global'
import postLike from '../../api/postLike'
import postJoin from '../../api/postJoin'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2.5),
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 8px 40px -12px',
  },
  register: {
    height: '90%',
    width: '100%',
  },
  eventImage: {
    boxShadow: 'none',
  },
  editButton: {
    padding: '3px',
  },
  titleBox: {
    display: 'flex',
    margin: '15px 0 10px',
  },
  Dvd: {
    paddingBottom: '10px',
  },
}))

export default function EventDetail() {
  const router = useRouteMatch()
  const { eventID } = router.params
  const user = localStorage.getItem('userEmail')
  const [like, setLike] = useState(false)
  const [attend, setAttend] = useState(false)
  const [likeButtonColor, setLikeButtonColor] = useState('rgba(0, 0, 0, 0.54)')
  const classes = useStyles()
  const [isAuthor, setIsAuthor] = useState(false)
  const [description, setDescription] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [type, setType] = useState(2)
  const [address, setAddress] = useState(
    'ASD Casting Co., Inc., West 47th Street, New York, NY, USA'
  )
  const [center, setCenter] = useState({
    lat: 59.95,
    lng: 30.33,
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const [participantsOpen, setParticipantsOpen] = useState(false)
  const [serverity, setServerity] = useState('error')
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [imageURL, setimageURL] = useState('')
  const [title, setTitle] = useState('Title')
  const [author, setAuthor] = useState('host')
  const [hostEmail, setHostEmail] = useState('')
  const [openInput, setOpenInput] = useState(false)
  const [failInfo, setfailInfo] = useState('')
  const [commentsProps, setCommentsProps] = useState([])
  const [participants, setParticipants] = useState([])

  const handleClick = (num) => {
    setType(num)
    setOpenInput(true)
  }
  const closeAlert = (event, reason) => {
    if (reason === 'clickaway') return
    setAlertOpen(false)
  }

  useEffect(() => {
    let isSubscribed = true
    getEvent(eventID).then((data) => {
      if (!data || !isSubscribed) {
        return
      }
      setAddress(data.address)
      setCenter({
        lat: Number(data.latitude),
        lng: Number(data.longitude),
      })
      setCommentsProps(data.comments.reverse())
      setLike(data.liked)
      setAttend(data.attended)
      setimageURL(data.image)
      data.description
        ? setDescription(data.description)
        : setDescription('This event does not have any detail posted yet.')
      setSelectedDate(new Date(data.time))
      const color = data.liked ? red[500] : 'rgba(0, 0, 0, 0.54)'
      setLikeButtonColor(color)
      setTitle(data.name)
      setAuthor(data.author)
      setHostEmail(data.user_email)
      if (user === data.user_email) {
        setIsAuthor(true)
      }
    })
    getEventAttendees(eventID).then((data) => {
      if (!data || !isSubscribed) {
        return
      }
      setParticipants(data)
    })
    return () => (isSubscribed = false)
  }, [eventID])

  /* istanbul ignore next */
  const UpdateInfo = (t, newValue) => {
    const requestForm = new FormData()
    requestForm.append('Type', t)
    if (t === 'time') {
      requestForm.append('Time', format(newValue, 'yyyy-MM-dd HH:mm:ss'))
    } else if (t === 'description') {
      console.log(newValue)
      requestForm.append('Description', newValue)
    } else if (t === 'address') {
      requestForm.append('Address', newValue.address)
      requestForm.append('Longitude', newValue.lng)
      requestForm.append('Latitude', newValue.lat)
    }
    updateEvent(eventID, requestForm).then((data) => {
      if (data) {
        console.log(data)
        if (t === 'time') {
          setSelectedDate(newValue)
        } else if (t === 'description') {
          setDescription(newValue)
        } else if (t === 'address') {
          setAddress(newValue.address)
          setCenter({
            lat: newValue.lat,
            lng: newValue.lng,
          })
        }
      } else {
        setfailInfo('Fail to update due to connection error with server')
        setServerity('error')
        setAlertOpen(true)
      }
    })
  }

  const deleteEvent = () => {
    deleteEventApi(eventID).then((res) => {
      if (res) {
        window.location = '/'
        setfailInfo('Successfully deleted your event!')
        setServerity('success')
        setAlertOpen(true)
      } else {
        setfailInfo('Fail to delete the event!')
        setServerity('error')
        setAlertOpen(true)
      }
    })
  }

  const registerEvent = () => {
    postJoin(eventID, !attend).then((res) => {
      if (res) {
        setAttend(!attend)
        const alertText = attend
          ? 'Successfully cancelled your registration.'
          : 'You have reistered this event!'
        if (!attend) {
          g.goEasy.publish({
            channel: hostEmail,
            message: `${user} just joined your event`,
          })
        }
        setfailInfo(alertText)
        setServerity('success')
        setAlertOpen(true)
        getEventAttendees(eventID).then((data) => {
          if (data) {
            setParticipants(data)
          }
        })
      } else {
        setfailInfo('Fail to update due to connection error with server')
        setServerity('error')
        setAlertOpen(true)
      }
    })
  }

  /* istanbul ignore next */
  const handleClose = (value) => {
    setOpenInput(false)
    if (!value) {
      return
    }
    console.log(value)
    if (type === 2) {
      UpdateInfo('time', value)
    } else if (type === 3) {
      UpdateInfo('description', value)
    } else if (type === 4) {
      geocodeByAddress(value)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          const newValue = {
            address: value,
            lat: latLng.lat,
            lng: latLng.lng,
          }
          UpdateInfo('address', newValue)
        })
        .catch(() => {
          setfailInfo('Fail to update due to illegitimate address')
          setServerity('error')
          setAlertOpen(true)
        })
    }
  }

  const clickLike = () => {
    const currentStatus = like
    const color = currentStatus ? 'rgba(0, 0, 0, 0.54)' : red[500]
    postLike(eventID, !currentStatus).then((res) => {
      if (res) {
        setLike(!currentStatus)
        setLikeButtonColor(color)
        if (!currentStatus) {
          setfailInfo('Saved to your favourite events!')
          setServerity('success')
        } else {
          setfailInfo('Remove this event from your favourite events!')
          setServerity('info')
        }
        setAlertOpen(true)
      }
    })
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className={classes.eventImage}>
            {imageURL ? (
              <CardMedia image={imageURL} component="img" height="300" />
            ) : (
              <Skeleton variant="rect" width="100%" height={300} />
            )}
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          {!user ? (
            <></>
          ) : (
            <IconButton aria-label="add to favorites" onClick={clickLike}>
              <FavoriteIcon style={{ color: likeButtonColor }} />
            </IconButton>
          )}

          <IconButton
            aria-label="share"
            onClick={() => {
              setShareModalOpen(true)
            }}
          >
            <ShareIcon />
          </IconButton>
          {!user ? (
            <></>
          ) : (
            <IconButton
              aria-label="check participants"
              onClick={() => {
                setParticipantsOpen(true)
              }}
            >
              <PeopleIcon />
            </IconButton>
          )}
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          {!user ? (
            <></>
          ) : isAuthor ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.register}
              onClick={deleteEvent}
            >
              DELETE
            </Button>
          ) : Date.now() < selectedDate.getTime() ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.register}
              onClick={registerEvent}
            >
              {attend ? 'CANCEL' : 'REGISTER NOW'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              className={classes.register}
              disabled
            >
              Event expired
            </Button>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.Dvd}>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid container spacing={0}>
        <Grid item xs={9}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4">{title}</Typography>
              <Typography gutterBottom variant="subtitle1">
                by {author}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box className={classes.titleBox}>
              <Typography variant="h5">Details&nbsp;&nbsp;</Typography>
              {isAuthor ? (
                <IconButton
                  onClick={() => handleClick(3)}
                  className={classes.editButton}
                >
                  <EditOutlinedIcon color="primary" />
                </IconButton>
              ) : (
                <></>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            {description ? (
              <Typography variant="body1" style={{ width: '90%' }}>
                {description}
              </Typography>
            ) : (
              <Skeleton
                variant="rect"
                animation="wave"
                height={150}
                width={'90%'}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Box className={classes.titleBox}>
              <Typography variant="h5">Comments&nbsp;&nbsp;</Typography>
            </Box>
            <Comment
              setfailInfo={setfailInfo}
              setServerity={setServerity}
              setAlertOpen={setAlertOpen}
              setLoginOpen={setLoginOpen}
              eventId={eventID}
              comments={commentsProps}
              setComments={setCommentsProps}
              eventHost={hostEmail}
            />
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid item xs={12}>
            <Box style={{ height: '20px' }}></Box>
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="left" className={classes.titleBox}>
              <Typography variant="h5">Date And Time&nbsp;&nbsp;</Typography>
              {isAuthor ? (
                <IconButton
                  onClick={() => handleClick(2)}
                  className={classes.editButton}
                >
                  <EditOutlinedIcon color="primary" />
                </IconButton>
              ) : (
                <></>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="left">
              <Typography variant="body2" color="textSecondary">
                {selectedDate.toDateString()}
              </Typography>
            </Box>
            <Box textAlign="left">
              <Typography variant="body2" color="textSecondary">
                {selectedDate.toTimeString()}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box textAlign="left" className={classes.titleBox}>
              <Typography variant="h5">Event Location&nbsp;&nbsp;</Typography>
              {isAuthor ? (
                <IconButton
                  onClick={() => handleClick(4)}
                  className={classes.editButton}
                >
                  <EditOutlinedIcon color="primary" />
                </IconButton>
              ) : (
                <></>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Typography variant="body2" gutterBottom color="textSecondary">
                {address}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Map center={center} name={address} />
          </Grid>
        </Grid>
      </Grid>
      <UpdateInputModal
        handleClose={handleClose}
        open={openInput}
        type={type}
        date={selectedDate}
        description={description}
      />
      <Participants
        open={participantsOpen}
        setOpen={setParticipantsOpen}
        participants={participants}
      />
      <ShareModal
        url={`http://yes-ok.herokuapp.com/#/event/${eventID}`}
        handleClose={() => setShareModalOpen(false)}
        open={shareModalOpen}
      />
      <Snackbar open={alertOpen} autoHideDuration={4000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity={serverity}>
          {failInfo}
        </Alert>
      </Snackbar>
      <LoginModal
        handleClose={/* istanbul ignore next */ () => setLoginOpen(false)}
        open={loginOpen}
      />
    </div>
  )
}
