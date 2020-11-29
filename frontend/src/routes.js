import * as React from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Events from './pages/EventsPage/EventsPage'
import CreateEvent from './pages/CreateEventPage/CreateEventPage'
import EventDetail from './pages/EventDetailPage/EventDetailPage'
import './styles.css'

const NotFound = () => (
  <div>
    <h1>404 - Not Found!</h1>
  </div>
)

const Routes = withRouter(({ location }) => (
  <TransitionGroup>
    <CSSTransition
      key={location.pathname}
      classNames="fade"
      timeout={{ enter: 300, exit: 300 }}
    >
      <section className="route-section">
        <Switch location={location}>
          <Route exact path="/" render={() => <Events />} />
          <Route
            exact
            path="/events/:category"
            render={() =>
              localStorage.getItem('userEmail') ? (
                <Events />
              ) : (
                <Redirect to="/" />
              )
            }
          />
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
      </section>
    </CSSTransition>
  </TransitionGroup>
))

export default Routes
