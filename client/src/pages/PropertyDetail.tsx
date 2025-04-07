import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getProperty, getPropertyReviews } from '@/lib/api';
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
  Heart,
  ChevronRight
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, formatDate, getRatingPercentage } from '@/lib/utils';
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
        <Breadcrumb items={breadcrumbItems} />

        {/* Property Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <div className="flex flex-wrap items-center text-sm gap-y-2">
            <div className="flex items-center mr-4">
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <span className="ml-1 font-medium">{property.rating?.toFixed(2)}</span>
              <span className="ml-1 text-gray-600">({property.reviewCount} reviews)</span>
            </div>
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

        {/* Property Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px]">
            <div className="md:col-span-2 md:row-span-2 h-full">
              <img 
                src={property.imageUrl} 
                alt={property.name}
                className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg" 
              />
            </div>
            
            {property.additionalImages?.slice(0, 4).map((image, index) => (
              <div key={index} className={`hidden md:block h-full ${index === 3 ? 'relative' : ''} ${index === 0 ? 'rounded-tr-lg' : ''} ${index === 3 ? 'rounded-br-lg' : ''}`}>
                <img 
                  src={image} 
                  alt={`${property.name} - view ${index + 2}`}
                  className={`w-full h-full object-cover ${index === 0 ? 'rounded-tr-lg' : ''} ${index === 3 ? 'rounded-br-lg' : ''}`}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column for property details */}
          <div className="lg:col-span-2">
            {/* Host Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">Entire {property.bedrooms === 0 ? 'studio' : 'apartment'} hosted by {property.hostName}</h2>
                  <ul className="flex flex-wrap text-gray-600 text-sm">
                    <li className="flex items-center mr-4">
                      <UserCircle2 className="h-4 w-4 mr-2" /> {property.maxGuests} guests
                    </li>
                    <li className="flex items-center mr-4">
                      <DoorOpen className="h-4 w-4 mr-2" /> {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                    </li>
                    <li className="flex items-center mr-4">
                      <Bed className="h-4 w-4 mr-2" /> {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
                    </li>
                    <li className="flex items-center">
                      <Bath className="h-4 w-4 mr-2" /> {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
                    </li>
                  </ul>
                </div>
                <img src={property.hostImage || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={property.hostName} className="w-12 h-12 rounded-full" />
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

            {/* Location */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Map view of {property.location}</p>
                </div>
              </div>
              <div className="text-gray-600">
                <p className="mb-2"><strong>{property.location}, {property.city}</strong></p>
                <p>Located in one of {property.city}'s most sought-after neighborhoods, you'll be close to popular attractions and local amenities.</p>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center mb-6">
                <Star className="h-5 w-5 text-amber-500 fill-current mr-2" />
                <span className="font-bold text-lg mr-1">{property.rating?.toFixed(2)}</span>
                <span className="text-gray-600 mr-1">·</span>
                <span className="text-gray-600">{property.reviewCount} reviews</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">Cleanliness</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "98%" }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">4.9</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">Accuracy</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "96%" }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">4.8</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">Communication</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">5.0</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">Location</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "94%" }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">4.7</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">Check-in</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "98%" }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">4.9</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">Value</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">4.6</span>
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-6">
                {isLoadingReviews ? (
                  <div className="animate-pulse space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  reviews?.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center mb-3">
                        <img 
                          src={review.userImage || 'https://randomuser.me/api/portraits/women/45.jpg'} 
                          alt={review.userName} 
                          className="w-10 h-10 rounded-full mr-3" 
                        />
                        <div>
                          <p className="font-medium">{review.userName}</p>
                          <p className="text-sm text-gray-500">{review.date ? formatDate(review.date) : ''}</p>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
              
              <Button variant="outline" className="mt-6 border border-gray-800 hover:bg-gray-100 text-gray-800 font-medium px-6 py-2 rounded-lg transition-colors">
                Show all reviews
              </Button>
            </div>
          </div>

          {/* Booking Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-2xl font-bold">{formatPrice(property.price)}</span>
                    <span className="text-gray-600"> night</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="ml-1 text-sm font-medium">{property.rating?.toFixed(2)}</span>
                    <span className="ml-1 text-gray-600 text-sm">({property.reviewCount})</span>
                  </div>
                </div>
                
                {/* Booking Form */}
                <form>
                  <div className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
                    <div className="grid grid-cols-2">
                      <div className="p-3 border-r border-b border-gray-300">
                        <Label className="block text-xs font-medium text-gray-700 mb-1">CHECK-IN</Label>
                        <Input 
                          type="text" 
                          placeholder="Add date" 
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full border-none p-0 focus:ring-0 text-gray-900" 
                        />
                      </div>
                      <div className="p-3 border-b border-gray-300">
                        <Label className="block text-xs font-medium text-gray-700 mb-1">CHECKOUT</Label>
                        <Input 
                          type="text" 
                          placeholder="Add date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full border-none p-0 focus:ring-0 text-gray-900" 
                        />
                      </div>
                      <div className="p-3 col-span-2">
                        <Label className="block text-xs font-medium text-gray-700 mb-1">GUESTS</Label>
                        <Select value={guests} onValueChange={setGuests}>
                          <SelectTrigger className="w-full border-none p-0 focus:ring-0 text-gray-900 h-auto shadow-none">
                            <SelectValue placeholder="Select guests" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1 guest">1 guest</SelectItem>
                            <SelectItem value="2 guests">2 guests</SelectItem>
                            <SelectItem value="3 guests">3 guests</SelectItem>
                            <SelectItem value="4 guests">4 guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handleBooking}
                    className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mb-4"
                  >
                    Book now
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mb-6">You won't be charged yet</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="underline">{formatPrice(property.price)} x 6 nights</span>
                      <span>{formatPrice(nightlyTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline">Cleaning fee</span>
                      <span>{formatPrice(cleaningFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline">Service fee</span>
                      <span>{formatPrice(serviceFee)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <Shield className="text-primary mt-1 mr-3 h-5 w-5" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Direct Booking Protection.</span> Every booking includes protection against host cancellations, listing inaccuracies, and other issues.
                  </p>
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