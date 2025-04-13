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
    <div className={cn("bg-white/80 backdrop-blur-md rounded-full shadow-lg overflow-hidden py-3 px-5", className)}>
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Location selector */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 py-2 px-3">
          <div className="text-xs uppercase tracking-wider mb-1 text-gray-400 font-medium">Location</div>
          <div className="flex items-center">
            <MapPin className="h-3.5 w-3.5 text-gray-400 mr-2" />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="border-0 p-0 h-auto font-normal text-gray-700 w-full">
                <SelectValue placeholder="Where are you going?" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] rounded-md">
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Check-in date picker */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 py-2 px-3">
          <div className="text-xs uppercase tracking-wider mb-1 text-gray-400 font-medium">Check in</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 h-auto font-normal text-left text-gray-700 w-full"
              >
                <CalendarIcon className="h-3.5 w-3.5 text-gray-400 mr-2" />
                {checkIn ? (
                  format(checkIn, 'MMM d, yyyy')
                ) : (
                  <span className="text-gray-500">Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-md border-0 shadow-lg" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out date picker */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 py-2 px-3">
          <div className="text-xs uppercase tracking-wider mb-1 text-gray-400 font-medium">Check out</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 h-auto font-normal text-left text-gray-700 w-full"
              >
                <CalendarIcon className="h-3.5 w-3.5 text-gray-400 mr-2" />
                {checkOut ? (
                  format(checkOut, 'MMM d, yyyy')
                ) : (
                  <span className="text-gray-500">Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-md border-0 shadow-lg" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
                disabled={(date) => 
                  date < new Date() || (checkIn ? date <= checkIn : false)
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests selector */}
        <div className="flex-1 py-2 px-3">
          <div className="text-xs uppercase tracking-wider mb-1 text-gray-400 font-medium">Guests</div>
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 text-gray-400 mr-2" />
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="border-0 p-0 h-auto font-normal text-gray-700 w-full">
                <SelectValue placeholder="Add guests" />
              </SelectTrigger>
              <SelectContent className="rounded-md border-0 shadow-lg">
                {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'guest' : 'guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search button - in mobile view it's full width below the inputs */}
        <div className="md:ml-4 mt-4 md:mt-0 flex items-center">
          <Button 
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-7 py-2.5 rounded-full font-medium transition-colors"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
            <span className="ml-2 md:hidden lg:inline-block">Search</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomSearchBar;