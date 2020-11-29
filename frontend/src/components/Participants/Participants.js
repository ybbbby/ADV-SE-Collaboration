import React from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import randomColor from '../../util/util'

export default function SimpleDialog(props) {
  const { open, setOpen, participants } = props

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle id="simple-dialog-title">
        Participants({participants.length})
      </DialogTitle>
      <List style={{ padding: '10px 15px 20px' }}>
        {participants.map((person) => (
          <ListItem key={person.email}>
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: randomColor(person.email),
                }}
              >
                {person.username[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={person.username + '(' + person.email + ')'}
            />
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
