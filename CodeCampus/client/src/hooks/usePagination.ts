import { useState, useEffect, useMemo } from "react";

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

// Helper function to safely get array length
const getSafeArrayLength = (arr: any): number => {
  try {
    if (!Array.isArray(arr)) return 0;
    const length = arr.length;
    if (typeof length !== 'number' || !Number.isFinite(length) || length < 0 || length > Number.MAX_SAFE_INTEGER) {
      return 0;
    }
    return length;
  } catch (error) {
    return 0;
  }
};

//todo change the type
const usePagination = <T>(data: T[] | null | undefined, itemsPerPage: number): PaginationResult<T> => {
  // Safely normalize data to always be a valid array
  const safeData = useMemo(() => {
    try {
      if (!data) return [];
      if (!Array.isArray(data)) return [];
      // Validate each item and filter out invalid ones
      return data.filter((item: any) => item !== null && item !== undefined);
    } catch (error) {
      console.error("Error normalizing data in usePagination:", error);
      return [];
    }
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState<T[]>([]);

  useEffect(() => {
    // Safety checks to prevent invalid array length errors
    const safeItemsPerPage = Number.isFinite(itemsPerPage) && itemsPerPage > 0 && itemsPerPage < 10000 ? itemsPerPage : 10;
    const dataLength = getSafeArrayLength(safeData);
    
    if (dataLength > 0 && safeItemsPerPage > 0) {
      const calculatedPages = Math.ceil(dataLength / safeItemsPerPage);
      const safeTotalPages = Number.isFinite(calculatedPages) && calculatedPages > 0 && calculatedPages < 10000 ? calculatedPages : 1;
      setTotalPages(safeTotalPages);
    } else {
      setTotalPages(1);
    }
  }, [safeData, itemsPerPage]);

  useEffect(() => {
    // Safety checks to prevent invalid array operations
    const safeItemsPerPage = Number.isFinite(itemsPerPage) && itemsPerPage > 0 && itemsPerPage < 10000 ? itemsPerPage : 10;
    const safeCurrentPage = Number.isFinite(currentPage) && currentPage > 0 && currentPage < 10000 ? currentPage : 1;
    
    const startIndex = (safeCurrentPage - 1) * safeItemsPerPage;
    const endIndex = startIndex + safeItemsPerPage;
    
    // Ensure indices are valid and within safe bounds
    if (
      Number.isFinite(startIndex) && 
      Number.isFinite(endIndex) && 
      startIndex >= 0 && 
      startIndex < Number.MAX_SAFE_INTEGER &&
      endIndex < Number.MAX_SAFE_INTEGER &&
      startIndex <= getSafeArrayLength(safeData)
    ) {
      try {
        setCurrentData(safeData.slice(startIndex, endIndex));
      } catch (error) {
        console.error("Error slicing data in usePagination:", error);
        setCurrentData([]);
      }
    } else {
      setCurrentData([]);
    }
  }, [safeData, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  };
};

export default usePagination;
