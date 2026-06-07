import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.97]",
          variant === 'default' && "bg-blue-600 text-white hover:bg-blue-700",
          variant === 'outline' && "border border-gray-300 dark:border-slate-700 bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800",
          variant === 'secondary' && "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
          variant === 'ghost' && "bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200",
          variant === 'destructive' && "bg-red-600 text-white hover:bg-red-700",
          size === 'default' && "h-10 px-4 py-2",
          size === 'sm' && "h-8 px-3 text-xs",
          size === 'lg' && "h-12 px-6 text-base",
          size === 'icon' && "h-10 w-10",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
