import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface TextfieldProps extends InputHTMLAttributes<HTMLInputElement> {
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  color?: string;
  readOnly?: boolean;
}

export default function Textfield(props: TextfieldProps) {
  const {
    multiline,
    helperText,
    color,
    title,
    required,
    id,
    rows,
    readOnly,
    ...otherProps
  } = props;

  return (
    <div className="flex items-start justify-start flex-col select-none gap-1 w-full mt-2">
      <label className={`text-gray-500 text-sm ${color}`} htmlFor={id}>
        {title}
        {required && <span className="text-red-500">&nbsp;*</span>}
      </label>

      {multiline ? (
        <textarea
          id={id}
          className={`text-gray-500 mt-0 text-sm rounded w-full border focus:border-gray-500 focus:bg-white focus:ring-1 focus:ring-base ${color} outline-none py-2 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik`}
          rows={rows || 4}
          readOnly={readOnly}
          required={required}
          {...(otherProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          type="text"
          id={id}
          className={`text-gray-500 text-sm rounded w-full  border ${helperText ? "border-base" : "border-gray-200"} focus:bg-white focus:ring-1 focus:ring-base ${color} outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-rubik`}
          readOnly={readOnly}
          required={required}
          {...otherProps}
        />
      )}

      <div className="flex items-center w-full">
        <p className="text-xs text-primary">{helperText}</p>
      </div>
    </div>
  );
}
