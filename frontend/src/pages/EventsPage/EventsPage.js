import React from 'react'
import { Typography, Container, Box, Grid } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import { makeStyles } from '@material-ui/core/styles'
import EventCard from '../../components/EventCard/EventCard'

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'calc(100vh - 150px)',
    overflow: 'scroll',
  },
  title: {
    display: 'inline',
    padding: theme.spacing(2),
  },
  pagination: {
    float: 'right',
    padding: '5px 0',
  },
}))

export default function EventsNearby({ match }) {
  const classes = useStyles()
  const {
    params: { user },
  } = match
  const eventList = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  const [page, setPage] = React.useState(1)
  const handleChange = (event, value) => {
    setPage(value)
  }

  return (
    <div>
      <Typography variant="h6" component="h5" className={classes.title}>
        EventsNearby user: {user}
      </Typography>
      <Pagination
        count={10}
        page={page}
        onChange={handleChange}
        className={classes.pagination}
      />
      <Container className={classes.root}>
        <Box my={2}>
          <Grid container spacing={3}>
            {eventList.map((x, key) => {
              return (
                <Grid item xs={4} key={key}>
                  <EventCard />
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Container>
    </div>
  )
}
