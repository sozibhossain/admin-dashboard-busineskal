'use client'

import React, { useEffect, useState } from 'react'
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
import { Loader2, ArrowLeft } from 'lucide-react'

export default function EnterOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (!canResend && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [canResend, resendTimer])

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (!/^\d*$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const otpValue = otp.join('')

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits')
      return
    }

    if (!email) {
      toast.error('Email not found')
      return
    }

    setIsLoading(true)
    try {
      await apiClient.verifyOtp(email, otpValue)
      toast.success('OTP verified successfully')
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otpValue}`)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to verify OTP'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email not found')
      return
    }

    setCanResend(false)
    setResendTimer(60)
    try {
      await apiClient.forgotPassword(email)
      toast.success('OTP resent to your email')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP'
      toast.error(errorMessage)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="w-full max-w-[500px]">
        <CardHeader className="space-y-3 mb-4">
          <CardTitle className="text-3xl font-bold text-gray-900">Enter OTP</CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            We sent a 6-digit code to your email. Enter it below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-900 text-center block">
                Verification Code
              </Label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl font-bold border-[#F0C478] bg-white rounded-lg focus-visible:ring-[#D99B29]"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              {!canResend ? (
                <span>Resend code in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#D99B29] hover:underline font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || otpValue.length !== 6}
              className="w-full h-14 bg-[#D99B29] hover:bg-[#c08924] text-white text-lg font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify'
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
