import React from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
function randomColor(k) {
  var hash = 0,
    i,
    chr
  for (i = 0; i < k.length; i++) {
    chr = k.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  const colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
  ]
  let color = colors[hash % 16]
  return color
}

export default function SimpleDialog(props) {
  const { open, setOpen, participants } = props

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        Participants({participants.length})
      </DialogTitle>
      <List>
        {participants.map((person) => (
          <ListItem key={person.email}>
            <ListItemAvatar>
              <Avatar
                alt={person.name}
                src="/static/images/avatar/1.jpg"
                style={{
                  backgroundColor: randomColor(person.name),
                }}
              />
            </ListItemAvatar>
            <ListItemText primary={person.name + '(' + person.email + ')'} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

SimpleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  participants: PropTypes.any,
}
