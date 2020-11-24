import React, { useEffect, useState } from 'react'
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
  titleText: {
    fontSize: theme.spacing(1.6),
    marginBottom: theme.spacing(1.85),
  },
  emptyHint: {
    padding: theme.spacing(1),
  },
}))

export default function EventsPage() {
  const classes = useStyles()
  const router = useRouter()
  const { category } = router.match.params
  const user = localStorage.getItem('userEmail')
  const pos = localStorage.getItem('pos')
  const [distance, setDistance] = useState(2)
  const [eventCategory, setEventCategory] = useState('all')
  const [categoryList, setCategoryList] = useState([])
  const [eventList, setEventList] = useState([])
  const [page, setPage] = useState(1)
  const [loginOpen, setLoginOpen] = useState(false)

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

  useEffect(() => {
    const categories = eventList.map((x) => {
      if (x.category) return x.category
    })
    setCategoryList([...new Set(categories)])
  }, [eventList])

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
            {eventList.length > 0 ? (
              eventList.map((x, key) => {
                if (eventCategory !== 'all' && eventCategory !== x.category)
                  return null
                else {
                  return (
                    <Grid item xs={6} key={key}>
                      <EventCard
                        config={x}
                        user={user}
                        openLogin={setLoginOpen}
                      />
                    </Grid>
                  )
                }
              })
            ) : (
              <Typography variant="body1" className={classes.emptyHint}>
                Oops, there are no such events.
              </Typography>
            )}
          </Grid>
        </Box>
      </Container>
      <LoginModal handleClose={() => setLoginOpen(false)} open={loginOpen} />
    </div>
  )
}
