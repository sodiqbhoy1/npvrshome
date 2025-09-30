import { Building2, Mail, MapPin, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { getHospitalProfile } from '../../services/hospitalService';

const Profile = () => {
  // fetch hospital data from local storage or API
  const [hospital, setHospital] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getHospitalProfile();
      setHospital(data);
      console.log(data);
    };
    fetchProfile();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-full">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-700">{hospital.name}</h2>
          <p className="text-gray-500">Hospital ID: {hospital.hospitalId} </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-blue-500" />
          <span className="text-gray-700">{hospital.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-green-500" />
          <span className="text-gray-700">{hospital.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-blue-500" />
          <span className="text-gray-700">{hospital.address}</span>
        </div>
        
      </div>
      <div className="flex flex-wrap gap-6 mt-4">
        
        <div className="bg-green-50 rounded-lg px-6 py-4 text-center">
          <div className="text-2xl font-bold text-green-700">  { new Date( hospital.createdAt).toDateString()}</div>
          <div className="text-xs text-gray-500">Registered On</div>
        </div>
      </div>
    </div>
  );
}

export default Profile