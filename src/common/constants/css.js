/**
 * Defines CSS for use around the application
 */
export const Css = Object.freeze({
  Popup: Object.freeze({
    POPUP_DIV: "flex absolute top-0 left-0 right-0 bottom-0 h-screen max-h-5/6 overflow-auto justify-center items-center backdrop-blur-sm z-40 isolate",
    POPUP_BACKGROUND: "flex flex-col items-center justify-center px-2 py-2 w-1/4 bg-white rounded-lg shadow-lg",
    POPUP_TITLE: "m-1 px-2 py-2 w-full bg-yellow-400 rounded-lg shadow text-center text-black font-bold",
    CLOSE_POPUP: "flex flex-row w-full items-end justify-end px-2 text-gray-400 font-bold",
    POPUP_DESCRIPTION: "m-1 px-2 py-2 w-full rounded-lg text-center text-gray-600",
  }),

  Error: Object.freeze({
    ERROR_DIV: "flex absolute top-0 left-0 right-0 justify-center items-center px-2 py-2 w-full bg-red-600 shadow-lg z-50 isolate",
    CLEAR_ERROR: "mx-2 px-2 py-1 items-center justify-center font-bold rounded-lg border border-white"
  }),

  NAV_BAR: Object.freeze({
    NAV_BAR_DIV: "flex flex-col absolute left-0 justify-center items-center px-2 py-2 h-full w-1/12 bg-yellow-400",
    NAV_BAR_ITEM: "flex items-center justify-center px-2 py-2 w-full bg-transparent rounded-lg text-center text-black font-bold overflow-wrap",
    NAV_BAR_ITEM_SEPARATOR: "my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25",
    USER_ACCOUNT: "absolute bottom-0 px-2 py-2 w-full items-center justify-center text-center text-black font-bold",
    LOGOUT_BUTTON: "px-2 py-2 items-center justify-center text-center text-black font-bold w-full",
  }),

  PAGE: Object.freeze({
    PAGE_DIV: "relative px-2 py-2 h-full flex flex-col",
    PAGE_TITLE_DIV: "flex flex-col w-full px-2 py-2",
    PAGE_TITLE: "text-center font-bold text-white w-full",
    PAGE_TITLE_SEPARATOR: "my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-white to-transparent opacity-25",
    PAGE_CONTENT_DIV: "flex flex-col w-full h-full",
    ADD_BUTTON_DIV: "px-2 py-1 w-full flex flex-col items-end justify-end",
    ADD_BUTTON: "px-2 py-1 bg-transparent border rounded-xl"
  }),

  PAGE_LIST: Object.freeze({
    PAGE_LIST_ITEM_DIV: "flex flex-col px-2 py-1",
    PAGE_LIST_ITEM_DATA_DIV: "flex flex-row px-2 py-1",
    PAGE_LIST_NAME_DIV: "px-2 py-1 w-3/4 font-bold",
    PAGE_LIST_BUTTONS_DIV: "flex flex-row items-center justify-end space-x-4 w-1/4 px-2 py-1",
    PAGE_LIST_BUTTON: "items-center justify-center",
    PAGE_LIST_RULE: "h-px border-t-0 bg-transparent bg-gradient-to-r from-neutral-500 to-neutral-500 opacity-30",
  }),

  Entries: Object.freeze({
    ENTRY_DIV: "px-2 py-2 w-full flex flex-row items-center justify-left",

    ENTRY_LABEL: "px-2 py-2 w-3/12 text-left text-black",
    ENTRY_TEXT: "px-2 py-2 w-7/12 rounded-lg shadow text-left text-black",

    CHECKBOX_LABEL: "px-2 py-2 w-11/12 text-left text-black",
    CHECKBOX: "flex flex-col",

    HEADER_LABEL: "mt-1 px-2 text-center text-gray-600 border-t border-gray-200",
    GROUPING_DIV: "w-full py-2 flex flex-row flex-wrap items-center justify-center border-b border-gray-200",
    GROUPING_INNER_DIV: "flex flex-col w-1/3 items-center justify-center border-r-2",

    PASSWORD_ENTRY_ICON: "px-2 py-2 text-black",
    REQUIRED_ENTRY_ICON: "px-2 py-2 text-red-500",
  }),

  Buttons: Object.freeze({
    SUBMIT_BUTTON: "px-2 py-2 bg-yellow-400 rounded-lg shadow text-center text-black",
    SUBMIT_BUTTON_LOADING: "px-2 py-2 bg-yellow-400 rounded-lg shadow text-center text-black font-bold",
    SUBMIT_BUTTON_LOADING_ICON: "animate-spin font-bold",
    DISABLED: " text-gray-300 line-through",
  }),
})