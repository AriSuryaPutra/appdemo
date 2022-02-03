import { useContext, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSkin } from '@hooks/useSkin'
import { useDispatch } from 'react-redux'
import { toast, Slide } from 'react-toastify'
import { useForm, FormProvider } from 'react-hook-form'
import { Coffee } from 'react-feather'
import { handleLogin } from '@src/views/auth/store'

//import { AbilityContext } from '@src/utility/context/Can'
import { redirectAfterLogin } from '@auth/utils'
import { Row, Col, Label, Button, CardText, CardTitle } from 'reactstrap'
import { Input, PasswordToggle } from '@components/form-hook'

import useJwt from '@src/auth/jwt/useJwt'
import Avatar from '@components/avatar'
import themeConfig from '@configs/themeConfig'
import '@styles/react/pages/page-authentication.scss'

const ToastContent = ({ name }) => (
  <Fragment>
    <div className="toastify-header">
      <div className="title-wrapper">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
        <h6 className="toast-title fw-bold">Success login</h6>
      </div>
    </div>
    <div className="toastify-body">
      <span>Selamat datang {name}</span>
    </div>
  </Fragment>
)

const defaultValues = {
  username: 'admin',
  password: '12345678'
}

const Login = () => {
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const history = useHistory()
  //const ability = useContext(AbilityContext)

  const form = useForm({ defaultValues })

  const illustration = skin === 'dark' ? 'register-v2-dark.svg' : 'register-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      useJwt
        .login({ username: data.username, password: data.password })
        .then(res => {
          const data = { ...res.data.account, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
          dispatch(handleLogin(data))
          history.push(redirectAfterLogin(data.role.name))
          toast.success(<ToastContent name={data.display_name || 'User'} />, {
            icon: false,
            transition: Slide,
            hideProgressBar: true,
            autoClose: 2000
          })
        })
        .catch(err => console.log(err))
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={e => e.preventDefault()}>
          <h2 className="brand-text text-primary ms-1">{themeConfig.app.appName}</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Welcome to {themeConfig.app.appName}!
            </CardTitle>
            <CardText className="mb-2">Silahkan masukan username dan password</CardText>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-1">
                  <Label className="form-label" for="login-email">
                    Username
                  </Label>
                  <Input autoFocus type="text" name="username" placeholder="Username" />
                </div>
                <div className="mb-1">
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" for="login-password">
                      Password
                    </Label>
                    {/* <Link to="/forgot-password">
                      <small>Forgot Password?</small>
                    </Link> */}
                  </div>
                  <PasswordToggle name="password" className="input-group-merge" />
                </div>
                <Button type="submit" color="primary" block>
                  Sign in
                </Button>
              </form>
            </FormProvider>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
