import React, { useState } from 'react';
import {
  User, Phone, HeartPulse, AlertCircle, Home, Calendar, Droplet, Stethoscope,
  Transgender
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { addPatient } from '../../services/hospitalService';

// Allowed blood groups for dropdown
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Yup validation schema
const schema = yup.object({
  name: yup.string().trim().min(2, 'Enter at least 2 characters').required('Name is required'),
  address: yup.string().trim().min(5, 'Enter a valid address').required('Address is required'),
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('is-valid-date', 'Invalid date', (v) => !!v && !isNaN(new Date(v).getTime())),
  bloodGroup: yup.string().oneOf(BLOOD_GROUPS, 'Select a valid blood group').required('Blood group is required'),
  underlyingSickness: yup.string().trim().max(500, 'Keep it under 500 characters').optional(),
  gender: yup.string().oneOf(['Male', 'Female', 'Other'], 'Select a valid gender').required('Gender is required'),
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/, 'Enter a valid phone number')
    .required('Phone is required'),
}).required();

const AddPatients = () => {
  const [success, setSuccess] = useState(false);

  // React Hook Form setup with Yup
  const {
    register,
    handleSubmit,
    reset,
    setError, // to map server field errors into the form
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      address: '',
      dateOfBirth: '',
      bloodGroup: '',
      underlyingSickness: '',
      gender: '',
      phone: '',
    },
  });

  // Submit: calls your API service
  const onSubmit = async (values) => {
    try {
      // Ensure dateOfBirth is ISO string (common backend format)
      const payload = {
        ...values,
        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
      };

      await addPatient(payload); // Service should attach Authorization internally
      toast.success('Patient registered successfully');
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // Map backend validation errors to form fields if provided
      if (err?.fieldErrors && typeof err.fieldErrors === 'object') {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          setError(field, { type: 'server', message: message || 'Invalid value' });
        });
      }
      toast.error(err?.message || 'Failed to register patient');
    }
  };

  return (
    <div className="w-full bg-white rounded-[0.3rem] border border-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6"> Enroll New Patient</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              {...register('name')}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Enter patient name"
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
          <div className="relative">
            <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              rows={2}
              {...register('address')}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors resize-none ${
                errors.address ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Enter address"
            />
          </div>
          {errors.address && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Date of Birth and Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                {...register('dateOfBirth')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${
                  errors.dateOfBirth ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              />
            </div>
            {errors.dateOfBirth && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
            <div className="relative">
              <Transgender className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                {...register('gender')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors appearance-none ${
                  errors.gender ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {errors.gender && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone and Blood Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register('phone')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors ${
                  errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Phone number"
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
            <div className="relative">
              <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                {...register('bloodGroup')}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors appearance-none ${
                  errors.bloodGroup ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            {errors.bloodGroup && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.bloodGroup.message}
              </p>
            )}
          </div>
        </div>

        {/* Underlying Sickness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Underlying Sickness (Optional)</label>
          <div className="relative">
            <Stethoscope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              rows={3}
              {...register('underlyingSickness')}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors resize-none ${
                errors.underlyingSickness ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="e.g., Hypertension, Asthma"
            />
          </div>
          {errors.underlyingSickness && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.underlyingSickness.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-[0.3rem] font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          <HeartPulse className="h-5 w-5" />
          {isSubmitting ? 'Enrolling Patient...' : 'Enroll Patient'}
        </button>

        {success && (
          <div className="text-green-600 text-center font-medium mt-2">
            Patient added successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default AddPatients;
