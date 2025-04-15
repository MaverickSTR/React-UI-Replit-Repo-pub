'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

const CustomSearchBar = ({ className }: CustomSearchBarProps) => {
  const router = useRouter();
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
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-lg overflow-hidden p-2", className)}>
      <div className="flex flex-col md:flex-row">
        {/* Location selector */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-2">
          <div className="text-sm font-medium mb-1">Location</div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
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
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-2">
          <div className="text-sm font-medium mb-1">Check in</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 h-auto font-normal text-left text-gray-900 w-full"
              >
                <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                {checkIn ? (
                  format(checkIn, 'MMM d, yyyy')
                ) : (
                  <span className="text-gray-500">Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-2">
          <div className="text-sm font-medium mb-1">Check out</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 h-auto font-normal text-left text-gray-900 w-full"
              >
                <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                {checkOut ? (
                  format(checkOut, 'MMM d, yyyy')
                ) : (
                  <span className="text-gray-500">Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
        <div className="flex-1 p-2">
          <div className="text-sm font-medium mb-1">Guests</div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-500 mr-2" />
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="border-0 p-0 h-auto font-normal text-gray-900 w-full">
                <SelectValue placeholder="Add guests" />
              </SelectTrigger>
              <SelectContent>
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
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-lg"
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