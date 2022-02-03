import React from "react"
import { Controller, useFormContext } from "react-hook-form"

export const FormControl = React.forwardRef(
  ({ name, label, Component, rules, size = "sm", defaultValue, readOnly, placeholder, ...restProps }, ref) => {
    const { control, register, formState } = useFormContext()

    return (
      <Controller
        {...register(name)}
        control={control}
        name={name}
        ref={ref}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Component
            placeholder={placeholder}
            readOnly={readOnly}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value || ""}
            ref={ref}
            invalid={Boolean(formState.errors && formState.errors[name])}
          />
        )}
        rules={rules}
        defaultValue={defaultValue || null}
      />
    )
  }
)

export const refAdapter = (registerReturn, refName) => {
  const { ref, ...rest } = registerReturn
  return {
    [refName]: ref,
    ...rest
  }
}
