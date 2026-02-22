'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { Lock, Loader2, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const otp = searchParams.get('otp')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!email || !otp) {
      toast.error('Invalid request')
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.resetPassword(email, otp, newPassword)

      if (response.success) {
        toast.success('Password reset successfully')
        router.push('/auth/login')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password'
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
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="new-password" className="text-base font-medium text-gray-900">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D99B29]" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-14 pl-12 border-[#F0C478] bg-white rounded-lg focus-visible:ring-[#D99B29]"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirm-password" className="text-base font-medium text-gray-900">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D99B29]" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Resetting...
                </span>
              ) : (
                'Continue'
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
