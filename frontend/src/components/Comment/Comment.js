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
import deleteComment from '../../api/deleteComment'
import postComment from '../../api/postComment'
import { format } from 'date-fns'
import g from '../../global'
import red from '@material-ui/core/colors/red'

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
  deleteButton: {
    color: red[500],
    float: 'right',
  },
}))

export default function AlignItemsList(props) {
  const classes = useStyles()
  const {
    setfailInfo,
    setServerity,
    setAlertOpen,
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
  const handleDelete = (id) => {
    deleteComment(id).then((data) => {
      if (data) {
        var array = [...comments]
        for (var i = 0; i < array.length; i++) {
          /* istanbul ignore else */
          if (array[i].id == id) {
            array.splice(i, 1)
            setComments(array)
          }
        }
        setfailInfo('Comment deleted!')
        setServerity('success')
        setAlertOpen(true)
      } else {
        setfailInfo('Fail to delete the comment')
        setServerity('error')
        setAlertOpen(true)
      }
    })
  }
  const handleSend = () => {
    const requestForm = new FormData()
    requestForm.append('Content', text)
    const date = new Date()
    requestForm.append('Time', format(date, 'yyyy-MM-dd HH:mm:ss'))
    postComment(eventId, requestForm).then((id) => {
      if (id) {
        g.goEasy.publish({
          channel: eventHost,
          message: `${user} adds a new comment: ${text}`,
        })
        setComments([
          {
            user: user,
            content: text,
            time: 'just now',
            id: id,
          },
          ...comments,
        ])
      } else {
        setfailInfo('Fail to add comments due to connection error with server')
        setServerity('error')
        setAlertOpen(true)
      }
    })
    setText('')
  }
  const Comment = (userName, time, content, id) => (
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
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {userName === user ? (
              <Button
                className={classes.deleteButton}
                onClick={() => handleDelete(id)}
              >
                Delete
              </Button>
            ) : (
              <></>
            )}
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
        <br />
        <br />
        {comments.map((comment, i) => {
          const divider = i == comments.length - 1
          return (
            <div key={i}>
              {Comment(
                comment['user'],
                comment['time'],
                comment['content'],
                comment['id']
              )}
              {divider ? <></> : <Divider component="li" />}
            </div>
          )
        })}
      </List>
    </>
  )
}

AlignItemsList.propTypes = {
  setfailInfo: PropTypes.func.isRequired,
  setServerity: PropTypes.func.isRequired,
  setAlertOpen: PropTypes.func.isRequired,
  eventId: PropTypes.string,
  comments: PropTypes.any,
  setComments: PropTypes.func,
  eventHost: PropTypes.string.isRequired,
}
