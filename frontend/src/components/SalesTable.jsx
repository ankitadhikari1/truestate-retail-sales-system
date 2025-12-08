export function SalesTable({ data, isLoading }) {

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
      return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[960px] divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gender</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Age</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Category</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((record, index) => {
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

            const transactionId = getField('transactionId', ['Transaction ID', 'transactionID']);
            const date = getField('date');
            const customerId = getField('customerId', ['Customer ID', 'customerID']);
            const customerName = getField('customerName', ['customerName', 'Customer Name']);
            const phoneNumber = getField('phoneNumber', ['phoneNumber', 'Phone Number']);
            const gender = getField('gender');
            const age = getField('age');
            const productCategory = getField('productCategory', ['productCategory', 'Product Category']);
            const quantity = getField('quantity');
            const finalAmount = getField('finalAmount', ['finalAmount', 'Final Amount']);

            return (
              <tr 
                key={index} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{transactionId ?? '—'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatDate(date)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-700 font-semibold">{customerId || '—'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{customerName || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-mono">{phoneNumber || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{gender || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{age ?? '—'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{productCategory || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900">{quantity || 0}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-gray-900">{formatCurrency(finalAmount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


