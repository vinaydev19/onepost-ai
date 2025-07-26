import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function EmailChange() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newEmail: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentEmail = "user@example.com";

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {

  }

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020817] p-4">
      <Card className="w-full text-white max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/profile" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <CardTitle className="text-2xl">Change Email</CardTitle>
          </div>
          <CardDescription>
            Update your account email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-[#1e293b] rounded-lg">
              <Label className="text-sm font-medium">Current Email</Label>
              <p className="text-sm text-gray-400 mt-1">{currentEmail}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    placeholder="Enter new email address"
                    value={formData.newEmail}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
                {formData.newEmail && !isValidEmail(formData.newEmail) && (
                  <p className="text-sm text-red-600">Please enter a valid email address</p>
                )}
                {formData.newEmail === currentEmail && (
                  <p className="text-sm text-red-600">New email must be different from current email</p>
                )}
              </div>

              <div className="p-3 text-white bg-blue-950/20 rounded-lg border border-blue-800">
                <p className="text-sm text-blue-200">
                  <strong>Note:</strong> A verification email will be sent to your new email address.
                  You'll need to verify it before the change takes effect.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#6b40e2] hover:cursor-pointer text-black transition-transform duration-200 hover:scale-105"
                disabled={
                  isLoading ||
                  !formData.currentPassword ||
                  !formData.newEmail ||
                  !isValidEmail(formData.newEmail) ||
                  formData.newEmail === currentEmail
                }
              >
                {isLoading ? "Sending Verification..." : "Change Email"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailChange