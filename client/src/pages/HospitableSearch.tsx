import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Breadcrumb from '@/components/ui/Breadcrumb';
import HospitableSearchWidget from '@/components/HospitableSearchWidget';

const HospitableSearch: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Find Your Perfect Stay | StayDirectly</title>
        <meta name="description" content="Search for the perfect property for your next vacation. Book direct and save on fees." />
      </Helmet>

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Property Search', href: '/hospitable-search' },
        ]}
      />

      <div className="flex flex-col items-center justify-center space-y-8 mt-8">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Find Your Perfect Stay</h1>
          <p className="text-lg text-gray-600 mb-8">
            Search for properties across all our destinations and book direct with owners to save on fees.
          </p>
        </div>

        <Card className="w-full max-w-4xl shadow-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Search Properties</h2>
            <div className="mb-6">
              <HospitableSearchWidget
                identifier="3747e731-d69b-4c6e-93a9-d6a432b26db9"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Lowest Price Guarantee</h3>
              <p className="text-gray-600">
                Book direct and save up to 15% compared to booking through online travel agencies.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">No Hidden Fees</h3>
              <p className="text-gray-600">
                See the total price upfront with no surprise service fees added at checkout.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Direct Communication</h3>
              <p className="text-gray-600">
                Chat directly with property owners or managers for a more personalized experience.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" className="rounded-full px-8">
            Explore Popular Destinations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HospitableSearch;