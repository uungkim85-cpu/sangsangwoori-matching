import * as React from "react"
import { cn } from "@/lib/utils"

function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-14 w-full rounded-lg border border-input bg-transparent px-4 text-lg transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22%3E%3Cpath fill=%22%236b7280%22 d=%22M7 10l5 5 5-5z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
