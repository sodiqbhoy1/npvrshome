import { useEffect, useState } from 'react';
import { getAllPatients } from '../../services/hospitalService';

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

  // Helper to safely read fields that might differ in API
  const normalize = (p) => {
    const card =
      p.card || p.cardNo || p.cardNumber || p.patientCard || p.patientId || p.id || '—';
    const name = p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || '—';
    const gender = p.gender || '—';
    const phone = p.phone || p.phoneNumber || '—';
    const condition = p.underlyingSickness || p.condition || '—';
    const address = p.address || '—';
    const bloodGroup = p.bloodGroup || '—';
    const age =
      typeof p.age === 'number'
        ? p.age
        : p.dateOfBirth
        ? Math.max(
            0,
            Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
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
      <div className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        <h2 className="text-xl font-bold text-blue-700 mb-6">Patient Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div><span className="font-semibold text-gray-700">Card No:</span> {s.card}</div>
          <div><span className="font-semibold text-gray-700">Name:</span> {s.name}</div>
          <div><span className="font-semibold text-gray-700">Age:</span> {s.age}</div>
          <div><span className="font-semibold text-gray-700">Gender:</span> {s.gender}</div>
          <div><span className="font-semibold text-gray-700">Phone:</span> {s.phone}</div>
          <div><span className="font-semibold text-gray-700">Condition:</span> {s.condition}</div>
          <div><span className="font-semibold text-gray-700">Blood Group:</span> {s.bloodGroup}</div>
          <div className="sm:col-span-2"><span className="font-semibold text-gray-700">Address:</span> {s.address}</div>
        </div>
        <div className="flex gap-4">
          <button
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:shadow-lg"
            onClick={() => window.print()}
          >
            Print Card
          </button>
          <button
            className="bg-white border border-blue-200 text-blue-700 px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50"
            onClick={() => setSelected(null)}
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto w-full">
      <h2 className="text-xl font-bold text-blue-700 mb-6">Patients List</h2>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs border border-blue-200 rounded-lg px-4 py-2 outline-none focus:ring-0 focus:border-blue-500"
          placeholder="Search by name or card number..."
        />
      </div>
      <table className="min-w-full divide-y divide-blue-100">
        <thead>
          <tr className="bg-blue-50">
            <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase">Card No</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase">Name</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase">Age</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase">Gender</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase">Phone</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase">Condition</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, idx) => {
            const s = normalize(p);
            const key = p.id ?? p.patientId ?? s.card ?? idx;
            return (
              <tr key={key} className="hover:bg-blue-50">
                <td className="px-4 py-2 font-medium text-gray-900">{s.card}</td>
                <td className="px-4 py-2 font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-2 text-gray-700">{s.age}</td>
                <td className="px-4 py-2 text-gray-700">{s.gender}</td>
                <td className="px-4 py-2 text-gray-700">{s.phone}</td>
                <td className="px-4 py-2 text-gray-700">{s.condition}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-3 py-1 rounded-lg font-semibold text-xs hover:shadow-lg"
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
  );
};

export default Patients;
