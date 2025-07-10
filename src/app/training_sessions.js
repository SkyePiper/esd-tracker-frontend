'use client'

import {useEffect, useState} from "react";
import {
  AddTrainingSessionRequest, DeleteTrainingSessionRequest,
  FetchAttendanceTypesRequest, FetchTrainingSessionAttendanceRequest,
  FetchTrainingSessionsRequest,
  FetchUserTrainingSessionAttendanceRequest, UpdateTrainingSessionAttendanceRequest, UpdateTrainingSessionRequest
} from "@/common/requests";
import Popup from "@/common/components/popup";
import {CheckboxEntry, DateEntry} from "@/common/components/entries";
import {Css} from "@/common/constants/css";
import {Button, LoadingButton} from "@/common/components/buttons";
import ValidateBitmask from "@/common/validatePermissions";
import {ButtonTypes} from "@/common/constants/button_types";
import PropTypes from "prop-types";

/**
 * Popup for adding a training session
 * @param {string} cookie The JWT from the cookie
 * @param {function} onClose The method to call when the popup is closed
 * @param {function} setErrorMessage The method to call when setting an error
 * @returns {JSX.Element} The popup
 */
const AddTrainingSessionPopup = ({cookie, onClose, setErrorMessage}) => {
  const [loading, setLoading] = useState(false)

  const [sessionDateTime, setSessionDateTime] = useState(new Date().toISOString().slice(0, -5))

  async function OnSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setErrorMessage("")

    const requestData = JSON.stringify({
      id: -1,
      created: new Date().toISOString(),
      datetime: new Date(Date.parse(sessionDateTime)).toISOString(),
    })

    const response = await AddTrainingSessionRequest(cookie, requestData)
    if (response?.status === 200) {
      onClose()
    } else if (response?.message) {
      setErrorMessage(response.message)
    } else {
      setErrorMessage("Unable to add training session")
    }

    setLoading(false)
  }

  return (
    <Popup title={"Add Training Session"} onSubmit={OnSubmit} description={"Add Training Session"} onClose={onClose}>
      <DateEntry
        name={"datetimeEntry"}
        className={Css.Entries.ENTRY_TEXT}
        labelText={"Session Time"}
        defaultValue={sessionDateTime}
        onChange={(event) => setSessionDateTime(event.target.value)}
        required={true}
      />
      <LoadingButton name={"submitButton"} text={"Add Training Session"} loading={loading} />
    </Popup>
  )
}
AddTrainingSessionPopup.propTypes = {
  cookie: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}


/**
 * Popup for editing a training session, including doing attendance
 * @param {object} session The training session being edited
 * @param {object} attendanceTypes The types of attendance
 * @param {string} cookie The cookie containing the JWT
 * @param {function} onClose The method to call once the popup is closed
 * @param {function} setErrorMessage The method to call to set the error message
 * @returns {JSX.Element} The popup
 */
const EditTrainingSessionPopup = ({session, attendanceTypes, cookie, onClose, setErrorMessage}) => {
  const [loading, setLoading] = useState(false)

  const [sessionDateTime, setSessionDateTime] = useState(new Date(Date.parse(session.datetime)).toISOString().slice(0, -5))
  const [attendance, setAttendance] = useState(null)
  const [attendanceCopy, setAttendanceCopy] = useState(null)

  // Load the attendance when the popup is loaded
  useEffect(() => {
    setLoading(true)
    setErrorMessage("")

    FetchTrainingSessionAttendanceRequest(cookie, session.id).then((response) => {
      if (response?.status === 200) {
        let responseItems = {}
        for (let index in response.data) {
          responseItems[response.data[index].email] = response.data[index]
        }
        setAttendance(responseItems)
      } else if (response?.message) {
        setErrorMessage(response.message)
      } else {
        setErrorMessage("Unable to get attendance")
      }

      setLoading(false)
    })
  }, []);

  useEffect(() => {
    if (attendanceCopy === null) {
      setAttendanceCopy(attendance)
    }
  }, [attendance]);

  // // region UNCOMMENT FOR DEBUGGING PURPOSES
  // useEffect(() => {
  //   console.log({attendance})
  // }, [attendance]);
  //
  // useEffect(() => {
  //   console.log({attendanceCopy})
  // }, [attendanceCopy]);
  //
  // useEffect(() => {
  //   console.log(typeof sessionDateTime)
  //   console.log(sessionDateTime)
  // }, [sessionDateTime]);
  // // endregion UNCOMMENT FOR DEBUGGING PURPOSES

  function UpdateAttendance(event, user) {
    let attendanceUpdates = {...attendance}
    attendanceUpdates[user].attendance_type = event.target.checked ? attendanceTypes["Attended"] : attendanceTypes["No Show"]

    setAttendance(attendanceUpdates)
  }

  async function OnSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setErrorMessage("")

    let errorMessages = []

    const updateData = JSON.stringify({datetime: new Date(Date.parse(sessionDateTime)).toISOString()})
    const response = await UpdateTrainingSessionRequest(cookie, session.id, updateData)
    if (response?.status === 200) {
      // Do nothing here as we want to check the attendance bits before closing
    } else if (response?.message) {
      errorMessages.push(response.message)
    } else {
      errorMessages.push("Unable to update training session")
    }

    // Figure out what attendance needs updating
    let updatedAttendance = Object.getOwnPropertyNames(attendance).map((item) => {
      return attendance[item].attendance_type === attendanceCopy[item].attendance_type ? undefined : attendance[item]
    }).filter(function(element) {return element !== undefined})

    let attendanceRequests = []
    for (const update of updatedAttendance) {
      attendanceRequests.push(UpdateTrainingSessionAttendanceRequest(cookie, session.id, update.email, update.attendance_type))
    }

    // Update the attendance
    await Promise.allSettled(
      attendanceRequests
    ).then((responses) => {
      for (const response of responses) {
        if (response.value.data) {
          // Successful request, do nothing
        } else if (response.value.detail) {
          errorMessages.push(response.value.detail)
        } else {
          errorMessages.push("Unable to update the attendance of a user")
        }
      }
    })

    errorMessages = errorMessages.filter(function(element) {return element !== undefined})
    if (errorMessages.length > 0) {
      let errorMessage = ""
      for (const message of errorMessages) {
        errorMessage += message + "; "
      }

      setErrorMessage(errorMessage)
    } else {
      onClose()
    }

    setLoading(false)
  }

  return attendance ? (
    <Popup
      title={"Edit Training Session"}
      onSubmit={OnSubmit}
      description={`Edit Training Session "${(new Date(Date.parse(session.datetime))).toString()}"`}
      onClose={onClose}
    >
      <DateEntry
        name={"datetimeEntry"}
        className={Css.Entries.ENTRY_TEXT}
        labelText={"Session Time"}
        defaultValue={sessionDateTime}
        onChange={(event) => setSessionDateTime(event.target.value)}
        required={true}
      />
      <p className={Css.Entries.HEADER_LABEL}>Attendance</p>
      <div id={"attendanceCheckboxes"} className={Css.Entries.GROUPING_DIV}>
        {Object.getOwnPropertyNames(attendance).map((item) => (
            <div key={item} className={Css.Entries.GROUPING_INNER_DIV}>
              <CheckboxEntry
                name={`${item}Checkbox`}
                className={Css.Entries.CHECKBOX}
                labelText={`${attendance[item].forename} ${attendance[item].surname}`}
                onChange={(event) => UpdateAttendance(event, item)}
                checked={attendance[item].attendance_type === attendanceTypes["Attended"]}
              />
            </div>
          )
        )}
      </div>
      <LoadingButton name={"submitButton"} text={"Update Training Session"} loading={loading}/>
    </Popup>
  ) : (
    <Popup
      title={"Edit Training Session"}
      onSubmit={OnSubmit}
      description={`Edit Training Session "${(new Date(Date.parse(session.datetime))).toString()}"`}
      onClose={onClose}
    >
      <LoadingButton name={"submitButton"} text={"Update Training Session"} loading={loading}/>
    </Popup>
  )
}
EditTrainingSessionPopup.propTypes = {
  session: PropTypes.object.isRequired,
  attendanceTypes: PropTypes.array.isRequired,
  cookie: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}


/**
 * Popup to delete a training session
 * @param {object} session The session to delete
 * @param {string} cookie The JWT cookie data
 * @param {function} onClose The method to call when the popup is closed
 * @param {function} setErrorMessage The method to call to show an error
 * @returns {JSX.Element} The popup
 */
const DeleteTrainingSessionPopup = ({session, cookie, onClose, setErrorMessage}) => {
  const [loading, setLoading] = useState(false)

  async function OnSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setErrorMessage("")

    const response = await DeleteTrainingSessionRequest(cookie, session.id)
    if (response?.status === 200) {
      onClose()
    } else if (response?.message) {
      setErrorMessage(response.message)
    } else {
      setErrorMessage("Unable to delete training session")
    }

    setLoading(false)
  }

  return (
    <Popup
      title={"Delete Training Session"}
      onSubmit={OnSubmit}
      description={`Are you sure you want to delete the training session ${(new Date(Date.parse(session.datetime))).toString()}`}
      onClose={onClose}
    >
      <LoadingButton name={"submitButton"} text={"Delete Training Session"} loading={loading} />
    </Popup>
  )
}
DeleteTrainingSessionPopup.propTypes = {
  session: PropTypes.object.isRequired,
  cookie: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}
export const TrainingSessionPage = ({user, cookie, validPermissions, attendanceTypes, setErrorMessage}) => {
  const [fetch, setFetch] = useState(true)
  const [data, setData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  const [showAddPopup, setShowAddPopup] = useState(false)
  const [showEditPopup, setShowEditPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  const [disableAddPopup, setDisableAddPopup] = useState(true)

  const [attendance, setAttendance] = useState([])

  // Enable/disable Add Popup on page load-up
  useEffect(() => {
    setDisableAddPopup(!ValidateBitmask(user.permissions, [validPermissions["Administer"], validPermissions["Add Training Session"]]))
  }, []);

  // Fetch training sessions when needed
  useEffect(() => {
    if (!fetch) {
      return
    }

    setErrorMessage("")

    FetchTrainingSessionsRequest(cookie).then((response) => {
      if (response.status === 200) {
        setData(response.data)
      } else {
        setErrorMessage(response.message)
      }
    }).catch((error) => setErrorMessage(error))

    FetchUserTrainingSessionAttendanceRequest(cookie, user.id).then((response) => {
      if (response?.status === 200) {
        setAttendance(response.data)
      } else {
        setErrorMessage(response.message)
      }
    }).catch((error) => setErrorMessage(error))

    setFetch(false)
  }, [fetch]);

  // // region UNCOMMENT FOR DEBUGGING PURPOSES
  //
  // useEffect(() => {
  //   console.log({data})
  // }, [data]);
  //
  // useEffect(() => {
  //   console.log({attendance})
  // }, [attendance]);
  //
  // // endregion UNCOMMENT FOR DEBUGGING PURPOSES

  function ShowAddPopup() {
    setShowAddPopup(true)
  }
  function CloseAddPopup() {
    setShowAddPopup(false)
    setFetch(true)
  }

  function ShowEditPopup(item) {
    setSelectedItem(item)
    setShowEditPopup(true)
  }
  function CloseEditPopup() {
    setSelectedItem(null)
    setShowEditPopup(false)
    setFetch(true)
  }

  function ShowDeletePopup(item) {
    setSelectedItem(item)
    setShowDeletePopup(true)
  }
  function CloseDeletePopup() {
    setSelectedItem(null)
    setShowDeletePopup(false)
    setFetch(true)
  }

  async function UpdateAttendance(event, sessionId, newAttendance) {
    event.preventDefault()

    if (newAttendance === null) {
      return
    }

    setErrorMessage("")

    const response = await UpdateTrainingSessionAttendanceRequest(cookie, sessionId, user.id, newAttendance)

    if (response?.status === 200) {
      setFetch(true)
    } else if (response?.message) {
      setErrorMessage(response.message)
    } else {
      setErrorMessage("Unable to update attendance")
    }
  }

  function GenerateItemList() {
    const editPermissions = [validPermissions["Administer"], validPermissions["Update Training Sessions"]]
    const editDisabled = !ValidateBitmask(user.permissions, editPermissions)

    const deletePermissions = [validPermissions["Administer"], validPermissions["Delete Training Sessions"]]
    const deleteDisabled = !ValidateBitmask(user.permissions, deletePermissions)

    const reverseOrder = data.sort((a, b) => a.id - b.id).reverse()

    return reverseOrder?.map((item) => {
      const itemAttendance = attendance.find((value) => value.training_session_id === item.id)

      let attendanceText
      let updateAttendanceValue = null

      if (ValidateBitmask(itemAttendance?.user_attendance_type, [attendanceTypes["Signed Up"]])) {
        attendanceText = "Attending"
        updateAttendanceValue = attendanceTypes["No Longer Attending"]
      } else if (ValidateBitmask(itemAttendance?.user_attendance_type, [attendanceTypes["No Longer Attending"]])) {
        attendanceText = "Not Attending"
        updateAttendanceValue = attendanceTypes["Signed Up"]
      } else if (ValidateBitmask(itemAttendance?.user_attendance_type, [attendanceTypes["Attended"]])) {
        attendanceText = "Attended"
      } else if (ValidateBitmask(itemAttendance?.user_attendance_type, [attendanceTypes["No Show"]])) {
        attendanceText = "No Show"
      } else {
        attendanceText = "Not Attending"
      }

      const disableUpdateAttendance = Date.parse(item.datetime) < new Date()

      return (
        <div key={item.id} className={Css.PAGE_LIST.PAGE_LIST_ITEM_DIV}>
          <div key={item.id + "-data"} className={Css.PAGE_LIST.PAGE_LIST_ITEM_DATA_DIV}>
            <div key={item.id} className={Css.PAGE_LIST.PAGE_LIST_NAME_DIV}>
              {(new Date(Date.parse(item.datetime))).toString()}
            </div>
            <div key={item.id + "-buttons"} className={Css.PAGE_LIST.PAGE_LIST_BUTTONS_DIV}>
              <Button
                name={item.id + "attendance-switch-button"}
                type={ButtonTypes.BUTTON}
                className={Css.PAGE_LIST.PAGE_LIST_BUTTON + (disableUpdateAttendance ? Css.Buttons.DISABLED : " text-yellow-400")}
                onClick={(event) => UpdateAttendance(
                  event,
                  item.id,
                  updateAttendanceValue
                )}
                disabled={disableUpdateAttendance}
              >
                {attendanceText}
              </Button>
              <Button
                name={`edit-${item.id}`}
                type={ButtonTypes.BUTTON}
                className={Css.PAGE_LIST.PAGE_LIST_BUTTON + (editDisabled ? Css.Buttons.DISABLED : " text-yellow-400")}
                disabled={editDisabled}
                onClick={() => ShowEditPopup(item)}
              >
              Edit
              </Button>
              <Button
                name={`delete-${item.id}`}
                type={ButtonTypes.BUTTON}
                className={Css.PAGE_LIST.PAGE_LIST_BUTTON + (deleteDisabled ? Css.Buttons.DISABLED : " text-red-400")}
                disabled={deleteDisabled}
                onClick={() => ShowDeletePopup(item)}
              >
              Delete
              </Button>
            </div>
          </div>
        </div>
      )
    })
  }

  return data ? (
    <div id={"trainingSessionsPage"} className={Css.PAGE.PAGE_DIV}>
      {showAddPopup ?
        <AddTrainingSessionPopup
          cookie={cookie}
          onClose={CloseAddPopup}
          setErrorMessage={setErrorMessage}
        /> : null
      }
      {showEditPopup ?
        <EditTrainingSessionPopup
          session={selectedItem}
          attendanceTypes={attendanceTypes}
          cookie={cookie}
          onClose={CloseEditPopup}
          setErrorMessage={setErrorMessage}
        /> : null
      }
      {
        showDeletePopup ?
          <DeleteTrainingSessionPopup
            session={selectedItem}
            cookie={cookie}
            onClose={CloseDeletePopup}
            setErrorMessage={setErrorMessage}
          /> : null
      }

      <div id={"titleDiv"} className={Css.PAGE.PAGE_TITLE_DIV}>
        <h1 id={"title"} className={Css.PAGE.PAGE_TITLE}>Training Sessions</h1>
        <hr className={Css.PAGE.PAGE_TITLE_SEPARATOR} />
      </div>
      <div id={"pageContent"} className={Css.PAGE.PAGE_CONTENT_DIV}>
        <div id={"addButtonDiv"} className={Css.PAGE.ADD_BUTTON_DIV}>
          <Button
            name={"addButton"}
            type={ButtonTypes.BUTTON}
            className={Css.PAGE.ADD_BUTTON + (disableAddPopup ? Css.Buttons.DISABLED : "border-yellow-400  text-yellow-400")}
            onClick={ShowAddPopup}
          >
            Add Training Session
          </Button>
        </div>
        {GenerateItemList()}
      </div>
    </div>
  ) : null
}