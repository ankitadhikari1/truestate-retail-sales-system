import { processSalesQuery, filterSales } from '../services/salesService.js';

/**
 * Get sales data with filtering, sorting, and pagination
 */
export function getSales(req, res) {
  try {
    const salesData = req.app.locals.salesData;
    
    if (!salesData || salesData.length === 0) {
      return res.json({
        data: [],
        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        },
        appliedFilters: {}
      });
    }

    // Debug logging (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Query params received:', JSON.stringify(req.query, null, 2));
    }

    const result = processSalesQuery(salesData, req.query);
    
    res.json(result);
  } catch (error) {
    console.error('Error processing sales query:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Get unique values for filter options (for populating filter dropdowns)
 * Now accepts query params to filter the dataset first, showing only applicable options
 */
export function getFilterOptions(req, res) {
  try {
    let salesData = req.app.locals.salesData || [];
    
    // Apply current filters to show only applicable filter options
    // This ensures users only see filters that can actually be applied
    if (Object.keys(req.query).length > 0) {
      // Filter the data first (without pagination) to get applicable options
      salesData = filterSales(salesData, req.query);
      console.log(`Filter options: Showing options for ${salesData.length} filtered records (from ${req.app.locals.salesData?.length || 0} total)`);
    }
    
    const regions = [...new Set(salesData.map(r => r.customerRegion).filter(Boolean))].sort();
    const genders = [...new Set(salesData.map(r => r.gender).filter(Boolean))].sort();
    const categories = [...new Set(salesData.map(r => r.productCategory).filter(Boolean))].sort();
    const paymentMethods = [...new Set(salesData.map(r => r.paymentMethod).filter(Boolean))].sort();
    
    // Collect all tags
    const allTags = new Set();
    salesData.forEach(record => {
      const tags = Array.isArray(record.tags) 
        ? record.tags 
        : (record.tags || '').split(',').map(t => t.trim()).filter(t => t);
      tags.forEach(tag => allTags.add(tag));
    });
    const tags = [...allTags].sort();
    
    // Get age range
    const ages = salesData.map(r => Number(r.age)).filter(age => !isNaN(age));
    const minAge = ages.length > 0 ? Math.min(...ages) : 0;
    const maxAge = ages.length > 0 ? Math.max(...ages) : 100;
    
    // Get date range
    const dates = salesData.map(r => r.date ? new Date(r.date) : null).filter(d => d && !isNaN(d.getTime()));
    const startDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))).toISOString().split('T')[0] : null;
    const endDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))).toISOString().split('T')[0] : null;

    res.json({
      regions,
      genders,
      categories,
      tags,
      paymentMethods,
      ageRange: { min: minAge, max: maxAge },
      dateRange: { start: startDate, end: endDate }
    });
  } catch (error) {
    console.error('Error getting filter options:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}


