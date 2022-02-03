import React from "react"
import { refAdapter } from "./FormControl"
import { Input as InputReactStrap } from "reactstrap"
import { Controller, useFormContext } from "react-hook-form"
import classnames from "classnames"

const Input = React.forwardRef((props, ref) => {
  const { name, defaultValue, type = "text", rows, readOnly = false, disabled = false } = props
  const { control, register, formState } = useFormContext()

  return (
    <Controller
      {...refAdapter(register(name), "innerRef")}
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <InputReactStrap
          type={type}
          rows={rows ?? 1}
          ref={ref}
          name={name}
          onChange={(e) => onChange(e)}
          className={classnames("form-control", {
            "is-invalid": Boolean(formState.errors[name])
          })}
          readOnly={readOnly}
          disabled={disabled}
          value={value ?? ""}
        />
      )}
      control={control}
      defaultValue={defaultValue ?? ""}
    />
  )
})

export default Input
