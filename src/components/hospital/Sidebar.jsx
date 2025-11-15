import React, { useState } from 'react';
import { User, Users, PlusCircle, LogOut, Heart, Stethoscope, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    // Show the confirmation modal instead of logging out directly
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Clear all items from localStorage
    localStorage.removeItem('hospitalToken');
    // Show a success message
    toast.success('You have been logged out.');
    // Redirect to the signin page
    navigate('/signin');
  };

  const cancelLogout = () => {
    // Hide the modal
    setShowLogoutModal(false);
  };

  return (
    <>
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
                <PlusCircle className="h-5 w-5" /> Enroll Patient
              </button>
            </li>
          </ul>
        </nav>
        <div className="mt-auto pt-6">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-[0.3rem] font-semibold hover:bg-emerald-700 transition-colors"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-[0.3rem] border border-gray-200 p-6 max-w-sm w-full mx-4 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to log out? You will be returned to the sign-in page.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded-[0.3rem] text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-[0.3rem] text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
