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
  Pill,
  User,
  Search,
  Plus,
  X,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createVisit,
  getPatientVisits,
  getVisitById,
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
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .typeError('Weight must be a number')
    .positive('Enter a valid weight')
    .optional(),
  temperature: yup
    .number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .typeError('Temperature must be a number')
    .optional(),
  heartRate: yup
    .number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .typeError('Heart rate must be a number')
    .optional(),
  respirationRate: yup
    .number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .typeError('Respiration rate must be a number')
    .optional(),
  symptoms: yup.string().trim().optional(),
  diagnosis: yup.string().trim().optional(),
  prescription: yup.string().trim().optional(),
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
      prescription: '',
    },
  });

  // Load all visits for patient
  const loadVisits = async () => {
    if (!patientId.trim()) {
      toast.error('Enter a patient code');
      return;
    }
    try {
      setLoadingList(true);
      const data = await getPatientVisits(patientId.trim());
      console.log('Visits fetched:', data);
      const visitsList = data?.visits || [];
      setVisits(Array.isArray(visitsList) ? visitsList : []);
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
      toast.error('Enter a patient code first');
      return;
    }
    try {
      setCreating(true);
      const payload = {
        patient_code: patientId.trim(),
        ...values,
        visitDate: values.visitDate ? new Date(values.visitDate).toISOString() : undefined,
        // Convert empty strings to undefined, and numbers properly
        weight: values.weight === '' ? undefined : Number(values.weight),
        temperature: values.temperature === '' ? undefined : Number(values.temperature),
        heartRate: values.heartRate === '' ? undefined : Number(values.heartRate),
        respirationRate: values.respirationRate === '' ? undefined : Number(values.respirationRate),
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

  // Quick summary line for table
  const summary = (v) => {
    const parts = [];
    if (v.blood_pressure) parts.push(`BP ${v.blood_pressure}`);
    if (v.temperature) parts.push(`Temp ${v.temperature}°C`);
    if (v.weight) parts.push(`Wt ${v.weight}kg`);
    if (v.heart_rate) parts.push(`HR ${v.heart_rate}`);
    if (v.respiration_rate) parts.push(`RR ${v.respiration_rate}`);
    return parts.join(' · ') || '—';
  };

  // Detail view
  if (selected) {
    const v = selected;
    return (
      <div className="w-full space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Visits
        </button>

        <div className="bg-white rounded-[0.3rem] border border-gray-200 p-4 sm:p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 rounded-[0.3rem] bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Visit Details</h2>
              <p className="text-xs sm:text-sm text-gray-600">{formatDate(v.visit_date)}</p>
            </div>
          </div>

          {loadingVisit ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-emerald-600"></div>
              <p className="mt-4 text-sm text-gray-600">Loading visit details...</p>
            </div>
          ) : (
            <>
              {/* Vitals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Blood Pressure</p>
                    <p className="font-medium text-gray-800">{v.blood_pressure || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HeartPulse className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Weight (kg)</p>
                    <p className="font-medium text-gray-800">{v.weight ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Thermometer className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Temperature (°C)</p>
                    <p className="font-medium text-gray-800">{v.temperature ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Heart Rate</p>
                    <p className="font-medium text-gray-800">{v.heart_rate ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wind className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Respiration Rate</p>
                    <p className="font-medium text-gray-800">{v.respiration_rate ?? '—'}</p>
                  </div>
                </div>
              </div>

              {/* Clinical Information */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="h-4 w-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase">Symptoms</p>
                  </div>
                  <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">{v.symptoms || '—'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 uppercase">Diagnosis</p>
                  </div>
                  <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">{v.diagnosis || '—'}</p>
                </div>
                {v.prescription && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="h-4 w-4 text-gray-500" />
                      <p className="text-xs font-medium text-gray-500 uppercase">Prescription</p>
                    </div>
                    <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">{v.prescription}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="h-5 w-5 text-emerald-700 flex-shrink-0" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Patient Visits</h2>
      </div>

      <div className="bg-white rounded-[0.3rem] border border-gray-200 p-4 sm:p-6 space-y-4">
        {/* Patient ID input + actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient code (e.g., 416863)"
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-[0.3rem] border border-gray-300 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            onClick={loadVisits}
            disabled={loadingList}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[0.3rem] text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Search className="h-4 w-4" /> {loadingList ? 'Loading...' : 'Load Visits'}
          </button>
          <button
            onClick={() => setShowCreate((s) => !s)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[0.3rem] text-sm font-medium border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap"
          >
            {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showCreate ? 'Close' : 'New Visit'}
          </button>
        </div>

        {/* Create Visit form */}
        {showCreate && (
          <form
            onSubmit={handleSubmitVisit(onCreateVisit)}
            className="border border-gray-200 rounded-[0.3rem] p-4 space-y-4"
          >
            <p className="text-sm font-medium text-gray-700">Record New Visit</p>
            
            {/* Vitals Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Visit Date</label>
                <input
                  type="date"
                  {...registerVisit('visitDate')}
                  className={`w-full px-3 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                    vErrors.visitDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Blood Pressure</label>
                <input
                  type="text"
                  placeholder="e.g., 120/80"
                  {...registerVisit('bloodPressure')}
                  className={`w-full px-3 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                    vErrors.bloodPressure ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  {...registerVisit('weight')}
                  className={`w-full px-3 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                    vErrors.weight ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {vErrors.weight && (
                  <p className="text-xs text-red-600 mt-1">{vErrors.weight.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  {...registerVisit('temperature')}
                  className={`w-full px-3 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                    vErrors.temperature ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {vErrors.temperature && (
                  <p className="text-xs text-red-600 mt-1">{vErrors.temperature.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Heart Rate</label>
                <input
                  type="number"
                  {...registerVisit('heartRate')}
                  className={`w-full px-3 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                    vErrors.heartRate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {vErrors.heartRate && (
                  <p className="text-xs text-red-600 mt-1">{vErrors.heartRate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Respiration Rate</label>
                <input
                  type="number"
                  {...registerVisit('respirationRate')}
                  className={`w-full px-3 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 transition-colors ${
                    vErrors.respirationRate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {vErrors.respirationRate && (
                  <p className="text-xs text-red-600 mt-1">{vErrors.respirationRate.message}</p>
                )}
              </div>
            </div>

            {/* Clinical Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Symptoms</label>
                <textarea
                  rows={4}
                  {...registerVisit('symptoms')}
                  className={`w-full px-3 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 resize-none transition-colors ${
                    vErrors.symptoms ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Describe symptoms"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Diagnosis</label>
                <textarea
                  rows={4}
                  {...registerVisit('diagnosis')}
                  className={`w-full px-3 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 resize-none transition-colors ${
                    vErrors.diagnosis ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter diagnosis"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-gray-500" />
                  <span>Prescription</span>
                </div>
              </label>
              <textarea
                rows={5}
                {...registerVisit('prescription')}
                className={`w-full px-3 py-2.5 text-sm rounded-[0.3rem] border outline-none focus:border-emerald-500 resize-none transition-colors ${
                  vErrors.prescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter prescription details (e.g., Drug name, dosage, frequency, duration, instructions)"
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  resetVisit();
                  setShowCreate(false);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[0.3rem] text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button
                type="submit"
                disabled={vSubmitting || creating}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[0.3rem] text-sm font-medium text-white transition-colors ${
                  vSubmitting || creating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <Calendar className="h-4 w-4" /> {vSubmitting || creating ? 'Saving…' : 'Save Visit'}
              </button>
            </div>
          </form>
        )}

        {/* Visits table */}
        <div className="overflow-x-auto border border-gray-200 rounded-[0.3rem]">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-3 font-medium whitespace-nowrap">Date</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Vitals Summary</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Diagnosis</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-emerald-600"></div>
                    <p className="mt-2">Loading visits...</p>
                  </td>
                </tr>
              ) : visits.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                    No visits found. Enter a patient code and click "Load Visits".
                  </td>
                </tr>
              ) : (
                visits.map((row) => (
                  <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{formatDate(row.visit_date)}</td>
                    <td className="px-4 py-3 text-gray-700">{summary(row)}</td>
                    <td className="px-4 py-3 text-gray-700">{row.diagnosis || '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openVisit(row)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[0.3rem] text-emerald-700 hover:text-white hover:bg-emerald-600 border border-emerald-200 transition-colors whitespace-nowrap"
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
    </div>
  );
};

export default Visits;