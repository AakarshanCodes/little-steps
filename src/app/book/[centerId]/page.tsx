"use client"
import * as React from "react"
import { Navbar } from "@/components/layout/navbar"
import { FloatingCard } from "@/components/ui/floating-card"
import { Button } from "@/components/ui/button"
import { Check, ChevronLeft, Calendar, Clock, Baby, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const STEPS = ["Select Time", "Child Details", "Review & Pay"]

export default function BookingFlowPage({ params }: { params: Promise<{ centerId: string }> }) {
  const resolvedParams = React.use(params) as { centerId: string }
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [loading, setLoading] = React.useState(false)

  // Form State
  const [planType, setPlanType] = React.useState("Hourly")
  const [date, setDate] = React.useState("")
  const [time, setTime] = React.useState("")
  const [childName, setChildName] = React.useState("")
  const [ageGroup, setAgeGroup] = React.useState("Toddler (1-3y)")
  const [specialNeeds, setSpecialNeeds] = React.useState("")

  const nextStep = () => {
    if (currentStep === 1 && (!date || !time)) return alert("Please select date and time")
    if (currentStep === 2 && !childName) return alert("Please enter child name")
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleBooking = async () => {
    if (!session) {
      alert("Please log in to book.")
      router.push("/login")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          centerId: resolvedParams.centerId,
          planType,
          date,
          time,
          childName,
          ageGroup,
          specialNeeds
        })
      })

      if (res.ok) {
        router.push("/parent")
      } else {
        const data = await res.json()
        alert(data.error || "Failed to book")
      }
    } catch (err) {
      alert("Error processing booking")
    } finally {
      setLoading(false)
    }
  }

  // If not logged in, redirect to login (basic protection)
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      <main className="pt-32 max-w-4xl mx-auto px-6">
        
        {/* Progress Indicator */}
        <div className="mb-12">
          <Link href={`/center/${resolvedParams.centerId || '1'}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ChevronLeft size={16} className="mr-1"/> Back to Center
          </Link>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
            
            {STEPS.map((step, idx) => {
              const stepNum = idx + 1
              const isActive = stepNum === currentStep
              const isCompleted = stepNum < currentStep
              
              return (
                <div key={step} className="flex flex-col items-center gap-2 bg-background px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-300 ${
                    isActive ? "border-primary bg-primary text-white" : 
                    isCompleted ? "border-primary bg-primary/10 text-primary" : 
                    "border-border bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
                  </div>
                  <span className={`text-xs font-medium ${isActive || isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <FloatingCard className="p-8 md:p-12 min-h-[400px] flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">When do you need care?</h2>
                  <p className="text-muted-foreground">Select your preferred plan and timings.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Hourly", "Daily", "Monthly"].map((plan, i) => (
                    <div 
                      key={plan} 
                      onClick={() => setPlanType(plan)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${planType === plan ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <h4 className="font-bold">{plan}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{i === 0 ? "Flexible drop-in" : i === 1 ? "8-12 hours" : "Full-time care"}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold">Select Date</label>
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
                      <Calendar className="text-muted-foreground" />
                      <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="bg-transparent outline-none w-full text-foreground" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold">Drop-off Time</label>
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
                      <Clock className="text-muted-foreground" />
                      <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="bg-transparent outline-none w-full text-foreground" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">Who is this for?</h2>
                  <p className="text-muted-foreground">Provide details about your child to ensure the best care.</p>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Child's Name</label>
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30 focus-within:border-primary transition-colors">
                      <Baby className="text-muted-foreground" />
                      <input type="text" value={childName} onChange={e=>setChildName(e.target.value)} placeholder="E.g. Emma" className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Age Group</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Infant (0-1y)", "Toddler (1-3y)", "Preschool (3-5y)"].map((age, i) => (
                        <div key={age} onClick={()=>setAgeGroup(age)} className={`p-3 rounded-xl border text-center text-sm font-medium cursor-pointer transition-colors ${ageGroup === age ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"}`}>
                          {age}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Allergies or Special Needs (Optional)</label>
                    <div className="flex gap-3 p-4 rounded-xl border border-border bg-muted/30 focus-within:border-primary transition-colors">
                      <ShieldAlert className="text-muted-foreground shrink-0 mt-1" />
                      <textarea value={specialNeeds} onChange={e=>setSpecialNeeds(e.target.value)} placeholder="Any dietary restrictions, medical conditions, etc." rows={3} className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground resize-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
                    <Check size={40} strokeWidth={3} />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-2">Review & Confirm</h2>
                  <p className="text-muted-foreground">Please review your booking details before proceeding to payment.</p>
                </div>
                
                <div className="bg-muted/30 rounded-2xl p-6 space-y-4 border border-border">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <h4 className="font-bold text-lg">Selected Center</h4>
                      <p className="text-sm text-muted-foreground">{planType} Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{planType === 'Hourly' ? '$45.00' : planType === 'Daily' ? '$120.00' : '$800.00'}</p>
                      <p className="text-xs text-muted-foreground">Estimated Cost</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Date & Time</p>
                      <p className="font-medium">{date} • {time}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Child</p>
                      <p className="font-medium">{childName} ({ageGroup})</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={prevStep}
              className={currentStep === 1 ? "invisible" : ""}
            >
              Back
            </Button>
            
            <Button 
              size="lg" 
              onClick={currentStep === 3 ? handleBooking : nextStep}
              className="px-8 shadow-md shadow-primary/20"
              disabled={loading}
            >
              {loading ? "Confirming..." : currentStep === 3 ? "Confirm Booking" : "Continue"}
            </Button>
          </div>
        </FloatingCard>
      </main>
    </div>
  )
}
