'use client'

import PropTypes from "prop-types";
import {ButtonTypes} from "@/common/constants/button_types";
import {Css} from "@/common/constants/css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

/**
 * A button
 * @param {string} name The name of the button
 * @param {string} type The type of input this is
 * @param {string} className The CSS for the button
 * @param {boolean} disabled Whether the button is disabled
 * @param {function} onClick The method to call when the button is clicked
 * @param {JSX.Element} children The children for the button
 * @returns {JSX.Element}
 * @constructor
 */
export const Button = ({name, type, className, onClick, disabled, children}) => {
  return (
    <button
      key={name}
      name={name}
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
Button.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
}

/**
 *
 * @param {string} name The name of this button
 * @param {string} text The text to show on this button when not loading
 * @param {boolean} loading The current loading state
 * @param {boolean} disabled Whether this button is disabled
 * @returns {JSX.Element} The Loading Button
 */
export const LoadingButton = ({name, text, loading, disabled}) => {
  return (
    <Button name={name} type={ButtonTypes.SUBMIT} className={loading ? Css.Buttons.SUBMIT_BUTTON_LOADING : Css.Buttons.SUBMIT_BUTTON} disabled={disabled || loading}  >
      {loading ? <FontAwesomeIcon icon={faSpinner} className={Css.Buttons.SUBMIT_BUTTON_LOADING_ICON} /> : text}
    </Button>
  )
}
LoadingButton.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
}