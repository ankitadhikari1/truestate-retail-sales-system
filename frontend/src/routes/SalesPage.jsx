import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryParams } from '../hooks/useQueryParams';
import { fetchSales, fetchFilterOptions } from '../services/api';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { SortDropdown } from '../components/SortDropdown';
import { SalesTable } from '../components/SalesTable';
import { Pagination } from '../components/Pagination';
import { Dashboard } from '../components/Dashboard';

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
  const [allFilteredData, setAllFilteredData] = useState([]); // For dashboard analytics
  const [pagination, setPagination] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [error, setError] = useState(null);
  const [showDashboard, setShowDashboard] = useState(true);

  // Get current state from URL params - memoized to prevent infinite loops
  // Depend on searchParams directly since that's what actually changes
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

  // Load filter options on mount
  useEffect(() => {
    fetchFilterOptions()
      .then(setFilterOptions)
      .catch(err => {
        console.error('Error loading filter options:', err);
        setError('Failed to load filter options');
      });
  }, []);

  // Build query params helper
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
      // For dashboard, fetch all filtered data (no pagination)
      queryParams.page = 1;
      queryParams.pageSize = 10000; // Large number to get all
    }

    return queryParams;
  }, [searchParams, getParam, getArrayParam, getNumberParam]);

  // Fetch sales data - depend on searchParams directly to avoid object reference issues
  const loadSales = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams(true);

      // Debug logging (can be removed in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Sending query params:', queryParams);
      }

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

  // Fetch all filtered data for dashboard
  const loadDashboardData = useCallback(async () => {
    if (!showDashboard) return;
    
    setIsLoadingDashboard(true);
    try {
      const queryParams = buildQueryParams(false);
      const result = await fetchSales(queryParams);
      setAllFilteredData(result.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setAllFilteredData([]);
    } finally {
      setIsLoadingDashboard(false);
    }
  }, [buildQueryParams, showDashboard]);

  // Reload data when query params change
  // Use searchParams.toString() as dependency to trigger on any param change
  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);
  
  useEffect(() => {
    console.log('loadSales effect triggered, searchParams:', searchParamsString);
    loadSales();
    loadDashboardData();
  }, [searchParamsString, loadSales, loadDashboardData]);

  // Reload dashboard data when showDashboard changes
  useEffect(() => {
    if (showDashboard) {
      loadDashboardData();
    }
  }, [showDashboard, loadDashboardData]);

  // Handlers - memoized to prevent re-renders
  const handleSearchChange = useCallback((value) => {
    setMultipleParams({
      search: value || undefined,
      page: 1 // Reset to first page on search
    });
  }, [setMultipleParams]);

  const handleFilterChange = useCallback((key, value) => {
    console.log('handleFilterChange called:', { key, value, type: typeof value, isArray: Array.isArray(value) });
    
    // Handle arrays properly - empty array should clear the filter
    let paramValue;
    if (Array.isArray(value)) {
      paramValue = value.length > 0 ? value : undefined;
    } else {
      paramValue = (value && value !== '') ? value : undefined;
    }
    
    console.log('Setting param:', { key, paramValue, originalValue: value });
    
    // Use setMultipleParams to update both filter and page in one go
    setMultipleParams({
      [key]: paramValue,
      page: 1 // Reset to first page on filter change
    });
  }, [setMultipleParams]);

  const handleSortChange = useCallback((newSortBy, newSortOrder) => {
    setMultipleParams({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: 1 // Reset to first page on sort change
    });
  }, [setMultipleParams]);

  const handlePageChange = useCallback((newPage) => {
    setParam('page', newPage);
  }, [setParam]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Retail Sales Management
                </h1>
                <p className="mt-1 text-sm text-gray-600">Search, filter, and manage sales transactions with ease</p>
              </div>
            </div>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {showDashboard ? 'Hide' : 'Show'} Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-sm flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Dashboard */}
        {showDashboard && (
          <div className="mb-8">
            <Dashboard salesData={allFilteredData} isLoading={isLoadingDashboard} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel
              filterOptions={filterOptions}
              filters={currentFilters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort and Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {pagination && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {pagination.totalItems.toLocaleString()}
                  </span>
                  <span>records found</span>
                </div>
              )}
              <div className="w-full sm:w-auto">
                <SortDropdown
                  value={{ sortBy, sortOrder }}
                  onChange={handleSortChange}
                />
              </div>
            </div>

            {/* Sales Table */}
            <SalesTable data={salesData} isLoading={isLoading} />

            {/* Pagination */}
            {pagination && pagination.totalPages > 0 && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


