import React from 'react'
import { Typography } from '@material-ui/core'

export default function EventsNearby({ match, location }) {
  const {
    params: { user },
  } = match

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        EventsNearby user: {user}
      </Typography>
    </div>
  )
}
