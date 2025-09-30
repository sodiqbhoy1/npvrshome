import React, { useState } from 'react'
import Sidebar from '../../superadmin/Sidebar'
import Hospitals from '../../superadmin/Hospital'
import Patients from '../../superadmin/Patients'
import Profile from '../../superadmin/Profile'
import { LayoutDashboard, Building2, Users, UserCircle2, Settings } from 'lucide-react'
import Overview from '../../superadmin/Overview'

// Distinct visual style vs hospital dashboard: indigo/purple accents, glassy header cards.
const SuperadminDashboard = () => {
  const [active, setActive] = useState('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const renderContent = () => {
    switch (active) {
      case 'overview':
        return <Overview/>
      case 'hospitals':
        return <Hospitals />
      case 'patients':
        return <Patients />
      case 'profile':
        return <Profile />
      case 'settings':
        return (
          <div className="bg-white rounded-xl border border-indigo-100 p-6 text-gray-700">Settings coming soon…</div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Desktop fixed sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen">
        <Sidebar activeTab={active} setActiveTab={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)} className="md:hidden fixed top-4 left-4 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg shadow-lg">☰</button>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 bg-white shadow-lg h-full">
            <Sidebar activeTab={active} setActiveTab={(k)=>{setActive(k); setMobileOpen(false)}} />
          </div>
          <div className="flex-1 bg-black/20" onClick={()=>setMobileOpen(false)} />
        </div>
      )}

      {/* Right content area */}
      <div className={`transition-all duration-300 px-3 sm:px-6 lg:px-10 py-6 ${collapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        {/* Sticky header with tab pills, styled differently from hospital */}
        <div className="sticky top-3 z-10">
          <div className="bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur rounded-2xl border border-indigo-100 shadow-sm p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                {active === 'overview' && <LayoutDashboard className="h-5 w-5 text-indigo-700" />}
                {active === 'hospitals' && <Building2 className="h-5 w-5 text-indigo-700" />}
                {active === 'patients' && <Users className="h-5 w-5 text-indigo-700" />}
                {active === 'profile' && <UserCircle2 className="h-5 w-5 text-indigo-700" />}
                {active === 'settings' && <Settings className="h-5 w-5 text-indigo-700" />}
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800 capitalize">{active}</h1>
              </div>
              <div className="inline-flex rounded-xl border border-indigo-200 bg-white p-1 self-start sm:self-auto">
                {[
                  { k: 'overview', icon: LayoutDashboard, l: 'Overview' },
                  { k: 'hospitals', icon: Building2, l: 'Hospitals' },
                  { k: 'patients', icon: Users, l: 'Patients' },
                  { k: 'profile', icon: UserCircle2, l: 'Profile' },
                  { k: 'settings', icon: Settings, l: 'Settings' }
                ].map((item) => (
                  <button
                    key={item.k}
                    onClick={() => setActive(item.k)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                      active === item.k
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow'
                        : 'text-indigo-700 hover:bg-indigo-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden xs:inline">{item.l}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="mt-4 bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-10 min-h-[60vh] w-full overflow-x-auto border border-indigo-100">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default SuperadminDashboard
