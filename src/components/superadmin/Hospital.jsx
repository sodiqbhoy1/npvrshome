import React, { useEffect, useMemo, useState } from 'react'
import { Building2, Mail, Phone, MapPin, Calendar, ArrowLeft, Eye, CheckCircle2, XCircle, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllHospitals, approveHospital } from '../../services/superAdminService'

// Helper: format ISO dates to a friendly date string
const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  return isNaN(d.getTime())
    ? (typeof value === 'string' && value.includes('T') ? value.split('T')[0] : String(value))
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Superadmin Hospitals: list + detail view with Approve/Reject
const Hospital = () => {
  const [hospitals, setHospitals] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null) // holds hospital object when viewing
  const [approvingId, setApprovingId] = useState(null) // loading state for Approve action

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getAllHospitals()
        setHospitals(data || [])
      } catch (e) {
        toast.error(e?.message || 'Failed to load hospitals')
      }
    }
    fetchHospitals()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return hospitals
    return hospitals.filter(h =>
      (h.name || '').toLowerCase().includes(q) ||
      (h.email || '').toLowerCase().includes(q) ||
      String(h.hospitalId || '').toLowerCase().includes(q)
    )
  }, [hospitals, query])

  const setStatus = (hospitalId, approvedValue) => {
    setHospitals(prev => prev.map(h => (
      h.hospitalId === hospitalId
        ? { ...h, approved: approvedValue, status: approvedValue === 1 ? 'approved' : 'not_approved' }
        : h
    )))
  }

  // Call backend to approve, then sync UI
  const handleApprove = async (h) => {
    try {
      setApprovingId(h.hospitalId)
      // Call your API; service includes Authorization header logic
      const resp = await approveHospital(h.hospitalId)
      const updated = resp?.hospital ?? resp ?? {}
      // Backend returns approved: true; normalize to 1 for UI
      const approvedValue = updated?.approved === true || updated?.approved === 1 ? 1 : 0
      setStatus(h.hospitalId, approvedValue)
      // Keep detail view in sync if open
      setSelected(prev =>
        prev && prev.hospitalId === h.hospitalId
          ? { ...prev, approved: approvedValue, status: approvedValue === 1 ? 'approved' : 'not_approved' }
          : prev
      )
      toast.success(`${updated?.name || h.name || 'Hospital'} approved`)
    } catch (e) {
      toast.error(e?.message || 'Error approving hospital')
    } finally {
      setApprovingId(null)
    }
  }

  // Local-only reject for now (no backend endpoint provided)
  const handleReject = (h) => {
    setStatus(h.hospitalId, 0)
    setSelected(prev =>
      prev && prev.hospitalId === h.hospitalId
        ? { ...prev, approved: 0, status: 'not_approved' }
        : prev
    )
    toast.error(`${h.name} set to not approved`)
  }

  const StatusBadge = ({ status }) => {
    // Accept numeric (0/1), boolean, or string
    const s = typeof status === 'number'
      ? status
      : typeof status === 'boolean'
        ? (status ? 1 : 0)
        : String(status || '').toLowerCase() === 'approved' || String(status) === '1' || String(status) === 'true'
          ? 1 : 0

    const isApproved = s === 1
    const cls = isApproved
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-amber-50 text-amber-700 border-amber-200'
    const label = isApproved ? 'Approved' : 'Not approved'
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>{label}</span>
  }

  // Detail view
  if (selected) {
    const isApproving = approvingId === selected.hospitalId
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-indigo-700 hover:text-purple-700 font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to hospitals
        </button>

        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selected.name}</h2>
                <p className="text-sm text-gray-600">ID: {selected.hospitalId}</p>
              </div>
            </div>
            <StatusBadge status={selected.approved ?? selected.status} />
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-700"><Mail className="h-5 w-5 text-gray-500" /><span>{selected.email}</span></div>
            <div className="flex items-center gap-3 text-gray-700"><Phone className="h-5 w-5 text-gray-500" /><span>{selected.phone}</span></div>
            <div className="flex items-center gap-3 text-gray-700"><MapPin className="h-5 w-5 text-gray-500" /><span>{selected.address}</span></div>
            <div className="flex items-center gap-3 text-gray-700"><Calendar className="h-5 w-5 text-gray-500" /><span>Applied: {formatDate(selected.createdAt)}</span></div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => handleApprove(selected)}
              disabled={isApproving}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow ${isApproving ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              <CheckCircle2 className="h-5 w-5" /> {isApproving ? 'Approving…' : 'Approve'}
            </button>
            <button
              onClick={() => handleReject(selected)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-rose-600 hover:bg-rose-700 shadow"
            >
              <XCircle className="h-5 w-5" /> Reject
            </button>
          </div>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Hospitals</h2>
        <div className="relative w-full sm:w-80">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Search by name, email or ID"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-indigo-100 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-50/60">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-3 font-medium">Hospital</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Applied</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(h => (
              <tr key={h.hospitalId} className="border-t border-indigo-100 hover:bg-indigo-50/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100"><Building2 className="h-5 w-5" /></div>
                    <div>
                      <div className="font-medium text-gray-900">{h.name}</div>
                      <div className="text-xs text-gray-500">ID: {h.hospitalId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{h.email}</td>
                <td className="px-4 py-3 text-gray-700">{h.phone}</td>
                <td className="px-4 py-3 text-gray-700">{formatDate(h.createdAt)}</td>
                <td className="px-4 py-3"><StatusBadge status={h.approved ?? h.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={()=>setSelected(h)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-indigo-700 hover:text-white hover:bg-indigo-600 border border-indigo-200">
                    <Eye className="h-4 w-4" /> View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No hospitals match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Hospital
