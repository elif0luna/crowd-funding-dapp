import type { ChangeEvent } from 'react'

type FormFieldProps = {
  labelName: string
  placeholder: string
  inputType: string
  value: string
  handleChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  isTextArea?: boolean
}

const FormField = ({ labelName, placeholder, inputType, value, handleChange, isTextArea }: FormFieldProps) => {
  return (
    <label className="form-field">
      <span>{labelName}</span>
      {isTextArea ? (
        <textarea
          rows={6}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="form-input"
        />
      ) : (
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="form-input"
        />
      )}
    </label>
  )
}

export default FormField
