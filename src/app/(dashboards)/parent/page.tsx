"use client"
import * as React from "react"
import { Navbar } from "@/components/layout/navbar"
import { FloatingCard } from "@/components/ui/floating-card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Bell, Settings, CreditCard, ChevronRight, Star } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function ParentDashboard() {
  const { data: session } = useSession()
  const [bookings, setBookings] = React.useState<any[]>([])
  const [children, setChildren] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (session?.user) {
      Promise.all([
        fetch('/api/bookings').then(res => res.json()),
        fetch('/api/user').then(res => res.json())
      ]).then(([bookingsData, userData]) => {
        setBookings(bookingsData)
        setChildren(userData.children || [])
        setLoading(false)
      })
    }
  }, [session])
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 max-w-7xl mx-auto px-6 pb-24">
        
        <header className="mb-12">
          <h1 className="text-3xl font-display font-bold">Welcome back, {session?.user?.name || 'Parent'}</h1>
          <p className="text-muted-foreground mt-2">Manage your bookings, subscriptions, and child profiles.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Booking */}
            <section>
              <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
              {loading ? (
                 <p className="text-sm text-muted-foreground">Loading bookings...</p>
              ) : bookings.length === 0 ? (
                 <p className="text-sm text-muted-foreground">No upcoming bookings.</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking: any) => {
                    const date = new Date(booking.startTime)
                    return (
                      <FloatingCard key={booking.id} className="p-6 bg-primary/5 border-primary/20">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold font-display text-xl shrink-0">
                              {date.getDate()}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{booking.center.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock size={14}/> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin size={14}/> {booking.center.location}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">{booking.status}</span>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      </FloatingCard>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Children Profiles */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold">Children Profiles</h2>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover hover:bg-primary/10 rounded-full font-bold">
                  + Add Child
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No children profiles found.</p>
                ) : (
                  children.map((child: any) => (
                    <FloatingCard key={child.id} className="p-4 border-border flex justify-between items-center group cursor-pointer hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center">
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold">{child.name}</h4>
                          <p className="text-xs text-muted-foreground">{child.ageGroup}</p>
                          {child.specialNeeds && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-widest">Medical Notes</p>}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </FloatingCard>
                  ))
                )}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <FloatingCard className="p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: Calendar, label: "Book Care", desc: "Find a new center", href: "/search" },
                  { icon: CreditCard, label: "Subscription", desc: "Manage monthly plans", href: "#" },
                  { icon: Bell, label: "Notifications", desc: "2 new updates", href: "#" },
                  { icon: Settings, label: "Settings", desc: "Profile & Preferences", href: "#" }
                ].map((action, i) => (
                  <Link href={action.href} key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group block">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        <action.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{action.label}</p>
                        <p className="text-xs text-muted-foreground">{action.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </FloatingCard>

            {/* Active Subscription */}
            <FloatingCard className="p-6 bg-secondary/10 border-none shadow-none">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-secondary uppercase tracking-wider">Active Plan</p>
                  <h3 className="font-bold text-lg mt-1">Premium Monthly</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-secondary">
                  <Star size={16} className="fill-current" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">40 hours remaining this month.</p>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-3/4 rounded-full" />
              </div>
            </FloatingCard>
          </div>
          
        </div>
      </main>
    </div>
  )
}
