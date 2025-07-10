'use client'

import {LoginPopup} from "@/app/login";
import {useEffect, useState} from "react";
import {FetchAttendanceTypesRequest, FetchPermissionsRequest} from "@/common/requests";
import {Css} from "@/common/constants/css";
import {NavBar} from "@/common/components/navBar";
import {UsersPage} from "@/app/users";
import {Button} from "@/common/components/buttons";
import {ButtonTypes} from "@/common/constants/button_types";
import Cookies from "universal-cookie";
import ValidatePermissions from "@/common/validatePermissions";
import {TrainingSessionPage} from "@/app/training_sessions";

const cookies = new Cookies()


export default function Home() {
  const [errorMessage, setErrorMessage] = useState("")
  const [requiresLogin, setRequiresLogin] = useState(true)

  const [validPermissions, setValidPermissions] = useState({})
  const [attendanceTypes, setAttendanceTypes] = useState({})

  const [page, setPage] = useState("home")

  // User Data
  const [user, setUser] = useState({})
  const [cookie, setCookie] = useState("")
  const [sessionTimeout, setSessionTimeout] = useState(new Date().toISOString())

  // Fetch Permissions and Attendance Types lists as soon as site is loaded
  useEffect(() => {

    setErrorMessage("")
    FetchPermissionsRequest().then((response) => {
        if (response.status === 200) {
          let permissions = {}
          for (let index in response.data.enum_items) {
            permissions[response.data.enum_items[index].name] = response.data.enum_items[index].value
          }
          setValidPermissions(permissions)
        } else {
          setErrorMessage(response.message)
        }
      }
    )
    FetchAttendanceTypesRequest().then((response) => {
      if (response.status === 200) {
        let responseItems = {}
        for (let index in response.data.enum_items) {
          responseItems[response.data.enum_items[index].name] = response.data.enum_items[index].value
        }
        setAttendanceTypes(responseItems)
      } else {
        setErrorMessage(response.message)
      }
    })
  }, []);


  // // region UNCOMMENT FOR DEBUGGING PURPOSES
  //
  // useEffect(() => {
  //   console.log({validPermissions})
  // }, [validPermissions]);
  //
  // useEffect(() => {
  //   console.log({attendanceTypes})
  // }, [attendanceTypes]);
  //
  // useEffect(() => {
  //   console.log({user})
  // }, [user])
  //
  // useEffect(() => {
  //   console.log({cookie})
  // }, [cookie]);
  //
  // // endregion UNCOMMENT FOR DEBUGGING PURPOSES

  function setUserData(id, forename, surname, email, permissions, sessionTimeout) {
    setUser({id: id, name: `${forename} ${surname}`, email: email, permissions: permissions})
    setCookie(cookies.get("session_x"))
    setSessionTimeout(sessionTimeout)
    setRequiresLogin(false)
  }

  function Logout() {
    setUser({})
    setCookie("")
    setPage("home")
    setRequiresLogin(true)
  }

  function GenerateCurrentPage() {
    if (page === "users") {
      return (
        <UsersPage user={user} cookie={cookie} validPermissions={validPermissions} setErrorMessage={setErrorMessage} />
      )
    } else if (page === "training_sessions") {
      return (
        <TrainingSessionPage user={user} cookie={cookie} validPermissions={validPermissions} attendanceTypes={attendanceTypes} setErrorMessage={setErrorMessage} />
      )
    } else {
      return (
        <div id={"titleDiv"} className={Css.PAGE.PAGE_TITLE_DIV}>
          <h1 id={"title"} className={Css.PAGE.PAGE_TITLE}>{`Welcome, ${user.name}`}</h1>
          <hr className={Css.PAGE.PAGE_TITLE_SEPARATOR} />
        </div>
      )
    }
  }

  return (
    <div>
      {errorMessage && errorMessage !== "" ?
        <div id={"errorMessage"} className={Css.Error.ERROR_DIV}>
          {errorMessage}
          <Button
            name={"clearErrorMessage"}
            type={ButtonTypes.BUTTON}
            className={Css.Error.CLEAR_ERROR}
            onClick={() => setErrorMessage("")}>
            X
          </Button>
        </div> : null}
      {requiresLogin ? <LoginPopup setUserData={setUserData} setErrorMessage={setErrorMessage} /> : null}
      <NavBar user={user} validPermissions={validPermissions} onSetPage={setPage} onLogout={Logout}/>
      <div id={"page"} className={"relative left-1/12 w-11/12 h-screen overflow-y-auto bg-black"}>
        {GenerateCurrentPage()}
      </div>
    </div>
  )
}
