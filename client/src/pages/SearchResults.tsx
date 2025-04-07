import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { searchProperties } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FilterList from '@/components/FilterList';
import Pagination from '@/components/Pagination';
import { Meta } from '@/lib/seo';

const SearchResults: React.FC = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<any>({});
  
  // Parse any filter parameters from URL
  useEffect(() => {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const propertyType = searchParams.get('propertyType');
    
    const newFilters: any = {};
    if (minPrice) newFilters.minPrice = parseInt(minPrice);
    if (maxPrice) newFilters.maxPrice = parseInt(maxPrice);
    if (bedrooms) newFilters.bedrooms = parseInt(bedrooms);
    if (propertyType) newFilters.propertyType = propertyType;
    
    setFilters(newFilters);
  }, [location]);

  const pageSize = 12;

  const { data: properties, isLoading, isError } = useQuery({
    queryKey: ['/api/properties/search', query, filters],
    queryFn: () => searchProperties(query, filters),
  });

  // Calculate pagination values
  const totalItems = properties?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = properties?.slice(startIndex, endIndex) || [];

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
  };

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: query ? `Search results for "${query}"` : 'All properties' }
  ];

  return (
    <>
      <Meta 
        title={query ? `${query} - Search Results | StayDirectly` : 'Search Properties | StayDirectly'}
        description={`Browse ${totalItems} properties ${query ? `matching "${query}"` : ''} - book directly with hosts and save on fees.`}
        canonical={`/search${query ? `?q=${query}` : ''}`}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />

        <h1 className="text-3xl font-bold mb-6">
          {query ? `Properties matching "${query}"` : 'All Properties'}
        </h1>
        
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <FilterList onFilterChange={handleFilterChange} currentFilters={filters} />
        </div>
        
        {/* Results Count */}
        <p className="text-gray-600 mb-4">
          {isLoading ? 'Searching...' : 
           isError ? 'Error loading results' :
           `Showing ${startIndex + 1}-${endIndex} of ${totalItems} properties`}
        </p>
        
        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm h-[300px]">
                <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-3 w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500 font-medium mb-2">Error loading properties</p>
              <p className="text-gray-600">Please try again later</p>
            </div>
          ) : properties?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-800 font-medium mb-2">No properties found</p>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            currentItems.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                totalPrice 
              />
            ))
          )}
        </div>
        
        {/* Pagination */}
        {!isLoading && !isError && properties?.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </div>
    </>
  );
};

export default SearchResults;
