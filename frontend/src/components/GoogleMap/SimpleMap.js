import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import Crendential from '../../credential'
import Marker from './Marker'

class SimpleMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      center: props.center
        ? props.center
        : {
            lat: 59.95,
            lng: 30.33,
          },
      zoom: 11,
      name: props.name ? props.name : 'Hero Deku',
    }
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '50vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: Crendential.key }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
          <Marker
            lat={this.state.center.lat}
            lng={this.state.center.lng}
            name={this.state.name}
          />
        </GoogleMapReact>
      </div>
    )
  }
}

export default SimpleMap
