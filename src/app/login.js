'use client'

import {useEffect, useState} from "react";
import Popup from "@/common/components/popup";
import {LoginRequest} from "@/common/requests";
import {EmailEntry, PasswordEntry} from "@/common/components/entries";
import {LoadingButton} from "@/common/components/buttons";
import {Css} from "@/common/constants/css";

import Cookies from "universal-cookie";
import PropTypes from "prop-types";

const cookies = new Cookies()

/**
 * The popup for the User Login
 * @param {function} setUserData The method to call upon a successful login
 * @param {function} setErrorMessage The method to call to display a error message
 * @returns {JSX.Element} The Login popup
 */
export const LoginPopup = ({setUserData, setErrorMessage}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function Login(event) {
    event.preventDefault()

    setLoading(true)
    setErrorMessage("")

    const userData = await LoginRequest(email, password)
    if (userData?.data) {
      cookies.set("session_x", userData.access_token, {
        path: "/",
        maxAge: 60 * 60,
        sameSite: "lax"
      })

      setUserData(userData.data.user_id, userData.data.user_forename, userData.data.user_surname, userData.data.user_email, userData.data.permissions, userData.data.expires)
    } else if (userData?.message) {
      setErrorMessage(userData.message)
    } else {
      setErrorMessage("Unable to log in")
    }

    setLoading(false)
  }

  return (
    <Popup title={"Login"} description={"Please login to continue"} onSubmit={Login} disableClose={true}>
      <EmailEntry name={"emailEntry"} className={Css.Entries.ENTRY_TEXT} placeholder={"Enter Email..."} labelText={"Email:"} onChange={(event) => setEmail(event.target.value)} required={true}/>
      <PasswordEntry name={"passwordEntry"} className={Css.Entries.ENTRY_TEXT} placeholder={"Enter Password..."} labelText={"Password:"} onChange={(event) => setPassword(event.target.value)} required={true}/>
      <LoadingButton name={"loginButton"} text={"Login!"} loading={loading} />
    </Popup>
  );
}
LoginPopup.propTypes = {
  setUserData: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}