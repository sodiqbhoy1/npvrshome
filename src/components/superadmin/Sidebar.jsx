import React, { useState } from 'react'
import { Shield, LayoutDashboard, Building2, Users, UserCircle2, Settings, ChevronsLeft, ChevronsRight, LogOut } from 'lucide-react'

// Props: { activeTab, setActiveTab, collapsed, setCollapsed, onClose? }
const Sidebar = ({ activeTab, setActiveTab, collapsed = false, setCollapsed = () => {}, onClose, onLogout }) => {
  const items = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" /> },
    { key: 'hospitals', label: 'Hospitals', icon: <Building2 className="h-5 w-5" /> },
    { key: 'patients', label: 'Patients', icon: <Users className="h-5 w-5" /> },
    { key: 'profile', label: 'Profile', icon: <UserCircle2 className="h-5 w-5" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ]

  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <aside className={`h-full flex flex-col bg-white border-r border-blue-100 shadow-lg ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Brand + collapse */}
      <div className="flex items-center justify-between gap-2 px-3 py-4 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg text-white">
            <Shield className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">NPVRS Admin</p>
              <p className="text-[11px] text-gray-600 -mt-0.5">Super Console</p>
            </div>
          )}
        </div>
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-1">
        {items.map(item => {
          const active = activeTab === item.key
          return (
            <button
              key={item.key}
              title={collapsed ? item.label : undefined}
              onClick={() => {
                setActiveTab(item.key)
                if (onClose) onClose()
              }}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-2.5 text-sm font-medium transition rounded-lg
              ${active ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'}`}
            >
              <span className={`shrink-0 ${active ? 'text-white' : 'text-gray-600'}`}>{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-2">
        <button
          onClick={() => {
            // Open confirmation UI instead of logging out immediately
            setConfirmOpen(true)
          }}
          title="Logout"
          className={`w-full inline-flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-2 px-3 py-2 rounded-lg text-rose-700 border border-rose-200 hover:bg-rose-50`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>

        {confirmOpen && (
          <div role="dialog" aria-labelledby="logout-title" className="mt-2 rounded-lg border border-rose-200 bg-white shadow p-3">
            <p id="logout-title" className="text-sm font-medium text-gray-900">Confirm logout</p>
            <p className="text-xs text-gray-600 mt-1">You’ll be signed out and returned to the login page.</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    if (typeof localStorage !== 'undefined') {
                      localStorage.removeItem('superAdminToken')
                    }
                  } catch { /* ignore storage errors */ }
                  if (typeof onLogout === 'function') {
                    onLogout()
                  } else {
                    window.location.href = '/superadmin/signin'
                  }
                }}
                className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-sm"
              >
                Yes, logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer small */}
      <div className={`px-3 py-3 border-t border-blue-100 text-[11px] text-gray-500 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed ? '© ' : ''}{new Date().getFullYear()} NPVRS
      </div>
    </aside>
  )
}

export default Sidebar
