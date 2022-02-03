import { forwardRef } from "react"
import InputPasswordToggle from "@components/input-password-toggle"
import classnames from "classnames"

import { Controller, useFormContext } from "react-hook-form"
import { refAdapter } from "./FormControl"

const PasswordToggle = forwardRef((props, ref) => {
  const { name, placeholder } = props
  const { register, control, formState } = useFormContext()

  return (
    <Controller
      {...refAdapter(register(name), "innerRef")}
      name={name}
      render={({ field: { onChange, onBlur, value: selectedId, ref } }) => (
        <InputPasswordToggle
          name={name}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={("input-group-merge", classnames({ "is-invalid": Boolean(formState.errors[name]) }))}
        />
      )}
      control={control}
      defaultValue=""
    />
  )
})
export default PasswordToggle
