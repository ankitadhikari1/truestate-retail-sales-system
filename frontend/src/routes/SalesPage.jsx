import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryParams } from '../hooks/useQueryParams';
import { fetchSales, fetchFilterOptions } from '../services/api';
import { SearchBar } from '../components/SearchBar';
import { SortDropdown } from '../components/SortDropdown';
import { SalesTable } from '../components/SalesTable';
import { Pagination } from '../components/Pagination';

export function SalesPage() {
  const {
    getParam,
    getArrayParam,
    getNumberParam,
    setParam,
    setMultipleParams,
    searchParams
  } = useQueryParams();

  const [salesData, setSalesData] = useState([]);
  const [allFilteredData, setAllFilteredData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchQuery = useMemo(() => getParam('search', ''), [searchParams, getParam]);
  const currentFilters = useMemo(() => ({
    regions: getArrayParam('regions', []),
    genders: getArrayParam('genders', []),
    categories: getArrayParam('categories', []),
    tags: getArrayParam('tags', []),
    paymentMethods: getArrayParam('paymentMethods', []),
    minAge: getParam('minAge', ''),
    maxAge: getParam('maxAge', ''),
    startDate: getParam('startDate', ''),
    endDate: getParam('endDate', '')
  }), [searchParams, getParam, getArrayParam]);
  const sortBy = useMemo(() => getParam('sortBy', 'date'), [searchParams, getParam]);
  const sortOrder = useMemo(() => getParam('sortOrder', 'desc'), [searchParams, getParam]);
  const currentPage = useMemo(() => getNumberParam('page', 1), [searchParams, getNumberParam]);

  useEffect(() => {
    fetchFilterOptions()
      .then(setFilterOptions)
      .catch(err => {
        console.error('Error loading filter options:', err);
        setError('Failed to load filter options');
      });
  }, []);
  const buildQueryParams = useCallback((includePagination = true) => {
    const regions = getArrayParam('regions', []);
    const genders = getArrayParam('genders', []);
    const categories = getArrayParam('categories', []);
    const tags = getArrayParam('tags', []);
    const paymentMethods = getArrayParam('paymentMethods', []);
    
    const queryParams = {
      search: getParam('search', '') || undefined,
      regions: regions.length > 0 ? regions : undefined,
      genders: genders.length > 0 ? genders : undefined,
      categories: categories.length > 0 ? categories : undefined,
      tags: tags.length > 0 ? tags : undefined,
      paymentMethods: paymentMethods.length > 0 ? paymentMethods : undefined,
      minAge: getParam('minAge', '') || undefined,
      maxAge: getParam('maxAge', '') || undefined,
      startDate: getParam('startDate', '') || undefined,
      endDate: getParam('endDate', '') || undefined,
      sortBy: getParam('sortBy', 'date') || 'date',
      sortOrder: getParam('sortOrder', 'desc') || 'desc'
    };

    if (includePagination) {
      queryParams.page = getNumberParam('page', 1);
      queryParams.pageSize = 10;
    } else {
      queryParams.page = 1;
      queryParams.pageSize = 10000;
    }

    return queryParams;
  }, [searchParams, getParam, getArrayParam, getNumberParam]);

  const loadSales = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams(true);
      const result = await fetchSales(queryParams);
      setSalesData(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      console.error('Error loading sales:', err);
      setError('Failed to load sales data');
      setSalesData([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [buildQueryParams]);
  const loadDashboardData = useCallback(async () => {
    try {
      const queryParams = buildQueryParams(false);
      const result = await fetchSales(queryParams);
      setAllFilteredData(result.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setAllFilteredData([]);
    }
  }, [buildQueryParams]);

  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);
  
  useEffect(() => {
    loadSales();
    loadDashboardData();
  }, [searchParamsString, loadSales, loadDashboardData]);
  const handleSearchChange = useCallback((value) => {
    setMultipleParams({
      search: value || undefined,
      page: 1
    });
  }, [setMultipleParams]);

  const handleFilterChange = useCallback((key, value) => {
    let paramValue;
    if (Array.isArray(value)) {
      paramValue = value.length > 0 ? value : undefined;
    } else {
      paramValue = (value && value !== '') ? value : undefined;
    }
    
    setMultipleParams({
      [key]: paramValue,
      page: 1
    });
  }, [setMultipleParams]);

  const handleSortChange = useCallback((newSortBy, newSortOrder) => {
    setMultipleParams({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: 1
    });
  }, [setMultipleParams]);

  const handlePageChange = useCallback((newPage) => {
    setParam('page', newPage);
  }, [setParam]);

  const toggleFilterOption = useCallback((key, option) => {
    const current = Array.isArray(currentFilters[key]) ? currentFilters[key] : [];
    const exists = current.some(v => String(v).trim().toLowerCase() === String(option).trim().toLowerCase());
    const nextValue = exists
      ? current.filter(v => String(v).trim().toLowerCase() !== String(option).trim().toLowerCase())
      : [...current, option];
    handleFilterChange(key, nextValue);
  }, [currentFilters, handleFilterChange]);

  const summaryStats = useMemo(() => {
    const safeData = Array.isArray(allFilteredData) ? allFilteredData : [];
    const totalUnits = safeData.reduce((sum, record) => sum + (Number(record.quantity) || 0), 0);
    const totalAmount = safeData.reduce((sum, record) => sum + (Number(record.finalAmount) || 0), 0);
    const totalDiscount = safeData.reduce((sum, record) => {
      const total = Number(record.totalAmount) || 0;
      const finalAmt = Number(record.finalAmount) || 0;
      return sum + Math.max(0, total - finalAmt);
    }, 0);
    return { totalUnits, totalAmount, totalDiscount };
  }, [allFilteredData]);

  const renderFilterGroup = (label, key, options = []) => {
    const selected = Array.isArray(currentFilters[key]) ? currentFilters[key] : [];
    const handleSelectChange = (event) => {
      const selectedOptions = Array.from(event.target.selectedOptions).map(opt => opt.value);
      handleFilterChange(key, selectedOptions);
    };

    return (
      <div className="min-w-[220px] space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-semibold text-gray-700">{label}</span>
          {selected.length > 0 && (
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              {selected.length} selected
            </span>
          )}
        </div>
        <select
          multiple
          value={selected}
          onChange={handleSelectChange}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white"
          size={Math.min(6, Math.max(3, options.length))}
        >
          {options.length === 0 ? (
            <option disabled>No options</option>
          ) : (
            options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          )}
        </select>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
              RS
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Vault</p>
              <p className="text-lg font-semibold text-gray-900">Sales Management</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-6 text-sm">
          <div className="space-y-2">
            <p className="text-xs uppercase text-gray-500 font-semibold px-2">General</p>
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 text-gray-900 font-semibold">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span> Dashboard
              </span>
              <span className="h-5 w-5 rounded-full border border-gray-300 text-[10px] flex items-center justify-center">3</span>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gray-300"></span> Nexus
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gray-300"></span> Intake
              </span>
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase text-gray-500 font-semibold px-2">Services</p>
            {['Pre-active', 'Active', 'Blocked', 'Closed'].map(item => (
              <button key={item} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                <span>{item}</span>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase text-gray-500 font-semibold px-2">Invoices</p>
            {['Proforma Invoices', 'Final Invoices'].map(item => (
              <button key={item} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                <span>{item}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold">Sales Management System</p>
              <h1 className="text-2xl font-bold text-gray-900">Retail Sales Management</h1>
            </div>
            <div className="w-full md:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search name, phone no..."
              />
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs uppercase text-gray-500 font-semibold">Total units sold</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{summaryStats.totalUnits.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs uppercase text-gray-500 font-semibold">Total amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(summaryStats.totalAmount)}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs uppercase text-gray-500 font-semibold">Total discount</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(summaryStats.totalDiscount)}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-4">
            <div className="overflow-x-auto">
              <div className="flex flex-nowrap gap-4 min-w-[720px]">
                {renderFilterGroup('Customer Region', 'regions', filterOptions?.regions || [])}
                {renderFilterGroup('Gender', 'genders', filterOptions?.genders || [])}
                {renderFilterGroup('Product Category', 'categories', filterOptions?.categories || [])}
                {renderFilterGroup('Payment Method', 'paymentMethods', filterOptions?.paymentMethods || [])}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Age Range</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={currentFilters.minAge || ''}
                    onChange={(e) => handleFilterChange('minAge', e.target.value)}
                    placeholder="Min"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  />
                  <span className="text-gray-400">–</span>
                  <input
                    type="number"
                    value={currentFilters.maxAge || ''}
                    onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                    placeholder="Max"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Date Range</p>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={currentFilters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="date"
                    value={currentFilters.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <div className="w-full">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Sort by</p>
                  <SortDropdown
                    value={{ sortBy, sortOrder }}
                    onChange={handleSortChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {pagination?.totalItems?.toLocaleString('en-IN') || '0'}
                </span>
                <span>records found</span>
                {isLoading && <span className="text-xs text-gray-400">(loading...)</span>}
              </div>
              {pagination && pagination.totalPages > 0 && (
                <div className="text-xs text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
              )}
            </div>

            <div className="p-4">
              <SalesTable data={salesData} isLoading={isLoading} />
            </div>

            {pagination && pagination.totalPages > 0 && (
              <div className="px-4 py-3 border-t border-gray-100">
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


