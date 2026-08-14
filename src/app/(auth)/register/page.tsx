"use client"
import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FloatingCard } from "@/components/ui/floating-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Baby } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState("PARENT")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Create user via our API
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Failed to register")
      setLoading(false)
      return
    }

    // Automatically log them in after registration
    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (signInRes?.error) {
      setError("Registration successful, but failed to auto-login.")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[80px] -z-10" />

      <Link href="/" className="flex items-center gap-2 group mb-8">
        <div className="bg-primary text-white p-2 rounded-full shadow-md">
          <Baby size={24} />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight text-foreground">Little Steps</span>
      </Link>

      <FloatingCard className="w-full max-w-md p-8 bg-white/90">
        <h1 className="text-2xl font-bold font-display mb-1 text-center">Create an account</h1>
        <p className="text-muted-foreground text-sm text-center mb-8">Join Little Steps to find or provide premium care.</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div 
              onClick={() => setRole("PARENT")}
              className={`p-3 text-center border-2 rounded-xl cursor-pointer font-bold text-sm transition-colors ${role === "PARENT" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
            >
              Parent
            </div>
            <div 
              onClick={() => setRole("PROVIDER")}
              className={`p-3 text-center border-2 rounded-xl cursor-pointer font-bold text-sm transition-colors ${role === "PROVIDER" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
            >
              Provider
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-border bg-transparent outline-none focus:border-primary transition-colors"
              placeholder="Jane Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-border bg-transparent outline-none focus:border-primary transition-colors"
              placeholder="jane@example.com"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 rounded-xl border border-border bg-transparent outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base mt-4" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </div>
      </FloatingCard>
    </div>
  )
}
