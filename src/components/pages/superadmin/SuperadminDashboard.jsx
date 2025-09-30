import React, { useState } from 'react'
import Sidebar from '../../superadmin/Sidebar'
import Hospitals from '../../superadmin/Hospital'
import Patients from '../../superadmin/Patients'
import Profile from '../../superadmin/Profile'
import { LayoutDashboard, Building2, Users, UserCircle2, Settings, Menu } from 'lucide-react'
import Overview from '../../superadmin/Overview'

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
          <div className="bg-white rounded-[0.3rem] border border-gray-200 p-6 text-gray-700">Settings coming soon…</div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop fixed sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen">
        <Sidebar activeTab={active} setActiveTab={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)} className="md:hidden fixed top-4 left-4 z-40 bg-emerald-600 text-white p-2 rounded-[0.3rem]">
        <Menu className="h-6 w-6" />
      </button>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 bg-white h-full border-r border-gray-200">
            <Sidebar activeTab={active} setActiveTab={(k)=>{setActive(k); setMobileOpen(false)}} />
          </div>
          <div className="flex-1 bg-black/30" onClick={()=>setMobileOpen(false)} />
        </div>
      )}

      {/* Right content area */}
      <div className={`transition-all duration-300 px-4 sm:px-6 lg:px-8 py-6 ${collapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        {/* Sticky header with tab pills */}
        <div className="sticky top-4 z-10">
          <div className="bg-white border border-gray-200 rounded-[0.3rem] p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                {active === 'overview' && <LayoutDashboard className="h-5 w-5 text-emerald-700" />}
                {active === 'hospitals' && <Building2 className="h-5 w-5 text-emerald-700" />}
                {active === 'patients' && <Users className="h-5 w-5 text-emerald-700" />}
                {active === 'profile' && <UserCircle2 className="h-5 w-5 text-emerald-700" />}
                {active === 'settings' && <Settings className="h-5 w-5 text-emerald-700" />}
                <h1 className="text-lg font-semibold text-gray-800 capitalize">{active}</h1>
              </div>
              <div className="inline-flex rounded-[0.3rem] border border-gray-200 bg-white p-1 self-start sm:self-auto">
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
                    className={`px-3 py-1.5 rounded-[0.3rem] text-sm font-medium flex items-center gap-2 transition-colors ${
                      active === item.k
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
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

        {/* Main content */}
        <div className="mt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default SuperadminDashboard
