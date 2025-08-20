import { useState, useMemo } from 'react';

const useSearch = (data, searchFields = ['title', 'description']) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    const term = searchTerm.toLowerCase().trim();

    // If data is array of categories (like ALL_TOOLS_DATA)
    if (data[0]?.category && data[0]?.conversions) {
      return data.map(category => ({
        ...category,
        conversions: category.conversions.filter(tool =>
          searchFields.some(field =>
            tool[field]?.toLowerCase().includes(term)
          )
        )
      })).filter(category => category.conversions.length > 0);
    }

    // If data is flat array of tools (like POPULAR_IMAGE_CONVERSIONS)
    return data.filter(tool =>
      searchFields.some(field =>
        tool[field]?.toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm, searchFields]);

  const clearSearch = () => setSearchTerm('');

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    clearSearch,
    hasResults: Array.isArray(filteredData) 
      ? filteredData.length > 0 
      : filteredData.some?.(category => category.conversions?.length > 0)
  };
};

export default useSearch;
