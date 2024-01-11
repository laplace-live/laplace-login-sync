import clsx from 'clsx'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'emerald' | 'red' | 'light'
}

export default function Button({
  color,
  children,
  className,
  ...props
}: ButtonProps) {
  const c = color || 'emerald'

  return (
    <button
      className={clsx(
        c === 'light' && `bg-gray-50 dark:bg-transparent hover:bg-gray-100 dark:hover:bg-transparent border-gray-300 dark:border-neutral-400 hover:border-gray-400 dark:hover:border-neutral-200 border text-gray-700 dark:text-neutral-300 font-bold py-1 px-2 rounded disabled:opacity-40 disabled:pointer-events-none`,
        c === 'emerald' && `bg-emerald-50 dark:bg-transparent hover:bg-emerald-100 dark:hover:bg-transparent border-emerald-600 dark:border-emerald-400 hover:border-emerald-700 dark:hover:border-emerald-300 border text-emerald-700 dark:text-emerald-400 font-bold py-1 px-2 rounded disabled:opacity-40 disabled:pointer-events-none`,
        c === 'red' && `bg-red-50 dark:bg-transparent hover:bg-red-100 dark:hover:bg-transparent border-red-600 dark:border-red-400 hover:border-red-700 dark:hover:border-red-300 border text-red-700 dark:text-red-400 font-bold py-1 px-2 rounded disabled:opacity-40 disabled:pointer-events-none`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
