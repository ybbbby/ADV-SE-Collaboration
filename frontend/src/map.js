import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import Crendential from './credential'
import Marker from './Marker'

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33,
    },
    zoom: 11,
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: Crendential.key }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <Marker lat={59.966513} lng={30.337844} name={'asdas'} />
          <Marker lat={59.955414} lng={30.337844} name={'Here I amaaa'} />
        </GoogleMapReact>
      </div>
    )
  }
}

export default SimpleMap
