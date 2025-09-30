import React from 'react'
import { Building2, Users } from 'lucide-react'

const Card = ({ icon, label, value, tint }) => (
  <div className={`rounded-2xl border ${tint.border} bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur p-4 shadow-sm`}>
    <div className="flex items-center justify-between">
      <div className={`flex items-center gap-2 ${tint.text}`}>{icon}<span className="text-sm font-medium">{label}</span></div>
      <span className="text-lg font-semibold text-gray-900">{value}</span>
    </div>
  </div>
)

const Overview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card icon={<Building2 className="h-5 w-5" />} label="Hospitals" value="128" tint={{ border: 'border-indigo-100', text: 'text-indigo-700' }} />
      <Card icon={<Users className="h-5 w-5" />} label="Patients" value="34,560" tint={{ border: 'border-indigo-100', text: 'text-indigo-700' }} />
    </div>
  )
}

export default Overview
