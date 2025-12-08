# Setup & Verification Guide

## Quick Start

### 1. Install Dependencies

**Option A: Install all at once (recommended)**
```bash
npm run install:all
```

**Option B: Install separately**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Verify CSV File

Ensure your `sales.csv` file is located at:
```
backend/src/data/sales.csv
```

The CSV should have the following header row:
```
Transaction ID,Date,Customer ID,Customer Name,Phone Number,Gender,Age,Customer Region,Customer Type,Product ID,Product Name,Brand,Product Category,Tags,Quantity,Price per Unit,Discount Percentage,Total Amount,Final Amount,Payment Method,Order Status,Delivery Type,Store ID,Store Location,Salesperson ID,Employee Name
```

### 3. Start the Application

**Option A: Start both servers manually**

Terminal 1 - Backend:
```bash
cd backend
npm start
```
You should see:
```
✅ Sales data loaded: [N] records
🚀 Server running on http://localhost:3001
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

**Option B: Use the start script (macOS/Linux)**
```bash
./start.sh
```

### 4. Verify Installation

1. **Backend Health Check:**
   - Open: http://localhost:3001/health
   - Should return: `{"status":"ok","recordsLoaded":10684}` (or your record count)

2. **Backend API Test:**
   - Open: http://localhost:3001/api/sales/filter-options
   - Should return JSON with filter options (regions, genders, categories, etc.)

3. **Frontend:**
   - Open: http://localhost:3000
   - Should see the Retail Sales Management System interface
   - Search bar, filters, and table should be visible

## Testing Features

### Search
1. Type a customer name in the search bar
2. Results should filter in real-time (with 300ms debounce)
3. Try searching by phone number

### Filters
1. Click on filter chips (Region, Gender, Category, etc.)
2. Multiple selections should work
3. Try age range and date range filters
4. All filters should work in combination

### Sorting
1. Use the sort dropdown
2. Try different sort options
3. Verify data is sorted correctly

### Pagination
1. Navigate through pages
2. Verify "Page X of Y" indicator
3. Test Previous/Next buttons
4. Verify pagination respects filters/search

### State Persistence
1. Apply filters and search
2. Copy the URL
3. Open in a new tab
4. All filters should be preserved

## Troubleshooting

### Backend Issues

**Problem: CSV not loading**
- Check file path: `backend/src/data/sales.csv`
- Verify file exists and is readable
- Check server logs for parsing errors
- Ensure CSV has proper header row

**Problem: Port 3001 already in use**
- Change port in `backend/src/index.js`: `const PORT = process.env.PORT || 3002;`
- Update frontend proxy in `frontend/vite.config.js`

**Problem: CORS errors**
- Verify `cors` package is installed
- Check `backend/src/index.js` has `app.use(cors())`

### Frontend Issues

**Problem: Cannot connect to backend**
- Verify backend is running on port 3001
- Check browser console for errors
- Verify proxy configuration in `vite.config.js`

**Problem: Filters not loading**
- Check Network tab for `/api/sales/filter-options` request
- Verify backend is returning data
- Check browser console for errors

**Problem: Styling issues**
- Verify Tailwind CSS is configured
- Check `tailwind.config.js` content paths
- Ensure `postcss.config.js` exists
- Restart dev server

### Data Issues

**Problem: Fields not matching**
- Verify CSV header matches expected format
- Check field normalization in `backend/src/utils/csvParser.js`
- Review server logs for parsing warnings

**Problem: Filters showing wrong values**
- Check `backend/src/controllers/salesController.js` - `getFilterOptions()`
- Verify data is being parsed correctly
- Check for null/empty values in dataset

## Development Tips

### Backend Development
- Use `npm run dev` for auto-reload
- Check server logs for debugging
- Test API endpoints with curl or Postman

### Frontend Development
- Use React DevTools for component debugging
- Check Network tab for API calls
- Use browser console for errors
- URL query params show current state

### Common Commands

```bash
# Backend
cd backend
npm start          # Production mode
npm run dev        # Development with auto-reload

# Frontend
cd frontend
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```


## Deployment Notes

### Backend Deployment
- Set `PORT` environment variable
- Ensure CSV file is accessible
- Use process manager (PM2) for production
- Configure CORS for production domain

### Frontend Deployment
- Build: `npm run build`
- Serve `dist/` folder
- Configure API proxy or use environment variable for API URL
- Update CORS settings in backend

