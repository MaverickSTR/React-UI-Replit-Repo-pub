import React from 'react';
import HospitablePropertiesList from '@/components/HospitablePropertiesList';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function ApiPropertiesPage() {
  return (
    <div className="container py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/">← Back to Home</Link>
        </Button>
        <h1 className="text-3xl font-bold">Hospitable API Properties</h1>
        <p className="text-muted-foreground mt-2">
          Properties fetched directly from the Hospitable API integration.
        </p>
      </div>

      <HospitablePropertiesList />
    </div>
  );
}