import React, { useState } from 'react';
import { User, Users as UsersIcon, UserPlus } from 'lucide-react';

import Sidebar from '../../hospital/Sidebar';
import Profile from '../../hospital/Profile';
import Patients from '../../hospital/Patients';
import AddPatients from '../../hospital/AddPatients';
import Visits from '../../hospital/Visits';


const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'patients':
        return <Patients />;
      case 'add':
        return <AddPatients />;
      case 'visits':
        return <Visits />;
      default:
        return <Profile />;
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col md:flex-row">
        {/* Sidebar for desktop */}
        <div className="hidden md:block md:w-64 bg-white border-r border-blue-100 shadow-lg md:h-screen md:fixed md:left-0 md:top-0">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        {/* Sidebar toggle for mobile */}
        <button
          className="md:hidden fixed top-4 left-4 z-40 bg-gradient-to-r from-blue-600 to-green-600 text-white p-2 rounded-lg shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          &#9776;
        </button>
        {/* Collapsible Sidebar for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-64 bg-white border-r border-blue-100 shadow-lg">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}
        {/* Main content full width, responsive to sidebar */}
        <div className="flex-1 p-2 sm:p-4 lg:p-8 transition-all duration-300 md:ml-64 mt-14 md:mt-0">
          <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
            {/* Sticky dashboard header with quick tabs */}
            <div className="sticky top-2 z-10">
              <div className="bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur rounded-xl border border-blue-100 shadow-sm p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {activeTab === 'profile' && <User className="h-5 w-5 text-blue-600" />}
                    {activeTab === 'patients' && <UsersIcon className="h-5 w-5 text-blue-600" />}
                    {activeTab === 'add' && <UserPlus className="h-5 w-5 text-blue-600" />}
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-800 capitalize">{activeTab}</h1>
                  </div>
                  <div className="inline-flex rounded-lg border border-blue-200 bg-white p-1 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTab('profile')}
                      className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition ${
                        activeTab === 'profile'
                          ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow'
                          : 'text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden xs:inline">Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('patients')}
                      className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition ${
                        activeTab === 'patients'
                          ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow'
                          : 'text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <UsersIcon className="h-4 w-4" />
                      <span className="hidden xs:inline">Patients</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('add')}
                      className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition ${
                        activeTab === 'add'
                          ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow'
                          : 'text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden xs:inline">Add Patient</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Content card */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-10 min-h-[60vh] w-full overflow-x-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalDashboard;
