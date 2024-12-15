import React from 'react'

export default function Input({ children, className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`border-neutral-800/20 dark:border-neutral-200/20 bg-transparent border font-mono py-1 px-2 rounded ${
        className || ''
      }`}
      {...props}
    />
  )
}
