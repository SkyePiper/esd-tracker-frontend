/**
 * Defines the different possible types of an input
 * @property BUTTON A push button with no default behavior displaying the value of the value attribute, empty by default.
 * @property CHECKBOX A check box allowing single values to be selected/deselected.
 * @property COLOR A control for specifying a color; opening a color picker when active in supporting browsers.
 * @property DATE A control for entering a date (year, month, and day, with no time). Opens a date picker or numeric wheels for year, month, day when active in supporting browsers.
 * @property DATETIME_LOCAL A control for entering a date and time, with no time zone. Opens a date picker or numeric wheels for date- and time-components when active in supporting browsers.
 * @property EMAIL A field for editing an email address. Looks like a text input, but has validation parameters and relevant keyboard in supporting browsers and devices with dynamic keyboards.
 * @property FILE A control that lets the user select a file. Use the accept attribute to define the types of files that the control can select.
 * @property HIDDEN A control that is not displayed but whose value is submitted to the server. There is an example in the next column, but it's hidden!
 * @property IMAGE A graphical submit button. Displays an image defined by the src attribute. The alt attribute displays if the image src is missing.
 * @property MONTH A control for entering a month and year, with no time zone.
 * @property NUMBER A control for entering a number. Displays a spinner and adds default validation. Displays a numeric keypad in some devices with dynamic keypads.
 * @property PASSWORD A single-line text field whose value is obscured. Will alert user if site is not secure.
 * @property RADIO A radio button, allowing a single value to be selected out of multiple choices with the same name value.
 * @property RANGE A control for entering a number whose exact value is not important. Displays as a range widget defaulting to the middle value. Used in conjunction min and max to define the range of acceptable values.
 * @property RESET A button that resets the contents of the form to default values. Not recommended.
 * @property SEARCH A single-line text field for entering search strings. Line-breaks are automatically removed from the input value. May include a delete icon in supporting browsers that can be used to clear the field. Displays a search icon instead of enter key on some devices with dynamic keypads.
 * @property SUBMIT A button that submits the form.
 * @property TELEPHONE A control for entering a telephone number. Displays a telephone keypad in some devices with dynamic keypads.
 * @property TEXT The default value. A single-line text field. Line-breaks are automatically removed from the input value.
 * @property TIME A control for entering a time value with no time zone.
 * @property URL A field for entering a URL. Looks like a text input, but has validation parameters and relevant keyboard in supporting browsers and devices with dynamic keyboards.
 * @property WEEK A control for entering a date consisting of a week-year number and a week number with no time zone.
 * @type {Readonly<{BUTTON: string, CHECKBOX: string, COLOR: string, DATE: string, DATETIME_LOCAL: string, EMAIL: string, FILE: string, IMAGE: string, MONTH: string, PASSWORD: string, RADIO: string, RANGE: string, SEARCH: string, SUBMIT: string, TELEPHONE: string, TEXT: string, TIME: string, URL: string, WEEK: string}>}
 */
export const EntryType = Object.freeze({

    BUTTON: "button",
    CHECKBOX: "checkbox",
    COLOR: "color",
    DATE: "date",
    DATETIME_LOCAL: "datetime-local",
    EMAIL: "email",
    FILE: "file",
    HIDDEN: "hidden",
    IMAGE: "image",
    MONTH: "month",
    NUMBER: "number",
    PASSWORD: "password",
    RADIO: "radio",
    RANGE: "range",
    RESET: "reset",
    SEARCH: "search",
    SUBMIT: "submit",
    TELEPHONE: "tel",
    TEXT: "text",
    TIME: "time",
    URL: "url",
    WEEK: "week",
})