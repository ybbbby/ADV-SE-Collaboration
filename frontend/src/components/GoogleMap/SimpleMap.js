/* istanbul ignore file */
import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from './Marker'
import PropTypes from 'prop-types'

class SimpleMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      center: {
        lat: 59.95,
        lng: 30.33,
      },
      zoom: 11,
      name: 'Hero Deku',
    }
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '30vh', width: '100%' }}>
        <GoogleMapReact
          // eslint-disable-next-line no-undef
          bootstrapURLKeys={{ key: process.env.REACT_APP_GMAP_KEY }}
          center={this.props.center ? this.props.center : this.state.center}
          defaultZoom={this.state.zoom}
        >
          <Marker
            lat={
              this.props.center ? this.props.center.lat : this.state.center.lat
            }
            lng={
              this.props.center ? this.props.center.lng : this.state.center.lng
            }
            name={this.props.name ? this.props.name : this.state.name}
          />
        </GoogleMapReact>
      </div>
    )
  }
}
SimpleMap.propTypes = {
  center: PropTypes.object,
  name: PropTypes.string,
}
export default SimpleMap
