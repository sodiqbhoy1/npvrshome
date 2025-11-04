import axios from 'axios';
import { API_URL } from '../api/api';

// Simple and beginner-friendly service using axios
// Usage: await registerHospital({ hospitalName, address, email, phone, password })
export async function registerHospital(payload) {
	try {
    const url = `${API_URL}/hospital/register.php`;
		const { data } = await axios.post(url, payload);
		return data; // e.g., { id, name, email, createdAt } or { token, hospital }
	} catch (err) {
		// Pass through backend errors if available, else a basic message
		const message = err?.response?.data?.message || 'Unable to register hospital';
		const fieldErrors = err?.response?.data?.fieldErrors;
		const status = err?.response?.status || 0;
		throw { status, message, fieldErrors };
	}
}


// login function for the hospital
export async function loginHospital(payload){
	try {
		const url = `${API_URL}/hospital/login.php`;	
		const {data} = await axios.post(url, payload);
		return data;
	} catch (error) {
		const message = error?.response?.data?.message || 'Unable to login hospital';
		const fieldErrors = error?.response?.data?.fieldErrors;
		const status = error?.response?.status || 0;
		throw { status, message, fieldErrors };
	}
}

// get hospital profile function
export async function getHospitalProfile(token) {
  try {
    const url = `${API_URL}/hospital/profile.php`;

    const stored =
      typeof localStorage !== 'undefined' &&
      (localStorage.getItem('hospitalToken') || localStorage.getItem('token'));

    const authToken = token ?? stored;
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;

    const { data } = await axios.get(url, { headers });

    // If your backend returns { profile: {...} }, you can do:
    // return data.profile;
    return data;
  } catch (error) {
    const res = error?.response;
    const payload = res?.data || {};
    const message = payload.message || payload.error || 'Unable to fetch hospital profile';
    const fieldErrors = payload.fieldErrors;
    const status = res?.status ?? 0;

    // Optional: if (status === 401) localStorage.removeItem('hospitalToken');

    throw { status, message, fieldErrors };
  }
}

// function to add patient
export async function addPatient(payload, token) {
  try {
	const url = `${API_URL}/hospital/add_patient.php`;
	const authToken = token || (typeof localStorage !== 'undefined' && (localStorage.getItem('hospitalToken') || localStorage.getItem('token')));
	const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
	const { data } = await axios.post(url, payload, { headers });
	return data;
  } catch (error) {
	const res = error?.response;
	const payload = res?.data || {};
	const message = payload.message || payload.error || 'Unable to add patient';
	const fieldErrors = payload.fieldErrors;
	const status = res?.status ?? 0;
	throw { status, message, fieldErrors };
	  }
	}

	// function to get all patients
export async function getAllPatients(token) {
  try {
	const url = `${API_URL}/hospital/patients.php`;
	const authToken = token || (typeof localStorage !== 'undefined' && (localStorage.getItem('hospitalToken') || localStorage.getItem('token')));
	const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
	const { data } = await axios.get(url, { headers });
	return data;
  } catch (error) {
	const res = error?.response;
	const payload = res?.data || {};
	const message = payload.message || payload.error || 'Unable to fetch patients';
	const fieldErrors = payload.fieldErrors;
	const status = res?.status ?? 0;
	throw { status, message, fieldErrors };
	  }	
	}

// Visits: create a new visit for a patient (patientPublicId = six-digit ID)
export async function createVisit(patientPublicId, payload, token) {
  try {
    const url = `${API_URL}/hospital/create_visit.php`;
    const authToken = token || (typeof localStorage !== 'undefined' && (localStorage.getItem('hospitalToken') || localStorage.getItem('token')));
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    const { data } = await axios.post(url, payload, { headers });
    return data; // { message, visit }
  } catch (error) {
    const res = error?.response;
    const payload = res?.data || {};
    const message = payload.message || payload.error || 'Unable to create visit';
    const fieldErrors = payload.fieldErrors;
    const status = res?.status ?? 0;
    throw { status, message, fieldErrors };
  }
}

// Visits: list all visits for a patient (by patient_code)
export async function getPatientVisits(patientCode, token) {
  try {
    const url = `${API_URL}/hospital/patient_visits.php?patient_code=${encodeURIComponent(patientCode)}`;
    const authToken = token || (typeof localStorage !== 'undefined' && (localStorage.getItem('hospitalToken') || localStorage.getItem('token')));
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    const { data } = await axios.get(url, { headers });
    return data; // { status: true, visits: [...] }
  } catch (error) {
    const res = error?.response;
    const payload = res?.data || {};
    const message = payload.message || payload.error || 'Unable to fetch visits';
    const fieldErrors = payload.fieldErrors;
    const status = res?.status ?? 0;
    throw { status, message, fieldErrors };
  }
}

// Visits: fetch a single visit by numeric ID
export async function getVisitById(visitId, token) {
  try {

    const url = `${API_URL}/hospital/patient_visits.php`;
    const authToken = token || (typeof localStorage !== 'undefined' && (localStorage.getItem('hospitalToken') || localStorage.getItem('token')));
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    const { data } = await axios.get(url, { headers });
    return data; // full visit
  } catch (error) {
    const res = error?.response;
    const payload = res?.data || {};
    const message = payload.message || payload.error || 'Unable to fetch visit';
    const fieldErrors = payload.fieldErrors;
    const status = res?.status ?? 0;
    throw { status, message, fieldErrors };
  }
}


// forgot password function for the hospital
export async function forgotPassword(payload) {
  try {
    const url = `${API_URL}/hospital/forgot_password.php`;
    const { data } = await axios.post(url, payload);
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || 'Unable to process forgot password request';
    const fieldErrors = error?.response?.data?.fieldErrors;
    const status = error?.response?.status || 0;
    throw { status, message, fieldErrors };
  }
}

// reset password function for the hospital
export async function resetPassword(payload) {
  try {
    const url = `${API_URL}/hospital/reset_password.php`;
    const { data } = await axios.post(url, payload);
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || 'Unable to reset password';
    const fieldErrors = error?.response?.data?.fieldErrors;
    const status = error?.response?.status || 0;
    throw { status, message, fieldErrors };
  }
}

