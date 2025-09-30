import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Profile from './Profile';
import Patients from './Patients';
import AddPatients from './AddPatients';
import Visits from './Visits';

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* The main content area is pushed to the right to account for the fixed sidebar */}
      <main className="ml-64 p-6 md:p-8">
        {/* The content itself is rendered directly without an extra container */}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'patients' && <Patients />}
        {activeTab === 'visits' && <Visits />}
        {activeTab === 'add' && <AddPatients />}
      </main>
    </div>
  );
};

export default HospitalDashboard;