import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import SearchBar from './SearchBar';
import { Menu, User, Home, MapPin, Heart, LogIn } from 'lucide-react';

const Navbar: React.FC = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isHomePage = location === '/';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-primary text-2xl font-bold">StayDirectly</span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-gray-600 hover:text-primary transition-colors">
              Destinations
            </Link>
            <Link href="/api-properties" className="text-gray-600 hover:text-primary transition-colors">
              API Properties
            </Link>
            <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
              For Hosts
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full flex items-center gap-2 px-4">
                  <Menu className="h-4 w-4" />
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogIn className="mr-2 h-4 w-4" /> Sign in
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Home className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className="mr-2 h-4 w-4" /> Favorites
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <MapPin className="mr-2 h-4 w-4" /> Host your place
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="py-4">
                <div className="space-y-4 mt-4">
                  <Link href="/" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                    Home
                  </Link>
                  <Link href="/search" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                    Destinations
                  </Link>
                  <Link href="/api-properties" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                    API Properties
                  </Link>
                  <Link href="#" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                    For Hosts
                  </Link>
                  <Link href="#" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                    Sign in
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Search bar (mobile) */}
        <div className="mt-4 lg:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
