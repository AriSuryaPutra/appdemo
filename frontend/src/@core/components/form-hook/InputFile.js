import React from "react"
import { Input } from "reactstrap"
import { useFormContext } from "react-hook-form"
import { refAdapter } from "./FormControl"

const InputFile = React.forwardRef((props, ref) => {
  const { name } = props
  const { register, formState } = useFormContext()

  return (
    <React.Fragment>
      <div>
        <Input
          {...refAdapter(register(name), "innerRef")}
          id={`file-${name}`}
          type="file"
          name={name}
          invalid={Boolean(formState.errors && formState.errors[name])}
        />
      </div>
    </React.Fragment>
  )
})

export default InputFile
