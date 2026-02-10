'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
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
    <Card className="p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Enter OTP</h1>
        <p className="text-gray-500 mt-2">We sent a 6-digit code to your email. Enter it below.</p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Verification Code
          </label>
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
                className="w-12 h-12 text-center text-xl font-bold border-amber-300 focus:border-amber-500"
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          {!canResend ? (
            <span>Resend code in {resendTimer}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-amber-500 hover:text-amber-600 font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || otpValue.length !== 6}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </Button>
      </form>

      <div className="mt-6">
        <Link href="/auth/login" className="flex items-center justify-center text-amber-500 hover:text-amber-600">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>
      </div>
    </Card>
  )
}
