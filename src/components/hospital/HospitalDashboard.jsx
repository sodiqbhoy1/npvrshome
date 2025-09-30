import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Profile from './Profile';
import Patients from './Patients';
import AddPatients from './AddPatients';
import Visits from './Visits';

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'patients' && <Patients />}
        {activeTab === 'visits' && <Visits />}
        {activeTab === 'add' && <AddPatients />}
      </main>
    </div>
  );
};

export default HospitalDashboard;