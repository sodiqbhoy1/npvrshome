import axios from "axios";
import { API_URL } from "../api/api";

// function to register admin
export async function registerSuperAdmin(payload) {
    try{
        const url = `${API_URL}/admin/admin_register.php`;
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
        const url = `${API_URL}/admin/admin_login.php`;
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
        const url = `${API_URL}/admin/admin_hospital.php`;
        // Resolve token: prefer explicit arg, else read from localStorage
        const authToken = token || (typeof localStorage !== 'undefined' && localStorage.getItem('superAdminToken'));
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
        const url = `${API_URL}/admin/admin_approve_hospital.php`;	
        const authToken = token || (typeof localStorage !== 'undefined' && localStorage.getItem('superAdminToken'));
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
        const {data} = await axios.post(url, { hospitalId }, { headers });
        return data;
    }
    catch(err){
        const message = err?.response?.data?.message || 'Unable to approve hospital';
        const fieldErrors = err?.response?.data?.fieldErrors;
        const status = err?.response?.status || 0;
        throw { status, message, fieldErrors };
    }
}

// function to get all patients
export async function getAllPatientsForAdmin(token){
    try{
        const url = `${API_URL}/admin/admin_patients.php`;
        const authToken = token || (typeof localStorage !== 'undefined' && localStorage.getItem('superAdminToken'));
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
        const {data} = await axios.get(url, { headers });
        return data;
    }
    catch(err){
        const message = err?.response?.data?.message || 'Unable to fetch patients';
        const fieldErrors = err?.response?.data?.fieldErrors;
        const status = err?.response?.status || 0;
        throw { status, message, fieldErrors };
    }
}

// function to get super admin profile
export async function getSuperAdminProfile(token){
    try{
        const url = `${API_URL}/admin/admin_profile.php`;
        const authToken = token || (typeof localStorage !== 'undefined' && localStorage.getItem('superAdminToken'));
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
        const {data} = await axios.get(url, { headers });
        return data;
    }
    catch(err){
        const message = err?.response?.data?.message || 'Unable to fetch profile';
        const fieldErrors = err?.response?.data?.fieldErrors;
        const status = err?.response?.status || 0;
        throw { status, message, fieldErrors };
    }
}


// Forgot password function for superadmin
export async function forgotPasswordSuperadmin(payload) {
  try {
    const url = `${API_URL}/admin/forgot_password.php`;
    const { data } = await axios.post(url, payload);
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || 'Unable to process forgot password request';
    const fieldErrors = error?.response?.data?.fieldErrors;
    const status = error?.response?.status || 0;
    throw { status, message, fieldErrors };
  }
}


// Reset password function for superadmin
export async function resetPasswordSuperadmin(payload) {
  try {
    const url = `${API_URL}/admin/reset_password.php`;
    const { data } = await axios.post(url, payload);
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || 'Unable to reset password';
    const fieldErrors = error?.response?.data?.fieldErrors;
    const status = error?.response?.status || 0;
    throw { status, message, fieldErrors };
  }
}
