import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; 
import Login from './Components/LoginComponent.jsx';
import DashBoard from './Components/DashBoard';
import NavBar from './Components/Navbar';

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/','/register','/vishal/register'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <NavBar />}

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Login action={"Login"} />} /> 
          <Route path="/vishal/register" element={<Login action={"Register"} />} />
          <Route path="/DashBoard" element={<DashBoard />} /> 
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider> 
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
