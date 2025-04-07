import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronRight, ChevronLeft, X, Grid } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  propertyName: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, propertyName }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px]">
        <div className="md:col-span-2 md:row-span-2 h-full">
          <img 
            src={images[0]} 
            alt={`${propertyName} - main view`}
            className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg cursor-pointer" 
            onClick={() => setFullScreen(true)}
          />
        </div>
        
        {images.slice(1, 5).map((image, index) => (
          <div key={index} className={`hidden md:block h-full ${index === 3 ? 'relative' : ''} ${index === 0 ? 'rounded-tr-lg' : ''} ${index === 3 ? 'rounded-br-lg' : ''}`}>
            <img 
              src={image} 
              alt={`${propertyName} - view ${index + 2}`}
              className={`w-full h-full object-cover cursor-pointer ${index === 0 ? 'rounded-tr-lg' : ''} ${index === 3 ? 'rounded-br-lg' : ''}`}
              onClick={() => {
                setCurrentIndex(index + 1);
                setFullScreen(true);
              }}
            />
            {index === 3 && (
              <Button 
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullScreen(true);
                }}
                className="absolute right-4 bottom-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                <Grid className="mr-2 h-4 w-4" /> Show all photos
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <Dialog open={fullScreen} onOpenChange={setFullScreen}>
        <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
            <DialogTitle className="text-white drop-shadow-md">{propertyName}</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setFullScreen(false)}
              className="text-white hover:bg-black/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </DialogHeader>
          
          <div className="relative h-full flex flex-col">
            <div className="flex-1 relative flex items-center justify-center bg-black">
              <img 
                src={images[currentIndex]} 
                alt={`${propertyName} - gallery view ${currentIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full p-2"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full p-2"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Thumbnails */}
            <div className="h-20 bg-black py-2 px-4 flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`h-16 w-24 flex-shrink-0 cursor-pointer border-2 ${idx === currentIndex ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  onClick={() => handleThumbnailClick(idx)}
                >
                  <img 
                    src={img} 
                    alt={`${propertyName} thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyGallery;
