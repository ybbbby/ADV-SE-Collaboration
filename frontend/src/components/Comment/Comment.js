import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import TelegramIcon from '@material-ui/icons/Telegram'
import PropTypes from 'prop-types'
import randomColor from '../../util/util'
import { format } from 'date-fns'
import g from '../../global'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    maxWidth: 752,
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
  },
  input: {
    width: 'calc(100% - 95px)',
    padding: '6px 10px 6px 0',
  },
}))

export default function AlignItemsList(props) {
  const classes = useStyles()
  const {
    setfailInfo,
    setServerity,
    setAlertOpen,
    setLoginOpen,
    eventId,
    comments,
    setComments,
    eventHost,
  } = props
  const user = localStorage.getItem('userEmail')
  const [text, setText] = useState('')
  const handleDataChange = (e) => {
    setText(e.target.value)
  }
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSend()
    }
  }
  const handleSend = () => {
    if (!user) {
      setLoginOpen(true)
      return
    }
    const url = `/user/event/` + eventId + `/comment`
    const requestForm = new FormData()
    requestForm.append('Content', text)
    const date = new Date()
    requestForm.append('Time', format(date, 'yyyy-MM-dd HH:mm:ss'))
    fetch(url, {
      method: 'POST',
      body: requestForm,
    })
      .then((response) => {
        if (response.status < 200 || response.status > 299) {
          throw Error(response.statusText)
        } else {
          return response.text()
        }
      })
      .then(() => {
        g.goEasy.publish({
          channel: eventHost,
          message: `${user} adds a new comment: ${text}`,
        })
        setComments([
          ...comments,
          {
            user: user,
            content: text,
            time: 'just now',
          },
        ])
      })
      .catch(() => {
        setfailInfo('Fail to add comments due to connection error with server')
        setServerity('error')
        setAlertOpen(true)
      })
    setText('')
  }
  const Comment = (userName, time, content) => (
    <ListItem style={{ padding: 0 }} alignItems="flex-start">
      <ListItemAvatar>
        <Avatar
          style={{
            backgroundColor: randomColor(userName),
          }}
        >
          {userName[0].toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Typography
              component="span"
              variant="subtitle2"
              className={classes.inline}
              color="textPrimary"
            >
              {userName}
            </Typography>
            &nbsp;&nbsp;
            <Typography
              component="span"
              variant="body2"
              className={classes.inline}
              color="textSecondary"
            >
              {time}
            </Typography>
          </>
        }
        secondary={
          <span
            style={{
              maxWidth: '100%',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              textOverflow: 'clip',
              overflow: 'auto',
            }}
          >
            <Typography component="span" variant="body1" color="textPrimary">
              {content}
            </Typography>
            {''}
          </span>
        }
      />
    </ListItem>
  )
  return (
    <>
      <List className={classes.root}>
        {comments.map((comment, i) => {
          const divider = i == comments.length - 1
          return (
            <div key={i}>
              {Comment(comment['user'], comment['time'], comment['content'], i)}
              {divider ? <></> : <Divider component="li" />}
            </div>
          )
        })}
        {localStorage.getItem('userEmail') ? (
          <>
            <TextField
              className={classes.input}
              placeholder={
                comments.length == 0
                  ? 'Be the first one to comment!'
                  : "What's your opinion on this event?"
              }
              value={text}
              onChange={handleDataChange}
              onKeyDown={handleKeyDown}
              inputProps={{ maxLength: 300 }}
            />
            <Button
              variant="contained"
              color="default"
              endIcon={<TelegramIcon />}
              onClick={handleSend}
            >
              Send
            </Button>
          </>
        ) : (
          <></>
        )}
      </List>
    </>
  )
}

AlignItemsList.propTypes = {
  setfailInfo: PropTypes.func.isRequired,
  setServerity: PropTypes.func.isRequired,
  setAlertOpen: PropTypes.func.isRequired,
  setLoginOpen: PropTypes.func.isRequired,
  eventId: PropTypes.string.isRequired,
  comments: PropTypes.any,
  setComments: PropTypes.func,
  eventHost: PropTypes.string.isRequired,
}
