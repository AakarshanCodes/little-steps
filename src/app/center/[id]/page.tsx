"use client"
import * as React from "react"
import { Star, MapPin, ShieldCheck, Clock, Phone, Heart, ArrowRight, ChevronRight, Check } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { FloatingCard } from "@/components/ui/floating-card"
import { Button } from "@/components/ui/button"

import prisma from "@/lib/prisma"

export default async function CenterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const centerId = resolvedParams?.id || "1"
  
  const center = await prisma.center.findUnique({
    where: { id: centerId },
    include: {
      caregivers: true,
      provider: true
    }
  })

  if (!center) {
    return <div className="p-24 text-center">Center not found.</div>
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      <main className="pt-24 max-w-7xl mx-auto px-6">
        
        {/* Photo Gallery Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] mb-12 mt-6">
          <div className="md:col-span-2 rounded-[2rem] overflow-hidden bg-muted relative group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="hidden md:flex flex-col gap-4">
            <div className="flex-1 rounded-[2rem] overflow-hidden bg-muted relative group">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587654780228-6a47a27fa7f1?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex-1 rounded-[2rem] overflow-hidden bg-muted relative group">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <Button variant="outline" className="text-white border-white hover:bg-white/20 backdrop-blur-sm">View all photos</Button>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-bold">Sunshine Daycare</h1>
                <Button variant="ghost" size="icon" className="rounded-full bg-muted text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Heart size={20} />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 font-bold text-foreground">
                  <Star size={16} className="text-secondary fill-secondary" /> 4.9 (128 reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin size={16}/> San Francisco, CA</span>
                <span>•</span>
                <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-primary"/> State Verified</span>
              </div>
            </div>
            <hr className="border-border" />

            {/* About */}
            <section className="mt-12">
            <h2 className="text-2xl font-bold font-display mb-4">About this Center</h2>
            <p className="text-foreground/80 leading-relaxed text-lg max-w-3xl">
              {center.description}
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold font-display mb-6">Meet the Caregivers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {center.caregivers.length === 0 ? (
                <p className="text-muted-foreground">No caregivers listed yet.</p>
              ) : (
                center.caregivers.map((caregiver) => (
                  <FloatingCard key={caregiver.id} className="p-6 flex items-start gap-4 border-border">
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xl shrink-0">
                      {caregiver.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{caregiver.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{caregiver.bio}</p>
                      
                      <div className="space-y-1">
                        {caregiver.certifications.split(',').map((cert, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded inline-flex mr-2 mb-2">
                            <ShieldCheck size={12}/> {cert.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </FloatingCard>
                ))
              )}
            </div>
          </section>

            {/* Safety */}
            <section className="space-y-6 bg-secondary/5 p-8 rounded-[2rem] border border-secondary/10">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-secondary" /> Safety & Certifications
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["State Licensed Facility", "Background Checked Staff", "Live CCTV Access", "Pediatric CPR Certified", "Secure Entry System", "Strict Hygiene Protocols"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* Sticky Booking Widget */}
          <div className="relative">
            <FloatingCard className="sticky top-28 p-6 space-y-6 border-2 border-primary/20">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Price per Hour</p>
                  <h3 className="text-4xl font-display font-bold">${center.priceHourly.toFixed(2)}</h3>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-md">
                   <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> Live
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-border rounded-xl p-3 text-center cursor-pointer hover:border-primary transition-colors bg-primary/5 border-primary">
                    <p className="font-bold text-sm">Hourly</p>
                    <p className="text-xs text-muted-foreground">Flexible</p>
                  </div>
                  <div className="border border-border rounded-xl p-3 text-center cursor-pointer hover:border-primary transition-colors">
                    <p className="font-bold text-sm">Daily</p>
                    <p className="text-xs text-muted-foreground">8-12 hours</p>
                  </div>
                </div>

                <div className="border border-border rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-muted-foreground"/>
                    <span className="text-sm font-medium">Select Time</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground"/>
                </div>
              </div>

              <Link href={`/book/${centerId}`} className="block">
                <Button size="lg" className="w-full text-lg h-14 shadow-lg shadow-primary/30">
                  Book Now
                </Button>
              </Link>
              
              <p className="text-xs text-center text-muted-foreground">You won't be charged yet.</p>
            </FloatingCard>
          </div>
        </div>
      </main>
    </div>
  )
}
