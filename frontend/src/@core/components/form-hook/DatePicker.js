import { Fragment, useState, forwardRef } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { refAdapter } from "./FormControl"
import DatePicker from "react-datepicker"
import moment from "moment"
import classnames from "classnames"

import "@styles/base/plugins/extensions/ext-component-datepicker.scss"

const DatePickerSip = forwardRef((props, ref) => {
  const { id, name, placeholder, defaultValue } = props
  const { register, control, formState } = useFormContext()

  return (
    <Controller
      {...refAdapter(register(name), "innerRef")}
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <DatePicker
          ref={ref}
          placeholderText={placeholder}
          name={name}
          className={classnames("form-control", {
            "is-invalid": Boolean(formState.errors[name])
          })}
          onChange={(e) => onChange(e)}
          selected={value ? moment(value).toDate() : defaultValue}
          showTimeSelect
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          yearDropdownItemNumber={15}
          scrollableYearDropdown
          showYearDropdown
        />
      )}
      control={control}
      defaultValue={defaultValue}
    />
  )
})

export default DatePickerSip
