import React, { useEffect } from 'react';
import '../lib/revyoos.css';

interface RevyoosDirectEmbedProps {
  propertyId?: string; // Not used in this implementation
  className?: string;
}

/**
 * RevyoosDirectEmbed uses a direct script tag approach for embedding the Revyoos widget
 * This exactly matches the implementation requested by the user
 */
const RevyoosDirectEmbed: React.FC<RevyoosDirectEmbedProps> = ({ 
  className = "w-full h-auto min-h-[600px]" 
}) => {
  useEffect(() => {
    // Clean up any previous scripts to avoid duplicates
    const existingScript = document.querySelector('script[data-revyoos-widget]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Create the script element with the exact attributes as specified
    const script = document.createElement('script');
    script.defer = true;
    script.type = 'application/javascript';
    script.src = 'https://www.revyoos.com/js/widgetBuilder.js';
    script.setAttribute('data-revyoos-widget', 'eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0=');
    
    // Add it to the document head
    document.head.appendChild(script);
    
    // Cleanup when component unmounts
    return () => {
      // Use the reference to the script we created
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  return (
    <div id="revyoos-container" className={className}>
      {/* This div will be targeted by the Revyoos script */}
      <div 
        className="revyoos-embed-widget" 
        data-revyoos-embed='eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0=' 
      />
    </div>
  );
};

export default RevyoosDirectEmbed;