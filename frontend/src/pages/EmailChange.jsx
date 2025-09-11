import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmailChangeMutation, useLogoutMutation } from '@/redux/api/userApiSlice';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function EmailChange() {
  const [formData, setFormData] = useState({
    email: ""
  });
  // const [isLoading, setIsLoading] = useState(false);
  const [emailChange, { isLoading }] = useEmailChangeMutation()
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.user);
  const currentEmail = currentUser?.email

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await emailChange(formData).unwrap()
      toast.success(res.message)
      console.log(res);
      navigate("/email-change-confirmation");
    } catch (error) {
      console.log(`something want wrong while change the password`);
      console.log(error);
      toast.error(error.data.message)
    }
  };

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
                <Label htmlFor="email">New Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter new email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
                {formData.email && !isValidEmail(formData.email) && (
                  <p className="text-sm text-red-600">Please enter a valid email address</p>
                )}
                {formData.email === currentEmail && (
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
                  !formData.email ||
                  !isValidEmail(formData.email) ||
                  formData.email === currentEmail
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