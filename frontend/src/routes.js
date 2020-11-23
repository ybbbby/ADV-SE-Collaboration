import * as React from 'react'
import { Route } from 'react-router-dom'
import Events from './pages/EventsPage/EventsPage'
import CreateEvent from './pages/CreateEventPage/CreateEventPage'
import EventDetail from './pages/EventDetailPage/EventDetailPage'

export default function Routes() {
  return (
    <>
      <Route exact path="/" render={() => <Events />} />
      <Route exact path="/events/:category" render={() => <Events />} />
      <Route exact path="/event/:eventID" render={() => <EventDetail />} />
      <Route exact path="/newevent" component={CreateEvent} />
    </>
  )
}
