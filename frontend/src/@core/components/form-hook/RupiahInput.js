import React from "react"
import NumberFormat from "react-number-format"
import { Controller, useFormContext } from "react-hook-form"
import { refAdapter } from "./FormControl"
import classnames from "classnames"

const RupiahInput = React.forwardRef((props, ref) => {
  const { name, options, placeholder, defaultValue, readOnly, isNumericString = true } = props
  const { control, register, formState } = useFormContext()

  return (
    <Controller
      {...refAdapter(register(name), "innerRef")}
      render={({ field }) => {
        return (
          <NumberFormat
            readOnly={readOnly}
            style={{ textAlign: "right" }}
            decimalScale={0}
            allowEmptyFormatting={false}
            control={control}
            className={classnames("form-control", {
              "is-invalid": Boolean(formState.errors[name])
            })}
            prefix="Rp."
            fixedDecimalScale={true}
            thousandSeparator={true}
            isNumericString={isNumericString}
            {...field}
            onValueChange={(c) => {
              field.onChange(c.value)
            }}
          />
        )
      }}
      name={name}
      defaultValue={defaultValue}
      control={control}
    />
  )
})

export default RupiahInput
