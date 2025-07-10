/**
 * The type of request this is
 */
export const RequestType = Object.freeze({
  "GET": "GET",
  "POST": "POST",
  "PATCH": "PATCH",
  "DELETE": "DELETE",
})

export const ContentType = Object.freeze({
  "JSON": "application/json",
  "SECURE": "application/x-www-form-urlencoded",
})