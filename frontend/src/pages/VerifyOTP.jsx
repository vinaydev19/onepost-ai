import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020817] p-4">
      <Card className="w-full text-white max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/forgot-password" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <CardTitle className="text-2xl">Verify Code</CardTitle>
          </div>
          <CardDescription className='text-gray-400'>
            Enter the 6-digit code sent to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" className="w-full bg-[#6b40e2] hover:cursor-pointer text-black transition-transform duration-200 hover:scale-105" disabled={isLoading || otp.length !== 4}>
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                Didn't receive the code?
              </p>
              <Button variant="ghost" className="text-sm cursor-pointer hover:bg-[#1e293b]">
                Resend code
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyOTP