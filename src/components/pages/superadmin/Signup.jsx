import React, { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Shield, User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerSuperAdmin } from '../../../services/superAdminService';
import { Link } from 'react-router';


const Signup = () => {
  const schema = yup.object({
    name: yup.string().required('Full name is required').min(3, 'Too short'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required').min(6, 'Min 6 characters'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm your password')
  })

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  })

  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  const onSubmit = async (values) => {
    // Drop confirmPassword before sending; underscore name avoids unused-var lint
  const { confirmPassword: _CONFIRM, ...payload } = values;
    try {
      const result = await registerSuperAdmin(payload);
      console.log('Registration successful:', result);
      toast.success('Super Admin registered successfully');
    } catch (error) {
      console.error('Registration failed:', error);
      // If backend sends fieldErrors like { email: 'Taken' }, attach to fields
      if (error?.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          setError(field, { type: 'server', message: String(message) });
        });
      } else {
        toast.error(error?.message || 'Hospital registration failed. Please try again.');
      }
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="min-h-screen bg-gray-50 py-10">
          <div className="w-full max-w-lg mx-auto px-4">
            <div className="bg-white rounded-[0.3rem] border border-gray-200 p-8 w-full">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-[0.3rem] mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Request Super Admin Access</h2>
                <p className="text-gray-600 mt-2">Submit details to receive access</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input id="name" {...register('name')} placeholder="Enter your full name" className={`w-full pl-10 pr-4 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`} />
                    {errors.name && <div className="absolute right-3 top-1/2 -translate-y-1/2"><AlertCircle className="h-5 w-5 text-red-500" /></div>}
                  </div>
                  {errors.name && <p className="mt-1.5 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input id="email" type="email" {...register('email')} placeholder="admin@example.com" className={`w-full pl-10 pr-4 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`} />
                    {errors.email && <div className="absolute right-3 top-1/2 -translate-y-1/2"><AlertCircle className="h-5 w-5 text-red-500" /></div>}
                  </div>
                  {errors.email && <p className="mt-1.5 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input id="password" type={show ? 'text' : 'password'} {...register('password')} placeholder="Create a password" className={`w-full pl-10 pr-12 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`} />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input id="confirmPassword" type={show2 ? 'text' : 'password'} {...register('confirmPassword')} placeholder="Re-enter password" className={`w-full pl-10 pr-12 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`} />
                    <button type="button" onClick={() => setShow2(!show2)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">{show2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.confirmPassword.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 rounded-[0.3rem] font-semibold text-white transition-colors flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  {isSubmitting ? 'Submitting…' : 'Request Access'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have access?{' '}
                  <Link to="/superadmin/signin" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors underline">Sign in</Link>
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

export default Signup
