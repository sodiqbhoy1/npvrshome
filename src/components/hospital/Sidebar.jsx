import React from 'react';
import { User, Users, PlusCircle, LogOut, Heart, Stethoscope } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
  <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col bg-white rounded-r-2xl shadow-lg py-8 px-4 z-30">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-blue-700">NPVRS</h2>
          <p className="text-xs text-gray-500">Hospital Panel</p>
        </div>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium gap-3 transition-colors ${activeTab === 'profile' ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-5 w-5" /> Profile
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium gap-3 transition-colors ${activeTab === 'patients' ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}
              onClick={() => setActiveTab('patients')}
            >
              <Users className="h-5 w-5" /> Patients
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium gap-3 transition-colors ${activeTab === 'visits' ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}
              onClick={() => setActiveTab('visits')}
            >
              <Stethoscope className="h-5 w-5" /> Visits
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium gap-3 transition-colors ${activeTab === 'add' ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}
              onClick={() => setActiveTab('add')}
            >
              <PlusCircle className="h-5 w-5" /> Add Patient
            </button>
          </li>
        </ul>
      </nav>
      <div className="mt-auto pt-8">
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
