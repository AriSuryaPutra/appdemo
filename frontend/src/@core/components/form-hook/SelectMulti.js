import React from "react"
import chroma from "chroma-js"
import Select, { components, ControlProps } from "react-select"
import { selectThemeColors } from "@utils"
import { Controller, useFormContext } from "react-hook-form"
import { refAdapter } from "./FormControl"
import classnames from "classnames"
import "@styles/react/libs/react-select/_react-select.scss"

const ReactSelectMulti = React.forwardRef((props, ref) => {
  const { name, options, disabled = false, onClick, defaultValue } = props
  const { control, register, formState } = useFormContext()

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color)
      return {
        ...styles,
        backgroundColor: isDisabled ? undefined : isSelected ? data.color : isFocused ? color.alpha(0.7).css() : undefined,
        color: isDisabled ? "#ccc" : isSelected ? (chroma.contrast(color, "white") > 2 ? "white" : "black") : data.color,
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled ? (isSelected ? data.color : color.alpha(0.7).css()) : undefined,
          lineHeight: "200px"
        }
      }
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color)
      return {
        ...styles,
        backgroundColor: color.alpha(0.7).css()
      }
    },
    multiValueLabel: (styles, { data }) => {
      const color = chroma(data.color)
      return {
        ...styles,
        backgroundColor: color.alpha(0.7).css(),
        color: data.whire
      }
    },
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      color: "white",
      ":hover": {
        backgroundColor: data.color,
        color: "white"
      }
    })
  }
  return (
    <Controller
      {...refAdapter(register(name), "innerRef")}
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Select
          styles={colourStyles}
          onClick={onClick}
          menuPlacement="auto"
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
          isMulti
        />
      )}
      control={control}
      defaultValue={defaultValue ?? null}
    />
    // <Select
    //   {...refAdapter(register(name), 'innerRef')}
    //   name={name}
    //   theme={selectThemeColors}
    //   defaultValue={colourOptions[0]}
    //   options={colourOptions}
    //   isClearable={false}
    // />
  )
})

export default ReactSelectMulti
