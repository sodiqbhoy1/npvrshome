import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Shield, Users, Activity, Settings } from 'lucide-react'

const Homepage = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  Super Admin Console for NPVRS
                </h1>
                <p className="mt-4 text-gray-700">
                  Manage hospitals, users, and platform settings with secure controls and clear oversight.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#features" className="px-5 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg shadow hover:shadow-md transition">Explore features</a>
                  <a href="/superadmin/signin" className="px-5 py-3 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition">Sign in</a>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-blue-100 shadow-xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <span className="text-gray-800 font-medium">Security</span>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-100 flex items-center gap-3">
                    <Users className="h-6 w-6 text-green-600" />
                    <span className="text-gray-800 font-medium">Hospitals</span>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-center gap-3">
                    <Activity className="h-6 w-6 text-blue-600" />
                    <span className="text-gray-800 font-medium">Monitoring</span>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-100 flex items-center gap-3">
                    <Settings className="h-6 w-6 text-green-600" />
                    <span className="text-gray-800 font-medium">Settings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Homepage
