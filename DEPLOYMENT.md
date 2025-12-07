# Deployment Guide

## Backend (Render)

The backend is deployed at: `https://truestate-backend-t2bz.onrender.com`

### Environment Variables (Optional)
- `FRONTEND_URL`: Your frontend URL (e.g., `https://truestate-retail-sales-system.vercel.app`)
  - If not set, CORS will allow all origins (works but less secure)

## Frontend (Vercel)

The frontend is deployed at: `truestate-retail-sales-system.vercel.app`

### Required Environment Variable

You **MUST** set the following environment variable in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://truestate-backend-t2bz.onrender.com/api`
   - **Environment**: Production, Preview, and Development (select all)

### Steps to Fix the Connection Issue

1. **Add Environment Variable in Vercel:**
   ```
   VITE_API_BASE_URL=https://truestate-backend-t2bz.onrender.com/api
   ```

2. **Redeploy the Frontend:**
   - After adding the environment variable, Vercel will automatically trigger a new deployment
   - Or manually trigger a redeploy from the Vercel dashboard

3. **Verify the Fix:**
   - Open browser console on your deployed frontend
   - Check for any CORS errors
   - The API calls should now go to `https://truestate-backend-t2bz.onrender.com/api`

### Testing the Connection

1. **Test Backend Health:**
   ```bash
   curl https://truestate-backend-t2bz.onrender.com/health
   ```

2. **Test API Endpoint:**
   ```bash
   curl https://truestate-backend-t2bz.onrender.com/api/sales?page=1&pageSize=10
   ```

3. **Check Browser Console:**
   - Open your deployed frontend
   - Open Developer Tools → Console
   - Look for "API Base URL" log message
   - Check Network tab for API requests

### Troubleshooting

**Issue: Still getting CORS errors**
- Verify backend CORS is configured correctly (already done in `backend/src/index.js`)
- Check that backend is actually running on Render
- Verify the backend URL is correct

**Issue: 404 errors on API calls**
- Verify the environment variable is set correctly in Vercel
- Make sure the value includes `/api` at the end: `https://truestate-backend-t2bz.onrender.com/api`
- Check that you've redeployed after adding the environment variable

**Issue: Network errors**
- Check if Render backend is awake (free tier may sleep after inactivity)
- Verify the backend URL is accessible
- Check Render logs for any errors

### Local Development

For local development, the Vite proxy will handle API calls automatically. No environment variable needed locally.

The proxy configuration in `frontend/vite.config.js` will forward `/api/*` requests to `http://localhost:3001`.

