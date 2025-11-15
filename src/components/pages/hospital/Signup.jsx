import React, { useState } from 'react';
// Form management and schema validation
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import {Heart, Building2, MapPin, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Users, Activity, Database } from 'lucide-react';
import Footer from './Footer';
import Navbar from './Navbar';
import { Link } from 'react-router';
import { registerHospital } from '../../../services/hospitalService';
import toast from 'react-hot-toast';

// List of Nigerian States for the dropdown
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara"
];

const Signup = () => {
  const navigate = useNavigate();

  // 1) Define a simple Yup schema for validation (keeps rules in one place)
  const schema = yup.object({
    hospitalname: yup.string().trim().required('Hospital name is required'),
    hospitaladdress: yup.string().trim().required('Hospital address is required'),
    state: yup.string().required('State is required').notOneOf([''], 'Please select a state'),
    email: yup.string().email('Please enter a valid email address').required('Email address is required'),
    phone: yup.string().trim().min(10, 'Please enter a valid phone number').required('Phone number is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Please confirm your password'),
    terms: yup.boolean().oneOf([true], 'You must accept the terms')
  });

  // 2) Initialize react-hook-form with the schema
  const { register, handleSubmit, watch, setError, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      hospitalname: '',
      hospitaladdress: '',
      state: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  // Keep UI toggles for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submit handler: sends valid data to backend and maps any field errors back to the form
  const onSubmit = async (values) => {
    // Drop confirmPassword before sending; underscore name avoids unused-var lint
    const { confirmPassword: _CONFIRM, ...payload } = values;
    try {
      const result = await registerHospital(payload);
      
      // Check if registration was successful
      if (result?.status || result?.message) {
        toast.success(result?.message);
        
        // Clear the form
        reset();
        
        // Navigate to signin page after a delay
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        toast.error('Registration failed. Please try again.');
      }
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
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;

    if (strength < 25) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength < 50) return { strength, label: 'Fair', color: 'bg-orange-500' };
    if (strength < 75) return { strength, label: 'Good', color: 'bg-yellow-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  // Use watch to get the current password value for live strength meter
  const watchedPassword = watch('password');
  const passwordStrength = getPasswordStrength(watchedPassword);

  return (
    <>
    <Navbar/>
    {/* Main wrapper adds space under fixed navbar and keeps layout stable on all screens */}
    <main className="pt-20">
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left: Benefits Panel */}
          <div className="lg:col-span-2 bg-gray-900 text-white rounded-[0.3rem] p-8 lg:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-[0.3rem] mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Join NPVRS</h1>
              <p className="text-gray-300">Connect to Nigeria's National Patient Vital Record System</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-gray-800 p-2 rounded-[0.3rem] mr-4">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Health Data</h3>
                  <p className="text-gray-400 text-sm mt-1">Encrypted patient records with strict access controls</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-800 p-2 rounded-[0.3rem] mr-4">
                  <Users className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Unified Network</h3>
                  <p className="text-gray-400 text-sm mt-1">Connect with healthcare facilities across Nigeria</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-800 p-2 rounded-[0.3rem] mr-4">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Analytics</h3>
                  <p className="text-gray-400 text-sm mt-1">Access insights for better patient care management</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-800 p-2 rounded-[0.3rem] mr-4">
                  <Database className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Interoperable System</h3>
                  <p className="text-gray-400 text-sm mt-1">FHIR standards for seamless data exchange</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-300 text-sm text-center">
                Already registered? <Link to="/signin" className="font-semibold underline hover:text-emerald-400">Sign in here</Link>
              </p>
            </div>
          </div>
          
          {/* Right: Form Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[0.3rem] shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-10 w-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Hospital Registration</h2>
                <p className="text-gray-600 mt-2">Complete the form below to join our network</p>
              </div>
              
              {/* react-hook-form handles validation and submission via handleSubmit */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Hospital Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="hospitalname" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Hospital Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="hospitalname"
                        {...register('hospitalname')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-4 py-2.5 text-gray-900 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${
                          errors.hospitalname ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="Enter hospital name"
                      />
                    </div>
                    {errors.hospitalname && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.hospitalname.message}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label htmlFor="hospitaladdress" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Hospital Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="hospitaladdress"
                        {...register('hospitaladdress')}
                        disabled={isSubmitting}
                        rows={3}
                        className={`block w-full pl-10 pr-4 py-2.5 text-gray-900 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors resize-none ${
                          errors.hospitaladdress ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="Enter complete hospital address"
                      />
                    </div>
                    {errors.hospitaladdress && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.hospitaladdress.message}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div className="md:col-span-2">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">
                      State *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="state"
                        {...register('state')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-4 py-2.5 text-gray-900 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${
                          errors.state ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">Select State</option>
                        {nigerianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    {errors.state && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-4 py-2.5 text-gray-900 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${
                          errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="hospital@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-4 py-2.5 text-gray-900 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${
                          errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        {...register('password')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-12 py-2.5 text-gray-900 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${
                          errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="Create a secure password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {watchedPassword && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Password strength:</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.strength < 50 ? 'text-red-600' : 
                            passwordStrength.strength < 75 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-[0.3rem] h-1.5">
                          <div 
                            className={`h-1.5 rounded-[0.3rem] transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        {...register('confirmPassword')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-12 py-2.5 text-gray-900 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${
                          errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isSubmitting}
                          className="text-gray-400 hover:text-gray-600 mr-2 disabled:cursor-not-allowed"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        {watch('confirmPassword') && watch('password') === watch('confirmPassword') && !errors.confirmPassword && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register('terms')}
                    disabled={isSubmitting}
                    className="h-4 w-4 mt-0.5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded-[0.2rem] disabled:cursor-not-allowed"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.terms.message}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-[0.3rem] font-semibold text-white transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600/50 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Registering...
                    </div>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 text-white" /> Register Hospital
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
    <Footer/>
    </>
  );
};

export default Signup;