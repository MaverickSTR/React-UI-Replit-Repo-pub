import React from 'react';
import { Link } from 'wouter';
import { Property } from '@shared/schema';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import HeartButton from '@/components/ui/HeartButton';
import { formatPrice } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  showLocation?: boolean;
  totalPrice?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  showLocation = true,
  totalPrice = false,
}) => {
  const {
    id,
    name,
    location,
    price,
    rating,
    reviewCount,
    imageUrl,
    bedrooms,
    bathrooms,
    maxGuests,
  } = property;

  // Calculate room features text
  const featureText = `${bedrooms} ${bedrooms === 1 ? 'bedroom' : 'bedrooms'} · ${bathrooms} ${bathrooms === 1 ? 'bath' : 'baths'} · ${maxGuests} ${maxGuests === 1 ? 'guest' : 'guests'}`;

  return (
    <Link href={`/property/${id}`}>
      <Card className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
        <div className="relative aspect-[4/3]">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <HeartButton propertyId={id} />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <span className="ml-1 text-sm font-medium">{rating?.toFixed(2)}</span>
            </div>
          </div>
          {showLocation && <p className="text-gray-600 text-sm mb-2">{location}</p>}
          <p className="text-gray-600 text-sm mb-3">{featureText}</p>
          <div className="flex justify-between items-center">
            <p>
              <span className="font-bold">{formatPrice(price)}</span> 
              <span className="text-gray-600"> night</span>
            </p>
            {totalPrice && (
              <p className="text-sm text-gray-500">{formatPrice(price * 6)} total</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
