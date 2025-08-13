import * as React from "react"
import { cn } from "@/utils/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }