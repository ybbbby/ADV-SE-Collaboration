import 'date-fns'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DateFnsUtils from '@date-io/date-fns'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers'
import LocationSearchInput from '../GoogleMap/LocationSearchInput'

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  content: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  confirmButton: {
    margin: theme.spacing(1),
    padding: theme.spacing(1.5),
  },
  textInput: {
    width: theme.spacing(50),
  },
  addressInput: {
    width: theme.spacing(50),
    height: theme.spacing(20),
  },
}))

function UpdateInputModal(props) {
  const classes = useStyles()
  const { handleClose, open, type, date, description } = props
  const [selectedDate, setSelectedDate] = useState(date)
  const [newDescription, setNewDescription] = useState(description)
  const [newAddress, setNewAddress] = useState('')
  const [addressError, setAddressError] = useState(false)
  const F = false
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }
  const handleDesChange = (des) => {
    setNewDescription(des.target.value)
  }
  const handleCloseWithNoUpdate = () => {
    handleClose()
    setSelectedDate(date)
    setNewDescription(description)
    setNewAddress('')
  }
  const handleCloseWithUpdate = () => {
    if (type === 1) {
      handleClose(selectedDate)
    } else if (type === 2) {
      handleClose(selectedDate)
    } else if (type === 3) {
      handleClose(newDescription)
    } else if (type === 4) {
      handleClose(newAddress)
      setNewAddress('')
    }
  }
  let selector
  /*
  if (type === 1) {
    selector = (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Change date"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
    )
  } else*/
  if (type === 2) {
    selector = (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDateTimePicker
          id="time-picker"
          label="Change time"
          ampm={F}
          value={selectedDate}
          disablePast
          onChange={handleDateChange}
        />
      </MuiPickersUtilsProvider>
    )
  } else if (type === 3) {
    selector = (
      <Box className={classes.textInput}>
        <TextField
          id="standard-multiline-static"
          label="Change event description"
          multiline
          rows={7}
          fullWidth
          margin="normal"
          value={newDescription}
          onChange={handleDesChange}
          className={classes.descripInput}
          inputProps={{ maxLength: 600 }}
        />
      </Box>
    )
  } else {
    selector = (
      <Box className={classes.addressInput}>
        <LocationSearchInput
          address={newAddress}
          setAddress={setNewAddress}
          error={addressError}
          setError={setAddressError}
        />
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={() => handleCloseWithNoUpdate()}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => handleCloseWithNoUpdate()}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>{selector}</DialogContent>
      <Button
        variant="contained"
        color="primary"
        className={classes.confirmButton}
        onClick={handleCloseWithUpdate}
      >
        Confirm
      </Button>
    </Dialog>
  )
}

UpdateInputModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  type: PropTypes.number.isRequired,
  date: PropTypes.object,
  description: PropTypes.string,
}

export default UpdateInputModal
