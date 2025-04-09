import React from 'react';
import { Meta } from '@/lib/seo';
import HospitableSearchWidget from '@/components/HospitableSearchWidget';
import Breadcrumb from '@/components/ui/Breadcrumb';

const HospitableSearch: React.FC = () => {
  // Define breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Hospitable Property Search' }
  ];

  return (
    <>
      <Meta 
        title="Hospitable Property Search | StayDirectly"
        description="Search for properties across multiple platforms using Hospitable's direct booking widget."
        canonical="/hospitable-search"
      />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Search Properties Across Platforms
          </h1>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Use the search widget below to find properties across multiple platforms, powered by Hospitable.
          </p>
        </div>
        
        {/* Hospitable search widget */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-12">
          <HospitableSearchWidget 
            identifier="3747e731-d69b-4c6e-93a9-d6a432b26db9" 
            type="custom"
            className="w-full min-h-[800px]"
          />
        </div>
      </div>
    </>
  );
};

export default HospitableSearch;