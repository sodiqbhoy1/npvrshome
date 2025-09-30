import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Calendar,
  Stethoscope,
  FileText,
  Thermometer,
  HeartPulse,
  Activity,
  Wind,
  NotebookPen,
  Pill,
  User,
  Search,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createVisit,
  getPatientVisits,
  getVisitById,
  addPrescription,
} from '../../services/hospitalService';

// Helper: format a date to a friendly string
const formatDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d.getTime())
    ? (typeof v === 'string' && v.includes('T') ? v.split('T')[0] : String(v))
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Visit creation validation
const visitSchema = yup.object({
  visitDate: yup.string().optional(),
  bloodPressure: yup.string().trim().optional(),
  weight: yup
    .number()
    .typeError('Weight must be a number')
    .positive('Enter a valid weight')
    .optional(),
  temperature: yup.number().typeError('Temperature must be a number').optional(),
  heartRate: yup.number().typeError('Heart rate must be a number').optional(),
  respirationRate: yup
    .number()
    .typeError('Respiration rate must be a number')
    .optional(),
  symptoms: yup.string().trim().optional(),
  diagnosis: yup.string().trim().optional(),
  notes: yup.string().trim().optional(),
});

// Prescription validation
const rxSchema = yup.object({
  drugName: yup.string().trim().required('Drug name is required'),
  dosage: yup.string().trim().optional(),
  frequency: yup.string().trim().optional(),
  duration: yup.string().trim().optional(),
  instructions: yup.string().trim().optional(),
  prescribedBy: yup.string().trim().optional(),
});

const Visits = () => {
  // Patient public ID input
  const [patientId, setPatientId] = useState('');
  // List of visits for patient
  const [visits, setVisits] = useState([]);
  // Selected visit (detail view)
  const [selected, setSelected] = useState(null);
  // UI state
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // RHF for creating visit
  const {
    register: registerVisit,
    handleSubmit: handleSubmitVisit,
    reset: resetVisit,
    formState: { errors: vErrors, isSubmitting: vSubmitting },
  } = useForm({
    resolver: yupResolver(visitSchema),
    defaultValues: {
      visitDate: '',
      bloodPressure: '',
      weight: '',
      temperature: '',
      heartRate: '',
      respirationRate: '',
      symptoms: '',
      diagnosis: '',
      notes: '',
    },
  });

  // RHF for adding prescription
  const {
    register: registerRx,
    handleSubmit: handleSubmitRx,
    reset: resetRx,
    formState: { errors: rxErrors, isSubmitting: rxSubmitting },
  } = useForm({
    resolver: yupResolver(rxSchema),
    defaultValues: {
      drugName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      prescribedBy: '',
    },
  });

  // Load all visits for patient
  const loadVisits = async () => {
    if (!patientId.trim()) {
      toast.error('Enter a patient ID');
      return;
    }
    try {
      setLoadingList(true);
      const data = await getPatientVisits(patientId.trim());
      console.log('Visits fetched:', data);
      setVisits(Array.isArray(data) ? data : []);
      setSelected(null);
      setShowCreate(false);
    } catch (e) {
      toast.error(e?.message || 'Failed to fetch visits');
      setVisits([]);
    } finally {
      setLoadingList(false);
    }
  };

  // Open detail and ensure we have the latest visit data
  const openVisit = async (visit) => {
    try {
      setLoadingVisit(true);
      const full = await getVisitById(visit.id);
      console.log('Visit fetched:', full);
      setSelected(full || visit);
    } catch (e) {
      setSelected(visit);
      toast.error(e?.message || 'Failed to load visit');
    } finally {
      setLoadingVisit(false);
    }
  };

  // Create a new visit
  const onCreateVisit = async (values) => {
    if (!patientId.trim()) {
      toast.error('Enter a patient ID first');
      return;
    }
    try {
      setCreating(true);
      const payload = {
        ...values,
        visitDate: values.visitDate ? new Date(values.visitDate).toISOString() : undefined,
        // Convert empty strings to undefined, and numbers properly
        weight: values.weight === '' ? undefined : Number(values.weight),
        temperature: values.temperature === '' ? undefined : Number(values.temperature),
        heartRate: values.heartRate === '' ? undefined : Number(values.heartRate),
        respirationRate:
          values.respirationRate === '' ? undefined : Number(values.respirationRate),
      };
      const res = await createVisit(patientId.trim(), payload);
      toast.success(res?.message || 'Visit recorded');
      resetVisit();
      setShowCreate(false);
      await loadVisits(); // refresh list
    } catch (e) {
      toast.error(e?.message || 'Failed to create visit');
    } finally {
      setCreating(false);
    }
  };

  // Add a prescription to the selected visit
  const onAddRx = async (values) => {
    if (!selected?.id) return;
    try {
      const res = await addPrescription(selected.id, values);
      toast.success(res?.message || 'Prescription added');
      resetRx();
      // Refresh selected visit to include the new prescription
      const full = await getVisitById(selected.id);
      setSelected(full);
    } catch (e) {
      toast.error(e?.message || 'Failed to add prescription');
    }
  };

  // Quick summary line for table
  const summary = (v) => {
    const parts = [];
    if (v.bloodPressure) parts.push(`BP ${v.bloodPressure}`);
    if (v.temperature) parts.push(`Temp ${v.temperature}°C`);
    if (v.weight) parts.push(`Wt ${v.weight}kg`);
    if (v.heartRate) parts.push(`HR ${v.heartRate}`);
    if (v.respirationRate) parts.push(`RR ${v.respirationRate}`);
    return parts.join(' · ') || '—';
  };

  // List view
  if (!selected) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl p-4 sm:p-8 lg:p-10 space-y-6">
        <h2 className="text-xl font-bold text-blue-700">Patient Visits</h2>

        {/* Patient ID input + actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="relative sm:flex-1">
            <User className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
            <input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient public ID (e.g., 123456)"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-200 outline-none focus:ring-0 focus:border-blue-500"
            />
          </div>
          <button
            onClick={loadVisits}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            <Search className="h-5 w-5" /> Load Visits
          </button>
          <button
            onClick={() => setShowCreate((s) => !s)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-5 w-5" /> {showCreate ? 'Close' : 'New Visit'}
          </button>
        </div>

        {/* Create Visit form */}
        {showCreate && (
          <form
            onSubmit={handleSubmitVisit(onCreateVisit)}
            className="border border-blue-100 rounded-xl p-4 sm:p-6 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Visit Date</label>
                <div className="relative">
                  <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="date"
                    {...registerVisit('visitDate')}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border outline-none focus:ring-0 ${
                      vErrors.visitDate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Blood Pressure</label>
                <div className="relative">
                  <Activity className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g., 120/80"
                    {...registerVisit('bloodPressure')}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border outline-none focus:ring-0 ${
                      vErrors.bloodPressure ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Weight (kg)</label>
                <div className="relative">
                  <HeartPulse className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="number"
                    step="0.1"
                    {...registerVisit('weight')}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border outline-none focus:ring-0 ${
                      vErrors.weight ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
                {vErrors.weight && (
                  <p className="text-sm text-red-600 mt-1">{vErrors.weight.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Temperature (°C)</label>
                <div className="relative">
                  <Thermometer className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="number"
                    step="0.1"
                    {...registerVisit('temperature')}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border outline-none focus:ring-0 ${
                      vErrors.temperature ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
                {vErrors.temperature && (
                  <p className="text-sm text-red-600 mt-1">{vErrors.temperature.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Heart Rate</label>
                <div className="relative">
                  <Activity className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="number"
                    {...registerVisit('heartRate')}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border outline-none focus:ring-0 ${
                      vErrors.heartRate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
                {vErrors.heartRate && (
                  <p className="text-sm text-red-600 mt-1">{vErrors.heartRate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Respiration Rate</label>
                <div className="relative">
                  <Wind className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="number"
                    {...registerVisit('respirationRate')}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border outline-none focus:ring-0 ${
                      vErrors.respirationRate
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
                {vErrors.respirationRate && (
                  <p className="text-sm text-red-600 mt-1">
                    {vErrors.respirationRate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Symptoms</label>
                <div className="relative">
                  <Stethoscope className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                  <textarea
                    rows={3}
                    {...registerVisit('symptoms')}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border outline-none focus:ring-0 resize-none ${
                      vErrors.symptoms ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Symptoms"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Diagnosis</label>
                <div className="relative">
                  <FileText className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                  <textarea
                    rows={3}
                    {...registerVisit('diagnosis')}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border outline-none focus:ring-0 resize-none ${
                      vErrors.diagnosis
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Diagnosis"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Notes</label>
              <div className="relative">
                <NotebookPen className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                <textarea
                  rows={3}
                  {...registerVisit('notes')}
                  className={`w-full pl-10 pr-3 py-3 rounded-lg border outline-none focus:ring-0 resize-none ${
                    vErrors.notes ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Additional notes"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  resetVisit();
                  setShowCreate(false);
                }}
                className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={vSubmitting || creating}
                className={`px-4 py-2 rounded-lg text-white shadow ${
                  vSubmitting || creating
                    ? 'bg-gradient-to-r from-blue-400 to-green-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
                }`}
              >
                {vSubmitting || creating ? 'Saving…' : 'Save Visit'}
              </button>
            </div>
          </form>
        )}

        {/* Visits table */}
        <div className="overflow-x-auto border border-blue-100 rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50">
              <tr className="text-left text-blue-700">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Summary</th>
                <th className="px-4 py-3 font-semibold">Diagnosis</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={4}>
                    Loading visits…
                  </td>
                </tr>
              ) : visits.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={4}>
                    No visits yet.
                  </td>
                </tr>
              ) : (
                visits.map((row) => (
                  <tr key={row.id} className="border-t border-blue-100 hover:bg-blue-50/40">
                    <td className="px-4 py-3 text-gray-800">{formatDate(row.visitDate)}</td>
                    <td className="px-4 py-3 text-gray-700">{summary(row)}</td>
                    <td className="px-4 py-3 text-gray-700">{row.diagnosis || '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openVisit(row)}
                        className="px-3 py-1.5 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Detail view
  const v = selected;
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-4 sm:p-8 lg:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-blue-700">Visit Detail</h2>
        <button
          onClick={() => setSelected(null)}
          className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          Back to Visits
        </button>
      </div>

      {loadingVisit ? (
        <div className="text-gray-600">Loading visit…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="font-semibold text-gray-700">Date:</span> {formatDate(v.visitDate)}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Blood Pressure:</span>{' '}
              {v.bloodPressure || '—'}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Weight:</span> {v.weight ?? '—'}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Temperature:</span>{' '}
              {v.temperature ?? '—'}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Heart Rate:</span>{' '}
              {v.heartRate ?? '—'}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Respiration Rate:</span>{' '}
              {v.respirationRate ?? '—'}
            </div>
            <div className="sm:col-span-2">
              <span className="font-semibold text-gray-700">Symptoms:</span> {v.symptoms || '—'}
            </div>
            <div className="sm:col-span-2">
              <span className="font-semibold text-gray-700">Diagnosis:</span> {v.diagnosis || '—'}
            </div>
            <div className="sm:col-span-2">
              <span className="font-semibold text-gray-700">Notes:</span> {v.notes || '—'}
            </div>
            {v?.patient && (
              <div className="sm:col-span-2">
                <span className="font-semibold text-gray-700">Patient:</span>{' '}
                {v.patient.name || '—'} (ID: {v.patient.patientId || '—'})
              </div>
            )}
          </div>

          {/* Prescriptions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-600" /> Prescriptions
            </h3>

            {Array.isArray(v.prescriptions) && v.prescriptions.length > 0 ? (
              <div className="overflow-x-auto border border-blue-100 rounded-xl">
                <table className="min-w-full text-sm">
                  <thead className="bg-blue-50">
                    <tr className="text-left text-blue-700">
                      <th className="px-4 py-2 font-semibold">Drug</th>
                      <th className="px-4 py-2 font-semibold">Dosage</th>
                      <th className="px-4 py-2 font-semibold">Frequency</th>
                      <th className="px-4 py-2 font-semibold">Duration</th>
                      <th className="px-4 py-2 font-semibold">Instructions</th>
                      <th className="px-4 py-2 font-semibold">Prescribed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {v.prescriptions.map((p) => (
                      <tr key={p.id} className="border-t border-blue-100">
                        <td className="px-4 py-2">{p.drugName}</td>
                        <td className="px-4 py-2">{p.dosage || '—'}</td>
                        <td className="px-4 py-2">{p.frequency || '—'}</td>
                        <td className="px-4 py-2">{p.duration || '—'}</td>
                        <td className="px-4 py-2">{p.instructions || '—'}</td>
                        <td className="px-4 py-2">{p.prescribedBy || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-600">No prescriptions yet.</div>
            )}

            {/* Add Prescription Form */}
            <form
              onSubmit={handleSubmitRx(onAddRx)}
              className="border border-blue-100 rounded-xl p-4 sm:p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Drug Name</label>
                  <div className="relative">
                    <Pill className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      {...registerRx('drugName')}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border outline-none focus:ring-0 ${
                        rxErrors.drugName
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="e.g., Amoxicillin"
                    />
                  </div>
                  {rxErrors.drugName && (
                    <p className="text-sm text-red-600 mt-1">{rxErrors.drugName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    {...registerRx('dosage')}
                    className="w-full pr-3 py-3 rounded-lg border border-gray-300 outline-none focus:ring-0 hover:border-gray-400"
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    {...registerRx('frequency')}
                    className="w-full pr-3 py-3 rounded-lg border border-gray-300 outline-none focus:ring-0 hover:border-gray-400"
                    placeholder="e.g., 2x daily"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    {...registerRx('duration')}
                    className="w-full pr-3 py-3 rounded-lg border border-gray-300 outline-none focus:ring-0 hover:border-gray-400"
                    placeholder="e.g., 7 days"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Instructions</label>
                  <input
                    type="text"
                    {...registerRx('instructions')}
                    className="w-full pr-3 py-3 rounded-lg border border-gray-300 outline-none focus:ring-0 hover:border-gray-400"
                    placeholder="e.g., after meals"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Prescribed By</label>
                  <input
                    type="text"
                    {...registerRx('prescribedBy')}
                    className="w-full pr-3 py-3 rounded-lg border border-gray-300 outline-none focus:ring-0 hover:border-gray-400"
                    placeholder="Doctor's name"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => resetRx()}
                  className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={rxSubmitting}
                  className={`px-4 py-2 rounded-lg text-white shadow ${
                    rxSubmitting
                      ? 'bg-gradient-to-r from-blue-400 to-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
                  }`}
                >
                  {rxSubmitting ? 'Adding…' : 'Add Prescription'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Visits;