'use server';
import PropTypes from "prop-types";
import {ContentType, RequestType} from "@/common/constants/request_types";

/**
 * Sends a request to the backend
 * @param {string} path The path to the page wanted
 * @param {string} method The HTTP method to use
 * @param {string} jwt The JWT
 * @param {Object} body The body of the request
 * @param {AbortController} controller The controller for the request
 * @param {string} contentType The type of content being sent over to the backend
 * @returns {Promise<Response>} The outcome of the request
 */
export async function BackendRequest(path, method, jwt="", body=null, controller=null, contentType=ContentType.JSON) {
  const url = process.env.BACKEND_URL + path

  const headers = {
    method: method,
    body: body || null,
    headers: {
      "Content-Type": contentType,
    }
  }

  if (jwt !== "") {
    headers.headers.Authorization = "Bearer " + jwt
  }

  if (controller?.signal) {
    headers.signal = controller.signal
  }

  return fetch(url, headers).then(response => {
      return response.json()
  }).catch(error => {
    return error
  })
}
BackendRequest.propTypes = {
  path: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  jwt: PropTypes.string,
  body: PropTypes.object,
  controller: PropTypes.objectOf(AbortController),
  contentType: PropTypes.string,
}

/**
 * Sends a request to the backend attempting to log in
 * @param {string} email The users email
 * @param {string} password The users password
 * @returns {Promise<Response>} The outcome of the request
 */
export async function LoginRequest(email, password) {
  return await BackendRequest("login", RequestType.POST, "", new URLSearchParams({"username": email, "password": password}), null, ContentType.SECURE)
}
BackendRequest.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

// region Enum Requests
/**
 * Gets the permissions enum from the backend
 * @returns {Promise<Response>} The permissions
 */
export async function FetchPermissionsRequest() {
  return await BackendRequest("enums/permissions", RequestType.GET)
}
FetchPermissionsRequest.propTypes = {
}

/**
 * Fetches the attendance types for a training session
 * @returns {Promise<Response>} The attendance types
 */
export async function FetchAttendanceTypesRequest() {
  return await BackendRequest("enums/user_session_attendance", RequestType.GET)
}
FetchAttendanceTypesRequest.propTypes = {
}

// endregion Enum Requests

// region User Requests

/**
 * Gets all the users
 * @param {string} jwt The JWT
 * @returns {Promise<Response>} The users
 */
export async function FetchUsersRequest(jwt) {
  return await BackendRequest("users", RequestType.GET, jwt)
}
FetchUsersRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
}

/**
 * Adds a new user
 * @param {string} jwt The JWT
 * @param {object} userData The new user data
 * @returns {Promise<Response>} The new user
 */
export async function AddUserRequest(jwt, userData) {
  return await BackendRequest("users", RequestType.POST, jwt, userData)
}
AddUserRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
  userData: PropTypes.object.isRequired,
}

/**
 * Updates a user
 * @param {string} jwt The JWT
 * @param {number} userId The ID of the user
 * @param {object} userUpdates The updates to the user
 * @returns {Promise<Response>} The updated user
 */
export async function UpdateUserRequest(jwt, userId, userUpdates) {
  return await BackendRequest(`users/${userId}`, RequestType.PATCH, jwt, userUpdates)
}
UpdateUserRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  userUpdates: PropTypes.object.isRequired,
}

/**
 * Deletes a user
 * @param {string} jwt The JWT
 * @param {number} userId The ID of the user
 * @returns {Promise<Response>} Confirmation of deletion
 */
export async function DeleteUserRequest(jwt, userId) {
  return await BackendRequest(`users/${userId}`, RequestType.DELETE, jwt)
}
DeleteUserRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
}

// endregion User Requests

// region Training Session Requests

/**
 * Gets all the training sessions
 * @param {string} jwt The JWT
 * @returns {Promise<Response>} The training sessions
 */
export async function FetchTrainingSessionsRequest(jwt) {
  return await BackendRequest("training_sessions", RequestType.GET, jwt)
}
FetchTrainingSessionsRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
}

/**
 * Adds a new training session
 * @param {string} jwt The JWT
 * @param {object} sessionData The training session data
 * @returns {Promise<Response>} The training session
 */
export async function AddTrainingSessionRequest(jwt, sessionData) {
  return await BackendRequest("training_sessions", RequestType.POST, jwt, sessionData)
}
AddTrainingSessionRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
  sessionData: PropTypes.object.isRequired,
}

/**
 * Updates a training session
 * @param {string} jwt The JWT
 * @param {number} sessionId The ID of the session to update
 * @param {object} sessionData The update data
 * @returns {Promise<Response>} The response
 */
export async function UpdateTrainingSessionRequest(jwt, sessionId, sessionData) {
  return await BackendRequest(`training_sessions/${sessionId}`, RequestType.PATCH, jwt, sessionData)
}
UpdateTrainingSessionRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
  sessionId: PropTypes.number.isRequired,
  sessionData: PropTypes.object.isRequired,
}

/**
 * Deletes a training session
 * @param {string} jwt The JWT
 * @param {number} sessionId The session to delete
 * @returns {Promise<Response>} The response
 */
export async function DeleteTrainingSessionRequest(jwt, sessionId) {
  return await BackendRequest(`training_sessions/${sessionId}`, RequestType.DELETE, jwt)
}
DeleteTrainingSessionRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
  sessionId: PropTypes.number.isRequired,
}

// endregion Training Session Requests

// region Training Session Attendance Requests

/**
 * Fetches the users attendance record
 * @param {string} jwt The JWT
 * @param {number} userId The data to send
 * @returns {Promise<Response>} The users attendance record
 */
export async function FetchUserTrainingSessionAttendanceRequest(jwt, userId) {
  return await BackendRequest(`training_sessions/attendance/user/${userId}`, RequestType.GET, jwt)
}
FetchUserTrainingSessionAttendanceRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
}

/**
 * Gets the attendance for a training session
 * @param {string} jwt The JWT
 * @param {number} sessionId The ID of the session
 * @returns {Promise<Response>}
 */
export async function FetchTrainingSessionAttendanceRequest(jwt, sessionId) {
  return await BackendRequest(`training_sessions/attendance/session/${sessionId}`, RequestType.GET, jwt)
}
FetchTrainingSessionAttendanceRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
  sessionId: PropTypes.number.isRequired,
}


/**
 * Updates the users attendance to a training session
 * @param {string} jwt The JWT
 * @param {number} sessionId The ID of the training session
 * @param {string} userEmail The ID of the user
 * @param {number} attendance The new attendance
 * @returns {Promise<Response>} The updated attendance
 */
export async function UpdateTrainingSessionAttendanceRequest(jwt, sessionId, userEmail, attendance) {
  return await BackendRequest(`training_sessions/attendance?session_id=${sessionId}&user_email=${userEmail}&attendance=${attendance}`, RequestType.POST, jwt)
}
UpdateTrainingSessionAttendanceRequest.propTypes = {
  jwt: PropTypes.string.isRequired,
  sessionId: PropTypes.number.isRequired,
  userEmail: PropTypes.string.isRequired,
  attendance: PropTypes.number.isRequired,
}

// endregion Training Session Attendance Requests