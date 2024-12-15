import clsx from 'clsx'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'red' | 'light' | 'violet'
}

export default function Button({ color, children, className, ...props }: ButtonProps) {
  const c = color || 'violet'

  return (
    <button
      className={clsx(
        c === 'light' && [
          'bg-neutral-600/10  text-neutral-600 hover:bg-neutral-600/20 border-neutral-600/20 font-bold py-1 px-2 rounded border',
          'dark:bg-neutral-300/10 dark:text-neutral-300 dark:hover:bg-neutral-300/20 dark:border-neutral-300/20',
          'disabled:opacity-40 disabled:pointer-events-none'
        ],
        c === 'violet' && [
          'bg-violet-600/10  text-violet-600 hover:bg-violet-600/20 border-violet-600/20 font-bold py-1 px-2 rounded border',
          'dark:bg-violet-300/10 dark:text-violet-300 dark:hover:bg-violet-300/20 dark:border-violet-300/20',
          'disabled:opacity-40 disabled:pointer-events-none'
        ],
        c === 'red' && [
          'bg-red-600/10  text-red-600 hover:bg-red-600/20 border-red-600/20 font-bold py-1 px-2 rounded border',
          'dark:bg-red-300/10 dark:text-red-300 dark:hover:bg-red-300/20 dark:border-red-300/20',
          'disabled:opacity-40 disabled:pointer-events-none'
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
