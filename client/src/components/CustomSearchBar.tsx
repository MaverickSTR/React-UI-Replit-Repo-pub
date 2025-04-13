import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { MapPin, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import '@/lib/animations.css';

interface CustomSearchBarProps {
  className?: string;
}

const locations = [
  { id: 'miami', name: 'Miami, FL' },
  { id: 'shenandoah', name: 'Shenandoah, VA' },
  { id: 'annapolis', name: 'Annapolis, MD' },
  { id: 'nashville', name: 'Nashville, TN' },
  { id: 'blue-ridge', name: 'Blue Ridge, GA' },
];

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({ className }) => {
  const [, setLocation] = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<string>('1');

  const handleSearch = () => {
    // Build the search query with available parameters
    const searchParams = new URLSearchParams();
    
    if (selectedLocation) {
      searchParams.append('location', selectedLocation);
    }
    
    if (checkIn) {
      searchParams.append('checkIn', format(checkIn, 'yyyy-MM-dd'));
    }
    
    if (checkOut) {
      searchParams.append('checkOut', format(checkOut, 'yyyy-MM-dd'));
    }
    
    if (guests) {
      searchParams.append('guests', guests);
    }
    
    // Navigate to search results page with query parameters
    setLocation(`/search?${searchParams.toString()}`);
  };

  return (
    <div className={cn("bg-white rounded-full shadow-md border border-gray-200 flex flex-col md:flex-row items-center hover-lift fade-in", className)}>
      {/* Where */}
      <div className="flex-1 py-3 px-6 border-b md:border-b-0 md:border-r border-gray-200 w-full hover:bg-gray-50 transition-colors">
        <div className="font-medium text-xs mb-1">Where</div>
        <div className="flex items-center">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="border-0 p-0 h-auto font-normal text-gray-600 w-full">
              <SelectValue placeholder="Search destinations" />
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M2.5 4L6 7.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-lg bg-white p-1 shadow-2xl border-0">
              {locations.map((loc) => (
                <SelectItem 
                  key={loc.id} 
                  value={loc.id} 
                  className="hover:bg-gray-100 rounded-md px-3 py-2 transition-colors duration-150"
                >
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Check in */}
      <div className="flex-1 py-3 px-6 border-b md:border-b-0 md:border-r border-gray-200 w-full hover:bg-gray-50 transition-colors">
        <div className="font-medium text-xs mb-1">Check in</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 h-auto font-normal text-left text-gray-500 w-full btn-hover-expand"
            >
              {checkIn ? (
                format(checkIn, 'MMM d, yyyy')
              ) : (
                <span>Add dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-xl border border-gray-200 shadow-xl fade-in" align="start">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              initialFocus
              disabled={(date) => date < new Date()}
              className="fade-in"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Check out */}
      <div className="flex-1 py-3 px-6 border-b md:border-b-0 md:border-r border-gray-200 w-full hover:bg-gray-50 transition-colors">
        <div className="font-medium text-xs mb-1">Check out</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 h-auto font-normal text-left text-gray-500 w-full btn-hover-expand"
            >
              {checkOut ? (
                format(checkOut, 'MMM d, yyyy')
              ) : (
                <span>Add dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-xl border border-gray-200 shadow-xl fade-in" align="start">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              initialFocus
              disabled={(date) => 
                date < new Date() || (checkIn ? date <= checkIn : false)
              }
              className="fade-in"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Who */}
      <div className="flex-1 py-3 px-6 border-b md:border-b-0 w-full hover:bg-gray-50 transition-colors">
        <div className="font-medium text-xs mb-1">Who</div>
        <div className="flex items-center">
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="border-0 p-0 h-auto font-normal text-gray-600 w-full">
              <SelectValue placeholder="Add guests" />
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M2.5 4L6 7.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-lg bg-white p-1 shadow-2xl border-0">
              {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                <SelectItem 
                  key={num} 
                  value={num.toString()} 
                  className="hover:bg-gray-100 rounded-md px-3 py-2 transition-colors duration-150"
                >
                  {num} {num === 1 ? 'guest' : 'guests'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search button */}
      <div className="p-2 md:ml-1 mt-2 md:mt-0 md:mr-1">
        <Button 
          className="rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white aspect-square w-12 h-12 flex items-center justify-center btn-pulse hover-scale"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CustomSearchBar;