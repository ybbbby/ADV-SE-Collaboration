import * as React from 'react'
import { Route } from 'react-router-dom'
import Events from './pages/EventsPage/EventsPage'
import CreateEvent from './pages/CreateEventPage/CreateEventPage'
import EventDetail from './pages/EventDetailPage/EventDetailPage'
import SimpleMap from './components/GoogleMap/SimpleMap'
import GetLocationInformation from './components/GoogleMap/GetLocationInformation'

export default function Routes(props) {
  const { user } = props

  return (
    <>
      <Route exact path="/" render={() => <Events user={user} />} />
      <Route
        exact
        path="/events/:category"
        render={() => <Events user={user} />}
      />
      <Route exact path="/event/:eventID" component={EventDetail} />
      <Route exact path="/newevent" component={CreateEvent} />
      <Route exact path="/map" component={SimpleMap} />
      <Route exact path="/getLocation" component={GetLocationInformation} />
    </>
  )
}
