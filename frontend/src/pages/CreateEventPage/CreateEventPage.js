import 'date-fns'
import React, { useState } from 'react'
import ImageUploader from 'react-images-upload'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { green } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import LocationSearchInput from '../../components/GoogleMap/LocationSearchInput'
import { RNS3 } from 'react-native-aws3'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import options from '../../awsOptions'
import './styles.css'
import { format } from 'date-fns'
import postEvent from '../../api/postEvent'

const EVENT_CATEGORY = [
  { name: 'Music', value: 'music' },
  { name: 'Visual Arts', value: 'visual-arts' },
  { name: 'Performing Arts', value: 'performing-arts' },
  { name: 'Film', value: 'film' },
  { name: 'Lectures & Books', value: 'lectures-books' },
  { name: 'Fashion', value: 'fashion' },
  { name: 'Food & Drink', value: 'food-and-drink' },
  { name: 'Festivals & Fairs', value: 'festivals-fairs' },
  { name: 'Charities', value: 'charities' },
  { name: 'Sports & Active Life', value: 'sports-active-life' },
  { name: 'Nightlife', value: 'nightlife' },
  { name: 'Kids & Family', value: 'kids-family' },
]

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
  },
  wrapper: {
    position: 'relative',
  },
  submitButton: {
    margin: theme.spacing(4),
    width: theme.spacing(15),
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
}))

const CreateEventPage = (props) => {
  const classes = useStyles()
  const [title, setTitle] = useState('')
  const [eventCategory, setEventCategory] = useState('')
  const [pictures, setPictures] = useState()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [addressError, setAddressError] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertText, setAlertText] = useState('Failed to create the event!')

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const onDrop = (picture) => {
    setPictures(picture)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
    if (title && titleError) {
      setTitleError(false)
    }
  }

  const handleChangeCategory = (event) => {
    setEventCategory(event.target.value)
  }

  const closeAlert = (event, reason) => {
    if (reason === 'clickaway') return

    setAlertOpen(false)
  }

  const handleSubmit = () => {
    if (!title) {
      setTitleError(true)
      return
    }
    if (!pictures || !pictures[0]) {
      setAlertText('Please upload the event picture.')
      setAlertOpen(true)
      return
    }
    setLoading(true)
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setAddressError(false)
        RNS3.put(pictures[0], options)
          .then((response) => {
            setLoading(false)
            if (response.status !== 201) {
              setAlertOpen(true)
              throw new Error('Failed to upload image to S3')
            } else {
              const requestForm = new FormData()
              requestForm.append('Event_name', title)
              requestForm.append('Category', eventCategory)
              requestForm.append('Address', address)
              requestForm.append('Longitude', latLng.lng)
              requestForm.append('Latitude', latLng.lat)
              requestForm.append(
                'Time',
                format(selectedDate, 'yyyy-MM-dd HH:mm:ss')
              )
              requestForm.append('Description', description)
              requestForm.append('Image', response.body.postResponse.location)
              postEvent(requestForm).then((data) => {
                if (data) {
                  window.location.href = `/#/event/${data}`
                } else {
                  setAlertOpen(true)
                }
              })
            }
          })
          .catch((error) => {
            setAlertText('Failed to create the event!')
            setAlertOpen(true)
            setLoading(false)
            console.log(error)
          })
      })
      .catch((error) => {
        setLoading(false)
        console.error('Error', error)
        setAddressError(true)
      })
  }

  return (
    <>
      <form className={classes.root} autoComplete="off">
        <Typography variant="h6">Create new event</Typography>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <TextField
              required
              margin="normal"
              id="standard-required"
              label="Name of event"
              placeholder="Title"
              helperText={titleError ? 'Missing event title.' : ''}
              error={titleError}
              onChange={handleTitleChange}
              fullWidth
              inputProps={{ maxLength: 50 }}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink>Category</InputLabel>
              <Select value={eventCategory} onChange={handleChangeCategory}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {EVENT_CATEGORY.map((x, key) => {
                  return (
                    <MenuItem value={x.value} key={key}>
                      {x.name}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around" spacing={3}>
            <Grid item xs={6}>
              <LocationSearchInput
                address={address}
                setAddress={setAddress}
                error={addressError}
                setError={setAddressError}
              />
            </Grid>
            <Grid item xs={3}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date picker inline"
                value={selectedDate}
                onChange={handleDateChange}
                disablePast
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <KeyboardTimePicker
                variant="inline"
                margin="normal"
                id="time-picker"
                label="Time picker"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              id="standard-multiline-static"
              label="Event description"
              multiline
              rows={7}
              fullWidth
              margin="normal"
              placeholder="Tell us something about your event"
              onChange={(event) => setDescription(event.target.value)}
              className={classes.descripInput}
              inputProps={{ maxLength: 600 }}
            />
          </Grid>
          <Grid item xs={6}>
            <ImageUploader
              {...props}
              withIcon={true}
              withPreview={true}
              singleImage={true}
              buttonText="Choose images"
              onChange={onDrop}
              imgExtension={['.jpg', '.gif', '.png']}
              maxFileSize={5242880}
            />
          </Grid>
        </Grid>
        <Grid container justify="space-around" className={classes.wrapper}>
          <Button
            variant="contained"
            color="primary"
            className={classes.submitButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Grid>
      </form>
      <Snackbar open={alertOpen} autoHideDuration={4000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity="error">
          {alertText}
        </Alert>
      </Snackbar>
    </>
  )
}

export default CreateEventPage
