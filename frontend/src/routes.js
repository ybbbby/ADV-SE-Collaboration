import * as React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Events from './pages/EventsPage/EventsPage'
import CreateEvent from './pages/CreateEventPage/CreateEventPage'
import EventDetail from './pages/EventDetailPage/EventDetailPage'

const NotFound = () => (
  <div>
    <h1>404 - Not Found!</h1>
  </div>
)

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" render={() => <Events />} />
      <Route exact path="/events/:category" render={() => <Events />} />
      <Route exact path="/event/:eventID" render={() => <EventDetail />} />
      <Route
        exact
        path="/newevent"
        render={() =>
          localStorage.getItem('userEmail') ? (
            <CreateEvent />
          ) : (
            <Redirect to="/" />
          )
        }
      />
      <Route component={NotFound} />
    </Switch>
  )
}
