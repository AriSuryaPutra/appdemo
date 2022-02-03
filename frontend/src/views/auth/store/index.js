import { createSlice } from '@reduxjs/toolkit'
import useJwt from '@src/auth/jwt/useJwt'

const config = useJwt.jwtConfig

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    account: {}
  },
  reducers: {
    handleLogin: (state, action) => {
      console.log(action)
      state.account = action.payload
      state[config.storageAccessTokenKeyName] = action.payload[config.storageAccessTokenKeyName]
      state[config.storageRefreshTokenKeyName] = action.payload[config.storageRefreshTokenKeyName]
      localStorage.setItem('account', JSON.stringify(action.payload))
      localStorage.setItem(config.storageAccessTokenKeyName, action.payload.accessToken)
      localStorage.setItem(config.storageRefreshTokenKeyName, action.payload.refreshToken)
    },
    handleLogout: state => {
      state.account = {}
      state[config.storageAccessTokenKeyName] = null
      state[config.storageRefreshTokenKeyName] = null
      // ** Remove account, accessToken & refreshToken from localStorage
      localStorage.removeItem('account')
      localStorage.removeItem(config.storageAccessTokenKeyName)
      localStorage.removeItem(config.storageRefreshTokenKeyName)
    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer
