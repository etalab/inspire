import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ children, type, size, color, href, disabled, ...props }) => {
  const buttonProps = href ? {} : props

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${size} ${disabled ? '' : color}`}
      tabIndex={href ? -1 : null}
      {...buttonProps}
    >
      {href ? (
        <a href={href} {...props}>{children}</a>
      ) : children}

      <style jsx>{`
        @import 'colors';

        button {
          display: block;
          width: 100%;
          border: 0 none;
          border-radius: 2px;
          padding: 5px 7px;
          border: 1px solid transparent;
          cursor: pointer;
          -webkit-font-smoothing: antialiased;

          &:disabled {
            background-color: $lightgrey;
            color: $grey;
            cursor: not-allowed;
          }
        }

        a {
          display: block;
          margin: -6px -8px;
          padding: 6px 8px;
          color: inherit;

          &:hover {
            color: inherit;
          }
        }

        .large {
          font-size: 1.2em;
          padding: 12px 16px;

          a {
            display: block;
            margin: -12px -16px;
            padding: 12px 16px;
          }
        }

        // Colors
        .blue {
          background-color: $blue;
          border-color: $blue;
          color: $white;

          &:hover {
            background-color: darken($blue, 10%);
          }
        }

        .white {
          background-color: $white;
          border-color: $blue;
          color: $blue;

          &:hover {
            background-color: lighten($blue, 43%);
          }
        }
      `}</style>
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  href: PropTypes.string,
  size: PropTypes.oneOf([
    'large'
  ]),
  color: PropTypes.oneOf([
    'blue',
    'white'
  ])
}

Button.defaultProps = {
  type: 'button',
  color: 'blue',
  href: null
}

export default Button