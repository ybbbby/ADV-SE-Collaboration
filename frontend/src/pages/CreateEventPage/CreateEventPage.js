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
} from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import LocationSearchInput from '../../components/GoogleMap/LocationSearchInput'
import { RNS3 } from 'react-native-aws3'
import options from '../../awsOptions'
import './styles.css'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    boxShadow:
      '0px 0px 0px -1px rgba(0,0,0,0.2), -2px -1px 1px -1px rgba(0,0,0,0.14), 0px 1px 4px 1px rgba(0,0,0,0.12);',
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
}))

const CreateEventPage = (props) => {
  const classes = useStyles()
  const [pictures, setPictures] = useState([])
  const [selectedDate, setSelectedDate] = useState()
  const [address, setAddress] = useState(' ')
  const [loading, setLoading] = useState(false)

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const onDrop = (picture) => {
    setPictures([...pictures, picture])
  }

  const handleSubmit = () => {
    // console.log(address)
    // console.log(selectedDate)
    setLoading(true)
    RNS3.put(pictures[0][0], options)
      .then((response) => {
        setLoading(false)
        if (response.status !== 201) {
          throw new Error('Failed to upload image to S3')
        } else {
          console.log(
            'Successfully uploaded image to s3. s3 bucket url: ',
            response.body.postResponse.location
          )
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  return (
    <>
      <form className={classes.root} noValidate autoComplete="off">
        <Typography variant="h6">Create new event</Typography>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <TextField
              required
              margin="normal"
              id="standard-required"
              label="Name of event"
              defaultValue="Title"
              fullWidth
            />
          </Grid>
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around" spacing={3}>
            <Grid item xs={6}>
              <LocationSearchInput address={address} setAddress={setAddress} />
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
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <KeyboardTimePicker
                disableToolbar
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
              defaultValue="Tell us something about your event"
              className={classes.descripInput}
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
    </>
  )
}

export default CreateEventPage
