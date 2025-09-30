import React from 'react';
import { User, Users, PlusCircle, LogOut, Heart, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all items from localStorage
    localStorage.clear();
    // Redirect to the signin page
    navigate('/signin');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col bg-white border-r border-gray-200 py-6 px-4 z-30">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <div className="bg-emerald-600 p-2 rounded-[0.3rem]">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">NPVRS</h2>
          <p className="text-xs text-gray-500">Hospital Panel</p>
        </div>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full flex items-center px-4 py-2.5 rounded-[0.3rem] font-medium gap-3 transition-colors ${
                activeTab === 'profile' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-5 w-5" /> Profile
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-2.5 rounded-[0.3rem] font-medium gap-3 transition-colors ${
                activeTab === 'patients' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('patients')}
            >
              <Users className="h-5 w-5" /> Patients
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-2.5 rounded-[0.3rem] font-medium gap-3 transition-colors ${
                activeTab === 'visits' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('visits')}
            >
              <Stethoscope className="h-5 w-5" /> Visits
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-2.5 rounded-[0.3rem] font-medium gap-3 transition-colors ${
                activeTab === 'add' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('add')}
            >
              <PlusCircle className="h-5 w-5" /> Add Patient
            </button>
          </li>
        </ul>
      </nav>
      <div className="mt-auto pt-6">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-[0.3rem] font-semibold hover:bg-emerald-700 transition-colors"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
