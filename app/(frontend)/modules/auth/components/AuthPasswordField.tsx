"use client"

import type { HTMLInputAutoCompleteAttribute } from 'react'
import { useId, useState } from 'react'

interface AuthPasswordFieldProps {
  autoComplete?: HTMLInputAutoCompleteAttribute
  helpText?: string
  id?: string
  label: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  value: string
}

export default function AuthPasswordField({
  autoComplete,
  helpText,
  id,
  label,
  onChange,
  placeholder,
  required = false,
  value
}: AuthPasswordFieldProps) {
  const generatedId = useId()
  const fieldId = id || generatedId
  const [isVisible, setIsVisible] = useState<boolean>(false)

  return (
    <div>
      <label className="form-label" htmlFor={fieldId}>{label}</label>
      <div className="input-group">
        <span className="input-group-text">
          <span className="material-symbols-outlined fs-6">lock</span>
        </span>
        <input
          autoComplete={autoComplete}
          className="form-control"
          id={fieldId}
          placeholder={placeholder}
          required={required}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => setIsVisible((current) => !current)}
        >
          <span className="material-symbols-outlined fs-6">
            {isVisible ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
      {helpText && <p className="form-text text-secondary mb-0">{helpText}</p>}
    </div>
  )
}
