import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { searchProperties } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FilterList from '@/components/FilterList';
import Pagination from '@/components/Pagination';
import { Meta } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Grid, List, MapPin } from 'lucide-react';

const SearchResults: React.FC = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<any>({});
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('map');
  
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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {query ? `Properties matching "${query}"` : 'All Properties'}
          </h1>
          
          {/* View toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
              className="w-10 h-10 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'map' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('map')}
              className="w-10 h-10 p-0"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
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
        
        {/* Map and results container */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Properties grid - left side on desktop, top on mobile */}
          <div className={`${viewMode === 'map' ? 'lg:w-3/5' : 'w-full'}`}>
            {isLoading ? (
              // Skeleton loading state for grid
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm h-[300px]">
                    <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-3 w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500 font-medium mb-2">Error loading properties</p>
                <p className="text-gray-600">Please try again later</p>
              </div>
            ) : properties?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-800 font-medium mb-2">No properties found</p>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentItems.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    totalPrice 
                  />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && !isError && properties && properties.length > 0 && (
              <div className="mt-8">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </div>
            )}
          </div>
          
          {/* Map view - right side on desktop, bottom on mobile */}
          {viewMode === 'map' && (
            <div className="lg:w-2/5 h-[calc(100vh-200px)] min-h-[600px] bg-gray-100 rounded-lg overflow-hidden relative">
              {/* Fixed map image for demo purposes */}
              <img 
                src="https://maps.googleapis.com/maps/api/staticmap?center=Nashville,TN&zoom=12&size=800x1200&markers=color:red%7CNashville,TN&markers=color:blue%7Clabel:1%7C36.174465,-86.767960&markers=color:blue%7Clabel:2%7C36.155768,-86.784230&markers=color:blue%7Clabel:3%7C36.184652,-86.798250&markers=color:blue%7Clabel:4%7C36.164861,-86.846380&key=YOUR_API_KEY&style=feature:administrative|element:labels|visibility:off&style=feature:poi|visibility:off&style=feature:transit|visibility:off&style=feature:road|element:labels|visibility:off&style=feature:road|element:geometry|color:0xf5f5f5&style=feature:landscape|color:0xffffff&style=feature:water|color:0xe8f4f8"
                alt="Property Map"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2l0eSUyMG1hcHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&h=1200&q=60";
                }}
              />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
                <h3 className="font-medium text-lg mb-2">Nashville, TN</h3>
                <p className="text-sm text-gray-600">Showing {totalItems} properties in this area</p>
              </div>
              
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg">
                <Button variant="ghost" size="sm" className="text-xs">
                  Reset Map
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
