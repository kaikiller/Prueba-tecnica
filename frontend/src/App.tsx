import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Interceptor component to have access to navigate
const AxiosInterceptor = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  return children;
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AxiosInterceptor>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AxiosInterceptor>
    </Router>
  );
};

export default App;
