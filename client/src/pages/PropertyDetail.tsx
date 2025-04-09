import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getProperty, getPropertyReviews } from '@/lib/api';
import RevyoosWidget from '@/components/RevyoosWidget';
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
              className="flex items-center text-gray-600 hover:text-primary transition-colors ml-auto"
            >
              <Heart className={`h-4 w-4 mr-1 ${isHeartFilled ? 'fill-current text-red-500' : ''}`} />
              <span>Save</span>
            </button>
            <button className="flex items-center text-gray-600 hover:text-primary transition-colors ml-4">
              <Share className="h-4 w-4 mr-1" />
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
                className="w-full h-full object-cover rounded-tl-lg" 
              />
            </div>
            
            {/* Additional images - first two on top row */}
            <div className="h-[198px]">
              <img 
                src={property.additionalImages?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=871&q=80'} 
                alt={`${property.name} - view 2`}
                className="w-full h-full object-cover rounded-tr-lg" 
              />
            </div>
            <div className="h-[198px]">
              <img 
                src={property.additionalImages?.[1] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=870&q=80'} 
                alt={`${property.name} - view 3`}
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Additional images - bottom row */}
            <div className="h-[198px]">
              <img 
                src={property.additionalImages?.[2] || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=867&q=80'} 
                alt={`${property.name} - view 4`}
                className="w-full h-full object-cover rounded-bl-lg" 
              />
            </div>
            <div className="relative h-[198px]">
              <img 
                src={property.additionalImages?.[3] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=870&q=80'} 
                alt={`${property.name} - view 5`}
                className="w-full h-full object-cover rounded-br-lg" 
              />
              <button className="absolute right-4 bottom-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all">
                <span className="flex items-center">
                  <Tv className="mr-2 h-4 w-4" /> Show all photos
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
              <Button variant="outline" className="mt-6 border border-gray-800 hover:bg-gray-100 text-gray-800 font-medium px-6 py-2 rounded-lg transition-colors">
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
                        <button className="bg-white border border-gray-300 rounded-full p-1 disabled:opacity-50">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="bg-white border border-gray-300 rounded-full p-1">
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
                          className="object-cover w-full h-full"
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
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 overflow-hidden">
              <h2 className="text-xl font-bold mb-6">Guest Reviews</h2>
              <div className="w-full overflow-x-hidden">
                <RevyoosWidget className="w-full" widgetCode='eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0=' />
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
            
            {/* Why Book Direct Section - Now below FAQ */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm mb-6">
              <h2 className="text-2xl font-bold text-center mb-4">Why Book Direct?</h2>
              <p className="text-center text-gray-700 mb-8 max-w-3xl mx-auto">
                Experience the perfect blend of luxury and convenience at this stunning {property.bedrooms}-bedroom {property.type?.toLowerCase()} in {property.location}. 
                Boasting breathtaking views, upscale furnishings, and amenities like a heated indoor pool, hot tub, and direct beach access, 
                it's the ultimate retreat for families and friends. Located just minutes from local attractions, 
                this {property.type?.toLowerCase()} promises relaxation and unforgettable memories.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#FFE2EC" />
                        <path d="M7.5 11C8.32843 11 9 10.3284 9 9.5C9 8.67157 8.32843 8 7.5 8C6.67157 8 6 8.67157 6 9.5C6 10.3284 6.67157 11 7.5 11Z" fill="#FF6B95" />
                        <path d="M7.5 16C8.32843 16 9 15.3284 9 14.5C9 13.6716 8.32843 13 7.5 13C6.67157 13 6 13.6716 6 14.5C6 15.3284 6.67157 16 7.5 16Z" fill="#FF6B95" />
                        <path d="M12.5 11C13.3284 11 14 10.3284 14 9.5C14 8.67157 13.3284 8 12.5 8C11.6716 8 11 8.67157 11 9.5C11 10.3284 11.6716 11 12.5 11Z" fill="#46C056" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M17.4 10C17.7314 10 18 9.73137 18 9.4V4.6C18 4.26863 17.7314 4 17.4 4H6.6C6.26863 4 6 4.26863 6 4.6V6H8V6H16V8H12V10H17.4Z" fill="#956B50" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2">Memorable Design</h3>
                  <p className="text-gray-600 text-center">
                    Thoughtfully designed with premium furnishings, stylish decor, and personalized touches. Every detail has been carefully considered to create a space that's not only functional but also inviting and unforgettable for your stay.
                  </p>
                </div>
                
                {/* Card 2 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6L14.25 10.5L19.5 11.25L15.75 14.75L16.75 20L12 17.5L7.25 20L8.25 14.75L4.5 11.25L9.75 10.5L12 6Z" fill="#D4AF37" />
                        <path d="M5 12L7.25 10.5L9.75 10.5L5 12Z" fill="#B28E29" />
                        <path d="M19 12L16.75 10.5L14.25 10.5L19 12Z" fill="#B28E29" />
                        <path d="M11 18.5L12 17.5L13 18.5L12 20L11 18.5Z" fill="#B28E29" />
                        <path d="M21 7L19 5L19 9L21 7Z" fill="#FFADB4" />
                        <path d="M23 7.5C23 6.67157 22.3284 6 21.5 6C20.6716 6 20 6.67157 20 7.5C20 8.32843 20.6716 9 21.5 9C22.3284 9 23 8.32843 23 7.5Z" fill="#FF8087" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2">5-Star Experience</h3>
                  <p className="text-gray-600 text-center">
                    Our goal is to deliver a 5-star experience for every guest. From high-quality amenities to the little extras that make a big difference, we aim to provide a seamless and exceptional experience that exceeds your expectations.
                  </p>
                </div>
                
                {/* Card 3 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-12 h-12 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 9C17 11.7614 14.7614 14 12 14C9.23858 14 7 11.7614 7 9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9Z" fill="#FFADB4" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 10C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10ZM12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="#FF8087" />
                        <path d="M18 16H15.5L15.5 20L18 20C18.5523 20 19 19.5523 19 19V17C19 16.4477 18.5523 16 18 16Z" fill="#D2B48C" />
                        <path d="M8.5 16H6C5.44772 16 5 16.4477 5 17V19C5 19.5523 5.44772 20 6 20H8.5L8.5 16Z" fill="#D2B48C" />
                        <path d="M15.5 16H8.5V20H15.5V16Z" fill="#FFCC80" />
                        <path d="M12 14C8.5 14 5.5 16 5 20H19C18.5 16 15.5 14 12 14Z" fill="#FFB3C0" />
                        <circle cx="19" cy="14" r="1" fill="#333333" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2">Save On Fees</h3>
                  <p className="text-gray-600 text-center">
                    Save up to 15% when you book directly. Avoid annoying service fees & save money by booking directly with us. Direct bookings have a 4% fee compared to 14%+ on Airbnb! More money in your pocket!
                  </p>
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