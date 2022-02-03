import { Fragment, forwardRef } from "react"
import moment from "moment"
import InputMask from "react-input-mask"

import { Controller, useFormContext } from "react-hook-form"
import { refAdapter } from "./FormControl"

const InputMaskHook = forwardRef((props, ref) => {
  const { name, placeholder } = props
  const { register, control } = useFormContext()

  //{...refAdapter(register(name), 'innerRef')}

  const yearNow = moment().format("YYYY")
  const monthNow = moment().format("MM")
  const maxJam = 18
  const minJam = 8

  const dateTimeMask = (newState) => {
    let { value } = newState

    if (value.length === 5 && value.substring(0, value.length - 1) * 1 !== yearNow * 1) {
      value = ""
    }

    if (
      value.length === 8 &&
      (value.substring(value.length - 3, value.length - 1) * 1 < monthNow * 1 || value.substring(value.length - 3, value.length - 1) * 1 > 12)
    ) {
      value = value.substring(0, value.length - 3)
    }

    if (value.length === 11) {
      if (!moment(value, "YYY-MM-DD").isValid()) {
        value = value.substring(0, value.length - 3)
      }
      if (value.substring(value.length - 3, value.length - 1) * 1 > moment(value, "YYY-MM-DD").endOf("month").format("DD") * 1) {
        value = value.substring(0, value.length - 3)
      }
    }

    if (value.length === 14 && value.substring(value.length - 3, value.length - 1) * 1 < minJam) {
      value = value.substring(0, value.length - 3)
    }

    if (value.length === 14 && value.substring(value.length - 3, value.length - 1) * 1 > maxJam) {
      value = value.substring(0, value.length - 3)
    }

    if (value.length === 16 && value.substring(value.length - 2, value.length) * 1 > 59) {
      value = value.substring(0, value.length - 3)
    }

    if (value.length === 16) {
      if (!moment(value, "YYY-MM-DD").isValid()) {
        value = value.substring(0, value.length - 3)
      }
    }

    return {
      ...newState,
      value
    }
  }

  return (
    <Controller
      {...refAdapter(register(name), "innerRef")}
      name={name}
      render={({ field: { onChange, onBlur, value: selectedId, ref } }) => (
        <InputMask
          name={name}
          placeholder={placeholder}
          className="form-control"
          mask={`9999-99-99 99:99`}
          maskChar={null}
          onChange={(e) => onChange(e)}
          beforeMaskedValueChange={dateTimeMask}
        />
      )}
      control={control}
      defaultValue=""
    />
  )
})

export default InputMaskHook
