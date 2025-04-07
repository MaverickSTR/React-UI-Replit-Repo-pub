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
  Share,
  Heart
} from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, formatDate } from '@/lib/utils';
import { Meta, PropertyStructuredData } from '@/lib/seo';

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
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: property.country, href: `/search?q=${property.country}` },
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
              <span>{property.location}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[450px]">
            <div className="md:col-span-2 md:row-span-2 h-full">
              <img 
                src={property.imageUrl} 
                alt={property.name}
                className="w-full h-full object-cover rounded-tl-lg" 
              />
            </div>
            
            {property.additionalImages?.slice(0, 4).map((image, index) => (
              <div key={index} className={`${index === 3 ? 'relative' : ''}`}>
                <img 
                  src={image} 
                  alt={`${property.name} - view ${index + 2}`}
                  className={`w-full h-full object-cover 
                    ${index === 0 ? 'rounded-tr-lg' : ''} 
                    ${index === 2 ? 'rounded-bl-lg' : ''} 
                    ${index === 3 ? 'rounded-br-lg' : ''}`}
                />
                {index === 3 && (
                  <button className="absolute right-4 bottom-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all">
                    <span className="flex items-center">
                      <Tv className="mr-2 h-4 w-4" /> Show all photos
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content grid - After Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column for property details */}
          <div className="lg:col-span-2">
            {/* Property Title and Host Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Entire {property.bedrooms === 0 ? 'home' : 'home'} in {property.city}, {property.country}</h2>
              <p className="text-gray-600 mb-4">{property.maxGuests} guests · {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'} · {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'} · {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}</p>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 mr-4">
                  <span className="text-amber-700 font-semibold mr-2">Guest favorite</span>
                  <span className="text-gray-600 text-sm">One of the most loved homes</span>
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
                <p>{property.description}</p>
              </div>
              <Button variant="link" className="mt-4 text-primary p-0 h-auto">Read more</Button>
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



            {/* Reviews Section with Revyoos Widget */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 overflow-hidden">
              <h2 className="text-xl font-bold mb-6">Guest Reviews</h2>
              <div className="w-full overflow-x-hidden">
                <RevyoosWidget className="w-full" widgetCode={property.reviewWidgetCode || undefined} />
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
                    Is there a security deposit?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, we collect a $200 refundable security deposit that will be returned within 7 days after checkout if no damages occur. The deposit is processed through our secure payment system.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">
                    Is the property suitable for remote work?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Absolutely! We offer high-speed fiber internet (300 Mbps) and a dedicated workspace with a comfortable desk and chair. The apartment has multiple outlets and USB charging ports throughout.
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
              
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex items-start">
                  <Shield className="text-primary mt-1 mr-3 h-5 w-5" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Direct Booking Protection.</span> Every booking includes protection against host cancellations, listing inaccuracies, and other issues.
                  </p>
                </div>
              </div>
              
              {/* Location Map */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Map view of {property.location}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2"><strong>{property.location}, {property.city}</strong></p>
                  <p>Located in one of {property.city}'s most sought-after neighborhoods.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;