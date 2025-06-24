import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Import your components
import InReviewProperties from './InReviewProperties';
import InactiveProperties from './InactiveProperties';

const FilteredProperties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'inreview'; // default filter

  const handleFilterChange = (newFilter) => {
    setSearchParams({ filter: newFilter });
  };

  const renderComponent = () => {
    switch (filter) {
      case 'inreview':
        return <InReviewProperties />;
      case 'inactive':
        return <InactiveProperties />;
      default:
        return <div>❓ Unknown Filter</div>;
    }
  };

  return (
    <div className="top_header_pg pg_bg pg_adminproperty">        
            <div className="page_spacing pg_min_height">
     
      {/* Buttons to change filter */}
      {/* <div className="flex gap-3 mb-6">
        <button onClick={() => handleFilterChange('inreview')} className="bg-blue-500 text-white px-4 py-2 rounded">
          In Review
        </button>
        <button onClick={() => handleFilterChange('inactive')} className="bg-red-500 text-white px-4 py-2 rounded">
          Inactive
        </button>
        <button onClick={() => handleFilterChange('active')} className="bg-green-500 text-white px-4 py-2 rounded">
          Active
        </button>
      </div> */}

      {/* Render based on filter */}
      {renderComponent()}
    </div></div>
  );
};

export default FilteredProperties;
