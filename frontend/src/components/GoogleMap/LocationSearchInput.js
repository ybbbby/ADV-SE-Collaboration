/* istanbul ignore file */
import React from 'react'
import PlacesAutocomplete from 'react-places-autocomplete'
import { TextField } from '@material-ui/core'
import PropTypes from 'prop-types'
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
    this.props.setError(false)
  }

  initMap = () => {
    this.setState({
      gmapsLoaded: true,
    })
  }

  componentDidMount() {
    if (document.getElementById('IamOneAndTheOnly')) {
      this.initMap()
      return
    }
    window.initMap = this.initMap
    const gmapScriptEl = document.createElement(`script`)
    gmapScriptEl.id = 'IamOneAndTheOnly'
    gmapScriptEl.src =
      `https://maps.googleapis.com/maps/api/js?key=` +
      // eslint-disable-next-line no-undef
      process.env.REACT_APP_GMAP_KEY +
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
                  inputProps={{ maxLength: 200 }}
                  helperText={this.props.error ? 'Invalid address.' : ''}
                  error={this.props.error}
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
LocationSearchInput.propTypes = {
  setAddress: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  address: PropTypes.string,
  error: PropTypes.bool,
}

export default LocationSearchInput
