'use client'


import {Css} from "@/common/constants/css";
import PropTypes from "prop-types";
import ValidatePermissions from "@/common/validatePermissions";
import {Button} from "@/common/components/buttons";
import {ButtonTypes} from "@/common/constants/button_types";
import {useRouter} from "next/navigation";

/**
 * An item in the NavBar
 * @param {string} text The text to display on the nav bar
 * @param {function} onClick The function to call once the item is clicked
 * @returns {JSX.Element} The Nav Bar item
 */
const NavBarItem = ({text, onClick}) => {
  return (
    <div>
      <Button name={`navBarItem${text}`} type={ButtonTypes.BUTTON} className={Css.NAV_BAR.NAV_BAR_ITEM} onClick={onClick}>
        <p>{text}</p>
      </Button>
      <hr className={Css.NAV_BAR.NAV_BAR_ITEM_SEPARATOR}/>
    </div>
  )
}
NavBarItem.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}


/**
 * The main navigation for the pages
 * @param {number} user The permissions of the user
 * @param {object} validPermissions The valid permissions fetched from the backend
 * @param {function} onSetPage The method to call when changing page
 * @param {function} onLogout The method to call when the logout button is pressed
 * @returns {JSX.Element}
 */
export const NavBar = ({user, validPermissions, onSetPage, onLogout}) => {

  return user?.permissions && validPermissions ? (
    <div id={"navBar"} className={Css.NAV_BAR.NAV_BAR_DIV}>
      <NavBarItem text={"Home"} onClick={() => onSetPage("home")} />
      {ValidatePermissions(user.permissions, [validPermissions["Administer"], validPermissions["Get Training Session"]]) ?
        <NavBarItem text={"Training Sessions"} onClick={() => onSetPage("training_sessions")}/> : null
      }
      {ValidatePermissions(user.permissions, [validPermissions["Administer"], validPermissions["Get User"]]) ?
        <NavBarItem text={"Users"} onClick={() => onSetPage("users")}/> : null
      }

      <div id={"userAccount"} className={Css.NAV_BAR.USER_ACCOUNT}>
        {user.name || "Unknown User"}
        <Button name={"logoutButton"} type={ButtonTypes.Button} className={Css.NAV_BAR.LOGOUT_BUTTON} onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  ) : null
}
NavBar.propTypes = {
  user: PropTypes.object.isRequired,
  validPermissions: PropTypes.object.isRequired,
  onSetPage: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
}