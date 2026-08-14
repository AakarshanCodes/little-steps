"use client"
import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Baby } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { data: session, status } = useSession()
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = React.useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20)
  })

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "py-2" : "py-6"
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between rounded-full px-6 py-3 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-soft border border-white/40" : "bg-transparent"
      )}>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 text-primary p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
            <Baby size={24} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Little Steps</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Find a Center</Link>
          <Link href="/providers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">For Providers</Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About Us</Link>
        </nav>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="w-20 h-10 animate-pulse bg-muted rounded-full"></div>
          ) : session ? (
            <>
              <Link 
                href={session?.user?.role === 'PROVIDER' ? '/provider' : session?.user?.role === 'ADMIN' ? '/admin' : '/parent'}
                className="hidden md:block text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Button variant="outline" onClick={() => signOut()}>Log Out</Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:block text-sm font-medium text-foreground hover:text-primary transition-colors">Log In</Link>
              <Link href="/register"><Button>Sign Up</Button></Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}
