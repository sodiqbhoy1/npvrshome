import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'


import { Mail, Heart } from 'lucide-react';
import { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 flex items-center justify-center">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 w-full border border-blue-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-blue-700">Forgot Password</h2>
              <p className="text-gray-700 mt-2">Enter your registered email to reset your password</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                    placeholder="hospital@example.com"
                  />
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-md hover:shadow-lg"
              >
                <Heart className="h-5 w-5 text-white" /> Reset Password
              </button>
              {submitted && (
                <div className="mt-4 text-green-600 text-center font-medium">If your email is registered, a reset link will be sent.</div>
              )}
            </form>
            <div className="mt-6 text-center">
              <a href="/signin" className="text-blue-600 hover:text-green-600 font-medium transition-colors underline underline-offset-2">Back to Sign In</a>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default ForgotPassword
