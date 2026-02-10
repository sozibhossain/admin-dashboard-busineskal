'use client'
import { ChevronRight } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <header className="w-full">
      {/* Top Profile Bar */}
      <div className="flex items-center justify-end bg-[rgba(223,141,16,1)] px-8 py-3">
        <div className="flex items-center gap-3">
          <span className="text-white text-sm font-medium">
            {session?.user?.name || 'Mr. Raja'}
          </span>
          <img 
            src={session?.user?.image || "https://i.pravatar.cc/150?u=raja"} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
          />
        </div>
      </div>
    </header>
  )
}