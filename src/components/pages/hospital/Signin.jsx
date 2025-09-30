import React, { useState } from 'react';
// Form management and schema validation (no API calls here yet)
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Navbar from './Navbar';
import Footer from './Footer';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, Heart } from 'lucide-react';
import { loginHospital } from '../../../services/hospitalService';
import toast from 'react-hot-toast';

const Signin = () => {
  // 1) Define a tiny Yup schema for email/password
  const schema = yup.object({
    email: yup.string().email('Please enter a valid email address').required('Email address is required'),
    password: yup.string().required('Password is required')
  });

  // 2) Initialize react-hook-form with the schema; expose errors and isSubmitting
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  // Keep simple UI toggle for showing password
  const [showPassword, setShowPassword] = useState(false);

  // 3) onSubmit: validation is already handled; you will integrate API here later
  const onSubmit = async (values) => {
    // TODO: integrate API here (e.g., await loginHospital(values))
  //  const { email, password } = values;
   try {
    const result = await loginHospital(values)
    localStorage.setItem('hospitalToken', result.token); // Store token
    toast.success(result.message);
    // Redirect or update UI as needed

    setTimeout(() => {
      window.location.href = '/hospital/dashboard';
    }, 3000);

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
          <div className="bg-white p-8 w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-md mb-4">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Sign In to NPVRS</h2>
              <p className="text-gray-600 mt-2">Access your hospital dashboard</p>
            </div>
      {/* react-hook-form handles validation and submission */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
        // register connects input to react-hook-form
        {...register('email')}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:border-blue-500 transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                    placeholder="hospital@example.com"
                  />
                  {errors.email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
        {errors.email.message}
                  </p>
                )}
              </div>
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
        {...register('password')}
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-md focus:outline-none focus:border-blue-500 transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
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
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
        {errors.password.message}
                  </p>
                )}
                <div className="mt-2 text-right">
                  <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors underline">Forgot password?</a>
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors flex items-center justify-center gap-2 focus:outline-none ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <Heart className="h-5 w-5 text-white" /> Sign In
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline">Register here</a>
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
