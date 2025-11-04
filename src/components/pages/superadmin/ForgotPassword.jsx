import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Mail, AlertCircle, Shield, ArrowLeft } from 'lucide-react';

import toast from 'react-hot-toast';
import { forgotPasswordSuperadmin } from '../../../services/superAdminService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email address is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);

    try {
      const response = await forgotPasswordSuperadmin({ email });
      
      if (response?.status) {
        toast.success(response?.message || 'Password reset link sent to your email');
        setSubmitted(true);
        setEmail('');
        
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error(response?.message || 'Failed to send reset link');
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred. Please try again.');
      setError(error?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar/>
      <main className="pt-20">
        <div className="min-h-screen bg-gray-50 py-10">
          <div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-[0.3rem] border border-gray-200 p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-[0.3rem] border border-emerald-200 mb-4">
                  <Shield className="h-8 w-8 text-emerald-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                <p className="text-gray-600 mt-2">Enter your registered email to reset your password</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      name="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                        error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="admin@example.com"
                    />
                    {error && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 px-4 rounded-[0.3rem] text-sm font-medium text-white transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                {/* Success Message */}
                {submitted && (
                  <div className="p-3 rounded-[0.3rem] bg-emerald-50 border border-emerald-200">
                    <p className="text-sm text-emerald-800 text-center font-medium">
                      Password reset link has been sent to your email. Please check your inbox.
                    </p>
                  </div>
                )}
              </form>

              {/* Back to Sign In Link */}
              <div className="mt-6 text-center">
                <a 
                  href="/superadmin/signin" 
                  className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  )
}

export default ForgotPassword;