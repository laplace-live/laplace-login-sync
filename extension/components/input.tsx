import React from 'react'

export default function Input({
  children,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`border-gray-300 dark:border-neutral-600 bg-transparent border font-mono py-1 px-2 rounded ${
        className || ''
      }`}
      {...props}
    />
  )
}
