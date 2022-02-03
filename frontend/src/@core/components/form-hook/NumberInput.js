import React from "react"
import NumberFormat from "react-number-format"
import { Controller, useFormContext } from "react-hook-form"
import { refAdapter } from "./FormControl"
import classnames from "classnames"

const NumberInput = React.forwardRef((props, ref) => {
  const { name, options, placeholder, defaultValue, readOnly, isNumericString = true } = props
  const { control, register, formState } = useFormContext()

  return (
    <Controller
      {...refAdapter(register(name), "innerRef")}
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <NumberFormat
          readOnly={readOnly}
          style={{ textAlign: "right" }}
          decimalScale={0}
          allowEmptyFormatting={false}
          control={control}
          className={classnames("form-control", {
            "is-invalid": Boolean(formState.errors[name])
          })}
          fixedDecimalScale={true}
          thousandSeparator={true}
          isNumericString={isNumericString}
          onValueChange={(c) => {
            onChange(c.value)
          }}
          value={value}
        />
      )}
      defaultValue={defaultValue}
      control={control}
    />
  )
})

export default NumberInput
