'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.forgotPassword(email)

      if (response.success) {
        toast.success('OTP sent to your email')
        router.push(`/auth/enter-otp?email=${encodeURIComponent(email)}`)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="w-full max-w-[500px]">
        <CardHeader className="space-y-3 mb-4">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            Enter your registered email address, we&apos;ll send you a code to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium text-gray-900">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D99B29]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-12 border-[#F0C478] bg-white rounded-lg focus-visible:ring-[#D99B29]"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#D99B29] hover:bg-[#c08924] text-white text-lg font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>

          <div className="mt-6 flex justify-center">
            <Link
              href="/auth/login"
              className="flex items-center text-sm font-medium text-[#D99B29] hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </div>
    </div>
  )
}
