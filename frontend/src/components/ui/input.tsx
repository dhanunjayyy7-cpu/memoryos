import * as React from "react"
import { cn } from "@/lib/utils"

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full min-w-0 rounded-full border-none bg-transparent px-1 text-sm outline-none placeholder:text-neutral-400",
        className
      )}
      {...props}
    />
  )
}
