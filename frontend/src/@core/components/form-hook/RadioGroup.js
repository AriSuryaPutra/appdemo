import React from "react"
import { Input } from "reactstrap"
import { Controller, useFormContext } from "react-hook-form"
import { refAdapter } from "./FormControl"

const RadioGroup = React.forwardRef((props, ref) => {
  const { name, items, defaultValue } = props
  const { control, register, formState } = useFormContext()

  return (
    <div>
      <Controller
        {...refAdapter(register(name), "innerRef")}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return items.map((item, i) => (
            <Input
              key={i}
              type="radio"
              id={`radio-hook-${name}-${i}`}
              inline
              label={item.label}
              checked={item.value === value}
              value={item.value}
              onChange={(e) => {
                onChange(item.value || null)
              }}
            />
          ))
        }}
        control={control}
        defaultValue={defaultValue ?? null}
      />
    </div>
  )
})

export default RadioGroup
