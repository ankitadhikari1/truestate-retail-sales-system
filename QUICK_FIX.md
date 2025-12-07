# Quick Fix for Frontend-Backend Connection

## The Problem
The frontend is trying to call `/api` which only works in development. In production, it needs the full backend URL.

## The Solution (2 Steps)

### Step 1: Add Environment Variable in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project: `truestate-retail-sales-system`
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://truestate-backend-t2bz.onrender.com/api`
   - **Environments**: ✅ Production ✅ Preview ✅ Development
6. Click **Save**

### Step 2: Redeploy

After adding the environment variable, Vercel will automatically redeploy. If not:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**

## Verify It Works

1. Open your deployed frontend: `truestate-retail-sales-system.vercel.app`
2. Open browser console (F12)
3. Look for the API request logs
4. Check Network tab - API calls should go to `https://truestate-backend-t2bz.onrender.com/api`

## What Changed in the Code

✅ Frontend now uses `VITE_API_BASE_URL` environment variable
✅ Falls back to `/api` for local development (uses Vite proxy)
✅ Better error messages for connection issues
✅ Backend CORS configured to allow frontend requests

## Still Not Working?

1. **Check Backend is Running:**
   ```bash
   curl https://truestate-backend-t2bz.onrender.com/health
   ```

2. **Check Environment Variable:**
   - In Vercel, verify the variable is set correctly
   - Make sure you redeployed after adding it

3. **Check Browser Console:**
   - Look for CORS errors
   - Check Network tab for failed requests
   - Verify the request URL is correct

