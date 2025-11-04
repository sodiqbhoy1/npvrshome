import React, { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginSuperAdmin } from '../../../services/superAdminService'

const Signin = () => {
  const schema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required')
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' }
  })

  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (values) => {
   try {
    const result = await loginSuperAdmin(values)
    localStorage.setItem('superAdminToken', result.token); // Store token
    toast.success(result.message);
    // Redirect or update UI as needed

    setTimeout(() => {
      window.location.href = '/superadmin/dashboard';
    }, 3000);

   } catch (error) {
    toast.error(error.message);
   }
   
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="min-h-screen bg-gray-50 py-10">
          <div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-[0.3rem] border border-gray-200 p-8 w-full">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-[0.3rem] mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Super Admin Sign In</h2>
                <p className="text-gray-600 mt-2">Access the admin console</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                      placeholder="admin@example.com"
                    />
                    {errors.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      {...register('password')}
                      className={`w-full pl-10 pr-12 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password.message}
                    </p>
                  )}
                  <div className="mt-2 text-right">
                    <a 
                      href="/superadmin/forgot-password" 
                      className="text-sm text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-[0.3rem] font-semibold text-white transition-colors flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {isSubmitting ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have access?{' '}
                  <a href="/superadmin/signup" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors underline">Request access</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Signin
