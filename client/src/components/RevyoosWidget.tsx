import React, { useEffect, useRef } from 'react';

interface RevyoosWidgetProps {
  propertyId: number;
  propertyName: string;
  location?: string;
  apiKey?: string;
  theme?: 'light' | 'dark';
  language?: string;
  widget?: 'default' | 'compact' | 'minimal';
}

declare global {
  interface Window {
    Revyoos?: {
      init: (options: any) => void;
    };
  }
}

const RevyoosWidget: React.FC<RevyoosWidgetProps> = ({
  propertyId,
  propertyName,
  location,
  apiKey = "YOUR_REVYOOS_API_KEY",
  theme = "light",
  language = "en",
  widget = "default"
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = `revyoos-widget-${propertyId}`;

  useEffect(() => {
    // Check if Revyoos is loaded
    const initWidget = () => {
      if (window.Revyoos && widgetRef.current) {
        window.Revyoos.init({
          element: `#${widgetId}`,
          property: {
            id: propertyId.toString(),
            name: propertyName,
            location: location || "",
          },
          apiKey: apiKey,
          theme: theme,
          language: language,
          widget: widget
        });
      }
    };

    // If Revyoos is already loaded, initialize immediately
    if (window.Revyoos) {
      initWidget();
    } else {
      // Otherwise wait for script to load
      const checkRevyoos = setInterval(() => {
        if (window.Revyoos) {
          clearInterval(checkRevyoos);
          initWidget();
        }
      }, 100);

      // Clear interval on component unmount
      return () => clearInterval(checkRevyoos);
    }
  }, [propertyId, propertyName, location, apiKey, theme, language, widget, widgetId]);

  return (
    <div className="revyoos-widget-container">
      <div id={widgetId} ref={widgetRef} className="w-full"></div>
    </div>
  );
};

export default RevyoosWidget;