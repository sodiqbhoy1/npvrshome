import axios from "axios";
import { API_URL } from "../api/api";

// function to register super admin
// Usage: await registerSuperAdmin({ fullName, email, password })
export async function registerSuperAdmin(payload) {
    try{
        const url = `${API_URL}/api/superadmin/register`;
        const {data} = await axios.post(url,payload)
        return data;
    }

    catch(err){
        // Pass through backend errors if available, else a basic message
		const message = err?.response?.data?.message || 'Unable to register super admin';
		const fieldErrors = err?.response?.data?.fieldErrors;
		const status = err?.response?.status || 0;
		throw { status, message, fieldErrors };

    }
}


// function to login super admin
export async function loginSuperAdmin(payload){
	try {
		const url = `${API_URL}/api/superadmin/login`;
		const {data} = await axios.post(url, payload);
		return data;
	} catch (error) {
		const message = error?.response?.data?.message || 'Unable to login super admin';
		const fieldErrors = error?.response?.data?.fieldErrors;
		const status = error?.response?.status || 0;
		throw { status, message, fieldErrors };
	}
}

// function to get all hospitals
export async function getAllHospitals(token){
	try{
		const url = `${API_URL}/api/superadmin/hospitals`;
		// Resolve token: prefer explicit arg, else read from localStorage
		const authToken = token || (typeof localStorage !== 'undefined' && (localStorage.getItem('superAdminToken') || localStorage.getItem('token')));
		const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
		const {data} = await axios.get(url, { headers });
		return data;
	}
	catch(err){
		const message = err?.response?.data?.message || 'Unable to fetch hospitals';
		const fieldErrors = err?.response?.data?.fieldErrors;
		const status = err?.response?.status || 0;
		throw { status, message, fieldErrors };
	}
}

// function to approve hospital
export async function approveHospital(hospitalId, token){
	try{
		const url = `${API_URL}/api/superadmin/hospitals/${hospitalId}/approve`;	
		const authToken = token || (typeof localStorage !== 'undefined' && (localStorage.getItem('superAdminToken') || localStorage.getItem('token')));
		const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
		const {data} = await axios.put(url, {}, { headers });
		return data;
	}
	catch(err){
		const message = err?.response?.data?.message ;
		const fieldErrors = err?.response?.data?.fieldErrors;
		const status = err?.response?.status || 0;
		throw { status, message, fieldErrors };
	}
}
