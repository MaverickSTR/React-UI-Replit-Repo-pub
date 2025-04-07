import { Helmet } from 'react-helmet-async';
import React from 'react';

interface MetaProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string;
}

export const Meta: React.FC<MetaProps> = ({
  title,
  description,
  canonical,
  image = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  type = 'website'
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  
  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={fullUrl} />}
      
      {/* Open Graph */}
      <meta property="og:site_name" content="StayDirectly" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export const PropertyStructuredData = ({
  name,
  description,
  image,
  price,
  ratingValue,
  reviewCount,
  address
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  ratingValue: number;
  reviewCount: number;
  address: string;
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": name,
    "description": description,
    "image": image,
    "priceRange": `$${price} per night`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export const CityStructuredData = ({
  name,
  description,
  image,
  country
}: {
  name: string;
  description: string;
  image: string;
  country: string;
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "City",
    "name": name,
    "description": description,
    "image": image,
    "containedInPlace": {
      "@type": "Country",
      "name": country
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default Meta;
