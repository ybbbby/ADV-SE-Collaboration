import React, { useEffect, useState, useRef } from 'react'
import {
  Typography,
  Container,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import { useRouteMatch } from 'react-router-dom'
import EventCard from '../../components/EventCard/EventCard'
import LoginModal from '../../components/LoginModal/LoginModal'
import getEvents from '../../api/getEvents'
import getEventsNearby from '../../api/getEventsNearby'

export const EVENT_CATEGORY_MAP = {
  music: 'Music',
  'visual-arts': 'Visual Arts',
  'performing-arts': 'Performing Arts',
  film: 'Film',
  'lectures-books': 'Lectures & Books',
  fashion: 'Fashion',
  'food-and-drink': 'Food & Drink',
  'festivals-fairs': 'Festivals & Fairs',
  charities: 'Charities',
  'sports-active-life': 'Sports & Active Life',
  nightlife: 'Nightlife',
  'kids-family': 'Kids & Family',
}

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
  emptyHint: {
    padding: theme.spacing(1),
  },
  switch: {
    padding: '16px 0 0 40px !important',
  },
}))

export default function EventsPage() {
  const classes = useStyles()
  const router = useRouteMatch()
  const { category } = router.params
  const user = localStorage.getItem('userEmail')
  const pos = localStorage.getItem('pos')
  const cache = useRef({})
  const [sortOrder, setSortOrder] = useState('distance')
  const [eventCategory, setEventCategory] = useState('all')
  const [categoryList, setCategoryList] = useState([])
  const [eventList, setEventList] = useState([])
  const [page, setPage] = useState(1)
  const [onlyHost, setOnlyHost] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filterEvents = (key1, key2, key3) => {
    const hostKey = key3 ? 'host' : 'all'
    const key = `${key1},${key2},${hostKey}`
    if (cache.current[key]) {
      setEventList(cache.current[key])
    } else {
      const originalEvents = JSON.parse(
        JSON.stringify(cache.current['distance,all,all'])
      )
      const allEvents =
        key1 === 'distance'
          ? originalEvents
          : originalEvents.sort((a, b) => (a.time > b.time ? 1 : -1))
      const eventsByCategory = allEvents.flatMap((item) =>
        key2 === 'all' || item.category === key2 ? item : []
      )
      const eventsByHost = key3
        ? eventsByCategory.flatMap((item) =>
            user && item.user_email === user ? item : []
          )
        : eventsByCategory
      cache.current[key] = eventsByHost
      setEventList(cache.current[key])
    }
    setPage(1)
  }

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  const handleChangeOrder = (event) => {
    setSortOrder(event.target.value)
    filterEvents(event.target.value, eventCategory, onlyHost)
  }

  const handleChangeCategory = (event) => {
    setEventCategory(event.target.value)
    filterEvents(sortOrder, event.target.value, onlyHost)
  }

  const handleChangeHost = (event) => {
    setOnlyHost(event.target.checked)
    filterEvents(sortOrder, eventCategory, event.target.checked)
  }

  const initData = (data) => {
    setEventList(data)
    cache.current['distance,all,all'] = data
    const categories = data.flatMap((x) => (x.category ? x.category : []))
    setCategoryList([...new Set(categories)])
  }

  useEffect(() => {
    let isSubscribed = true
    cache.current.value = {}
    setIsLoading(true)
    if (category) {
      getEvents(category).then((data) => {
        /* istanbul ignore else */
        if (isSubscribed) {
          if (data) {
            initData(data)
          }
          setIsLoading(false)
        }
      })
    } else {
      getEventsNearby(pos).then((data) => {
        /* istanbul ignore else */
        if (isSubscribed) {
          if (data) {
            initData(data)
          }
          setIsLoading(false)
        }
      })
    }
    return () => (isSubscribed = false)
  }, [category])

  return (
    <div>
      <Typography variant="h6" component="h5" className={classes.title}>
        Events: {category}
      </Typography>
      <Grid container spacing={3} className={classes.filterGroup}>
        <Grid item xs={2} className={classes.filterItem}>
          <FormControl className={classes.formControl}>
            <InputLabel shrink>Sort</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleChangeOrder}
              disabled={!cache.current['distance,all,all']}
            >
              <MenuItem value="distance">
                <em>By distance</em>
              </MenuItem>
              <MenuItem value="time">
                <em>By time</em>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2} className={classes.filterItem}>
          <FormControl className={classes.formControl}>
            <InputLabel shrink>Category</InputLabel>
            <Select
              value={eventCategory}
              onChange={handleChangeCategory}
              disabled={!cache.current['distance,all,all']}
            >
              <MenuItem value="all">
                <em>All</em>
              </MenuItem>
              {categoryList.map((x, key) => {
                return (
                  <MenuItem value={x} key={key}>
                    {EVENT_CATEGORY_MAP[x]}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} className={classes.switch}>
          <FormControlLabel
            className={classes.formControl}
            control={
              <Switch
                checked={onlyHost}
                onChange={handleChangeHost}
                disabled={!cache.current['distance,all,all']}
              />
            }
            label="Only host"
          />
        </Grid>
        <Grid item xs={5} className={classes.filterItem}>
          <Pagination
            count={Math.ceil(eventList.length / 10)}
            page={page}
            onChange={handleChangePage}
            className={classes.pagination}
          />
        </Grid>
      </Grid>
      <Container>
        <Box my={2}>
          <Grid container spacing={3}>
            {isLoading ? (
              <>
                <Grid item xs={6}>
                  <Skeleton variant="rect" height={270} />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </Grid>
                <Grid item xs={6}>
                  <Skeleton variant="rect" height={270} />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </Grid>
              </>
            ) : eventList.length > 0 ? (
              eventList.slice((page - 1) * 10, page * 10).map((x, key) => (
                <Grid item xs={6} key={key}>
                  <EventCard config={x} user={user} openLogin={setLoginOpen} />
                </Grid>
              ))
            ) : (
              <Typography variant="body1" className={classes.emptyHint}>
                Oops, there are no such events.
              </Typography>
            )}
          </Grid>
        </Box>
      </Container>
      <LoginModal
        handleClose={/* istanbul ignore next */ () => setLoginOpen(false)}
        open={loginOpen}
      />
    </div>
  )
}
