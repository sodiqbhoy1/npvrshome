import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Homepage from './components/pages/hospital/Homepage';
import Signup from './components/pages/hospital/Signup';
import Signin from './components/pages/hospital/Signin';
import ForgotPassword from './components/pages/hospital/ForgotPassword';
import ResetPassword from './components/pages/hospital/ResetPassword';
import HospitalDashboard from './components/pages/hospital/HospitalDashboard';
import AdminHompage from './components/pages/superadmin/Homepage';
import SuperadminSignin from './components/pages/superadmin/Signin';
import SuperadminSignup from './components/pages/superadmin/Signup';
import SuperadminDashboard from './components/pages/superadmin/SuperadminDashboard';
import SuperadminForgotPassword from './components/pages/superadmin/ForgotPassword';
import SuperadminResetPassword from './components/pages/superadmin/ResetPassword';
const App = () => {
  return (
    <Routes>

      {/* hospital routes */}

<Route path="/" element={<Homepage/>}/>
<Route path='/signup' element={<Signup/>} />
<Route path='/signin' element={<Signin/>} />
<Route path='/forgot-password' element={<ForgotPassword/>} />
<Route path='/reset-password' element={<ResetPassword/>} />
<Route path='/hospital/dashboard' element={<HospitalDashboard/>} />

{/* super admin routes */}

<Route path='/superadmin/dashboard' element={<SuperadminDashboard/>} />
<Route path='/superadmin' element={<AdminHompage/>} />
<Route path='/superadmin/signin' element={<SuperadminSignin/>} />
<Route path='/superadmin/signup' element={<SuperadminSignup/>} />
<Route path='/superadmin/forgot-password' element={<SuperadminForgotPassword/>} />
<Route path='/superadmin/reset-password' element={<SuperadminResetPassword/>} />
      
<Route path='/superadmin/dashboard' element={<SuperadminDashboard/>} />
    </Routes>
  );
};

export default App;
