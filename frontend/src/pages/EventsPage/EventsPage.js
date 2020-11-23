import React, { useEffect } from 'react'
import {
  Typography,
  Container,
  Box,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import { makeStyles } from '@material-ui/core/styles'
import useRouter from 'use-react-router'
import EventCard from '../../components/EventCard/EventCard'
import LoginModal from '../../components/LoginModal/LoginModal'
import getEvents from '../../api/getEvents'
import getEventsNearby from '../../api/getEventsNearby'

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'inline',
    padding: theme.spacing(2),
  },
  pagination: {
    float: 'right',
    padding: '10px 0',
  },
  formControl: {
    minWidth: 120,
  },
  filterGroup: {
    padding: '5px 16px',
  },
  filterItem: {
    padding: '5px 12px 0 !important',
  },
  titleText: {
    fontSize: theme.spacing(1.6),
    marginBottom: theme.spacing(1.85),
  },
}))

export default function EventsNearby() {
  const classes = useStyles()
  const router = useRouter()
  const { category } = router.match.params
  const user = localStorage.getItem('userEmail')
  const pos = localStorage.getItem('pos')
  const [distance, setDistance] = React.useState(2)
  const [eventCategory, setEventCategory] = React.useState(10)
  const [eventList, setEventList] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [loginOpen, setLoginOpen] = React.useState(false)

  const handleChange = (event, value) => {
    setPage(value)
  }

  const handleChangeDistance = (event, newValue) => {
    setDistance(newValue)
  }

  const handleChangeCategory = (event) => {
    setEventCategory(event.target.value)
  }

  const marks = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 5 },
    { value: 10 },
    { value: 20 },
  ]

  useEffect(() => {
    if (category) {
      getEvents(category).then((data) => {
        if (data) {
          setEventList(data)
        }
      })
    } else {
      getEventsNearby(pos, distance).then((data) => {
        if (data) {
          setEventList(data)
        }
      })
    }
  }, [category])

  return (
    <div>
      <Typography variant="h6" component="h5" className={classes.title}>
        Events: {category}
      </Typography>
      <Grid container spacing={3} className={classes.filterGroup}>
        <Grid item xs={4} className={classes.filterItem}>
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.titleText}
          >
            Distance range (/mile):
          </Typography>
          <Slider
            track={false}
            min={1}
            max={20}
            value={distance}
            onChange={handleChangeDistance}
            valueLabelDisplay="auto"
            step={null}
            marks={marks}
          />
        </Grid>
        <Grid item xs={2} className={classes.filterItem}>
          <FormControl className={classes.formControl}>
            <InputLabel shrink>Category</InputLabel>
            <Select value={eventCategory} onChange={handleChangeCategory}>
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} className={classes.filterItem}>
          <Pagination
            count={10}
            page={page}
            onChange={handleChange}
            className={classes.pagination}
          />
        </Grid>
      </Grid>
      <Container>
        <Box my={2}>
          <Grid container spacing={3}>
            {eventList.map((x, key) => {
              return (
                <Grid item xs={6} key={key}>
                  <EventCard config={x} user={user} openLogin={setLoginOpen} />
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Container>
      <LoginModal handleClose={() => setLoginOpen(false)} open={loginOpen} />
    </div>
  )
}
