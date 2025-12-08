import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#84cc16'];

export function Dashboard({ salesData, allSalesData = null, isLoading = false }) {
  // Use allSalesData if provided (for full dataset), otherwise use salesData (filtered)
  const dataToAnalyze = allSalesData || salesData || [];

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-xl p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 font-bold text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = useMemo(() => {
    if (!dataToAnalyze || dataToAnalyze.length === 0) {
      return {
        totalRevenue: 0,
        totalSales: 0,
        avgOrderValue: 0,
        totalQuantity: 0
      };
    }

    const totalRevenue = dataToAnalyze.reduce((sum, record) => {
      const amount = Number(record.finalAmount) || 0;
      return sum + amount;
    }, 0);

    const totalQuantity = dataToAnalyze.reduce((sum, record) => {
      const qty = Number(record.quantity) || 0;
      return sum + qty;
    }, 0);

    return {
      totalRevenue,
      totalSales: dataToAnalyze.length,
      avgOrderValue: dataToAnalyze.length > 0 ? totalRevenue / dataToAnalyze.length : 0,
      totalQuantity
    };
  }, [dataToAnalyze]);

  // Sales by Region
  const salesByRegion = useMemo(() => {
    const regionMap = {};
    dataToAnalyze.forEach(record => {
      const region = record.customerRegion || 'Unknown';
      const amount = Number(record.finalAmount) || 0;
      regionMap[region] = (regionMap[region] || 0) + amount;
    });
    return Object.entries(regionMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [dataToAnalyze]);

  // Sales by Category
  const salesByCategory = useMemo(() => {
    const categoryMap = {};
    dataToAnalyze.forEach(record => {
      const category = record.productCategory || 'Unknown';
      const amount = Number(record.finalAmount) || 0;
      categoryMap[category] = (categoryMap[category] || 0) + amount;
    });
    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [dataToAnalyze]);

  // Sales by Payment Method
  const salesByPaymentMethod = useMemo(() => {
    const paymentMap = {};
    dataToAnalyze.forEach(record => {
      const method = record.paymentMethod || 'Unknown';
      const amount = Number(record.finalAmount) || 0;
      paymentMap[method] = (paymentMap[method] || 0) + amount;
    });
    return Object.entries(paymentMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [dataToAnalyze]);

  // Sales over time (by month)
  const salesOverTime = useMemo(() => {
    const monthMap = {};
    dataToAnalyze.forEach(record => {
      if (!record.date) return;
      try {
        const date = new Date(record.date);
        if (isNaN(date.getTime())) return;
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        const amount = Number(record.finalAmount) || 0;
        monthMap[monthKey] = (monthMap[monthKey] || 0) + amount;
      } catch {
        return;
      }
    });
    return Object.entries(monthMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA - dateB;
      });
  }, [dataToAnalyze]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!dataToAnalyze || dataToAnalyze.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 text-center">
        <p className="text-gray-500">No data available for dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Total Sales</p>
              <p className="text-3xl font-bold">{stats.totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium mb-1">Avg Order Value</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.avgOrderValue)}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Total Quantity</p>
              <p className="text-3xl font-bold">{stats.totalQuantity.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Region - Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded"></div>
            Sales by Region
          </h3>
          {salesByRegion.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {salesByRegion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No data available</p>
          )}
        </div>

        {/* Sales by Category - Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Sales by Category
          </h3>
          {salesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No data available</p>
          )}
        </div>

        {/* Sales Over Time - Line Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded"></div>
            Sales Over Time
          </h3>
          {salesOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No data available</p>
          )}
        </div>

        {/* Payment Methods - Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded"></div>
            Payment Methods
          </h3>
          {salesByPaymentMethod.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByPaymentMethod} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={100}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 8, 8, 0]}>
                  {salesByPaymentMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

