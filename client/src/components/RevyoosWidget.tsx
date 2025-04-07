import React from 'react';

interface RevyoosWidgetProps {
  embedCode: string;
  className?: string;
}

const RevyoosWidget: React.FC<RevyoosWidgetProps> = ({ embedCode, className = "" }) => {
  return (
    <div className={`revyoos-widget-container ${className}`}>
      <div 
        className="revyoos-embed-widget" 
        data-revyoos-embed={embedCode}
      ></div>
    </div>
  );
};

export default RevyoosWidget;