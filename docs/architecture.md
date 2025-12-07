# Architecture Documentation

## Overview

The Retail Sales Management System is a full-stack application built with a clear separation between backend API and frontend UI. The system processes CSV data in-memory and provides a RESTful API for querying sales data with advanced filtering, sorting, and pagination.

## System Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React + Vite)  │
│   Port: 3000    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│    Backend      │
│ (Express API)   │
│   Port: 3001    │
└────────┬────────┘
         │
┌────────▼────────┐
│  In-Memory Data │
│  (CSV Loaded)   │
└─────────────────┘
```

## Backend Architecture

### Layer Structure

```
┌─────────────────────────────────┐
│      Routes Layer               │
│  (salesRoutes.js)               │
│  - Defines API endpoints        │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│    Controllers Layer             │
│  (salesController.js)           │
│  - Request/Response handling    │
│  - Error handling               │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│     Services Layer              │
│  (salesService.js)              │
│  - Business logic               │
│  - Filtering                    │
│  - Sorting                      │
│  - Pagination                   │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│     Utils Layer                 │
│  (csvParser.js)                 │
│  - CSV parsing                  │
│  - Data normalization           │
└─────────────────────────────────┘
```

### Data Flow

1. **Startup:**
   - Server loads CSV from `backend/src/data/sales.csv`
   - CSV parser normalizes field names to camelCase
   - Data types are converted (numbers, dates, arrays)
   - Data stored in `app.locals.salesData` (in-memory)

2. **Request Processing:**
   ```
   Request → Routes → Controller → Service → Response
   ```

3. **Query Processing:**
   - Filters applied first (reduces dataset)
   - Sorting applied second
   - Pagination applied last

### Key Components

#### CSV Parser (`utils/csvParser.js`)
- Loads and parses CSV file
- Normalizes field names (e.g., "Customer Name" → "customerName")
- Converts data types:
  - Numeric fields → numbers
  - Date fields → ISO strings
  - Tags → arrays
- Handles missing/null values gracefully

#### Sales Service (`services/salesService.js`)
- **filterSales()**: Applies all filters to dataset
- **sortSales()**: Sorts data by specified field and order
- **paginateSales()**: Paginates results
- **processSalesQuery()**: Orchestrates the full query pipeline

#### Sales Controller (`controllers/salesController.js`)
- **getSales()**: Main endpoint handler
- **getFilterOptions()**: Returns unique values for filters
- Error handling and response formatting

## Frontend Architecture

### Component Hierarchy

```
App
└── Router
    └── SalesPage
        ├── SearchBar
        ├── FilterPanel
        │   └── MultiSelectFilter (multiple)
        ├── SortDropdown
        ├── SalesTable
        └── Pagination
```

### State Management

**URL Query Parameters as Single Source of Truth:**
- All filters, search, sorting, and pagination stored in URL
- `useQueryParams` hook manages URL state
- Changes to URL trigger data refetch
- Enables shareable URLs and browser navigation

### Data Flow

1. **Initial Load:**
   - Component mounts
   - `useQueryParams` reads URL params
   - `fetchFilterOptions()` loads filter dropdowns
   - `fetchSales()` loads data with current params

2. **User Interaction:**
   - User changes filter/search/sort/page
   - `useQueryParams` updates URL
   - `useEffect` detects URL change
   - `fetchSales()` called with new params
   - UI updates with new data

### Key Components

#### useQueryParams Hook
- Custom hook wrapping React Router's `useSearchParams`
- Provides typed getters (`getParam`, `getArrayParam`, `getNumberParam`)
- Provides setters (`setParam`, `setMultipleParams`)
- Handles array serialization/deserialization

#### API Service (`services/api.js`)
- `fetchSales()`: Main data fetching function
- `fetchFilterOptions()`: Loads filter options
- Builds query strings from params object
- Handles errors

#### Components
- **SearchBar**: Text input with debounced search
- **FilterPanel**: Multi-select and range filters
- **SortDropdown**: Sort option selector
- **SalesTable**: Data table with formatting
- **Pagination**: Page navigation controls

## Data Model

### Sales Record Structure

```javascript
{
  // Customer
  customerId: string,
  customerName: string,
  phoneNumber: string,
  gender: string,
  age: number,
  customerRegion: string,
  customerType: string,
  
  // Product
  productId: string,
  productName: string,
  brand: string,
  productCategory: string,
  tags: string[],
  
  // Sales
  quantity: number,
  pricePerUnit: number,
  discountPercentage: number,
  totalAmount: number,
  finalAmount: number,
  
  // Operational
  date: string (ISO),
  paymentMethod: string,
  orderStatus: string,
  deliveryType: string,
  storeId: string,
  storeLocation: string,
  salespersonId: string,
  employeeName: string
}
```

## API Design

### RESTful Principles
- GET requests only (read-only operations)
- Query parameters for filtering
- Consistent response format
- Error handling with appropriate status codes

### Response Format

**Success Response:**
```json
{
  "data": [...],
  "pagination": {...},
  "appliedFilters": {...}
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "Error message"
}
```

## Performance Considerations

1. **In-Memory Processing:**
   - CSV loaded once at startup
   - All queries operate on in-memory array
   - Fast for datasets up to ~100K records

2. **Filtering Order:**
   - Filters applied before sorting
   - Reduces dataset size early
   - Sorting operates on smaller dataset

3. **Pagination:**
   - Only requested page sent to client
   - Reduces network payload
   - Improves UI responsiveness

4. **Frontend Optimization:**
   - React memoization where beneficial
   - Efficient re-renders with proper dependencies
   - URL state prevents unnecessary API calls

## Error Handling

### Backend
- Try-catch blocks in controllers
- Graceful handling of missing/null data
- Validation of query parameters
- 500 status for server errors

### Frontend
- Error boundaries (can be added)
- Try-catch in API calls
- User-friendly error messages
- Loading states during fetches

## Security Considerations

1. **CORS:** Enabled for development (configure for production)
2. **Input Validation:** Query params validated in service layer
3. **No SQL Injection:** No database queries (in-memory only)
4. **XSS Prevention:** React escapes by default

## Scalability

### Current Limitations
- In-memory storage (limited by RAM)
- Single-threaded Node.js processing
- No caching layer

### Future Improvements
- Database integration (PostgreSQL/MongoDB)
- Redis caching for frequent queries
- Elasticsearch for full-text search
- Pagination with cursor-based approach
- Background job processing for large datasets

## Testing Strategy

### Unit Tests (Recommended)
- Service layer functions (filtering, sorting, pagination)
- CSV parser utilities
- Component rendering

### Integration Tests (Recommended)
- API endpoint testing
- End-to-end user flows
- Filter combinations

## Deployment

### Backend
- Node.js server (Express)
- Environment variables for configuration
- Process manager (PM2) recommended

### Frontend
- Static files (Vite build)
- Served via Nginx or CDN
- API proxy configuration

## Development Workflow

1. **Local Development:**
   - Backend: `npm run dev` (auto-reload)
   - Frontend: `npm run dev` (HMR)

2. **Code Organization:**
   - Clear separation of concerns
   - Reusable components
   - Utility functions extracted

3. **Best Practices:**
   - Consistent naming conventions
   - Error handling throughout
   - Comments for complex logic
   - README files for setup


