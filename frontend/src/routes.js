import * as React from 'react'
import { Route } from 'react-router-dom'
import EventsNearby from './pages/EventsNearby/EventsNearby'
import SimpleMap from './components/GoogleMap/SimpleMap'
import LocationSearchInput from './components/GoogleMap/LocationSearchInput'

export default function Routes() {
  return (
    <>
      <Route exact path="/" component={EventsNearby} />
      <Route exact path="/eventsnearby/:user" component={EventsNearby} />
      <Route exact path="/map" component={SimpleMap} />
      <Route exact path="/searchbar" component={LocationSearchInput} />
    </>
  )
}
