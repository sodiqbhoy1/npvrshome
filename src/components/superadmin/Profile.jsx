import React, { useState } from 'react'
import { UserCircle2, Mail, User, Pencil, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  // Dummy initial data
  const [profile, setProfile] = useState({ name: 'Super Admin', email: 'admin@npvrs.gov' })
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState(profile)

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

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
          <UserCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Super Admin Profile</h2>
          <p className="text-sm text-gray-600">Manage your basic information</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6">
        {!edit ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Name</p>
              <div className="flex items-center gap-2 text-gray-800"><User className="h-5 w-5 text-gray-500" /> {profile.name}</div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Email</p>
              <div className="flex items-center gap-2 text-gray-800"><Mail className="h-5 w-5 text-gray-500" /> {profile.email}</div>
            </div>
            <div>
              <button onClick={() => { setForm(profile); setEdit(true) }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow">
                <Pencil className="h-5 w-5" /> Edit profile
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={onSave} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow">
                <Save className="h-5 w-5" /> Save changes
              </button>
              <button onClick={onCancel} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200">
                <X className="h-5 w-5" /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
