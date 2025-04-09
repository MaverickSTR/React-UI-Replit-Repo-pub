import React, { useEffect } from 'react';

interface RevyoosScriptWidgetProps {
  propertyId: string;
  className?: string;
}

/**
 * This component handles loading the Revyoos widget script
 * It creates and injects the script tag with the correct configuration
 */
const RevyoosScriptWidget: React.FC<RevyoosScriptWidgetProps> = ({ 
  propertyId,
  className = "w-full" 
}) => {
  useEffect(() => {
    // Remove any existing Revyoos script to prevent duplicates
    const existingScript = document.querySelector('script[data-revyoos-widget]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Create a new script element
    const script = document.createElement('script');
    script.defer = true;
    script.type = 'application/javascript';
    script.src = 'https://www.revyoos.com/js/widgetBuilder.js';
    script.setAttribute('data-revyoos-widget', 'eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0=');
    
    // Add it to the document body
    document.body.appendChild(script);
    
    // Clean up the script on component unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [propertyId]);

  return (
    <div className={className}>
      <div 
        className="revyoos-embed-widget" 
        data-revyoos-embed='eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0='
      />
    </div>
  );
};

export default RevyoosScriptWidget;