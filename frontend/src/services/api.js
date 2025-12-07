// Use environment variable for API URL, fallback to relative path for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Log API configuration (helpful for debugging)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Environment:', import.meta.env.MODE);
}

/**
 * Build query string from params object
 */
function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    // Only include non-empty, non-undefined, non-null values
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        // Only add arrays that have at least one element
        if (value.length > 0) {
          // Filter out empty strings from array before joining
          const filteredArray = value.filter(v => v !== null && v !== undefined && v !== '');
          if (filteredArray.length > 0) {
            searchParams.append(key, filteredArray.join(','));
          }
        }
      } else {
        // For strings, check it's not just whitespace
        if (typeof value === 'string' && value.trim() !== '') {
          searchParams.append(key, value);
        } else if (typeof value !== 'string') {
          // For numbers, booleans, etc., add them
          searchParams.append(key, value);
        }
      }
    }
  });
  
  return searchParams.toString();
}

/**
 * Fetch sales data with filters, sorting, and pagination
 */
export async function fetchSales(queryParams = {}) {
  try {
    const queryString = buildQueryString(queryParams);
    const url = `${API_BASE_URL}/sales${queryString ? `?${queryString}` : ''}`;
    
    console.log('=== API REQUEST ===');
    console.log('Request URL:', url);
    console.log('Request Params Object:', queryParams);
    console.log('Query String:', queryString);
    console.log('Filter arrays in request:', {
      regions: queryParams.regions,
      genders: queryParams.genders,
      categories: queryParams.categories,
      tags: queryParams.tags,
      paymentMethods: queryParams.paymentMethods,
      areArrays: {
        regions: Array.isArray(queryParams.regions),
        genders: Array.isArray(queryParams.genders),
        categories: Array.isArray(queryParams.categories),
        tags: Array.isArray(queryParams.tags),
        paymentMethods: Array.isArray(queryParams.paymentMethods)
      }
    });
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('=== API RESPONSE ===');
    console.log('Records in response:', data.data?.length || 0);
    console.log('Total items (filtered):', data.pagination?.totalItems || 0);
    console.log('Applied filters:', data.appliedFilters);
    
    if (data.pagination?.totalItems === 10683 && Object.keys(queryParams).some(k => queryParams[k] !== undefined && k !== 'page' && k !== 'pageSize' && k !== 'sortBy' && k !== 'sortOrder')) {
      console.warn('⚠️ WARNING: Filters were sent but totalItems is still 10683 - filters may not be applied!');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    // Provide more helpful error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to the server. Please check if the backend is running and accessible.');
    }
    throw error;
  }
}

/**
 * Fetch filter options (unique values for filters)
 * Now accepts current filters to show only applicable options
 */
export async function fetchFilterOptions(currentFilters = {}) {
  try {
    // Build query string from current filters to get applicable options
    const queryString = buildQueryString(currentFilters);
    const url = `${API_BASE_URL}/sales/filter-options${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching filter options with current filters:', currentFilters);
    console.log('Filter options URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Filter Options API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Filter options received:', {
      regions: data.regions?.length || 0,
      genders: data.genders?.length || 0,
      categories: data.categories?.length || 0,
      tags: data.tags?.length || 0,
      paymentMethods: data.paymentMethods?.length || 0
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    // Provide more helpful error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to the server. Please check if the backend is running and accessible.');
    }
    throw error;
  }
}


