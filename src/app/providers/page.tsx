import { Navbar } from "@/components/layout/navbar"
import { FloatingCard } from "@/components/ui/floating-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProvidersLandingPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      <main className="pt-32 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-bold uppercase tracking-wider rounded-full mb-6">
          Partner With Us
        </div>
        <h1 className="text-5xl font-display font-bold mb-6">Grow your childcare business</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join the Little Steps network to reach more parents, manage bookings effortlessly, and streamline your payments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { title: "Reach Parents", desc: "Get listed on our interactive map and get discovered by local parents seeking care." },
            { title: "Manage Bookings", desc: "Our unified dashboard lets you approve, reject, and schedule bookings in one place." },
            { title: "Secure Payments", desc: "Automated billing means you never have to chase invoices again." }
          ].map((feature, i) => (
            <FloatingCard key={i} className="p-8 text-center border-border">
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </FloatingCard>
          ))}
        </div>

        <Link href="/register">
          <Button size="lg" className="px-12 h-14 text-lg shadow-lg shadow-primary/20">Apply as a Provider</Button>
        </Link>
      </main>
    </div>
  )
}
