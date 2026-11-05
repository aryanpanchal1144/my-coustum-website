import React, { useState } from 'react';
import { Compass } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  aspectClass = 'aspect-[4/3]',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative overflow-hidden bg-[#ECEEF1] border border-[#E2E5E9] flex flex-col items-center justify-center p-6 text-center ${aspectClass} ${className}`}
        role="img"
        aria-label={alt}
      >
        <Compass className="w-7 h-7 text-[#52555A] mb-2.5 stroke-[1.5]" />
        <p className="text-xs font-medium text-[#52555A] max-w-xs leading-relaxed">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#ECEEF1] ${aspectClass} ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
