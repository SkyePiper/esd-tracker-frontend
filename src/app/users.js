'use client'

import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {AddUserRequest, DeleteUserRequest, FetchUsersRequest, UpdateUserRequest} from "@/common/requests";
import {Css} from "@/common/constants/css";
import {Button, LoadingButton} from "@/common/components/buttons";
import {ButtonTypes} from "@/common/constants/button_types";
import ValidatePermissions from "@/common/validatePermissions";
import Popup from "@/common/components/popup";
import {CheckboxEntry, EmailEntry, PasswordEntry, TextEntry} from "@/common/components/entries";

/**
 * Popup to allow for addition of new user
 * @param {object} validPermissions All the valid permissions
 * @param {string} cookie The JWT cookie data
 * @param {function} onClose The method to call when the popup is closed
 * @param {function} setErrorMessage The method to call tos et the error emssage
 * @returns {JSX.Element} The popup
 */
const AddUserPopup = ({validPermissions, cookie, onClose, setErrorMessage}) => {
  const [loading, setLoading] = useState(false)

  const [forename, setForename] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [permissions, setPermissions] = useState(0)

  function UpdatePermissionValue(value) {
    if (permissions ^ value) {
      setPermissions(permissions ^ value)
    } else {
      setPermissions(permissions & value)
    }
  }

  async function OnSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setErrorMessage("")

    const newUserData = JSON.stringify({
      id: -1,
      forename: forename,
      surname: surname,
      email: email,
      permissions: permissions,
      password: password,
    })

    const response = await AddUserRequest(cookie, newUserData)
    if (response?.status === 200) {
      onClose()
    } else if (response?.message) {
      setErrorMessage(response.message)
    } else {
      setErrorMessage("Unable to add new user")
    }

    setLoading(false)
  }

  return (
    <Popup title={"Add User"} onSubmit={OnSubmit} description={"Add a new user"} onClose={onClose}>
      <TextEntry
        name={"forenameEntry"}
        className={Css.Entries.ENTRY_TEXT}
        placeholder={"Forename..."}
        labelText={"Forename:"}
        onChange={(event) => setForename(event.target.value)}
        required={true}
      />
      <TextEntry
        name={"surnameEntry"}
        className={Css.Entries.ENTRY_TEXT}
        placeholder={"Surname..."}
        labelText={"Surname:"}
        onChange={(event) => setSurname(event.target.value)}
        required={true}
      />
      <EmailEntry
        name={"emailEntry"}
        className={Css.Entries.ENTRY_TEXT}
        placeholder={"Email..."}
        labelText={"Email:"}
        onChange={(event) => setEmail(event.target.value)}
        required={true}
      />
      <PasswordEntry
        name={"passwordEntry"}
        className={Css.Entries.ENTRY_TEXT}
        placeholder={"Password..."}
        labelText={"Password:"}
        onChange={(event) => setPassword(event.target.value)}
        required={true}
      />
      <p className={Css.Entries.HEADER_LABEL}>Select Permissions</p>
      <div id={"permissionCheckboxes"} className={Css.Entries.GROUPING_DIV}>
        {Object.getOwnPropertyNames(validPermissions).map((permission) => (
          <div key={permission} className={"flex flex-col w-1/3 items-center justify-center border-r-2"}>
            <CheckboxEntry
              name={`${permission}Checkbox`}
              className={"flex flex-col"}
              labelText={permission}
              onChange={() => UpdatePermissionValue(validPermissions[permission])}
              disabled={permission === "Administer"}
            />
          </div>
        ))}
      </div>
      <LoadingButton name={"submitButton"} text={"Add User"} loading={loading} />
    </Popup>
  )
}
AddUserPopup.propTypes = {
  validPermissions: PropTypes.object.isRequired,
  cookie: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}


/**
 * Popup to allow for editing of a user
 * @param {object} userToEdit The user to edit
 * @param {object} validPermissions All the valid permissions
 * @param {string} cookie The JWT cookie data
 * @param {function} onClose The method to call when the popup is closed
 * @param {function} setErrorMessage The method to call to set the error message
 * @returns {JSX.Element} The popup
 */
const EditUserPopup = ({userToEdit, validPermissions, cookie, onClose, setErrorMessage}) => {

  const [loading, setLoading] = useState(false);

  // User details
  const [forename, setForename] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [permissions, setPermissions] = useState(-1)

  useEffect(() => {
    setForename(userToEdit.forename)
    setSurname(userToEdit.surname)
    setEmail(userToEdit.email)
    setPermissions(userToEdit.permissions)
  }, [userToEdit])

  function UpdatePermissionValue(value) {
    if (permissions ^ value) {
      setPermissions(permissions ^ value)
    } else {
      setPermissions(permissions & value)
    }
  }

  async function OnSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setErrorMessage("")

    const updateData = JSON.stringify({
      forename: forename,
      surname: surname,
      last_training_date: userToEdit.last_training_date,
      next_training_date: userToEdit.next_training_date,
      email: email,
      permissions: permissions,
    })

    const response = await UpdateUserRequest(cookie, userToEdit.id, updateData)
    if (response?.status === 200) {
      onClose()
    } else if (response?.message) {
      setErrorMessage(response.message)
    } else {
      setErrorMessage("Unable to update user")
    }

    setLoading(false)
  }

  return (
    <Popup title={"Edit User"} onSubmit={OnSubmit} description={"Edit a users' details"} onClose={onClose}>
      <TextEntry
        name={"forenameEntry"}
        className={Css.Entries.ENTRY_TEXT}
        placeholder={"Forename..."}
        text={userToEdit.forename}
        labelText={"Forename:"}
        onChange={(event) => setForename(event.target.value)}
        required={true}
      />
      <TextEntry
        name={"surnameEntry"}
        className={Css.Entries.ENTRY_TEXT}
        placeholder={"Surname..."}
        text={userToEdit.surname}
        labelText={"Surname:"}
        onChange={(event) => setSurname(event.target.value)}
        required={true}
      />
      <EmailEntry
        name={"emailEntry"}
        className={Css.Entries.ENTRY_TEXT}
        placeholder={"Email..."}
        text={userToEdit.email}
        labelText={"Email:"}
        onChange={(event) => setEmail(event.target.value)}
        required={true}
      />
      <p className={Css.Entries.HEADER_LABEL}>Select Permissions</p>
      <div id={"permissionCheckboxes"} className={Css.Entries.GROUPING_DIV}>
        {Object.getOwnPropertyNames(validPermissions).map((permission) => (
          <div key={permission} className={Css.Entries.GROUPING_INNER_DIV}>
            <CheckboxEntry
              name={`${permission}Checkbox`}
              className={Css.Entries.CHECKBOX}
              labelText={permission}
              onChange={() => UpdatePermissionValue(validPermissions[permission])}
              checked={ValidatePermissions(permissions, [validPermissions[permission]])}
              disabled={permission === "Administer"}
            />
          </div>
        ))}
      </div>
      <LoadingButton name={"submitButton"} text={"Update User"} loading={loading} />
    </Popup>
  )
}
EditUserPopup.propTypes = {
  userToEdit: PropTypes.object.isRequired,
  validPermissions: PropTypes.object.isRequired,
  cookie: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}

/**
 * Popup to delete a user
 * @param {object} selectedUser The user to delete
 * @param {string} cookie The JWT cookie data
 * @param {function} onClose The method to call when the popup is closed
 * @param {function} setErrorMessage The method to call to show an error
 * @returns {JSX.Element} The popup
 */
const DeleteUserPopup = ({selectedUser, cookie, onClose, setErrorMessage}) => {
  const [loading, setLoading] = useState(false)

  async function OnSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setErrorMessage("")

    const response = await DeleteUserRequest(cookie, selectedUser.id)
    if (response?.status === 200) {
      onClose()
    } else if (response?.message) {
      setErrorMessage(response.message)
    } else {
      setErrorMessage("Unable to delete user")
    }

    setLoading(false)
  }

  return (
    <Popup
      title={"Delete User"}
      onSubmit={OnSubmit}
      description={`Are you sure you want to delete the user ${selectedUser.forename} ${selectedUser.surname}`}
      onClose={onClose}
    >
      <LoadingButton name={"submitButton"} text={"Delete User"} loading={loading} />
    </Popup>
  )
}
DeleteUserPopup.propTypes = {
  selectedUser: PropTypes.object.isRequired,
  cookie: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}

export const UsersPage = ({user, cookie, validPermissions, setErrorMessage}) => {

  const [fetch, setFetch] = useState(true)
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null)

  const [showAddPopup, setShowAddPopup] = useState(false)
  const [showEditPopup, setShowEditPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  const [disableAddPopup, setDisableAddPopup] = useState(true)

  // Enable/disable Add User on page loadup
  useEffect(() => {
    setDisableAddPopup(!ValidatePermissions(user.permissions, [validPermissions["Administer"], validPermissions["Add User"]]))
  }, []);

  // Fetch users when needed
  useEffect(() => {
    if (!fetch) {
      return
    }
    setErrorMessage("");
    FetchUsersRequest(cookie).then((response) => {
      if (response.status === 200) {
        setData(response.data)
      } else {
        setErrorMessage(response.message)
      }
    })

    setFetch(false)
  }, [fetch]);

  // // region UNCOMMENT FOR DEBUGGING PURPOSES
  //
  // useEffect(() => {
  //   console.log({users})
  // }, [users]);
  //
  // // endregion UNCOMMENT FOR DEBUGGING PURPOSES

  function ShowAddPopup() {
    setShowAddPopup(true)
  }
  function CloseAddPopup() {
    setShowAddPopup(false)
    setFetch(true)
  }

  function ShowEditPopup(userSelected) {
    setSelected(userSelected)
    setShowEditPopup(true)
  }
  function CloseEditPopup() {
    setSelected(null)
    setShowEditPopup(false)
    setFetch(true)
  }

  function ShowDeletePopup(userSelected) {
    setSelected(userSelected)
    setShowDeletePopup(true)
  }
  function CloseDeletePopup() {
    setSelected(null)
    setShowDeletePopup(false)
    setFetch(true)
  }

  function GenerateUsersList() {
    return data.map((item) => {
      let editPermissions = [validPermissions["Administer"], validPermissions["Update Other Users"]]
      if (user.email === item.email) {
        editPermissions.push(validPermissions["Update Self"])
      }
      const editDisabled = !ValidatePermissions(user.permissions, editPermissions)

      let deletePermissions = [validPermissions["Administer"], validPermissions["Delete Users"]]
      const deleteDisabled = !ValidatePermissions(user.permissions, deletePermissions)

      return (
        <div key={`user-${item.id}`} className={Css.PAGE_LIST.PAGE_LIST_ITEM_DIV}>
          <div key={`user-${item.id}-data`} className={Css.PAGE_LIST.PAGE_LIST_ITEM_DATA_DIV}>
            <div id={`user-${item.id}-name`} className={Css.PAGE_LIST.PAGE_LIST_NAME_DIV}>
              {item.forename} {item.surname}
            </div>
            <div key={`user-${item.id}-buttons`} className={Css.PAGE_LIST.PAGE_LIST_BUTTONS_DIV}>
              <Button
                name={`edit-user-${item.id}`}
                type={ButtonTypes.BUTTON}
                className={Css.PAGE_LIST.PAGE_LIST_BUTTON + (editDisabled ? Css.Buttons.DISABLED : " text-yellow-400")}
                disabled={editDisabled}
                onClick={() => ShowEditPopup(item)}
              >
                Edit
              </Button>
              <Button
                name={`delete-user-${item.id}`}
                type={ButtonTypes.BUTTON}
                className={Css.PAGE_LIST.PAGE_LIST_BUTTON + (deleteDisabled ? Css.Buttons.DISABLED : " text-red-400")}
                disabled={deleteDisabled}
                onClick={() => ShowDeletePopup(item)}
              >
                Delete
              </Button>
            </div>
          </div>
          <hr
            className={Css.PAGE_LIST.PAGE_LIST_RULE}/>
        </div>
      )
    })
  }

  return data ? (
    <div id={"usersPage"} className={Css.PAGE.PAGE_DIV} >
      {showAddPopup ?
        <AddUserPopup
          validPermissions={validPermissions}
          cookie={cookie}
          onClose={CloseAddPopup}
          setErrorMessage={setErrorMessage}
        /> : null
      }
      {
        selected && showEditPopup ?
          <EditUserPopup
            userToEdit={selected}
            validPermissions={validPermissions}
            cookie={cookie}
            onClose={CloseEditPopup}
            setErrorMessage={setErrorMessage}
          /> : null
      }
      {
        selected && showDeletePopup ?
          <DeleteUserPopup
            selectedUser={selected}
            cookie={cookie}
            onClose={CloseDeletePopup}
            setErrorMessage={setErrorMessage}
          /> : null
      }

      <div id={"usersTitleDiv"} className={Css.PAGE.PAGE_TITLE_DIV}>
        <h1 id={"usersTitle"} className={Css.PAGE.PAGE_TITLE}>Users</h1>
        <hr className={Css.PAGE.PAGE_TITLE_SEPARATOR} />
      </div>
      <div id={"usersPageContent"} className={Css.PAGE.PAGE_CONTENT_DIV}>
        <div id={"addUser"} className={Css.PAGE.ADD_BUTTON_DIV}>
          <Button
            name={"addUserButton"}
            type={ButtonTypes.BUTTON}
            className={Css.PAGE.ADD_BUTTON + (disableAddPopup ? Css.Buttons.DISABLED : "border-yellow-400  text-yellow-400")}
            onClick={ShowAddPopup}
          >
            Add User
          </Button>
        </div>
        {GenerateUsersList()}
      </div>
    </div>
  ) : null
}
UsersPage.propTypes = {
  user: PropTypes.object.isRequired,
  cookie: PropTypes.string.isRequired,
  validPermissions: PropTypes.object.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}