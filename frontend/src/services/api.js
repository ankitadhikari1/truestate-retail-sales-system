let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

if (API_BASE_URL.startsWith('http') && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api';
}

function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const filteredArray = value.filter(v => v !== null && v !== undefined && v !== '');
          if (filteredArray.length > 0) {
            searchParams.append(key, filteredArray.join(','));
          }
        }
      } else {
        if (typeof value === 'string' && value.trim() !== '') {
          searchParams.append(key, value);
        } else if (typeof value !== 'string') {
          searchParams.append(key, value);
        }
      }
    }
  });
  
  return searchParams.toString();
}

export async function fetchSales(queryParams = {}) {
  try {
    const queryString = buildQueryString(queryParams);
    const url = `${API_BASE_URL}/sales${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to the server. Please check if the backend is running and accessible.');
    }
    throw error;
  }
}

export async function fetchFilterOptions(currentFilters = {}) {
  try {
    const queryString = buildQueryString(currentFilters);
    const url = `${API_BASE_URL}/sales/filter-options${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Filter Options API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to the server. Please check if the backend is running and accessible.');
    }
    throw error;
  }
}


