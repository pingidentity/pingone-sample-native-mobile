/**
 * PingOne authentication flow and OpenID Connect/OAuth 2 protocol API.
 *
 * Contains functions that correspond to steps needed to make it through a PingOne authentication flow.
 * Each function corresponds with an action the UI needs to take and call function(s) from actions.js
 */
import {API_URI,AUTH_URI, ENVIRONMENT_ID} from './config';

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
      true)}/${ENVIRONMENT_ID}/as/signoff?id_token_hint=${token}`);

};

/**
 * Get claims about the authenticated end user from UserInfo Endpoint (OAuth 2.0 protected resource)
 * A userinfo authorization request is used with applications associated with the openid resource.
 * @param access_token access token
 */
export const getUserInfo = (access_token) => {
  return fetch(
      `${getBaseApiUrl(true)}/${ENVIRONMENT_ID}/as/userinfo`,
      {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      })
  .then(handleResponse);
};


export const flatten = (objectOrArray, prefix = '', formatter = (k) => (k)) => {
  const nestedFormatter = (k) => ('_' + k)
  const nestElement = (prev, value, key) => (
      (value && typeof value === 'object')
          ? { ...prev, ...flatten(value, `${prefix}${formatter(key)}`, nestedFormatter) }
          : { ...prev, ...{ [`${prefix}${formatter(key)}`]: value } });

  return Array.isArray(objectOrArray)
      ? objectOrArray.reduce(nestElement, {})
      : Object.keys(objectOrArray).reduce(
          (prev, element) => nestElement(prev, objectOrArray[element], element),
          {},
      );
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
      AUTH_URI : // base API URL for auth things like the flow orchestration service
      API_URI; // base API URL for non-auth things
};

/**
 * User Attribute Claims and their descriptions
 */
export const CLAIMS_DESCRIPTION_MAPPING = {
  at_hash: 'Access Token hash value.',
  sub: 'User Identifier.',
  name: 'End-User\'s full name in displayable form including all name parts, possibly including titles and suffixes, ordered according to the End-User\'s locale and preferences.',
  given_name: 'User given name(s) or first name(s).',
  family_name: 'Surname(s) or last name(s) of the End-User.',
  middle_name: 'Middle name(s) of the End-User.',
  nickname: 'Casual name of the End-User that may or may not be the same as the given_name.',
  preferred_username: 'User shorthand name.',
  email: 'User e-mail address.',
  updated_at: 'Last time User\'s information was updated.',
  amr: 'Authentication Methods Reference.',
  iss: 'Issuer Identifier for the Issuer of the response.',
  nonce: 'String value used to associate a Client session with an ID Token, and to mitigate replay attacks',
  aud: 'Audience(s) that this ID Token is intended for.',
  acr: 'Authentication Context Class Reference value that identifies the Authentication Context Class that the authentication performed satisfied.',
  auth_time: 'Time when the End-User authentication occurred.',
  exp: 'Expiration time on or after which the ID Token MUST NOT be accepted for processing. ',
  iat: 'Time at which the JWT was issued.',
  address_country: 'Country name.',
  address_postal_code: 'Zip code or postal code. ',
  address_region: 'State, province, prefecture, or region. ',
  address_locality: 'City or locality. ',
  address_formatted: 'Full mailing address, formatted for display or use on a mailing label. This field MAY contain multiple lines, separated by newlines. Newlines can be represented either as a carriage return/line feed pair (\'\\r\\n\') or as a single line feed character (\'\\n\').',
  address_street_address: 'Full street address component, which MAY include house number, street name, Post Office Box, and multi-line extended street address information. '
      + 'This field MAY contain multiple lines, separated by newlines. Newlines can be represented either as a carriage return/line feed pair (\'\\r\\n\') or as a single line feed character (\'\\n\').',
      amr_0: 'Authentication methods. '

};

export const CLAIMS_MAPPING = {
  at_hash: 'Access Token hash value.',
  sub: 'User Identifier.',
  name: 'User\'s full name.',
  given_name: 'User given name(s) or first name(s).',
  family_name: 'Surname(s) or last name(s) of the User.',
  middle_name: 'User middle name.',
  nickname: 'User casual name.',
  preferred_username: 'User shorthand name.',
  email: 'User e-mail address.',
  updated_at: 'Last time User\'s information was updated.',
  amr: 'Authentication Methods Reference.',
  iss: 'Response Issuer Identifier.',
  nonce: 'Client session unique and random value.',
  aud: 'ID Token Audience.',
  acr: 'Authentication Context Class Reference.',
  auth_time: 'User authentication time.',
  exp: 'ID Toke expiration time.',
  iat: 'Time at which the JWT was issued.',
  address_country: 'Country name. ',
  address_postal_code: 'Zip code or postal code. ',
  address_region: 'State, province, prefecture, or region. ',
  address_locality: 'City or locality. ',
  address_formatted: 'Full mailing address. ',
  address_street_address: 'Full street address. ',
  amr_0: 'Authentication methods. '

};
