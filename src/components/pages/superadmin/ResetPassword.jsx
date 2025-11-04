import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import { Lock, Eye, EyeOff, AlertCircle, Shield, ArrowLeft } from 'lucide-react';

import toast from 'react-hot-toast';
import { resetPasswordSuperadmin } from '../../../services/superAdminService';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      navigate('/superadmin/forgot-password');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPasswordSuperadmin({ token, password });

      if (response?.status) {
        toast.success(response?.message || 'Password reset successful');
        setTimeout(() => {
          navigate('/superadmin/signin');
        }, 2000);
      } else {
        toast.error(response?.message || 'Failed to reset password');
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
      <Navbar />
      <main className="pt-20">
        <div className="min-h-screen bg-gray-50 py-10">
          <div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-[0.3rem] border border-gray-200 p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-[0.3rem] border border-emerald-200 mb-4">
                  <Shield className="h-8 w-8 text-emerald-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                <p className="text-gray-600 mt-2">Enter your new password</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-12 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                        error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Enter new password (min 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-12 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                        error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
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
                      Resetting...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
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
      <Footer />
    </>
  );
};

export default ResetPassword;