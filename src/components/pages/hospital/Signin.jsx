import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Navbar from './Navbar';
import Footer from './Footer';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { loginHospital } from '../../../services/hospitalService';
import toast from 'react-hot-toast';

const Signin = () => {
  const schema = yup.object({
    email: yup.string().email('Please enter a valid email address').required('Email address is required'),
    password: yup.string().required('Password is required')
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values) => {
    try {
      const result = await loginHospital(values);
      console.log(result);
      
      localStorage.setItem('hospitalToken', result.token);
      toast.success(result.message);

      setTimeout(() => {
        window.location.href = '/hospital/dashboard';
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="min-h-screen bg-gray-50 py-10">
          <div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-[0.3rem] border border-gray-200 p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-[0.3rem] border border-emerald-200 mb-4">
                  <Building2 className="h-8 w-8 text-emerald-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Sign In to NPVRS</h2>
                <p className="text-gray-600 mt-2">Access your hospital dashboard</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="hospital@example.com"
                    />
                    {errors.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      {...register('password')}
                      className={`w-full pl-10 pr-12 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.password.message}
                    </p>
                  )}
                  <div className="mt-2 text-right">
                    <a 
                      href="/forgot-password" 
                      className="text-sm text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 px-4 rounded-[0.3rem] text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <a 
                    href="/signup" 
                    className="text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                  >
                    Register here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Signin;
