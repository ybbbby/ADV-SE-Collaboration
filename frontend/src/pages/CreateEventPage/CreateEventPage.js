import 'date-fns'
import React, { useState } from 'react'
import ImageUploader from 'react-images-upload'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { Grid, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import LocationSearchInput from '../../components/GoogleMap/LocationSearchInput'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  submitButton: {
    margin: theme.spacing(4),
    width: theme.spacing(15),
  },
}))

const CreateEventPage = (props) => {
  const classes = useStyles()
  const [pictures, setPictures] = useState([])
  const [selectedDate, setSelectedDate] = useState()
  const [address, setAddress] = useState(' ')

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const onDrop = (picture) => {
    setPictures([...pictures, picture])
  }

  const handleSubmit = () => {
    console.log(address)
    console.log(selectedDate)
  }

  return (
    <>
      <form className={classes.root} noValidate autoComplete="off">
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
        <Grid container justify="space-around">
          <Button
            variant="contained"
            color="primary"
            className={classes.submitButton}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </>
  )
}

export default CreateEventPage
