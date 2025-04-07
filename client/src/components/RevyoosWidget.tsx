import React, { useEffect, useRef } from 'react';

interface RevyoosWidgetProps {
  className?: string;
  widgetCode?: string;
}

const RevyoosWidget: React.FC<RevyoosWidgetProps> = ({ className, widgetCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

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
    
    // Create new widget element with responsive styling
    const widgetElement = document.createElement('div');
    widgetElement.className = 'revyoos-embed-widget w-full';
    widgetElement.setAttribute('data-revyoos-embed', widgetCode);
    widgetElement.style.width = '100%';
    widgetElement.style.maxWidth = '100%';
    containerRef.current.appendChild(widgetElement);
    
    // Create and add script
    const script = document.createElement('script');
    script.defer = true;
    script.type = 'application/javascript';
    script.src = 'https://www.revyoos.com/js/widgetBuilder.js';
    script.setAttribute('data-revyoos-widget', widgetCode);
    
    // Set up custom event handler for when widget is fully loaded
    script.onload = () => {
      // Add a MutationObserver to watch for changes in the widget container
      // to ensure it remains responsive after being populated
      if (containerRef.current) {
        const targetNode = containerRef.current;
        const observer = new MutationObserver((mutations) => {
          mutations.forEach(() => {
            // Find any iframes injected by Revyoos
            const iframes = targetNode.querySelectorAll('iframe');
            iframes.forEach(iframe => {
              iframe.style.width = '100%';
              iframe.style.maxWidth = '100%';
              iframe.style.border = 'none';
            });
            
            // Find any elements with fixed width and make them responsive
            const allElements = targetNode.querySelectorAll('*');
            allElements.forEach(el => {
              const element = el as HTMLElement;
              if (element.style.width && element.style.width !== '100%') {
                element.style.width = '100%';
                element.style.maxWidth = '100%';
              }
            });
          });
        });
        
        // Start observing
        observer.observe(targetNode, { 
          childList: true, 
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class']
        });
        
        // Save reference for cleanup
        observerRef.current = observer;
      }
    };
    
    document.body.appendChild(script);
    scriptRef.current = script;
    
    // Inject CSS to ensure responsiveness
    const style = document.createElement('style');
    style.textContent = `
      .revyoos-embed-widget, 
      .revyoos-embed-widget * {
        max-width: 100% !important;
        overflow-x: hidden !important;
      }
      .revyoos-embed-widget iframe {
        width: 100% !important;
        border: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function
    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      
      document.head.removeChild(style);
    };
  }, [widgetCode]);

  return (
    <div ref={containerRef} className={`w-full max-w-full overflow-hidden ${className || ''}`}>
      {!widgetCode && (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">Review widget not configured for this property</p>
        </div>
      )}
    </div>
  );
};

export default RevyoosWidget;