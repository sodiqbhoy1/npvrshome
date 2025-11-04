import React, { useState, useEffect } from 'react'
import { UserCircle2, Mail, User, Pencil, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { getSuperAdminProfile } from '../../services/superAdminService'

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState(profile)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await getSuperAdminProfile()
        
        // Extract admin data from response
        const admin = data?.admin || data || {}
        const profileData = {
          name: admin.name || admin.username || '',
          email: admin.email || ''
        }
        setProfile(profileData)
        setForm(profileData)
      } catch (e) {
        toast.error(e?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const onCancel = () => {
    setForm(profile)
    setEdit(false)
  }

  const onSave = () => {
    // minimal validation
    if (!form.name.trim()) return toast.error('Name is required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error('Enter a valid email')
    setProfile(form)
    setEdit(false)
    toast.success('Profile updated')
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[0.3rem] border border-gray-200 p-8 sm:p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-emerald-600"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 sm:p-3 rounded-[0.3rem] bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
          <UserCircle2 className="h-6 w-6 sm:h-8 sm:w-8" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Super Admin Profile</h2>
          <p className="text-xs sm:text-sm text-gray-600 truncate">Manage your basic information</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-[0.3rem] border border-gray-200 p-4 sm:p-6">
        {!edit ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Name</p>
              <div className="flex items-center gap-2 text-gray-800 break-words">
                <User className="h-5 w-5 text-gray-500 flex-shrink-0" /> 
                <span>{profile.name || '—'}</span>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Email</p>
              <div className="flex items-center gap-2 text-gray-800 break-words">
                <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" /> 
                <span>{profile.email || '—'}</span>
              </div>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => { setForm(profile); setEdit(true) }} 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[0.3rem] text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors w-full sm:w-auto"
              >
                <Pencil className="h-4 w-4" /> Edit profile
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <input 
                  value={form.name} 
                  onChange={e=>setForm({...form, name: e.target.value})} 
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-[0.3rem] border border-gray-300 focus:outline-none focus:border-emerald-500 transition-colors" 
                  placeholder="Enter your name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={e=>setForm({...form, email: e.target.value})} 
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-[0.3rem] border border-gray-300 focus:outline-none focus:border-emerald-500 transition-colors" 
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={onSave} 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[0.3rem] text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                <Save className="h-4 w-4" /> Save changes
              </button>
              <button 
                onClick={onCancel} 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[0.3rem] text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
