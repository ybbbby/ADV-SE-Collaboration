import React from 'react'
import { Typography, Container, Box, Grid } from '@material-ui/core'
import EventCard from '../../components/EventCard/EventCard'

export default function EventsNearby({ match }) {
  const {
    params: { user },
  } = match

  return (
    <div>
      <Typography variant="h5" component="h5">
        EventsNearby user: {user}
      </Typography>
      <Container>
        <Box my={4}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <EventCard />
            </Grid>
            <Grid item xs={6}>
              <EventCard />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  )
}
