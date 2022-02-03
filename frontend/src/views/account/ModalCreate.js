import { Fragment, useState } from 'react'
import { Card, Row, Col, Modal, Input, Label, Button, CardBody, CardText, CardTitle, ModalBody, ModalHeader, FormFeedback } from 'reactstrap'
import { User, Check, X, Save } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import { selectThemeColors } from '@utils'

import InputPasswordToggle from '@components/input-password-toggle'
import Select from 'react-select'

import '@styles/react/libs/react-select/_react-select.scss'

const defaultValues = {
  username: '',
  display_name: '',
  email: '',
  password: '',
  status: false
}

const ModalCreate = props => {
  const { open, setOpen } = props

  const languageOptions = [
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' }
  ]

  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      return null
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
    <Modal isOpen={open} toggle={() => setOpen(!open)} className="modal-dialog-centered modal-md">
      <ModalHeader className="bg-transparent" toggle={() => setOpen(!open)}></ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <div className="text-center mb-2">
          <h1 className="mb-1">Create Account</h1>
        </div>
        <Row tag="form" className="gy-1 pt-75" onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12}>
            <Label className="form-label" for="display_name">
              Display Name
            </Label>
            <Controller
              control={control}
              name="display_name"
              render={({ field }) => {
                return <Input {...field} id="display_name" placeholder="Display Name" value={field.value} invalid={errors.display_name && true} />
              }}
            />
            {errors.display_name && <FormFeedback>{errors.display_name.message}</FormFeedback>}
          </Col>
          <Col xs={12}>
            <Label className="form-label" for="email">
              Email
            </Label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => {
                return <Input {...field} id="email" placeholder="Email" value={field.value} type="email" invalid={errors.email && true} />
              }}
            />
            {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
          </Col>
          <Col xs={12}>
            <Label className="form-label" for="username">
              Username
            </Label>
            <Controller name="username" control={control} render={({ field }) => <Input {...field} id="username" value={field.value} placeholder="Username" invalid={errors.username && true} />} />
            {errors.username && <FormFeedback>Please enter a valid Username</FormFeedback>}
          </Col>
          <Col xs={12}>
            <Label className="form-label" for="password">
              Password
            </Label>
            <Controller id="password" name="password" control={control} render={({ field }) => <InputPasswordToggle {...field} className="input-group-merge" value={field.value} invalid={errors.password && true} />} />
            {errors.password && <FormFeedback>Please enter a valid Username</FormFeedback>}
          </Col>
          <Col md={6} xs={12}>
            <Label className="form-label" for="language">
              Role
            </Label>
            <Select id="language" isClearable={false} className="react-select" classNamePrefix="select" options={languageOptions} theme={selectThemeColors} defaultValue={languageOptions[0]} />
          </Col>
          <Col xs={12}>
            <div className="d-flex align-items-center">
              <div className="form-switch">
                <Input type="switch" defaultChecked id="status" name="status" />
                <Label className="form-check-label" htmlFor="status">
                  <span className="switch-icon-left">
                    <Check size={14} />
                  </span>
                  <span className="switch-icon-right">
                    <X size={14} />
                  </span>
                </Label>
              </div>
              <Label className="form-check-label fw-bolder" htmlFor="status">
                Active
              </Label>
            </div>
          </Col>
        </Row>
        <Row className="gy-1">
          <Col className="d-flex justify-content-end mt-2" xs={12}>
            <Button type="reset" color="secondary" outline onClick={() => setOpen(false)} className="me-1">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              <Save size={14} />
              <span className="ms-50">Simpan</span>
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default ModalCreate
