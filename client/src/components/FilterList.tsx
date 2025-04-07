import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import FilterButton from '@/components/ui/FilterButton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from '@/components/ui/slider';
import { formatPrice } from '@/lib/utils';

interface FilterListProps {
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

const FilterList: React.FC<FilterListProps> = ({ onFilterChange, currentFilters }) => {
  const [location, setLocation] = useLocation();
  
  // Price range filter
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentFilters.minPrice || 0,
    currentFilters.maxPrice || 1000
  ]);

  // Property type filter
  const [propertyType, setPropertyType] = useState<string>(
    currentFilters.propertyType || ''
  );

  // Bedrooms filter
  const [bedrooms, setBedrooms] = useState<number>(
    currentFilters.bedrooms || 0
  );

  // Apply filters and update URL
  const applyFilters = (newFilters: any) => {
    const filters = { ...currentFilters, ...newFilters };
    onFilterChange(filters);
    
    // Update URL with filters
    const params = new URLSearchParams(location.split('?')[1] || '');
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    
    const newLocation = location.split('?')[0] + (params.toString() ? `?${params.toString()}` : '');
    setLocation(newLocation);
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setPropertyType('');
    setBedrooms(0);
    
    const params = new URLSearchParams(location.split('?')[1] || '');
    ['minPrice', 'maxPrice', 'propertyType', 'bedrooms'].forEach(key => {
      params.delete(key);
    });
    
    const query = params.get('q');
    const newLocation = location.split('?')[0] + (query ? `?q=${query}` : '');
    setLocation(newLocation);
    
    onFilterChange({});
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Price Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <FilterButton 
              label={
                priceRange[0] === 0 && priceRange[1] === 1000
                  ? "Price Range"
                  : `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`
              }
              active={currentFilters.minPrice !== undefined || currentFilters.maxPrice !== undefined}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Price Range</h4>
            <div className="pt-4">
              <Slider
                defaultValue={priceRange}
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={(value: [number, number]) => setPriceRange(value)}
              />
            </div>
            <div className="flex justify-between">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                className="text-sm"
                onClick={() => setPriceRange([0, 1000])}
              >
                Reset
              </Button>
              <Button 
                className="text-sm"
                onClick={() => applyFilters({ minPrice: priceRange[0], maxPrice: priceRange[1] })}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Property Type Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <FilterButton 
              label={propertyType || "Property Type"}
              active={!!currentFilters.propertyType}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-1">
            {['Apartment', 'House', 'Villa', 'Condo', 'Cabin', 'Cottage'].map((type) => (
              <Button
                key={type}
                variant="ghost"
                className={`w-full justify-start text-left ${
                  propertyType === type ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => {
                  setPropertyType(type);
                  applyFilters({ propertyType: type });
                }}
              >
                {type}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Bedrooms Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <FilterButton 
              label={bedrooms > 0 ? `${bedrooms}+ Bedrooms` : "Bedrooms"}
              active={currentFilters.bedrooms !== undefined}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-1">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <Button
                key={num}
                variant="ghost"
                className={`w-full justify-start text-left ${
                  bedrooms === num ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => {
                  setBedrooms(num);
                  applyFilters({ bedrooms: num > 0 ? num : undefined });
                }}
              >
                {num === 0 ? 'Any' : num === 5 ? '5+' : num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Amenities Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <FilterButton label="Amenities" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-left">
              WiFi
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              Kitchen
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              Air Conditioning
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              Washer/Dryer
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              Pool
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              Free Parking
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* More Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <FilterButton label="More Filters" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Additional Filters</h4>
            <p className="text-sm text-gray-600">More filter options will be available soon.</p>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters Button (only show if filters are applied) */}
      {Object.keys(currentFilters).length > 0 && (
        <Button 
          variant="ghost" 
          className="text-primary hover:text-primary/80"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterList;
