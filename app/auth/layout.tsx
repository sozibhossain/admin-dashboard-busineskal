import React from "react"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8" style={{ backgroundColor: 'rgba(245, 243, 240, 1)' }}>
      <div className="w-full">{children}</div>
    </div>
  )
}
