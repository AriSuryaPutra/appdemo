// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from '@src/views/auth/store'
import account from '@src/views/account/store'
import role from '@src/views/role/store'

const rootReducer = {
  auth,
  account,
  role,
  navbar,
  layout
}

export default rootReducer
