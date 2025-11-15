import { Building2, Mail, MapPin, Phone, Calendar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getHospitalProfile } from '../../services/hospitalService';

const Profile = () => {
  // fetch hospital data from local storage or API
  const [hospital, setHospital] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getHospitalProfile();
        
        // Extract the hospital object from the response
        setHospital(data?.hospital || {});
      } catch (error) {
        console.error("Failed to fetch hospital profile:", error);
        setHospital({});
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="bg-white rounded-[0.3rem] border border-gray-200 p-6 sm:p-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="bg-emerald-600 p-4 rounded-[0.3rem] flex-shrink-0">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{hospital.name || 'Hospital Name'}</h2>
          <p className="text-gray-500">Hospital Code: {hospital.hospital_code || 'N/A'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-gray-800">{hospital.email || '—'}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="text-gray-800">{hospital.phone || '—'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:col-span-2">
          <MapPin className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="text-gray-800">{hospital.address || '—'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Registered On</h3>
            <p className="text-gray-800">
              {hospital.created_at ? new Date(hospital.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;