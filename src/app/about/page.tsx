import { Navbar } from "@/components/layout/navbar"
import { FloatingCard } from "@/components/ui/floating-card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      <main className="pt-32 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">About Little Steps</h1>
        <p className="text-xl text-muted-foreground mb-12">Connecting parents with premium, verified childcare providers.</p>
        
        <FloatingCard className="p-8 text-left space-y-6 bg-primary/5 border-primary/20">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Little Steps was founded with a simple goal: to make finding reliable, safe, and high-quality childcare as seamless as possible. We understand that leaving your little ones with someone else is a big step, which is why we meticulously verify every provider on our platform.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Whether you need flexible hourly drop-ins, consistent daily care, or a full-time monthly plan, our platform provides the tools to book and manage it all in one place.
          </p>
        </FloatingCard>
      </main>
    </div>
  )
}
