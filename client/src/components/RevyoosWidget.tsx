import React, { useEffect, useRef } from 'react';

interface RevyoosWidgetProps {
  className?: string;
  widgetCode?: string;
}

const RevyoosWidget: React.FC<RevyoosWidgetProps> = ({ className, widgetCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!widgetCode || !containerRef.current) return;
    
    // Remove any existing widget and script
    if (containerRef.current) {
      const existingWidget = containerRef.current.querySelector('.revyoos-embed-widget');
      if (existingWidget) {
        existingWidget.remove();
      }
      
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    }
    
    // Create new widget element
    const widgetElement = document.createElement('div');
    widgetElement.className = 'revyoos-embed-widget';
    widgetElement.setAttribute('data-revyoos-embed', widgetCode);
    containerRef.current.appendChild(widgetElement);
    
    // Create and add script
    const script = document.createElement('script');
    script.defer = true;
    script.type = 'application/javascript';
    script.src = 'https://www.revyoos.com/js/widgetBuilder.js';
    script.setAttribute('data-revyoos-widget', widgetCode);
    
    document.body.appendChild(script);
    scriptRef.current = script;
    
    // Cleanup function
    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [widgetCode]);

  return (
    <div ref={containerRef} className={className}>
      {!widgetCode && (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">Review widget not configured for this property</p>
        </div>
      )}
    </div>
  );
};

export default RevyoosWidget;