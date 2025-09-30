import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Shield, Users, Activity, Settings } from 'lucide-react';

const Homepage = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  Super Admin Console for NPVRS
                </h1>
                <p className="mt-4 text-gray-600 text-lg">
                  Manage hospitals, users, and platform settings with secure controls and clear oversight.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="#features" className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-[0.3rem] hover:bg-emerald-700 transition-colors">
                    Explore Features
                  </a>
                  <a href="/superadmin/signin" className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-[0.3rem] hover:bg-gray-100 transition-colors">
                    Sign In
                  </a>
                </div>
              </div>
              <div className="bg-white rounded-[0.3rem] border border-gray-200 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-[0.3rem] bg-gray-100 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-emerald-600" />
                    <span className="text-gray-800 font-medium">Security</span>
                  </div>
                  <div className="p-4 rounded-[0.3rem] bg-gray-100 flex items-center gap-3">
                    <Users className="h-6 w-6 text-emerald-600" />
                    <span className="text-gray-800 font-medium">Hospitals</span>
                  </div>
                  <div className="p-4 rounded-[0.3rem] bg-gray-100 flex items-center gap-3">
                    <Activity className="h-6 w-6 text-emerald-600" />
                    <span className="text-gray-800 font-medium">Monitoring</span>
                  </div>
                  <div className="p-4 rounded-[0.3rem] bg-gray-100 flex items-center gap-3">
                    <Settings className="h-6 w-6 text-emerald-600" />
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
  );
};

export default Homepage;
