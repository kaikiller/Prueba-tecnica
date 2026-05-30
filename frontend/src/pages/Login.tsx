import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:4000/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.email);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-emerald-200/50 w-[400px] border border-white">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-200 mb-4 rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">AutoDrive</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Gestión de Inventario Premium</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
            <input
              type="email"
              placeholder="admin@autodrive.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-300"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 active:scale-[0.97] transition-all duration-200 shadow-xl shadow-emerald-100 mt-2"
          >
            Acceder al Panel
          </button>
        </form>
        
        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Credenciales de Acceso</span>
          <div className="bg-slate-50 px-4 py-2 rounded-full mt-3 border border-slate-100">
            <code className="text-emerald-700 text-xs font-bold">admin@admin.com / password</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
