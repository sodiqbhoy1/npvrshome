import React, { useEffect, useMemo, useState } from 'react'
import { Users, Mail, Phone, MapPin, Calendar, ArrowLeft, Eye, Search, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllPatientsForAdmin } from '../../services/superAdminService'

// Helper: format ISO dates to a friendly date string
const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  return isNaN(d.getTime())
    ? (typeof value === 'string' && value.includes('T') ? value.split('T')[0] : String(value))
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Helper: calculate age from date of birth
const calculateAge = (dob) => {
  if (!dob) return '—'
  const birthDate = new Date(dob)
  if (isNaN(birthDate.getTime())) return '—'
  const ageDiff = Date.now() - birthDate.getTime()
  const ageDate = new Date(ageDiff)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

// Superadmin Patients: list + detail view
const Patients = () => {
  const [patients, setPatients] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const data = await getAllPatientsForAdmin()
        
        // Extract patients array from response
        const list = data?.patients || []
        setPatients(list)
      } catch (e) {
        toast.error(e?.message || 'Failed to load patients')
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(p =>
      (p.full_name || '').toLowerCase().includes(q) ||
      (p.patient_code || '').toLowerCase().includes(q) ||
      (p.patient_uuid || '').toLowerCase().includes(q) ||
      (p.phone || '').toLowerCase().includes(q)
    )
  }, [patients, query])

  // Detail view
  if (selected) {
    return (
      <div className="space-y-4 w-full">
        <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to patients
        </button>

        <div className="bg-white rounded-[0.3rem] border border-gray-200 p-4 sm:p-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 rounded-[0.3rem] bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{selected.full_name}</h2>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Patient Code: {selected.patient_code}</p>
              </div>
            </div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-[0.3rem] text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              Age: {calculateAge(selected.dob)}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 text-gray-700">
              <User className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Gender</p>
                <p className="font-medium break-words">{selected.gender || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-gray-700">
              <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Date of Birth</p>
                <p className="font-medium break-words">{formatDate(selected.dob)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-gray-700">
              <Phone className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium break-words">{selected.phone || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-gray-700">
              <Mail className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Blood Group</p>
                <p className="font-medium break-words">{selected.blood_group || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-gray-700 sm:col-span-2">
              <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Address</p>
                <p className="font-medium break-words">{selected.address || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-gray-700">
              <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Registered</p>
                <p className="font-medium break-words">{formatDate(selected.created_at)}</p>
              </div>
            </div>
          </div>

          {selected.underlying_sickness && (
            <div className="mt-6 p-4 bg-gray-50 rounded-[0.3rem] border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Underlying Sickness</p>
              <p className="text-sm text-gray-800 break-words">{selected.underlying_sickness}</p>
            </div>
          )}

          <div className="mt-4 p-4 bg-gray-50 rounded-[0.3rem] border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Patient UUID</p>
            <p className="text-sm font-mono text-gray-800 break-all">{selected.patient_uuid}</p>
          </div>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-700 flex-shrink-0" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">All Patients</h2>
          {!loading && <span className="text-sm text-gray-500">({patients.length})</span>}
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, code or phone"
            className="w-full pl-10 pr-3 py-2.5 text-sm rounded-[0.3rem] border border-gray-300 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[0.3rem] border border-gray-200 p-8 sm:p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-emerald-600"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading patients...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[0.3rem] border border-gray-200 overflow-hidden">
          {/* Mobile card view */}
          <div className="block sm:hidden divide-y divide-gray-200">
            {filtered.map((p, idx) => {
              const key = p.id || p.patient_uuid || idx
              return (
                <div key={key} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2 rounded-[0.3rem] bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{p.full_name || '—'}</div>
                        <div className="text-xs font-mono text-gray-600 truncate">{p.patient_code || '—'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[0.3rem] text-xs text-emerald-700 hover:text-white hover:bg-emerald-600 border border-emerald-200 transition-colors flex-shrink-0"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-500">Age:</span> <span className="text-gray-700">{calculateAge(p.dob)}</span></div>
                    <div><span className="text-gray-500">Gender:</span> <span className="text-gray-700">{p.gender || '—'}</span></div>
                    <div className="col-span-2"><span className="text-gray-500">Phone:</span> <span className="text-gray-700">{p.phone || '—'}</span></div>
                    <div><span className="text-gray-500">Blood:</span> <span className="text-gray-700">{p.blood_group || '—'}</span></div>
                    <div><span className="text-gray-500">Registered:</span> <span className="text-gray-700">{formatDate(p.created_at)}</span></div>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">
                {query ? 'No patients match your search.' : 'No patients registered yet.'}
              </div>
            )}
          </div>

          {/* Desktop table view */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-700">
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Patient</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Patient Code</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Age</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Gender</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Blood Group</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Registered</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => {
                  const key = p.id || p.patient_uuid || idx
                  return (
                    <tr key={key} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-[0.3rem] bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="font-medium text-gray-900 truncate max-w-[200px]">{p.full_name || '—'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-700 whitespace-nowrap">{p.patient_code || '—'}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{calculateAge(p.dob)}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{p.gender || '—'}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{p.phone || '—'}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{p.blood_group || '—'}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatDate(p.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(p)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[0.3rem] text-emerald-700 hover:text-white hover:bg-emerald-600 border border-emerald-200 transition-colors whitespace-nowrap"
                        >
                          <Eye className="h-4 w-4" /> View
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                      {query ? 'No patients match your search.' : 'No patients registered yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patients
