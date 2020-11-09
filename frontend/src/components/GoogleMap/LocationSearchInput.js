import React from 'react'
import Crendential from '../../credential'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'
import { TextField } from '@material-ui/core'

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = { gmapsLoaded: false }
  }

  handleChange = (address) => {
    this.props.setAddress(address)
  }

  handleSelect = (selected) => {
    this.props.setAddress(selected)
    console.log(selected)
    geocodeByAddress(selected)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log('Success', latLng))
      .catch((error) => console.error('Error', error))
  }

  initMap = () => {
    this.setState({
      gmapsLoaded: true,
    })
  }

  componentDidMount() {
    window.initMap = this.initMap
    const gmapScriptEl = document.createElement(`script`)
    gmapScriptEl.src =
      `https://maps.googleapis.com/maps/api/js?key=` +
      Crendential.key +
      `&libraries=places&callback=initMap`
    document
      .querySelector(`body`)
      .insertAdjacentElement(`beforeend`, gmapScriptEl)
  }

  render() {
    return (
      <div style={{ height: '80px', width: '100%' }}>
        {this.state.gmapsLoaded && (
          <PlacesAutocomplete
            value={this.props.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <TextField
                  id="Iamtheonlysearchbar"
                  required
                  margin="normal"
                  label="Location"
                  fullWidth
                  {...getInputProps({
                    placeholder: 'Search Places ...',
                    className: 'location-search-input',
                  })}
                />
                <div
                  className="autocomplete-dropdown-container"
                  style={{
                    zIndex: 999,
                    position: 'relative',
                    backgroundColor: 'white',
                  }}
                >
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion, i) => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item'
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer' }
                    return (
                      <div
                        key={i}
                        style={{
                          zIndex: 999,
                          backgroundColor: 'white',
                        }}
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        )}
      </div>
    )
  }
}
export default LocationSearchInput
