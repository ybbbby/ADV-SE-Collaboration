import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Map from '../../components/GoogleMap/SimpleMap'
import CardMedia from '@material-ui/core/CardMedia'
import { Typography, Card, Box, Snackbar } from '@material-ui/core'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import Button from '@material-ui/core/Button'
import UpdateInputModal from '../../components/UpdateInputModal/UpdateInputModal'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { format } from 'date-fns'
import MuiAlert from '@material-ui/lab/Alert'
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    borderRadius: '10px',
    boxShadow:
      '0px 0px 0px -1px rgba(0,0,0,0.2), -2px -1px 1px -1px rgba(0,0,0,0.14), 0px 1px 4px 1px rgba(0,0,0,0.12);',
  },
  Typography: {
    color: theme.palette.text.primary,
  },
  register: {
    height: '80%',
    width: '100%',
  },
  blank: {
    height: '10px',
  },
  eventImage: {
    boxShadow: 'none',
  },
}))

export default function EventDetail({ match }) {
  const classes = useStyles()
  const isAuthor = match.params.eventID === '1' ? true : false
  const [description, setDescription] = useState(
    'asjhdflakjhsdlfkajhsdljhf lajh dsfljkhadsfjh aldsjfh lajsdh flajshdflajhds flajhds flahds lf jhasasjdfh a;kjds ;fkja;dsfk ja;sdkfj;akdsj f;al dsj;kflas;df a;lkfj ;aklsdj f;ajks df;ajs d;flajds;lfaj;dslfj aei hliuaherf liahfd vlkasdn flawker oaiudf;kjas;dkljfa;lkw3 jr;ioausdj;flkjajds;flkj a;sdlkfj ;awefh ;ioauf ;alksdj;fakjs df'
  )
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [type, setType] = useState(1)
  const [address, setAddress] = useState(
    'ASD Casting Co., Inc., West 47th Street, New York, NY, USA'
  )
  const [center, setCenter] = useState({
    lat: 59.95,
    lng: 30.33,
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const imageURL =
    'https://cdn.vox-cdn.com/thumbor/lopA7fKDwAh9iqR0hqVsHWpnPfQ=/0x0:4133x3074/1820x1213/filters:focal(1737x1207:2397x1867):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65573297/GettyImages_1019226434.0.jpg'
  const title = 'Party in Hells Kitchen'

  const handleClick = (num) => {
    setType(num)
    setOpenLogin(true)
  }
  const closeAlert = (event, reason) => {
    if (reason === 'clickaway') return

    setAlertOpen(false)
  }
  const [openLogin, setOpenLogin] = React.useState(false)
  const [failInfo, setfailInfo] = React.useState('')
  const UpdateInfo = () => {
    const requestForm = new FormData()
    requestForm.append('Event_name', title)
    requestForm.append('Address', address)
    requestForm.append('Longitude', center.lng)
    requestForm.append('Latitude', center.lat)
    requestForm.append('Time', format(selectedDate, 'yyyy-MM-dd HH:mm:ss'))
    requestForm.append('Description', description)
    requestForm.append('Image', imageURL)
    const url = '/user/event/' + match.params.eventID.toString() + '/update'
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
        setfailInfo('Fail to update due to connection error with server')
        setAlertOpen(true)
      })
  }
  const handleClose = (value) => {
    setOpenLogin(false)
    if (!value) {
      return
    }
    console.log(value)
    if (type === 1) {
      setSelectedDate(value)
      UpdateInfo()
    } else if (type === 2) {
      setSelectedDate(value)
      UpdateInfo()
    } else if (type === 3) {
      setDescription(value)
      UpdateInfo()
    } else if (type === 4) {
      const res = geocodeByAddress(value)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          setCenter({
            lat: latLng.lat,
            lng: latLng.lng,
          })
          setAddress(value)
          UpdateInfo()
        })
        .catch((error) => {
          setfailInfo('Fail to update due illegitimate address')
          setAlertOpen(true)
        })
    }

    //fixme: add roll back after test!!!!
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className={classes.eventImage}>
            <CardMedia image={imageURL} component="img" height="300" />
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Typography gutterBottom variant="h4">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
      <Grid container spacing={1} justify="center">
        <Grid item xs={1}>
          <Box align="center">
            <CalendarTodayIcon />
          </Box>
          <Box align="center">
            <AccessTimeIcon />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">
            <Box textAlign="left" align="center">
              {selectedDate.toDateString()}
            </Box>
            <Box textAlign="left" align="justify">
              {selectedDate.toLocaleTimeString()}
            </Box>
          </Typography>
        </Grid>

        <Grid item xs={1}>
          {isAuthor ? (
            <Box style={{ cursor: 'pointer' }} onClick={() => handleClick(1)}>
              <EditOutlinedIcon color="primary" />
            </Box>
          ) : (
            <></>
          )}
          {isAuthor ? (
            <Box style={{ cursor: 'pointer' }} onClick={() => handleClick(2)}>
              <EditOutlinedIcon color="primary" />
            </Box>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={4}>
          {!isAuthor ? (
            <Button
              variant="contained"
              color="secondary"
              className={classes.register}
            >
              REGISTER NOW
            </Button>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12}>
          <Box className={classes.blank}></Box>
          <Box className={classes.blank}></Box>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h5">
            <Box textAlign="left" align="center">
              Details
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={10}>
          {isAuthor ? (
            <Box style={{ cursor: 'pointer' }} onClick={() => handleClick(3)}>
              <EditOutlinedIcon color="primary" />
            </Box>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">
            <Box textAlign="left" align="center">
              Event Location
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {isAuthor ? (
            <Box style={{ cursor: 'pointer' }} onClick={() => handleClick(4)}>
              <EditOutlinedIcon color="primary" />
            </Box>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            {address}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} justify="center">
        <Grid item xs={12}>
          <Map height="100px" center={center} name={address} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.blank}></Box>
        <Box className={classes.blank}></Box>
      </Grid>
      <UpdateInputModal
        handleClose={handleClose}
        open={openLogin}
        type={type}
        date={selectedDate}
        description={description}
      ></UpdateInputModal>
      <Snackbar open={alertOpen} autoHideDuration={4000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity="error">
          {failInfo}
        </Alert>
      </Snackbar>
    </div>
  )
}
