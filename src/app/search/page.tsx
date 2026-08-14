"use client"
import * as React from "react"
import { Navbar } from "@/components/layout/navbar"
import { FloatingCard } from "@/components/ui/floating-card"
import { Button } from "@/components/ui/button"
import { MapPin, Filter, Star, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import MapWrapper from "@/components/map/MapWrapper"

export default function SearchPage() {
  const [centers, setCenters] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/centers')
      .then(res => res.json())
      .then(data => {
        setCenters(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch centers:", err)
        setLoading(false)
      })
  }, [])
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 flex flex-col lg:flex-row h-screen">
        {/* Left Side: List View & Filters */}
        <div className="w-full lg:w-[600px] h-full flex flex-col overflow-hidden bg-background relative z-10 shadow-xl border-r border-border">
          
          {/* Sticky Header & Filters */}
          <div className="p-6 pb-4 border-b border-border bg-background">
            <h1 className="text-2xl font-bold mb-4">Find Care Near You</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted rounded-full">
                <MapPin className="text-muted-foreground" size={16} />
                <input type="text" defaultValue="San Francisco, CA" className="bg-transparent border-none outline-none text-sm w-full" />
              </div>
              <Button variant="outline" size="icon" className="shrink-0 rounded-full h-10 w-10">
                <Filter size={16} />
              </Button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {["Any time", "Infants (0-1y)", "24x7 Available", "Top Rated"].map(filter => (
                <button key={filter} className="px-4 py-1.5 rounded-full border border-border text-xs font-medium whitespace-nowrap hover:bg-muted transition-colors">
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          {/* Scrollable Center List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : centers.map((center, idx) => (
              <motion.div 
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <FloatingCard className="overflow-hidden flex flex-col sm:flex-row gap-4 p-4 border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="w-full sm:w-40 h-32 rounded-xl bg-muted shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=400&auto=format&fit=crop)`}} />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{center.name}</h3>
                        <div className="flex items-center text-sm font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                          <Star size={12} className="mr-1 fill-current" /> 4.9
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin size={12} /> {center.location}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-muted text-muted-foreground px-2 py-1 rounded-sm">
                            ${center.priceHourly}/hr
                          </span>
                      </div>
                      <Link href={`/center/${center.id}`}>
                        <Button size="sm" variant="ghost" className="rounded-full text-primary hover:text-primary-hover hover:bg-primary/10">
                          View <ChevronRight size={14} className="ml-1"/>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="hidden lg:block flex-1 bg-muted relative z-0">
          <MapWrapper centers={centers} />
        </div>
      </main>
    </div>
  )
}
