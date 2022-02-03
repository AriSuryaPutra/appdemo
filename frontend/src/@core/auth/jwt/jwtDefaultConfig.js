// ** Auth Endpoints
export default {
  loginEndpoint: '/api/auth/login',
  registerEndpoint: '/api/auth/register',
  refreshEndpoint: '/api/auth/refresh',
  logoutEndpoint: '/api/auth/logout',

  tokenType: 'Bearer',

  storageAccessTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
