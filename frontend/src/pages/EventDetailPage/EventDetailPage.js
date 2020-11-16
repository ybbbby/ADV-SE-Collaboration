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
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import Button from '@material-ui/core/Button'
import UpdateInputModal from '../../components/UpdateInputModal/UpdateInputModal'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { format } from 'date-fns'
import MuiAlert from '@material-ui/lab/Alert'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import useRouter from 'use-react-router'
import LoginModal from '../../components/LoginModal/LoginModal'
import { red } from '@material-ui/core/colors'
import ShareModal from '../../components/ShareModal/ShareModal'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1.5),
  },
  register: {
    height: '90%',
    width: '100%',
  },
  eventImage: {
    boxShadow: 'none',
  },
  date: {
    margin: '0 15px',
  },
  editButton: {
    padding: '3px',
  },
  dateBox: {
    display: 'flex',
  },
  titleBox: {
    display: 'flex',
    margin: '10px 0',
  },
  shareButton: {
    padding: '3px',
    paddingLeft: '0',
  },
  likeButton: {
    marginLeft: '5px',
    paddingRight: '0',
    padding: '3px',
  },
}))

export default function EventDetail(props) {
  const router = useRouter()
  const { user } = props
  const [like, setLike] = useState(false)
  const [attend, setAttend] = useState(false)
  const [likeButtonColor, setLikeButtonColor] = useState('rgba(0, 0, 0, 0.54)')
  const classes = useStyles()
  const isAuthor = router.match.params.eventID === '1' ? true : false
  const [description, setDescription] = useState(
    'asjhdflakjhsdlfkajhsdljhf lajh dsfljkhadsfjh aldsjfh lajsdh flajshdflajhds flajhds flahds lf jhasasjdfh a;kjds ;fkja;dsfk ja;sdkfj;akdsj f;al dsj;kflas;df a;lkfj ;aklsdj f;ajks df;ajs d;flajds;lfaj;dslfj aei hliuaherf liahfd vlkasdn flawker oaiudf;kjas;dkljfa;lkw3 jr;ioausdj;flkjajds;flkj a;sdlkfj ;awefh ;ioauf ;alksdj;fakjs df'
  )
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
  const [serverity, setServerity] = useState('error')
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [imageURL, setimageURL] = useState(
    'https://cdn.vox-cdn.com/thumbor/lopA7fKDwAh9iqR0hqVsHWpnPfQ=/0x0:4133x3074/1820x1213/filters:focal(1737x1207:2397x1867):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65573297/GettyImages_1019226434.0.jpg'
  )
  const [title, setTitle] = useState('Party in Hells Kitchen')
  const [author, setAuthor] = useState('Deku')

  const handleClick = (num) => {
    setType(num)
    setOpenInput(true)
  }
  const closeAlert = (event, reason) => {
    if (reason === 'clickaway') return

    setAlertOpen(false)
  }
  const [openInput, setOpenInput] = useState(false)
  const [failInfo, setfailInfo] = useState('')

  useEffect(() => {
    const url = '/event/' + router.match.params.eventID.toString()
    fetch(url, {
      method: 'GET',
    })
      .then((response) => {
        console.log(response)
        if (response.status < 200 || response.status > 299) {
          throw Error(response.statusText)
        } else {
          return response.json()
        }
      })
      .then((data) => {
        console.log(data)
        console.log('askdhakshdjkashdk')
        setAddress(data.address)
        setCenter({
          lat: Number(data.latitude),
          lng: Number(data.longitude),
        })
        setLike(Boolean.parseBoolean(data.liked))
        setAttend(Boolean.parseBoolean(data.isAttebd))
        setimageURL(data.image)
        setDescription(data.description)
        setSelectedDate(new Date(data.time))
        const color = like ? red[500] : 'rgba(0, 0, 0, 0.54)'
        setLikeButtonColor(color)
        setTitle(data.name)
        //setAuthor(data.author)
      })
      .catch((error) => {
        setfailInfo('Cannot get event detail')
        setServerity('error')
        setAlertOpen(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const UpdateInfo = (t, oldValue) => {
    const requestForm = new FormData()
    requestForm.append('type', t)
    if (t === 'time') {
      requestForm.append(
        'Time',
        format({ selectedDate }.selectedDate, 'yyyy-MM-dd HH:mm:ss')
      )
    } else if (t === 'description') {
      requestForm.append('Description', { description }.description)
    } else if (t === 'address') {
      requestForm.append('Address', { address }.address)
      requestForm.append('Longitude', { center }.center.lng)
      requestForm.append('Latitude', { center }.center.lat)
    }
    const url = '/event/' + router.match.params.eventID.toString() + '/update'
    fetch(url, {
      method: 'POST',
      body: requestForm,
    })
      .then((response) => {
        console.log(response)
        if (response.status < 200 || response.status > 299) {
          throw Error(response.statusText)
        } else {
          return response.text()
        }
      })
      .then((data) => console.log(data))
      .catch((error) => {
        if (t === 'time') {
          setSelectedDate(oldValue)
        } else if (t === 'description') {
          setDescription(oldValue)
        } else if (t === 'address') {
          setAddress(oldValue.address)
          setCenter({
            lat: oldValue.lat,
            lng: oldValue.lng,
          })
        }
        setfailInfo('Fail to update due to connection error with server')
        setServerity('error')
        setAlertOpen(true)
      })
  }
  const handleClose = (value) => {
    setOpenInput(false)
    if (!value) {
      return
    }
    var oldValue
    console.log(value)
    if (type === 1) {
      oldValue = selectedDate
      setSelectedDate(value)
      UpdateInfo('time', oldValue)
    } else if (type === 2) {
      oldValue = selectedDate
      setSelectedDate(value)
      UpdateInfo('time', oldValue)
    } else if (type === 3) {
      oldValue = description
      setDescription(value)
      console.log({ description }.description)
      UpdateInfo('description', oldValue)
    } else if (type === 4) {
      geocodeByAddress(value)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          oldValue = {
            address: address,
            lat: center.lat,
            lng: center.lng,
          }
          setCenter({
            lat: latLng.lat,
            lng: latLng.lng,
          })
          setAddress(value)
          UpdateInfo('address', oldValue)
        })
        .catch((error) => {
          setfailInfo('Fail to update due to illegitimate address')
          setServerity('error')
          setAlertOpen(true)
        })
    }
  }
  const clickLike = () => {
    if (!user) {
      setLoginOpen(true)
      return
    }
    const currentStatus = like
    const color = currentStatus ? 'rgba(0, 0, 0, 0.54)' : red[500]
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
  const closeShare = () => {
    setShareModalOpen(false)
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className={classes.eventImage}>
            <CardMedia image={imageURL} component="img" height="300" />
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={1}>
          <IconButton
            aria-label="add to favorites"
            onClick={clickLike}
            className={classes.likeButton}
          >
            <FavoriteIcon style={{ color: likeButtonColor }} />
          </IconButton>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            aria-label="share"
            onClick={() => {
              setShareModalOpen(true)
            }}
            className={classes.shareButton}
          >
            <ShareIcon />
          </IconButton>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={4}>
          {isAuthor ? (
            <></>
          ) : attend ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.register}
            >
              CANCEL
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              className={classes.register}
            >
              REGISTER NOW
            </Button>
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4">{title}</Typography>

              <Typography gutterBottom variant="subtitle1">
                by {author}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={8}>
              <Box textAlign="left" className={classes.dateBox}>
                <CalendarTodayIcon
                  fontSize="small"
                  style={{ marginTop: '4px' }}
                />
                <Typography variant="subtitle1" className={classes.date}>
                  {selectedDate.toDateString()}
                </Typography>
                {isAuthor ? (
                  <IconButton
                    onClick={() => handleClick(1)}
                    className={classes.editButton}
                  >
                    <EditOutlinedIcon color="primary" fontSize="small" />
                  </IconButton>
                ) : (
                  <></>
                )}
              </Box>
              <Box textAlign="left" className={classes.dateBox}>
                <AccessTimeIcon fontSize="small" style={{ marginTop: '4px' }} />
                <Typography variant="subtitle1" className={classes.date}>
                  {selectedDate.toLocaleTimeString()}
                </Typography>
                {isAuthor ? (
                  <IconButton
                    onClick={() => handleClick(2)}
                    className={classes.editButton}
                  >
                    <EditOutlinedIcon color="primary" fontSize="small" />
                  </IconButton>
                ) : (
                  <></>
                )}
              </Box>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
          <Grid item xs={12}>
            <Box className={classes.titleBox}>
              <Typography variant="h5">Details</Typography>
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
            <Typography variant="body1">{description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box className={classes.titleBox}>
              <Typography variant="h5">Event Location</Typography>
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
            <Typography variant="body1" gutterBottom>
              {address}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Map height="100px" center={center} name={address} />
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
      <ShareModal
        url="https://www.google.com/"
        handleClose={closeShare}
        open={shareModalOpen}
      />
      <Snackbar open={alertOpen} autoHideDuration={4000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity={serverity}>
          {failInfo}
        </Alert>
      </Snackbar>
      <LoginModal handleClose={() => setLoginOpen(false)} open={loginOpen} />
    </div>
  )
}
