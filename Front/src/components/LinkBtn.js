import React from 'react'
import PropTypes from 'prop-types'

import { Link } from './Router'

const LinkBtn = ({ to, label }) => {
  return (
    <Link to={to}>
      <button variant="raised" color="primary">
        <span>{label}</span>
      </button>
    </Link>
  )
}

LinkBtn.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default LinkBtn
