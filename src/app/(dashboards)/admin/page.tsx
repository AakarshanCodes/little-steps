"use client"
import * as React from "react"
import { Navbar } from "@/components/layout/navbar"
import { FloatingCard } from "@/components/ui/floating-card"
import { Button } from "@/components/ui/button"
import { Shield, Users, Building, Activity, CheckCircle, XCircle } from "lucide-react"
import { useSession } from "next-auth/react"

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (session?.user) {
      fetch('/api/admin/dashboard')
        .then(res => res.json())
        .then(resData => {
          setData(resData)
          setLoading(false)
        })
    }
  }, [session])
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 max-w-7xl mx-auto px-6 pb-24">
        
        <header className="mb-12">
          <h1 className="text-3xl font-display font-bold">Admin Portal</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {session?.user?.name || 'Admin'}. Manage platform verifications and overview.</p>
        </header>

        {/* Global Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Users", value: loading ? "..." : data?.stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
            { label: "Total Centers", value: loading ? "..." : data?.stats?.totalCenters || 0, icon: Building, color: "text-purple-500", bg: "bg-purple-100" },
            { label: "Active Bookings", value: loading ? "..." : data?.stats?.activeBookings || 0, icon: Activity, color: "text-green-500", bg: "bg-green-100" },
            { label: "System Health", value: "99.9%", icon: Shield, color: "text-orange-500", bg: "bg-orange-100" }
          ].map((stat, i) => (
            <FloatingCard key={i} className="p-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
              <h3 className="text-3xl font-bold font-display">{stat.value}</h3>
            </FloatingCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Verification Queue */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">Verification Queue</h2>
            
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading queue...</p>
              ) : data?.unverifiedCenters?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No centers pending verification.</p>
              ) : (
                data?.unverifiedCenters?.map((center: any) => (
                  <FloatingCard key={center.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-orange-200 bg-orange-50/50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg">{center.name}</h4>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-bold uppercase tracking-wider">Pending Review</span>
                      </div>
                      <p className="text-sm text-foreground/80 mb-1">Provider: {center.provider?.name}</p>
                      <p className="text-sm text-muted-foreground">Location: {center.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-500 gap-1">
                        <XCircle size={16} /> Reject
                      </Button>
                      <Button className="bg-primary hover:bg-primary-hover text-white gap-1">
                        <CheckCircle size={16} /> Verify Center
                      </Button>
                    </div>
                  </FloatingCard>
                ))
              )}
            </div>
          </div>

          {/* System Alerts */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">System Alerts</h2>
            <FloatingCard className="p-6">
              <h3 className="font-bold mb-4">Recent Registrations</h3>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  data?.recentUsers?.map((user: any) => (
                    <div key={user.id} className="flex items-center gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full mt-6 text-sm">View All Users</Button>
            </FloatingCard>
          </div>
          
        </div>
      </main>
    </div>
  )
}
