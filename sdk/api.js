/**
 * PingOne authentication flow and OpenID Connect/OAuth 2 protocol API.
 *
 * Contains functions that correspond to steps needed to make it through a PingOne authentication flow.
 * Each function corresponds with an action the UI needs to take and call function(s) from actions.js
 */
import config from "../config";

/******************************************************************************
 *         OAuth 2/OpenID Connect Protocol API
 ******************************************************************************/

/**
 * Ends the user session associated with the given ID token by clearing their session in application and out of P14C.
 *
 * @param token  - a required attribute that specifies the ID token passed to the logout endpoint as a hint about the user’s current authenticated session.
 * @see {@link https://openid.net/specs/openid-connect-session-1_0.html#RPLogout|RP-Initiated Logout}
 */
export const signOff = (token) => {
  return fetch(`${getBaseApiUrl(
      true)}/${config.authDetails.environmentId}/as/signoff?id_token_hint=${token}`);

};

/**
 * Get claims about the authenticated end user from UserInfo Endpoint (OAuth 2.0 protected resource)
 * A userinfo authorization request is used with applications associated with the openid resource.
 * @param access_token access token
 */
export const getUserInfo = (access_token) => {
  return fetch(
      `${getBaseApiUrl(true)}/${config.authDetails.environmentId}/as/userinfo`,
      {
        method: "POST",
        headers: new Headers({
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      })
  .then(handleResponse);
};

/**
 * Handle all fetch response's
 *
 * @param response
 * @returns {Promise<T | never>}
 */
function handleResponse(response) {
  let contentType = response.headers.get('content-type')
  if (contentType.includes('application/json')) {
    return handleJSONResponse(response)
  } else if (contentType.includes('text/html')) {
    return handleTextResponse(response)
  } else {
    // Other response types as necessary. I haven't found a need for them yet though.
    throw new Error(`Sorry, content-type ${contentType} not supported`)
  }
}

/**
 * Handle json fetch response's
 * @param response json type response
 * @returns {Promise<T | never>}
 */
function handleJSONResponse(response) {
  return response.json()
  .then(json => {
    if (response.ok) {
      return json
    } else {
      return Promise.reject(Object.assign({}, json, {
        status: response.status,
        statusText: response.statusText
      }))
    }
  })
}

/**
 * Handle text fetch response's
 * @param response text type response
 * @returns {Promise<T | never>}
 */
function handleTextResponse(response) {
  return response.text()
  .then(text => {
    if (response.ok) {
      return text
    } else {
      return Promise.reject({
        status: response.status,
        statusText: response.statusText,
        err: text
      })
    }
  })
}

const getBaseApiUrl = (useAuthUrl) => {
  return useAuthUrl ?
      config.AUTH_URI : // base API URL for auth things like the flow orchestration service
      config.API_URI; // base API URL for non-auth things
};

