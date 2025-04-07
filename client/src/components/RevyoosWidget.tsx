import React from 'react';

interface RevyoosWidgetProps {
  className?: string;
}

const RevyoosWidget: React.FC<RevyoosWidgetProps> = ({ className = "" }) => {
  return (
    <div className={`revyoos-widget-container ${className}`}>
      <div 
        id="revyoos-widget" 
        className="w-full min-h-[200px]"
      ></div>
    </div>
  );
};

export default RevyoosWidget;