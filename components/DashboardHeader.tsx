'use client'
import { Menu } from 'lucide-react'
import { useSession } from 'next-auth/react'

type DashboardHeaderProps = {
  onMenuClick?: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="w-full">
      <div className="flex items-center justify-between bg-[rgba(223,141,16,1)] px-3 py-3 sm:px-4 lg:px-8">
        <button
          type="button"
          className="rounded-md p-2 text-white/90 hover:bg-white/10 md:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
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
