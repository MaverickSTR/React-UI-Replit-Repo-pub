import React, { useEffect } from 'react';

interface RevyoosWidgetProps {
  className?: string;
}

const RevyoosWidget: React.FC<RevyoosWidgetProps> = ({ className = "" }) => {
  useEffect(() => {
    // Create and append the Revyoos script to the component
    const script = document.createElement('script');
    script.defer = true;
    script.type = 'application/javascript';
    script.src = 'https://www.revyoos.com/js/widgetBuilder.js';
    script.dataset.revyoosWidget = 'eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0=';
    
    // Append script to current component
    const widgetContainer = document.getElementById('revyoos-widget-container');
    if (widgetContainer) {
      widgetContainer.appendChild(script);
    }
    
    // Clean up on component unmount
    return () => {
      if (widgetContainer && script.parentNode === widgetContainer) {
        widgetContainer.removeChild(script);
      }
    };
  }, []);

  return (
    <div className={`revyoos-widget-container ${className}`}>
      <div 
        id="revyoos-widget-container" 
        className="w-full min-h-[200px]"
      >
        {/* The Revyoos widget will be inserted here by the script */}
        <div className="revyoos-embed-widget" data-revyoos-embed="eyJwIjoiNjVlMGZiNTg5MjBlYWEwMDYxMjdlNWVjIn0="></div>
      </div>
    </div>
  );
};

export default RevyoosWidget;