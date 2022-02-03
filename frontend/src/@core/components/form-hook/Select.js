import React from "react"
import Select from "react-select"
import { selectThemeColors } from "@utils"
import { Controller, useFormContext } from "react-hook-form"
import { refAdapter } from "./FormControl"
import classnames from "classnames"
import "@styles/react/libs/react-select/_react-select.scss"

const ReactSelect = React.forwardRef((props, ref) => {
  const { name, options, disabled = false, onClick, defaultValue, menuPlacement = "auto" } = props
  const { control, register, formState } = useFormContext()
  return (
    <Controller
      {...refAdapter(register(name), "innerRef")}
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Select
          onClick={onClick}
          menuPlacement={menuPlacement}
          isDisabled={disabled}
          name={name}
          theme={selectThemeColors}
          onChange={(e) => {
            onChange(e.value || null)
          }}
          className={classnames("react-select", {
            "is-invalid": Boolean(formState.errors[name])
          })}
          value={options.find((options) => options.value === value)}
          classNamePrefix="select"
          placeholder={"Pilih"}
          options={options}
        />
      )}
      control={control}
      defaultValue={defaultValue ?? null}
    />
  )
})

export default ReactSelect
