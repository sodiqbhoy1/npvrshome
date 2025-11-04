import { useEffect, useState } from 'react';
import { getAllPatients } from '../../services/hospitalService';
import { Search } from 'lucide-react';

const Patients = () => {
  // Loaded patients from API
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  // Fetch patients on mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getAllPatients();
        // Log the raw response for debugging
        console.log('Patients fetched:', data);

        // Accept array or { patients: [...] }
        const list = Array.isArray(data) ? data : data?.patients || [];
        setPatients(list);
      } catch (e) {
        console.error('Failed to fetch patients:', e);
        setPatients([]);
      }
    };
    loadPatients();
  }, []);

  // Helper to safely read fields that match your API response
  const normalize = (p) => {
    const card = p.patient_code ;
    const name = p.full_name ;
    const gender = p.gender || '—';
    const phone = p.phone ;
    const condition = p.underlying_sickness ;
    const address = p.address ;
    const bloodGroup = p.blood_group ;
    const age =
      typeof p.age === 'number'
        ? p.age
        : p.dob
        ? Math.max(
            0,
            Math.floor((Date.now() - new Date(p.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          )
        : '—';
    return { card, name, age, gender, phone, condition, address, bloodGroup };
  };

  const filtered = patients.filter((p) => {
    const { name, card } = normalize(p);
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || String(card).toLowerCase().includes(q);
  });

  if (selected) {
    const s = normalize(selected);
    // Patient detail view
    return (
      <div className="w-full bg-white rounded-[0.3rem] border border-gray-200 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Patient Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div><span className="font-semibold text-gray-700">Patient Code:</span> {s.card}</div>
          <div><span className="font-semibold text-gray-700">Name:</span> {s.name}</div>
          <div><span className="font-semibold text-gray-700">Age:</span> {s.age}</div>
          <div><span className="font-semibold text-gray-700">Gender:</span> {s.gender}</div>
          <div><span className="font-semibold text-gray-700">Phone:</span> {s.phone}</div>
          <div><span className="font-semibold text-gray-700">Blood Group:</span> {s.bloodGroup}</div>
          <div className="sm:col-span-2"><span className="font-semibold text-gray-700">Underlying Condition:</span> {s.condition}</div>
          <div className="sm:col-span-2"><span className="font-semibold text-gray-700">Address:</span> {s.address}</div>
        </div>
        <div className="flex gap-4">
          <button
            className="bg-emerald-600 text-white px-6 py-2 rounded-[0.3rem] font-semibold text-sm hover:bg-emerald-700 transition-colors"
            onClick={() => window.print()}
          >
            Print Card
          </button>
          <button
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-[0.3rem] font-semibold text-sm hover:bg-gray-100 transition-colors"
            onClick={() => setSelected(null)}
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[0.3rem] border border-gray-200 p-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Patients List</h2>
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-[0.3rem] focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Search by name or patient code..."
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Patient Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Age</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gender</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Blood Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => {
              const s = normalize(p);
              const key = p.id ?? p.patientId ?? p.patient_uuid ?? idx;
              return (
                <tr key={key} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.card}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.age}</td>
                  <td className="px-4 py-3 text-gray-600">{s.gender}</td>
                  <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{s.bloodGroup}</td>
                  <td className="px-4 py-3">
                    <button
                      className="bg-emerald-600 text-white px-3 py-1 rounded-[0.3rem] font-semibold text-xs hover:bg-emerald-700 transition-colors"
                      onClick={() => setSelected(p)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
