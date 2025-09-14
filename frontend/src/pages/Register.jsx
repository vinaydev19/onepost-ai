import React, { useState } from 'react'
import Logo from "../assets/Logo.png"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import { LoaderTwo } from '@/components/ui/loader'
import { useRegisterMutation } from '@/redux/api/userApiSlice'


function Register() {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };
  const isPasswordVaild = Object.values(passwordValidation).every(Boolean)


  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await register(formData).unwrap()
      toast.success(res.message)
      navigate('/verify-otp')
    } catch (error) {
      console.log(`something want wrong while register`);
      console.log(error);
      toast.error(error.data.message)
    }
  }

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }


  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center p-4'>
      <div className="w-full max-w-md animate-scale-in">
        <div className='text-center mb-8'>
          <div className='inline-flex items-center space-x-2 text-2xl font-bold text-white mb-4'>
            <img src={Logo} className='w-24 rounded-full' />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/80">Sign in to your account to continue</p>
        </div>


        <Card className='shadow-elegant bg-[#020817] text-white border-white/10'>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>
              Enter your information to create your BlogSpace account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="transition-all focus:shadow-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your full username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="transition-all focus:shadow-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="transition-all focus:shadow-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="pr-10 transition-all focus:shadow-card"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {formData.password && (
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <Check className={`h-3 w-3 ${passwordValidation.minLength ? 'opacity-100' : 'opacity-30'}`} />
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <Check className={`h-3 w-3 ${passwordValidation.hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                      Contains a number
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasLetter ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <Check className={`h-3 w-3 ${passwordValidation.hasLetter ? 'opacity-100' : 'opacity-30'}`} />
                      Contains a letter
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <Check className={`h-3 w-3 ${passwordValidation.hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                      Contains a special character
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#6b40e2] hover:cursor-pointer text-black transition-transform duration-200 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? <LoaderTwo /> : "Create account"}
              </Button>
            </form>

            <div className=" flex  justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" className="w-full hover:bg-[#1e293b] cursor-pointer">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Register