import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import CustomSearchBar from '@/components/custom-search-bar';
import PropertyCard from '@/components/property-card';
import DestinationCard from '@/components/destination-card';
import TestimonialCard from '@/components/testimonial-card';
import { getFeaturedProperties, getFeaturedCities } from '@/lib/data';

export const metadata: Metadata = {
  title: 'StayDirectly - Book Unique Accommodations Directly',
  description: 'Find and book unique accommodations directly from hosts - no fees, no middlemen, just authentic stays.',
};

export default async function Home() {
  // Server Components can fetch data directly
  const featuredProperties = await getFeaturedProperties();
  const featuredCities = await getFeaturedCities();
  
  // Sample testimonials data - in production this would likely come from the database
  const testimonials = [
    {
      quote: "Booking directly through StayDirectly was so easy and saved us money. The property was exactly as described and the host was incredibly helpful.",
      name: "Sarah L.",
      location: "New York, USA",
      avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
      rating: 5
    },
    {
      quote: "As a frequent traveler, I appreciate the direct communication with property owners. It makes for a much more personal experience than traditional hotel stays.",
      name: "Michael T.",
      location: "London, UK",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    {
      quote: "The interface is clean and easy to use. I found exactly what I was looking for within minutes and the booking process was seamless. Highly recommend!",
      name: "Emma R.",
      location: "Sydney, Australia",
      avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4.5
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Find your next perfect stay</h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">Book directly with hosts worldwide and save on booking fees</p>
          
          {/* Custom Search Widget */}
          <div className="w-full max-w-4xl">
            <CustomSearchBar className="w-full" />
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Popular Destinations</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCities.map((city) => (
            <DestinationCard key={city.id} destination={city} />
          ))}
        </div>
      </div>

      {/* Featured Properties */}
      <div className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Properties</h2>
          <Link href="/search" className="text-primary hover:text-blue-700 font-medium flex items-center">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What Our Guests Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </>
  );
}