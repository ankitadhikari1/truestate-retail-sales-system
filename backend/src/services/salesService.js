/**
 * Sales Service - Handles filtering, sorting, and pagination logic
 */

/**
 * Filters sales data based on query parameters
 */
export function filterSales(salesData, queryParams) {
  let filtered = [...salesData];

  // Full-text search on customerName and phoneNumber
  if (queryParams.search) {
    const searchTerm = queryParams.search.toLowerCase();
    filtered = filtered.filter(record => {
      const customerName = (record.customerName || '').toLowerCase();
      const phoneNumber = (record.phoneNumber || '').toLowerCase();
      return customerName.includes(searchTerm) || phoneNumber.includes(searchTerm);
    });
  }

  // Filter by regions (multi-select)
  if (queryParams.regions) {
    const regions = Array.isArray(queryParams.regions) 
      ? queryParams.regions.filter(r => r && String(r).trim())
      : (typeof queryParams.regions === 'string' 
          ? queryParams.regions.split(',').map(r => String(r).trim()).filter(r => r)
          : []);
    if (regions.length > 0) {
      console.log('Filtering by regions:', regions);
      const beforeCount = filtered.length;
      filtered = filtered.filter(record => {
        const recordRegion = String(record.customerRegion || '').trim();
        const matches = regions.some(region => recordRegion === String(region).trim());
        return matches;
      });
      console.log(`Regions filter: ${beforeCount} -> ${filtered.length} records`);
    }
  }

  // Filter by genders (multi-select)
  if (queryParams.genders) {
    const genders = Array.isArray(queryParams.genders)
      ? queryParams.genders.filter(g => g && g.trim())
      : (typeof queryParams.genders === 'string'
          ? queryParams.genders.split(',').map(g => g.trim()).filter(g => g)
          : []);
    if (genders.length > 0) {
      filtered = filtered.filter(record => {
        const recordGender = (record.gender || '').trim();
        return genders.some(gender => recordGender.toLowerCase() === gender.toLowerCase().trim());
      });
    }
  }

  // Filter by age range
  if (queryParams.minAge !== undefined && queryParams.minAge !== null && queryParams.minAge !== '') {
    const minAge = Number(queryParams.minAge);
    if (!isNaN(minAge)) {
      filtered = filtered.filter(record => {
        const age = Number(record.age);
        return !isNaN(age) && age >= minAge;
      });
    }
  }

  if (queryParams.maxAge !== undefined && queryParams.maxAge !== null && queryParams.maxAge !== '') {
    const maxAge = Number(queryParams.maxAge);
    if (!isNaN(maxAge)) {
      filtered = filtered.filter(record => {
        const age = Number(record.age);
        return !isNaN(age) && age <= maxAge;
      });
    }
  }

  // Filter by product categories (multi-select)
  if (queryParams.categories) {
    const categories = Array.isArray(queryParams.categories)
      ? queryParams.categories.filter(c => c && String(c).trim())
      : (typeof queryParams.categories === 'string'
          ? queryParams.categories.split(',').map(c => String(c).trim()).filter(c => c)
          : []);
    if (categories.length > 0) {
      console.log('Filtering by categories:', categories);
      const beforeCount = filtered.length;
      filtered = filtered.filter(record => {
        const recordCategory = String(record.productCategory || '').trim();
        const matches = categories.some(category => recordCategory === String(category).trim());
        return matches;
      });
      console.log(`Categories filter: ${beforeCount} -> ${filtered.length} records`);
    }
  }

  // Filter by tags (multi-select) - tags can be comma-separated in the record
  if (queryParams.tags) {
    const tags = Array.isArray(queryParams.tags)
      ? queryParams.tags.filter(t => t && t.trim())
      : (typeof queryParams.tags === 'string'
          ? queryParams.tags.split(',').map(t => t.trim()).filter(t => t)
          : []);
    if (tags.length > 0) {
      filtered = filtered.filter(record => {
        const recordTags = Array.isArray(record.tags) 
          ? record.tags 
          : (record.tags || '').split(',').map(t => t.trim()).filter(t => t);
        return tags.some(tag => 
          recordTags.some(recordTag => recordTag.toLowerCase() === tag.toLowerCase().trim())
        );
      });
    }
  }

  // Filter by payment methods (multi-select)
  if (queryParams.paymentMethods) {
    const paymentMethods = Array.isArray(queryParams.paymentMethods)
      ? queryParams.paymentMethods.filter(p => p && String(p).trim())
      : (typeof queryParams.paymentMethods === 'string'
          ? queryParams.paymentMethods.split(',').map(p => String(p).trim()).filter(p => p)
          : []);
    if (paymentMethods.length > 0) {
      console.log('Filtering by payment methods:', paymentMethods);
      const beforeCount = filtered.length;
      filtered = filtered.filter(record => {
        const recordPaymentMethod = String(record.paymentMethod || '').trim();
        const matches = paymentMethods.some(method => recordPaymentMethod === String(method).trim());
        return matches;
      });
      console.log(`Payment methods filter: ${beforeCount} -> ${filtered.length} records`);
    }
  }

  // Filter by date range
  if (queryParams.startDate) {
    const startDate = new Date(queryParams.startDate);
    if (!isNaN(startDate.getTime())) {
      filtered = filtered.filter(record => {
        const recordDate = record.date ? new Date(record.date) : null;
        if (!recordDate || isNaN(recordDate.getTime())) return false;
        return recordDate >= startDate;
      });
    }
  }

  if (queryParams.endDate) {
    const endDate = new Date(queryParams.endDate);
    if (!isNaN(endDate.getTime())) {
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(record => {
        const recordDate = record.date ? new Date(record.date) : null;
        if (!recordDate || isNaN(recordDate.getTime())) return false;
        return recordDate <= endDate;
      });
    }
  }

  return filtered;
}

/**
 * Sorts sales data based on sortBy and sortOrder
 */
export function sortSales(salesData, sortBy, sortOrder = 'asc') {
  const sorted = [...salesData];
  const order = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

  sorted.sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case 'date':
        aVal = a.date ? new Date(a.date).getTime() : 0;
        bVal = b.date ? new Date(b.date).getTime() : 0;
        break;
      case 'quantity':
        aVal = Number(a.quantity) || 0;
        bVal = Number(b.quantity) || 0;
        break;
      case 'customerName':
        aVal = (a.customerName || '').toLowerCase();
        bVal = (b.customerName || '').toLowerCase();
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return -1 * order;
    if (aVal > bVal) return 1 * order;
    return 0;
  });

  return sorted;
}

/**
 * Paginates sales data
 */
export function paginateSales(salesData, page = 1, pageSize = 10) {
  const pageNum = Math.max(1, Number(page) || 1);
  const size = Math.max(1, Number(pageSize) || 10);
  
  const totalItems = salesData.length;
  const totalPages = Math.ceil(totalItems / size);
  const startIndex = (pageNum - 1) * size;
  const endIndex = startIndex + size;
  
  const paginatedData = salesData.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page: pageNum,
      pageSize: size,
      totalItems,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  };
}

/**
 * Main function to process sales data with all filters, sorting, and pagination
 */
export function processSalesQuery(salesData, queryParams) {
  // Step 1: Filter
  let processed = filterSales(salesData, queryParams);

  // Step 2: Sort
  if (queryParams.sortBy) {
    // Use provided sortOrder, or default to 'desc' for date, 'asc' for others
    const defaultOrder = queryParams.sortBy === 'date' ? 'desc' : 'asc';
    processed = sortSales(processed, queryParams.sortBy, queryParams.sortOrder || defaultOrder);
  } else {
    // Default sort by date desc if no sortBy specified
    processed = sortSales(processed, 'date', 'desc');
  }

  // Step 3: Paginate
  const page = queryParams.page || 1;
  const pageSize = queryParams.pageSize || 10;
  const result = paginateSales(processed, page, pageSize);

  // Build appliedFilters object for response
  const appliedFilters = {
    search: queryParams.search || null,
    regions: queryParams.regions ? (Array.isArray(queryParams.regions) ? queryParams.regions : queryParams.regions.split(',').map(r => r.trim()).filter(r => r)) : [],
    genders: queryParams.genders ? (Array.isArray(queryParams.genders) ? queryParams.genders : queryParams.genders.split(',').map(g => g.trim()).filter(g => g)) : [],
    categories: queryParams.categories ? (Array.isArray(queryParams.categories) ? queryParams.categories : queryParams.categories.split(',').map(c => c.trim()).filter(c => c)) : [],
    tags: queryParams.tags ? (Array.isArray(queryParams.tags) ? queryParams.tags : queryParams.tags.split(',').map(t => t.trim()).filter(t => t)) : [],
    paymentMethods: queryParams.paymentMethods ? (Array.isArray(queryParams.paymentMethods) ? queryParams.paymentMethods : queryParams.paymentMethods.split(',').map(p => p.trim()).filter(p => p)) : [],
    minAge: queryParams.minAge ? Number(queryParams.minAge) : null,
    maxAge: queryParams.maxAge ? Number(queryParams.maxAge) : null,
    startDate: queryParams.startDate || null,
    endDate: queryParams.endDate || null,
    sortBy: queryParams.sortBy || 'date',
    sortOrder: queryParams.sortOrder || 'desc'
  };

  return {
    ...result,
    appliedFilters
  };
}

