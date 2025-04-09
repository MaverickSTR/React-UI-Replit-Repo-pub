import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getProperty, getPropertyReviews } from '@/lib/api';
import RevyoosIframe from '@/components/RevyoosIframe';
import RevyoosScriptWidget from '@/components/RevyoosScriptWidget';
import RevyoosDirectEmbed from '@/components/RevyoosDirectEmbed';
import { 
  Wifi, 
  Snowflake, 
  Tv, 
  Utensils, 
  ShowerHead, 
  Building, 
  Dumbbell, 
  ShieldCheck,
  Star,
  MapPin,
  UserCircle2,
  DoorOpen,
  Bed,
  Bath,
  Shield,
  ChevronLeft,
  ChevronRight,
  Share,
  Heart
} from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, formatDate } from '@/lib/utils';
import { Meta, PropertyStructuredData } from '@/lib/seo';

// Generate mock bedroom details if they don't exist in the property data
const generateMockBedroomDetails = (property: any) => {
  const bedTypes = ['king', 'queen', 'double', 'single', 'sofa bed', 'bunk bed', 'air mattress'];
  const bedroomNames = ['Master Bedroom', 'Guest Bedroom', 'Kids Room', 'Bedroom', 'Cozy Bedroom'];
  const bedroomImages = [
    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1558882224-dda166733046?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3'
  ];
  
  // Create mock bedrooms based on the number of bedrooms in the property
  const numBedrooms = property.bedrooms || 2;
  return Array.from({ length: numBedrooms }, (_, i) => {
    // Randomize number of beds between 1 and 2
    const numBeds = Math.floor(Math.random() * 2) + 1;
    
    return {
      id: i + 1,
      name: i < bedroomNames.length ? bedroomNames[i] : `${bedroomNames[4]} ${i + 1}`,
      beds: Array.from({ length: numBeds }, (_, j) => {
        // Select a random bed type
        const bedType = bedTypes[Math.floor(Math.random() * bedTypes.length)];
        return { type: bedType, count: 1 };
      }),
      image: bedroomImages[i % bedroomImages.length]
    };
  });
};

const PropertyDetail: React.FC = () => {
  const [match, params] = useRoute('/property/:id');
  const propertyId = match ? parseInt(params.id) : 0;
  
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1 guest');
  
  const { data: property, isLoading: isLoadingProperty } = useQuery({
    queryKey: [`/api/properties/${propertyId}`],
    queryFn: () => getProperty(propertyId),
    enabled: !!propertyId,
  });
  
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: [`/api/properties/${propertyId}/reviews`],
    queryFn: () => getPropertyReviews(propertyId),
    enabled: !!propertyId,
  });
  
  // No need for script handling here since we'll use the RevyoosScriptWidget component
  
  const toggleHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsHeartFilled(!isHeartFilled);
  };
  
  const handleBooking = () => {
    // Booking logic would go here
    alert('Booking functionality would be implemented here');
  };
  
  if (isLoadingProperty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 max-w-md mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-[500px] bg-gray-200 rounded-lg mb-8"></div>
          {/* More loading skeleton elements would go here */}
        </div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-red-500 mb-2">Property Not Found</h1>
            <p>The property you are looking for does not exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Calculate total price for a 6-night stay
  const nightlyTotal = property.price * 6;
  const cleaningFee = 85;
  const serviceFee = 0;
  const totalPrice = nightlyTotal + cleaningFee + serviceFee;
  
  // Get amenity icons
  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "High-speed WiFi": <Wifi className="h-5 w-5 text-gray-400" />,
      "Air conditioning": <Snowflake className="h-5 w-5 text-gray-400" />,
      "55\" HDTV with Netflix": <Tv className="h-5 w-5 text-gray-400" />,
      "Fully equipped kitchen": <Utensils className="h-5 w-5 text-gray-400" />,
      "Washer/dryer": <ShowerHead className="h-5 w-5 text-gray-400" />,
      "Elevator in building": <Building className="h-5 w-5 text-gray-400" />,
      "Gym access": <Dumbbell className="h-5 w-5 text-gray-400" />,
      "24/7 security": <ShieldCheck className="h-5 w-5 text-gray-400" />
    };
    
    return iconMap[amenity] || <Star className="h-5 w-5 text-gray-400" />;
  };
  
  // Breadcrumb items
  // Extract state from location (assuming format like "Beverly Hills, CA")
  const locationParts = property.location.split(',');
  const state = locationParts.length > 1 ? locationParts[1].trim() : 'CA';
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: state, href: `/search?q=${state}` },
    { label: property.city, href: `/city/${property.city}` },
    { label: property.name }
  ];
  
  return (
    <>
      <Meta 
        title={`${property.name} in ${property.city} | StayDirectly`}
        description={property.description.substring(0, 160)}
        canonical={`/property/${property.id}`}
        image={property.imageUrl}
        type="product"
      />
      
      <PropertyStructuredData
        name={property.name}
        description={property.description.substring(0, 160)}
        image={property.imageUrl}
        price={property.price}
        ratingValue={property.rating || 0}
        reviewCount={property.reviewCount || 0}
        address={property.location}
      />
      
      <div className="container mx-auto px-4 pt-6">
        {/* Breadcrumbs */}
        <nav>
          <Breadcrumb items={breadcrumbItems} />
        </nav>

        {/* Property Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <div className="flex flex-wrap items-center text-sm gap-y-2">
            <div className="flex items-center mr-4 text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.city}, {state}</span>
            </div>
            <button 
              onClick={toggleHeart}
              className="flex items-center text-gray-600 hover:text-primary transition-colors ml-auto hover-scale"
            >
              <Heart className={`h-4 w-4 mr-1 ${isHeartFilled ? 'fill-current text-red-500 heart-beat active' : 'heart-beat'}`} />
              <span>Save</span>
            </button>
            <button className="flex items-center text-gray-600 hover:text-primary transition-colors ml-4 hover-scale">
              <Share className="h-4 w-4 mr-1 icon-bounce" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Property Gallery - Full Width */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px]">
            {/* Main large image */}
            <div className="md:col-span-2 md:row-span-2 h-full">
              <img 
                src={property.imageUrl} 
                alt={property.name}
                className="w-full h-full object-cover rounded-tl-lg hover-scale transition-transform duration-700" 
              />
            </div>
            
            {/* Additional images - first two on top row */}
            <div className="h-[198px] overflow-hidden">
              <img 
                src={property.additionalImages?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=871&q=80'} 
                alt={`${property.name} - view 2`}
                className="w-full h-full object-cover rounded-tr-lg hover-scale transition-transform duration-700" 
              />
            </div>
            <div className="h-[198px] overflow-hidden">
              <img 
                src={property.additionalImages?.[1] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=870&q=80'} 
                alt={`${property.name} - view 3`}
                className="w-full h-full object-cover hover-scale transition-transform duration-700" 
              />
            </div>
            
            {/* Additional images - bottom row */}
            <div className="h-[198px] overflow-hidden">
              <img 
                src={property.additionalImages?.[2] || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=867&q=80'} 
                alt={`${property.name} - view 4`}
                className="w-full h-full object-cover rounded-bl-lg hover-scale transition-transform duration-700" 
              />
            </div>
            <div className="relative h-[198px] overflow-hidden">
              <img 
                src={property.additionalImages?.[3] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=870&q=80'} 
                alt={`${property.name} - view 5`}
                className="w-full h-full object-cover rounded-br-lg hover-scale transition-transform duration-700" 
              />
              <button className="absolute right-4 bottom-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all gallery-nav-btn pulse">
                <span className="flex items-center">
                  <Tv className="mr-2 h-4 w-4 icon-bounce" /> Show all photos
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content grid - After Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column for property details */}
          <div className="lg:col-span-2">
            {/* Property Title and Host Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Entire home in {property.city}, {property.country}
              </h2>
              <p className="text-gray-600 mb-4 flex items-center flex-wrap gap-3">
                <span className="flex items-center">
                  <UserCircle2 className="h-4 w-4 mr-1.5 text-gray-500" />
                  {property.maxGuests} guests
                </span>
                <span className="flex items-center">
                  <DoorOpen className="h-4 w-4 mr-1.5 text-gray-500" />
                  {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                </span>
                <span className="flex items-center">
                  <Bed className="h-4 w-4 mr-1.5 text-gray-500" />
                  {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
                </span>
                <span className="flex items-center">
                  <Bath className="h-4 w-4 mr-1.5 text-gray-500" />
                  {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
                </span>
              </p>
              
              <div className="flex items-center mb-6">
                <div className="inline-flex items-center bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-3 rounded-lg border border-amber-200 mr-4 shadow-sm">
                  <Star className="h-5 w-5 text-amber-500 fill-current mr-2" />
                  <div className="flex flex-col">
                    <span className="text-amber-700 font-semibold leading-tight">Guest favorite</span>
                    <span className="text-gray-600 text-sm">One of the most loved homes</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-amber-500 fill-current" />
                  <span className="font-bold text-lg mx-2">{property.rating?.toFixed(1)}</span>
                  <span className="text-gray-600">({property.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="flex items-start border-t border-gray-200 pt-4">
                <img src={property.hostImage || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={property.hostName} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="font-medium">Hosted by {property.hostName}</h3>
                  <p className="text-gray-600 text-sm">Superhost · 3 years hosting</p>
                </div>
              </div>
            </div>
            
            {/* Property Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="prose max-w-none text-gray-600">
                <p>{property.description.substring(0, 300)}...</p>
              </div>
              
              <Accordion type="single" collapsible className="w-full mt-4 border-t pt-4">
                <AccordionItem value="description" className="border-none">
                  <AccordionTrigger className="py-2 font-medium text-primary">
                    The Space
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <div className="space-y-4">
                      <p>{property.description}</p>
                      <p>
                        This stunning {property.bedrooms}-bedroom home has been thoughtfully designed to provide an exceptional
                        stay. The open-concept living area flows seamlessly to a private balcony with sweeping views. 
                        The fully-equipped gourmet kitchen features premium appliances, perfect for preparing meals.
                      </p>
                      <p>
                        Each bedroom has been designed with comfort in mind, featuring premium linens, ample storage, 
                        and luxurious touches. The master suite includes a spa-like ensuite bathroom with a rainfall shower.
                      </p>
                      <p>
                        Additional features include high-speed WiFi throughout, smart TVs in each room, in-unit laundry,
                        and secure parking.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    {getAmenityIcon(amenity)}
                    <span className="ml-3">{amenity}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-6 border border-gray-800 hover:bg-gray-100 text-gray-800 font-medium px-6 py-2 rounded-lg transition-colors hover-scale btn-pulse">
                Show all amenities
              </Button>
            </div>

            {/* Where you'll sleep */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Where you'll sleep</h2>
                <div className="text-sm text-gray-600">
                  {property.bedrooms > 2 && (
                    <div className="flex items-center gap-2">
                      <span>1 / {property.bedrooms}</span>
                      <div className="flex gap-1">
                        <button className="bg-white border border-gray-300 rounded-full p-1 disabled:opacity-50 transition-all hover:bg-gray-50 hover-scale">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="bg-white border border-gray-300 rounded-full p-1 transition-all hover:bg-gray-50 hover-scale">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Grid layout for bedrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(property.bedroomDetails?.length ? property.bedroomDetails : generateMockBedroomDetails(property)).slice(0, 2).map((bedroom, index) => (
                  <div key={index} className="h-full">
                    <div className="overflow-hidden h-full flex flex-col">
                      <div className="aspect-video relative overflow-hidden bg-gray-100 mb-4 rounded-lg">
                        <img 
                          src={bedroom.image || property.imageUrl} 
                          alt={`${bedroom.name} in ${property.name}`}
                          className="object-cover w-full h-full hover-scale transition-transform duration-700"
                        />
                      </div>
                      <h3 className="font-medium text-base mb-1">{bedroom.name}</h3>
                      <div className="text-gray-600 text-sm">
                        {bedroom.beds.map((bed, bedIndex) => (
                          <span key={bedIndex}>
                            {bedIndex > 0 && ', '}
                            {bed.count} {bed.count > 1 ? bed.type + 's' : bed.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* No "show all bedrooms" button */}
            </div>


            {/* Reviews Section with Revyoos Widget */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 overflow-visible">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-xl font-bold">Guest Reviews</h2>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-amber-500 fill-current mr-1" />
                  <span className="font-semibold mr-1">{property.rating?.toFixed(1) || '4.9'}</span>
                  <span className="text-gray-600">({property.reviewCount || '84'} reviews)</span>
                </div>
              </div>
              
              {/* Using the RevyoosDirectEmbed component with fallback UI */}
              <div className="relative w-full min-h-[600px]">
                <RevyoosDirectEmbed className="w-full mx-auto" />
              </div>
            </div>
            
            {/* Location Map - Moved under Guest Reviews */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-xl font-bold mb-4">Location</h3>
              <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Map view of {property.location}</p>
                </div>
              </div>
              <div className="text-gray-600">
                <p className="mb-2"><strong>{property.location}, {property.city}</strong></p>
                <p>Located in one of {property.city}'s most sought-after neighborhoods.</p>
              </div>
            </div>

            {/* Nearby Landmarks and Points of Interest */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-6">Nearby Places</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Miami International Airport</span>
                  </div>
                  <span className="text-gray-600">8.2 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-50 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <span>South Beach</span>
                  </div>
                  <span className="text-gray-600">1.3 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-purple-50 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <span>Wynwood Arts District</span>
                  </div>
                  <span className="text-gray-600">3.7 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-amber-50 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-amber-600" />
                    </div>
                    <span>Bayside Marketplace</span>
                  </div>
                  <span className="text-gray-600">2.1 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-red-50 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-red-600" />
                    </div>
                    <span>Vizcaya Museum & Gardens</span>
                  </div>
                  <span className="text-gray-600">5.8 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-teal-50 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-teal-600" />
                    </div>
                    <span>Little Havana</span>
                  </div>
                  <span className="text-gray-600">4.3 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-orange-50 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-orange-600" />
                    </div>
                    <span>Lincoln Road Mall</span>
                  </div>
                  <span className="text-gray-600">1.8 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-pink-50 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-pink-600" />
                    </div>
                    <span>Frost Museum of Science</span>
                  </div>
                  <span className="text-gray-600">3.2 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-indigo-50 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span>Coconut Grove</span>
                  </div>
                  <span className="text-gray-600">6.7 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-emerald-50 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span>Brickell City Centre</span>
                  </div>
                  <span className="text-gray-600">2.9 miles</span>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-6">Frequently asked questions</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">
                    What are the check-in and check-out times?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Check-in is after 3:00 PM and check-out is before 11:00 AM. Self check-in with a keypad is available. We'll send you the code 24 hours before your arrival.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">
                    Is parking available?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Paid parking garage is available nearby for $25 per day. Street parking is limited but available. We recommend using public transportation as the subway station is only a 5-minute walk away.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">
                    What are the house rules?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We ask that you treat our home with respect. No smoking, parties, or events are allowed. Please be mindful of noise levels after 10 PM to respect our neighbors. Keep the property clean and report any damages promptly.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">
                    What is the cancellation policy?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Flexible cancellation: Full refund if cancelled at least 7 days before check-in. 50% refund if cancelled at least 3 days before check-in. No refunds for cancellations made less than 3 days before check-in.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-medium">
                    Things to know
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>The property is located on the 3rd floor with elevator access</li>
                      <li>Quiet hours from 10 PM to 8 AM</li>
                      <li>Please remove shoes when inside</li>
                      <li>Emergency contact is available 24/7</li>
                      <li>Garbage and recycling instructions are in the house manual</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">
                    Are pets allowed?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We don't allow pets in this property, but service animals are welcome as required by law. There are several pet-friendly parks within walking distance if you're visiting with a local friend who has pets.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Why Book Direct Section - Minimal design like shown in screenshot */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-6">Why Book Direct</h2>
              
              <div className="space-y-6 divide-y">
                {/* Item 1 */}
                <div className="flex items-start gap-4 py-4 hover-scale transition-all">
                  <div className="flex-shrink-0 bg-blue-50 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Identity verified</h3>
                    <p className="text-gray-600 text-sm">This host verified their email and phone number.</p>
                  </div>
                </div>
                
                {/* Item 2 */}
                <div className="flex items-start gap-4 py-4 hover-scale transition-all">
                  <div className="flex-shrink-0 bg-amber-50 p-3 rounded-full">
                    <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Pets are allowed</h3>
                    <p className="text-gray-600 text-sm">Pets will be considered, but must be okayed by the host.</p>
                  </div>
                </div>
                
                {/* Item 3 */}
                <div className="flex items-start gap-4 py-4 hover-scale transition-all">
                  <div className="flex-shrink-0 bg-green-50 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Book Direct and Save</h3>
                    <p className="text-gray-600 text-sm">Save on service fees by booking direct on our platform.</p>
                  </div>
                </div>
                
                {/* Item 4 */}
                <div className="flex items-start gap-4 py-4 hover-scale transition-all">
                  <div className="flex-shrink-0 bg-purple-50 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Instant confirmation</h3>
                    <p className="text-gray-600 text-sm">Your booking will be instantly confirmed after payment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h3 className="text-xl font-bold mb-6">Booking</h3>
                
                {/* Booking Widget Iframe */}
                <div className="booking-widget-container w-full overflow-hidden">
                  <iframe 
                    id="booking-iframe" 
                    sandbox="allow-top-navigation allow-scripts allow-same-origin allow-forms" 
                    className="w-full min-h-[700px] lg:min-h-[800px] border-0"
                    scrolling="no"
                    src={property.bookingWidgetUrl || "https://booking.hospitable.com/widget/55ea1cea-3c99-40f7-b98b-3de392f74a36/1080590"}
                    onLoad={(e) => {
                      // Add event listener to adjust height based on content
                      const iframe = e.currentTarget;
                      try {
                        // Attempt to resize iframe based on content height
                        const resizeObserver = new ResizeObserver(() => {
                          try {
                            if (iframe.contentWindow?.document.body) {
                              const height = iframe.contentWindow.document.body.scrollHeight;
                              iframe.style.height = `${height + 50}px`; // Add padding
                            }
                          } catch (err) {
                            console.log('Could not adjust iframe height dynamically');
                          }
                        });
                        
                        // Observe size changes if possible
                        if (iframe.contentWindow?.document.body) {
                          resizeObserver.observe(iframe.contentWindow.document.body);
                        }
                      } catch (err) {
                        console.log('Failed to set up dynamic resizing');
                      }
                    }}
                  ></iframe>
                </div>
              </div>
              
              {/* Direct Booking Protection and Location Map removed */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;