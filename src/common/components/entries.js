'use client';

import {faStarOfLife} from "@fortawesome/free-solid-svg-icons";
import {faEye, faEyeSlash} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import PropTypes from "prop-types";
import {EntryType} from "@/common/constants/entry_types";
import {Css} from "@/common/constants/css";
import {useEffect, useState} from "react";

/**
 * A entry for the user
 * @param {string} name The name of this component
 * @param {string} type The type of entry this is
 * @param {string} className The CSS for this button
 * @param {string} placeholder Placeholder text for this entry
 * @param {string|number} defaultValue The text to fill the entry with, if any
 * @param {boolean} checked Whether this entry is checked by default
 * @param {string} labelText The text to go in the label for the entry
 * @param {number} minLength The minimum number of characters required for this entry
 * @param {number} maxLength The maximum number of characters allowed for this entry
 * @param {function} onChange The method to call when a change has been detected
 * @param {boolean} required Whether this is required
 * @param {boolean} disabled Whether this is disabled
 * @param {boolean} readOnly Whether this is read-only
 * @param {JSX.Element} children The child elements
 * @return {JSX.Element} The entry
 */
const Entry = ({name, type, className, placeholder, defaultValue, checked, labelText, minLength, maxLength, onChange, required, disabled, readOnly, children}) => {

  return (
    <div className={Css.Entries.ENTRY_DIV}>
      <p className={type === EntryType.CHECKBOX ? Css.Entries.CHECKBOX_LABEL : Css.Entries.ENTRY_LABEL}>
        {labelText}
      </p>
      <input
        key={name}
        name={name}
        type={type}
        className={className}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
        checked={checked}
        onChange={onChange}
        readOnly={readOnly}
      />
      {
        required ? <FontAwesomeIcon className={Css.Entries.REQUIRED_ENTRY_ICON} icon={faStarOfLife}/> : null
      }
      {children}
    </div>
  )
}

Entry.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  checked: PropTypes.bool,
  labelText: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  children: PropTypes.node,
}

/**
 * A text entry for the user
 * @param {string} name The name of this component
 * @param {string} className The CSS for this entry
 * @param {string} placeholder Placeholder text for this entry
 * @param {string} text The text to fill the entry with, if any
 * @param {string} labelText The text to go in the label for the entry
 * @param {number} minLength The minimum number of characters required for this entry
 * @param {number} maxLength The maximum number of characters allowed for this entry
 * @param {function} onChange The method to call when a change has been detected
 * @param {boolean} required Whether this is required
 * @param {boolean} disabled Whether this is disabled
 * @param {boolean} readOnly Whether this is read-only
 * @return {JSX.Element} The text entry
 */
export const TextEntry = ({name, className, placeholder, text, labelText, minLength, maxLength, onChange, required, disabled, readOnly}) => {
  return (
    <Entry
      name={name}
      className={className}
      type={EntryType.TEXT}
      placeholder={placeholder}
      defaultValue={text}
      labelText={labelText}
      minLength={minLength}
      maxLength={maxLength}
      onChange={onChange}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
    />
  )
}

TextEntry.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  text: PropTypes.string,
  labelText: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
}

/**
 * A text entry for the user
 * @param {string} name The name of this component
 * @param {string} className The CSS for this entry
 * @param {string} placeholder Placeholder text for this entry
 * @param {string} text The text to fill the entry with, if any
 * @param {string} labelText The text to go in the label for the entry
 * @param {number} minLength The minimum number of characters required for this entry
 * @param {number} maxLength The maximum number of characters allowed for this entry
 * @param {function} onChange The method to call when a change has been detected
 * @param {boolean} required Whether this is required
 * @param {boolean} disabled Whether this is disabled
 * @param {boolean} readOnly Whether this is read-only
 * @return {JSX.Element} The email entry
 */
export const EmailEntry = ({name, className, placeholder, text, labelText, minLength, maxLength, onChange, required, disabled, readOnly}) => {
  return (
    <Entry
      name={name}
      className={className}
      type={EntryType.EMAIL}
      placeholder={placeholder}
      defaultValue={text}
      labelText={labelText}
      minLength={minLength}
      maxLength={maxLength}
      onChange={onChange}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
    />
  )
}

EmailEntry.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  text: PropTypes.string,
  labelText: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
}

/**
 * A password entry
 * @param {string} name The name of this component
 * @param {string} className The CSS for this entry
 * @param {string} placeholder Placeholder text for this entry
 * @param {string} text The text to fill the entry with, if any
 * @param {string} labelText The text to go in the label for the entry
 * @param {number} minLength The minimum number of characters required for this entry
 * @param {number} maxLength The maximum number of characters allowed for this entry
 * @param {function} onChange The method to call when a change has been detected
 * @param {boolean} required Whether this is required
 * @param {boolean} disabled Whether this is disabled
 * @param {boolean} readOnly Whether this is read-only
 * @return {JSX.Element} The password entry
 */
export const PasswordEntry = ({name, className, placeholder, text, labelText, minLength, maxLength, onChange, required, disabled, readOnly}) => {

  // Default to true as this will flip once it has been loaded
  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    setShowPassword(!showPassword);
  }, [])

  return (
    <Entry
      name={name}
      className={className}
      type={showPassword ? EntryType.TEXT : EntryType.PASSWORD}
      placeholder={placeholder}
      defaultValue={text}
      labelText={labelText}
      minLength={minLength}
      maxLength={maxLength}
      onChange={onChange}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
    >
      <FontAwesomeIcon
        className={Css.Entries.PASSWORD_ENTRY_ICON}
        icon={showPassword ? faEyeSlash : faEye}
        onClick={() => setShowPassword(!showPassword)}
      />
    </Entry>
  )
}
PasswordEntry.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  text: PropTypes.string,
  labelText: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
}

/**
 * A checkbox entry
 * @param {string} name The name of the checkbox
 * @param {string} className The className of the checkbox
 * @param {string} labelText The text for the label representing the checkbox
 * @param {boolean} checked Whether this checkbox is checked to begin with
 * @param {function} onChange The method to call when the value of this checkbox is called
 * @param {boolean} disabled Whether this checkbox is disabled or not
 * @returns {JSX.Element} The checkbox
 */
export const CheckboxEntry = ({name, className, labelText, checked, onChange, disabled}) => {
  return (
    <Entry
      name={name}
      type={EntryType.CHECKBOX}
      className={className}
      placeholder={""}
      onChange={onChange}
      checked={checked}
      labelText={labelText}
      disabled={disabled}
    />
  )
}
CheckboxEntry.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}


export const DateEntry = ({name, className, labelText, defaultValue, onChange, disabled, required}) => {
  return (
    <Entry
      name={name}
      type={EntryType.DATETIME_LOCAL}
      className={className}
      placeholder={defaultValue}
      onChange={onChange}
      labelText={labelText}
      defaultValue={defaultValue}
      disabled={disabled}
      required={required}
    />
  )
}