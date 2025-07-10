'use client';

import {Css} from "@/common/constants/css";
import PropTypes from "prop-types";
import Form from "next/form";
import {Button} from "@/common/components/buttons";
import {ButtonTypes} from "@/common/constants/button_types";

/**
 * A popup in the center of the screen
 * @param {string} title The title of the popup
 * @param {string} description The description of the popup
 * @param {function} onSubmit The function to call once the form is submitted
 * @param {function} onClose The function to call once the popup has been closed without submitting
 * @param {boolean} disableClose Whether to disable being able to close the popup
 * @param {JSX.Element} children The children of this popup
 * @returns {JSX.Element} The popup
 */
export default function Popup({title, description, onSubmit, onClose, disableClose, children}) {
    return (
        <div className={Css.Popup.POPUP_DIV}>
          <Form className={Css.Popup.POPUP_BACKGROUND} onSubmit={onSubmit}>
            {disableClose ? null :
              <div className={Css.Popup.CLOSE_POPUP}>
              <Button
                name={"closePopup"}
                className={Css.Popup.CLOSE_POPUP}
                type={ButtonTypes.BUTTON}
                onClick={onClose}
              >
                X
              </Button>
              </div>
            }
            <p className={Css.Popup.POPUP_TITLE}>
              {title}
            </p>
            <p className={Css.Popup.POPUP_DESCRIPTION}>{description}</p>
            {children}
          </Form>
        </div>
    );
}
Popup.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  disableClose: PropTypes.bool,
  children: PropTypes.node.isRequired,
}
