import * as React from "react"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
        {...props}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${value || 0}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
