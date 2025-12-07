export function SalesTable({ data, isLoading }) {
  // Debug: Log first record to verify field names
  if (data && data.length > 0 && process.env.NODE_ENV === 'development') {
    console.log('Sample record fields:', Object.keys(data[0]));
    console.log('Sample record:', data[0]);
  }

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-xl p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 font-bold text-lg">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-xl p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-700 font-bold text-xl">No sales records found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search criteria</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'completed' || statusLower === 'delivered') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (statusLower === 'processing' || statusLower === 'pending') {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    if (statusLower === 'cancelled' || statusLower === 'returned') {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((record, index) => {
              // Handle potential field name variations
              const getField = (fieldName, altNames = []) => {
                if (record[fieldName] !== undefined && record[fieldName] !== null) {
                  return record[fieldName];
                }
                for (const alt of altNames) {
                  if (record[alt] !== undefined && record[alt] !== null) {
                    return record[alt];
                  }
                }
                return null;
              };

              const date = getField('date');
              const customerName = getField('customerName', ['customerName', 'Customer Name']);
              const phoneNumber = getField('phoneNumber', ['phoneNumber', 'Phone Number']);
              const productName = getField('productName', ['productName', 'Product Name']);
              const productCategory = getField('productCategory', ['productCategory', 'Product Category']);
              const quantity = getField('quantity');
              const finalAmount = getField('finalAmount', ['finalAmount', 'Final Amount']);
              const paymentMethod = getField('paymentMethod', ['paymentMethod', 'Payment Method']);
              const orderStatus = getField('orderStatus', ['orderStatus', 'Order Status']);

              return (
                <tr 
                  key={index} 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer border-b border-gray-100"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(date)}
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {customerName || 'N/A'}
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {phoneNumber || 'N/A'}
                </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {productName || 'N/A'}
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {productCategory || 'N/A'}
                    </span>
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900">
                    {quantity || 0}
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-700">
                    {formatCurrency(finalAmount)}
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {paymentMethod || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(orderStatus)}`}>
                      {orderStatus || 'N/A'}
                  </span>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


