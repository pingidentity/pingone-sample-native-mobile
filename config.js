export const AUTH_URI = 'https://auth.pingone.com'
export const API_URI = 'https://api.pingone.com/v1'

export const ENVIRONMENT_ID = '<ENVIRONMENT_ID>'

export const AUTH_CONFIG = {
  issuer: AUTH_URI + '/'+ ENVIRONMENT_ID + '/as',
  clientId: '<clientId>',
  clientSecret: '<clientSecret>',
  redirectUrl: 'com.example.app:/redirect_uri_path',
  scopes: ["openid", "profile", "email", "address"],
  usePKCE: true,
  useNonce: true,
  additionalParameters: {
    max_age: '3600',
    prompt: 'login'
  }
}
