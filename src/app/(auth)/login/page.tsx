"use client"
import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FloatingCard } from "@/components/ui/floating-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Baby, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (res?.error) {
      setError("Invalid email or password.")
      setLoading(false)
    } else {
      router.push("/") // We can redirect to the correct dashboard based on role later, or let the navbar handle it
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[80px] -z-10" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[100px] -z-10" />

      <Link href="/" className="flex items-center gap-2 group mb-8">
        <div className="bg-primary text-white p-2 rounded-full shadow-md">
          <Baby size={24} />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight text-foreground">Little Steps</span>
      </Link>

      <FloatingCard className="w-full max-w-md p-8 bg-white/90">
        <h1 className="text-2xl font-bold font-display mb-1 text-center">Welcome back</h1>
        <p className="text-muted-foreground text-sm text-center mb-8">Log in to manage your bookings and account.</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-border bg-transparent outline-none focus:border-primary transition-colors"
              placeholder="parent@littlesteps.com"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-sm font-bold">Password</label>
              <Link href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-border bg-transparent outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base mt-4" disabled={loading}>
            {loading ? "Logging in..." : "Log In"} <ArrowRight size={16} className="ml-2" />
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign up</Link>
        </div>
      </FloatingCard>
      
      <div className="mt-8 text-xs text-muted-foreground text-center max-w-xs">
        <strong>Demo Accounts:</strong><br />
        parent@littlesteps.com / password123<br />
        provider@littlesteps.com / password123<br />
        admin@littlesteps.com / password123
      </div>
    </div>
  )
}
