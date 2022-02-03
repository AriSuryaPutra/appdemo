import React from "react"
import { Input } from "reactstrap"
import { useFormContext } from "react-hook-form"
import { refAdapter } from "./FormControl"

const RadioGroup = React.forwardRef((props, ref) => {
  const { name, defaultChecked } = props
  const { register, formState } = useFormContext()

  return (
    <React.Fragment>
      <div>
        <Input
          {...refAdapter(register(name), "innerRef")}
          type="checkbox"
          id={`switch-hook-${name}`}
          name={name}
          invalid={Boolean(formState.errors && formState.errors[name])}
          defaultChecked={defaultChecked ?? false}
        />
      </div>
    </React.Fragment>
  )
})

export default RadioGroup
