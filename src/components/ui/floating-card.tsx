"use client"
import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface FloatingCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
}

const FloatingCard = React.forwardRef<HTMLDivElement, FloatingCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "bg-card rounded-2xl md:rounded-3xl shadow-soft hover:shadow-floating-hover transition-shadow duration-300 border border-white/40 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
FloatingCard.displayName = "FloatingCard"

export { FloatingCard }
