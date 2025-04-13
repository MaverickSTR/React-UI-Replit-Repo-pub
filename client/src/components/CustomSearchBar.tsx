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
    <div className={cn("bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden p-4 border border-gray-100", className)}>
      <div className="flex flex-col md:flex-row gap-2">
        {/* Location selector */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-3 transition-all duration-200 hover:bg-gray-50 rounded-lg">
          <div className="text-sm font-medium mb-1 text-gray-700">Location</div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-primary mr-2" />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="border-0 p-0 h-auto font-normal text-gray-900 w-full">
                <SelectValue placeholder="Where are you going?" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Check-in date picker */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-3 transition-all duration-200 hover:bg-gray-50 rounded-lg">
          <div className="text-sm font-medium mb-1 text-gray-700">Check in</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 h-auto font-normal text-left text-gray-900 w-full"
              >
                <CalendarIcon className="h-4 w-4 text-primary mr-2" />
                {checkIn ? (
                  <span className="font-medium">{format(checkIn, 'MMM d, yyyy')}</span>
                ) : (
                  <span className="text-gray-500">Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-xl rounded-xl border-gray-100" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
                disabled={(date) => date < new Date()}
                className="rounded-xl"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out date picker */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-3 transition-all duration-200 hover:bg-gray-50 rounded-lg">
          <div className="text-sm font-medium mb-1 text-gray-700">Check out</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 h-auto font-normal text-left text-gray-900 w-full"
              >
                <CalendarIcon className="h-4 w-4 text-primary mr-2" />
                {checkOut ? (
                  <span className="font-medium">{format(checkOut, 'MMM d, yyyy')}</span>
                ) : (
                  <span className="text-gray-500">Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-xl rounded-xl border-gray-100" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
                disabled={(date) => 
                  date < new Date() || (checkIn ? date <= checkIn : false)
                }
                className="rounded-xl"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests selector */}
        <div className="flex-1 p-3 transition-all duration-200 hover:bg-gray-50 rounded-lg">
          <div className="text-sm font-medium mb-1 text-gray-700">Guests</div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-primary mr-2" />
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="border-0 p-0 h-auto font-normal text-gray-900 w-full">
                <SelectValue placeholder="Add guests" />
              </SelectTrigger>
              <SelectContent className="shadow-xl rounded-xl border-gray-100">
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
        <div className="md:ml-2 mt-4 md:mt-0 flex items-center">
          <Button 
            className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-7 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5 mr-2" /> Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomSearchBar;