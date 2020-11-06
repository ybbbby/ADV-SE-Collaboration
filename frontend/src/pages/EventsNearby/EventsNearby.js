import React from 'react'
import { Typography, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
  },
}))

export default function EventsNearby({ match }) {
  const {
    params: { user },
  } = match

  const classes = useStyles()

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h4" component="h1" gutterBottom>
          EventsNearby user: {user}
        </Typography>
      </Paper>
    </div>
  )
}
