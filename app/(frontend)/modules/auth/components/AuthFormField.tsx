import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'

type InputMode = InputHTMLAttributes<HTMLInputElement>['inputMode']

interface AuthFormFieldProps {
  autoComplete?: HTMLInputAutoCompleteAttribute
  autoFocus?: boolean
  helpText?: string
  icon?: string
  id: string
  inputMode?: InputMode
  label: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: HTMLInputTypeAttribute
  value: string
}

export default function AuthFormField({
  autoComplete,
  autoFocus = false,
  helpText,
  icon,
  id,
  inputMode,
  label,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  value
}: AuthFormFieldProps) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>{label}</label>
      <div className="input-group">
        {icon && (
          <span className="input-group-text">
            <span className="material-symbols-outlined fs-6">{icon}</span>
          </span>
        )}
        <input
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className="form-control"
          id={id}
          inputMode={inputMode}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      {helpText && <p className="form-text text-secondary mb-0">{helpText}</p>}
    </div>
  )
}
