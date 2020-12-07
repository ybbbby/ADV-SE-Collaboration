/* istanbul ignore file */
import React from 'react'
import './Marker.css'
import PropTypes from 'prop-types'

const Marker = (props) => {
  const { color, name } = props
  return (
    <div>
      <div
        className="pin bounce"
        style={{ backgroundColor: color, cursor: 'pointer' }}
        title={name}
      />
      <div className="pulse" />
    </div>
  )
}
Marker.propTypes = {
  color: PropTypes.any,
  name: PropTypes.string,
}
export default Marker
