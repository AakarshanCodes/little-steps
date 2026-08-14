"use client"
import * as React from "react"
import { Navbar } from "@/components/layout/navbar"
import { FloatingCard } from "@/components/ui/floating-card"
import { Button } from "@/components/ui/button"
import { Bell, Calendar, MapPin, Users, TrendingUp, DollarSign, Settings } from "lucide-react"
import { useSession } from "next-auth/react"

export default function ProviderDashboard() {
  const { data: session } = useSession()
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  const fetchDashboard = () => {
    fetch('/api/provider/dashboard')
      .then(res => res.json())
      .then(resData => {
        setData(resData)
        setLoading(false)
      })
  }

  React.useEffect(() => {
    if (session?.user) {
      fetchDashboard()
    }
  }, [session])

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchDashboard()
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 max-w-7xl mx-auto px-6 pb-24">
        
        <header className="mb-12">
          <h1 className="text-3xl font-display font-bold">Provider Portal</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {session?.user?.name || 'Provider'}. Here is your overview.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FloatingCard className="p-5 border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Calendar size={18} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Active Bookings</p>
                <p className="text-2xl font-bold font-display mt-1">{loading ? "..." : data?.stats?.activeBookings || 0}</p>
              </FloatingCard>
              <FloatingCard className="p-5 border-border">
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                  <MapPin size={18} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Your Centers</p>
                <p className="text-2xl font-bold font-display mt-1">{loading ? "..." : data?.stats?.totalCenters || 0}</p>
              </FloatingCard>
              <FloatingCard className="p-5 border-border bg-primary text-white border-transparent">
                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center mb-3">
                  <DollarSign size={18} />
                </div>
                <p className="text-sm text-white/80 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold font-display mt-1">${loading ? "..." : (data?.stats?.totalRevenue || 0).toFixed(2)}</p>
              </FloatingCard>
            </div>

            {/* Upcoming Schedule */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upcoming Schedule</h2>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover font-bold">View Calendar</Button>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading schedule...</p>
                ) : data?.bookings?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming bookings found.</p>
                ) : (
                  data?.bookings?.map((booking: any) => (
                    <FloatingCard key={booking.id} className="p-4 border-border flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted flex flex-col items-center justify-center">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(booking.startTime).toLocaleString('en-us', { month: 'short' })}</span>
                          <span className="text-lg font-bold font-display leading-none">{new Date(booking.startTime).getDate()}</span>
                        </div>
                        <div>
                          <h4 className="font-bold">{booking.parent.name}'s Child</h4>
                          <p className="text-xs text-muted-foreground">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {booking.center.name}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{booking.status}</span>
                        {booking.status === 'PENDING' && (
                           <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => updateBookingStatus(booking.id, 'REJECTED')}>Reject</Button>
                              <Button size="sm" className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => updateBookingStatus(booking.id, 'APPROVED')}>Approve</Button>
                           </div>
                        )}
                      </div>
                    </FloatingCard>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Centers List */}
          <div className="lg:col-span-4">
            <section>
              <h2 className="text-xl font-bold mb-4">My Centers</h2>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  data?.centers?.map((center: any) => (
                    <FloatingCard key={center.id} className="p-4 border-border">
                      <h4 className="font-bold">{center.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{center.location}</p>
                      
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="font-medium">{center.capacity}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-3">
                        <span className="text-muted-foreground">Price/Hr</span>
                        <span className="font-medium">${center.priceHourly.toFixed(2)}</span>
                      </div>
                      <Button variant="outline" className="w-full text-xs h-8">Manage Center</Button>
                    </FloatingCard>
                  ))
                )}
                
                <Button className="w-full border-dashed border-2 border-border bg-transparent text-foreground hover:bg-muted shadow-none">
                  + Add New Center
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
