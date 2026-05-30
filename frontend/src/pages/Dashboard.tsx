import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
}

interface User {
  id: number;
  email: string;
}

interface FilterOptions {
  brands: string[];
  years: number[];
  statuses: string[];
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'users'>('inventory');
  
  // Inventory State
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({ brands: [], years: [], statuses: [] });
  
  // Users State
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userMsg, setUserMsg] = useState({ text: '', type: '' });
  const [loadingUsers, setLoadingUsers] = useState(false);

  const email = localStorage.getItem('userEmail');
  const navigate = useNavigate();
  const limit = 8;

  // --- API CALLS ---

  const fetchFilters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/filters', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFilters(response.data);
    } catch (err) {
      console.error('Error fetching filters', err);
    }
  };

  const fetchCars = async (currentPage: number = page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/api/cars`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search,
          brand: brandFilter,
          year: yearFilter,
          status: statusFilter,
          page: currentPage,
          limit
        }
      });
      setCars(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.total);
    } catch (err) {
      console.error('Error fetching cars', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMsg({ text: '', type: '' });
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/users', 
        { email: newUserEmail, password: newUserPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserMsg({ text: 'Usuario creado con éxito', type: 'success' });
      setNewUserEmail('');
      setNewUserPassword('');
      fetchUsers();
    } catch (err: any) {
      setUserMsg({ text: err.response?.data?.message || 'Error al crear usuario', type: 'error' });
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user', err);
    }
  };

  // --- EFFECTS ---

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchCars(1);
      setPage(1);
    } else {
      fetchUsers();
    }
  }, [brandFilter, yearFilter, statusFilter, activeTab]);

  useEffect(() => {
    if (activeTab === 'inventory') fetchCars(page);
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCars(1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Auto<span className="text-emerald-600">Drive</span></h1>
        </div>

        {/* Tab Navigation */}
        <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Inventario
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Usuarios
          </button>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Admin Access</span>
            <span className="text-sm font-bold text-slate-700">{email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-600 transition-all font-bold text-sm shadow-xl shadow-slate-200 active:scale-95"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-10">
        
        {activeTab === 'inventory' ? (
          <>
            <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">Manejo de Stock</span>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Inventario de Autos</h2>
                <p className="text-slate-500 mt-2 font-medium">Control total sobre los {totalItems} vehículos en catálogo.</p>
              </div>
              <form onSubmit={handleSearchSubmit} className="flex gap-3 w-full lg:w-auto">
                <div className="relative flex-grow lg:w-96">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Busca por marca o modelo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 w-full p-4 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 bg-white shadow-xl shadow-slate-200/50 transition-all placeholder:text-slate-300 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-700 font-black shadow-xl shadow-emerald-200 transition-all active:scale-95"
                >
                  Buscar
                </button>
              </form>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-12">
              <div className="xl:col-span-4 flex flex-wrap gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30">
                <div className="flex flex-col gap-2 flex-grow min-w-[200px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marca</label>
                  <select 
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Todas las Marcas</option>
                    {filters.brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-2 flex-grow min-w-[200px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Año</label>
                  <select 
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Todos los Años</option>
                    {filters.years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2 flex-grow min-w-[200px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estado de Venta</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Todos los Estados</option>
                    {filters.statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => {setBrandFilter(''); setYearFilter(''); setStatusFilter(''); setSearch('');}}
                  className="xl:mt-6 px-6 py-3 text-sm text-slate-400 font-black hover:text-red-500 transition-all uppercase tracking-widest"
                >
                  Resetear
                </button>
              </div>

              <div className="xl:col-span-4 bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                {loading ? (
                  <div className="p-32 flex flex-col items-center justify-center text-slate-300">
                    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-emerald-600 border-t-transparent mb-6"></div>
                    <p className="font-black uppercase tracking-widest text-xs">Cargando catálogo...</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-slate-50/50">
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vehículo</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Detalles</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Precio</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {cars.length > 0 ? (
                            cars.map((car) => (
                              <tr key={car.id} className="hover:bg-emerald-50/30 transition-colors group">
                                <td className="px-8 py-7 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{car.brand}</span>
                                    <span className="text-sm font-bold text-slate-400 tracking-tight">{car.model}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-7 whitespace-nowrap">
                                  <div className="flex gap-4">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-black text-slate-300 uppercase">Año</span>
                                      <span className="text-sm font-bold text-slate-700">{car.year}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-black text-slate-300 uppercase">Km</span>
                                      <span className="text-sm font-bold text-slate-700">{formatNumber(car.mileage)}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-7 whitespace-nowrap">
                                  <span className="text-xl font-black text-emerald-600 tracking-tight">{formatCurrency(car.price)}</span>
                                </td>
                                <td className="px-8 py-7 whitespace-nowrap">
                                  <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-xl border-2
                                    ${car.status === 'Disponible' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                      car.status === 'Reservado' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                      'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                    {car.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-8 py-32 text-center text-slate-400 font-bold">No hay vehículos.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div className="bg-slate-50/50 px-8 py-6 flex items-center justify-between border-t border-slate-50">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-[10px] font-black uppercase text-slate-400 disabled:opacity-20 hover:text-emerald-600 flex items-center gap-1">
                          Anterior
                        </button>
                        <div className="flex gap-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button key={num} onClick={() => setPage(num)} className={`w-8 h-8 rounded-lg text-xs font-black ${page === num ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}>
                              {num}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-[10px] font-black uppercase text-slate-400 disabled:opacity-20 hover:text-emerald-600 flex items-center gap-1">
                          Siguiente
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          /* USERS TAB */
          <div className="flex flex-col gap-10">
            <header>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">Administración</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Usuarios</h2>
              <p className="text-slate-500 mt-2 font-medium">Controla quién tiene acceso al sistema AutoDrive.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Form to create user */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/30 h-fit">
                <h3 className="text-lg font-black text-slate-900 mb-6">Nuevo Usuario</h3>
                {userMsg.text && (
                  <div className={`p-4 rounded-2xl mb-6 text-xs font-bold ${userMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {userMsg.text}
                  </div>
                )}
                <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo</label>
                    <input 
                      type="email" 
                      value={newUserEmail} 
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="ejemplo@autodrive.com"
                      className="p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                    <input 
                      type="password" 
                      value={newUserPassword} 
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="••••••••"
                      className="p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-emerald-600 text-white py-3.5 rounded-xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 mt-2"
                  >
                    Registrar Usuario
                  </button>
                </form>
              </div>

              {/* Table of users */}
              <div className="lg:col-span-2 bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                {loadingUsers ? (
                  <div className="p-20 flex flex-col items-center justify-center text-slate-300">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent mb-4"></div>
                  </div>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                        <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Correo Electrónico</th>
                        <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 whitespace-nowrap text-sm font-mono text-slate-400">#{user.id}</td>
                          <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-700">{user.email}</td>
                          <td className="px-8 py-6 whitespace-nowrap text-right">
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.email === email}
                              className="text-slate-300 hover:text-red-500 disabled:opacity-0 transition-all p-2 rounded-lg hover:bg-red-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
