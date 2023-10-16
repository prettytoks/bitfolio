import React from 'react';

interface PaginationProps {
  currentPage: number;
  coinsPerPage: number;
  totalCoins: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  coinsPerPage,
  totalCoins,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCoins / coinsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return; // Do not navigate if page is out of range
    }
    onPageChange(page);
  };

  return (
  

        <div className="flex justify-center mt-20">
          
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:hover:text-gray-600"
          >
            Previous
          </button>
          {/* Render page numbers */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded relative inline-flex items-center ml-3"
            >
              
              {page}
             
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ml-3 dark:hover:text-gray-600"
          >
            Next
          </button>
       

        </div>
    
        
  );
};

export default Pagination;

/*

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPaginationItems = () => {
    const paginationItems = [];

    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage;
      paginationItems.push(
        <li
          key={i}
          className={`pagination-item ${isActive ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </li>
      );
    }

    return paginationItems;
  };

  return (
    <nav className="flex items-center justify-center mt-6">
      <ul className="pagination">
        <li
          className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={handlePreviousPage}
        >
          Previous
        </li>

        {renderPaginationItems()}

        <li
          className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleNextPage}
        >
          Next
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
*/