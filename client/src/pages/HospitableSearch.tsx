import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

const HospitableSearch: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the script if it's not already loaded
    if (!document.querySelector('script[src="https://hospitable.b-cdn.net/direct-property-search-widget/hospitable-search-widget.prod.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://hospitable.b-cdn.net/direct-property-search-widget/hospitable-search-widget.prod.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = createWidget;
    } else {
      // If script is already loaded, create the widget directly
      createWidget();
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const createWidget = () => {
    if (!containerRef.current) return;
    
    // Clear previous content
    containerRef.current.innerHTML = '';
    
    // Create widget element
    const widget = document.createElement('hospitable-direct-mps');
    widget.setAttribute('identifier', '3747e731-d69b-4c6e-93a9-d6a432b26db9');
    widget.setAttribute('type', 'custom');
    
    // Append to container
    containerRef.current.appendChild(widget);
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Search Properties | StayDirectly</title>
        <meta name="description" content="Find and book unique accommodations directly with hosts - no fees, no middlemen." />
      </Helmet>

      <div ref={containerRef} className="w-full h-full min-h-screen"></div>
    </div>
  );
};

export default HospitableSearch;