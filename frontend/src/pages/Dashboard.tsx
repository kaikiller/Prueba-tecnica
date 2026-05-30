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

interface FilterOptions {
  brands: string[];
  years: number[];
}

const Dashboard: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({ brands: [], years: [] });
  
  const email = localStorage.getItem('userEmail');
  const navigate = useNavigate();
  const limit = 8;

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
          page: currentPage,
          limit
        }
      });
      setCars(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.total);
    } catch (err) {
      console.error('Error fetching cars', err);
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchCars(1);
    setPage(1);
  }, [brandFilter, yearFilter]);

  useEffect(() => {
    fetchCars(page);
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Concesionario <span className="text-blue-600">AutoDrive</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Sesión iniciada</span>
            <span className="text-sm font-medium text-slate-700">{email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition font-semibold text-sm border border-slate-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <header className="mb-10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800">Inventario de Autos</h2>
              <p className="text-slate-500 mt-1">Mostrando {totalItems} vehículos disponibles.</p>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Buscar modelo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 font-bold shadow-md shadow-blue-200 transition"
              >
                Buscar
              </button>
            </form>
          </div>

          <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Filtrar por Marca</label>
              <select 
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Todas las Marcas</option>
                {filters.brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Filtrar por Año</label>
              <select 
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Todos los Años</option>
                {filters.years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => {setBrandFilter(''); setYearFilter(''); setSearch('');}}
              className="mt-auto mb-1 text-sm text-blue-600 font-bold hover:text-blue-800 ml-2"
            >
              Limpiar Filtros
            </button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <p>Actualizando inventario...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Vehículo</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Año</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Precio</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Kilometraje</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {cars.length > 0 ? (
                      cars.map((car) => (
                        <tr key={car.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900">{car.brand}</span>
                              <span className="text-xs text-slate-500">{car.model}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{car.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{formatCurrency(car.price)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatNumber(car.mileage)} km</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border
                              ${car.status === 'Disponible' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                car.status === 'Reservado' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                'bg-slate-100 text-slate-600 border-slate-200'}`}>
                              {car.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                          No se encontraron vehículos que coincidan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 text-sm font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-blue-600 transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>
                  <span className="text-sm text-slate-500 font-medium">
                    Página <span className="text-slate-900 font-bold">{page}</span> de <span className="text-slate-900 font-bold">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 text-sm font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-blue-600 transition"
                  >
                    Siguiente
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
