"use client"
import * as React from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { FloatingCard } from "@/components/ui/floating-card"
import { motion } from "framer-motion"
import { Search, ShieldCheck, Clock, Star, MapPin, Heart, ArrowRight, Baby } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Organic Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Hero Copy */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-soft text-sm font-medium text-primary">
              <Star size={16} className="fill-primary" />
              Trusted by 10,000+ parents
            </div>
            
            <h1 className="text-5xl md:text-7xl leading-tight">
              Premium Childcare, <br />
              <span className="text-primary relative">
                Anytime You Need It.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.00036 6.99999C47.0195 2.1955 125.077 -1.61168 198.001 6.99999" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Connect with verified daycare centers, crèches, and caregivers 24/7. Because your little ones deserve the best.
            </p>

            {/* Search Bar Overlay */}
            <FloatingCard className="p-2 flex flex-col sm:flex-row gap-2 max-w-xl relative z-10">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl md:rounded-full">
                <MapPin className="text-muted-foreground" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter your location..." 
                  className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button size="lg" className="w-full sm:w-auto px-8 gap-2">
                <Search size={18} />
                Find Care
              </Button>
            </FloatingCard>
          </motion.div>

          {/* Hero Imagery / Floating Collage */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative h-[500px] md:h-[600px] w-full"
          >
            {/* Main Image placeholder */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden border-8 border-white shadow-floating">
               {/* Replace with actual image in production */}
               <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
            </div>

            {/* Floating Elements */}
            <FloatingCard className="absolute -left-8 top-24 p-4 flex items-center gap-4 animate-[bounce_4s_infinite_alternate]">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="font-bold font-display text-sm">100% Verified</p>
                <p className="text-xs text-muted-foreground">Centers & Staff</p>
              </div>
            </FloatingCard>

            <FloatingCard className="absolute -right-8 bottom-32 p-4 flex flex-col gap-2 animate-[bounce_5s_infinite_alternate_reverse]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                  ))}
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star size={16} className="fill-current" />
                  <span className="font-bold text-sm ml-1">4.9</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium">Loved by Parents</p>
            </FloatingCard>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-4">Childcare made simple</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Three easy steps to secure a safe and engaging environment for your child.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Discover", desc: "Browse verified centers and caregivers near you, filtered by age group and availability." },
              { icon: Clock, title: "Book", desc: "Select hourly, daily, or monthly slots. Real-time availability prevents overbooking." },
              { icon: Heart, title: "Relax", desc: "Drop off your child with peace of mind knowing they are in safe, certified hands." }
            ].map((step, idx) => (
              <FloatingCard key={idx} className="p-8 text-center flex flex-col items-center gap-4 bg-muted/30 border-none">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-2">
                  <step.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[400px] md:h-[500px]">
             <div className="absolute inset-0 rounded-[3rem] overflow-hidden border-8 border-white shadow-floating rotate-[-3deg]">
               <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1587654780228-6a47a27fa7f1?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
             </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl">Your child's safety is our <span className="text-primary">top priority</span></h2>
            <div className="space-y-6">
              {[
                "Background checks & verification for all staff",
                "Real-time CCTV access for parents (Premium)",
                "Strict hygiene and health protocols",
                "First-aid and CPR certified caregivers"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0 mt-1">
                    <ShieldCheck size={14} />
                  </div>
                  <p className="text-lg text-foreground/80">{feature}</p>
                </div>
              ))}
            </div>
            <Button size="lg" variant="outline" className="mt-4 gap-2">
              Read our Safety Standards <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <Baby size={28} className="text-primary" />
              <span className="font-display font-bold text-2xl tracking-tight">Little Steps</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Premium 24x7 childcare booking platform connecting parents with verified centers.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">For Parents</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Find a Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">How it works</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Safety Standards</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">For Providers</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Partner with us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Provider Dashboard</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Success Stories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Little Steps. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
