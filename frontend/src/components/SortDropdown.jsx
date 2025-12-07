export function SortDropdown({ value, onChange }) {
  const sortOptions = [
    { value: 'date:desc', label: 'Sort by Date (Newest First)' },
    { value: 'date:asc', label: 'Sort by Date (Oldest First)' },
    { value: 'quantity:desc', label: 'Sort by Quantity (High to Low)' },
    { value: 'quantity:asc', label: 'Sort by Quantity (Low to High)' },
    { value: 'customerName:asc', label: 'Sort by Customer Name (A-Z)' },
    { value: 'customerName:desc', label: 'Sort by Customer Name (Z-A)' }
  ];

  const handleChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(':');
    onChange(sortBy, sortOrder);
  };

  const currentValue = value ? `${value.sortBy}:${value.sortOrder}` : 'date:desc';

  return (
    <div className="w-full sm:w-auto relative">
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </div>
      <select
        value={currentValue}
        onChange={handleChange}
        className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 text-gray-900 font-semibold appearance-none cursor-pointer"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}


