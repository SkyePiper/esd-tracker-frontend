/**
 * Validates that a user has a permission
 * @param {number} userPermissions The users permissions
 * @param {object} validPermissions The permissions that can be used
 * @returns {boolean} Whether the user has the correct permissions
 */
export default function ValidatePermissions(userPermissions, validPermissions) {
  if (!userPermissions && !validPermissions) {
    return false
  }

  for (const permission of validPermissions) {
    if (userPermissions & permission) {
      // console.log({userPermissions: userPermissions, validPermissions: validPermissions, valid: true})

      return true
    }
  }
  // console.log({userPermissions: userPermissions, validPermissions: validPermissions, valid: false})

  return false
}