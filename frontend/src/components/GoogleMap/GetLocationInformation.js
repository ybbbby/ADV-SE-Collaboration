import React from 'react'

class GetLocationInformation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    if ('geolocation' in navigator) {
      console.log('Available')
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log('Latitude is :', position.coords.latitude)
        console.log('Longitude is :', position.coords.longitude)
      })
    } else {
      console.log('Not Available')
    }
  }

  render() {
    return (
      <div>
        <h4>Using geolocation JavaScript API in React</h4>
      </div>
    )
  }
}

export default GetLocationInformation
