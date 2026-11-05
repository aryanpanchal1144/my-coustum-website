import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Truck,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { Product, BusinessSupportSettings } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
  supportSettings: BusinessSupportSettings;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
  supportSettings,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImg = images[activeImageIndex] || images[0];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B130E]/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-white border border-[#E7D8C9] shadow-2xl max-h-[92vh] flex flex-col my-auto text-[#291C14] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7D8C9] bg-[#FAF8F5]">
          <div className="flex items-center gap-2 text-xs text-[#825638]">
            <span className="font-semibold text-[#5C3E29] uppercase tracking-wider">{product.category}</span>
            <span>·</span>
            <span>{product.woodType}</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-[#825638] hover:text-[#291C14] hover:bg-[#F3ECE2] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Gallery Column: Interactive Slider + Thumbnails Scroll */}
            <div className="space-y-3">
              {/* Main Image with Prev / Next Controls */}
              <div className="relative aspect-[4/3] bg-[#FAF8F5] border border-[#E7D8C9] overflow-hidden group">
                <img
                  src={currentImg}
                  alt={`${product.name} photo ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-200"
                />

                {/* Arrow navigation if multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-[#1B130E]/70 hover:bg-[#1B130E] text-white rounded-full transition-opacity shadow-md"
                      title="Previous photo"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1B130E]/70 hover:bg-[#1B130E] text-white rounded-full transition-opacity shadow-md"
                      title="Next photo"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Photo index indicator */}
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-[#1B130E]/80 backdrop-blur-xs text-white text-[11px] font-mono">
                      {activeImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Horizontal Scrollable Thumbnails Strip */}
              {images.length > 1 && (
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#825638] flex items-center justify-between">
                    <span>Scroll All {images.length} Photos</span>
                    <span className="text-[#5C3E29]">Click any photo to inspect</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-16 shrink-0 border overflow-hidden transition-all ${
                          activeImageIndex === idx
                            ? 'border-[#5C3E29] ring-2 ring-[#5C3E29]/40 opacity-100 scale-102'
                            : 'border-[#E7D8C9] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {activeImageIndex === idx && (
                          <div className="absolute inset-0 border-2 border-[#5C3E29]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Artisan Seal */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E7D8C9] flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#5C3E29] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#291C14] block">Direct Artisan Guarantee</span>
                  <span className="text-[#825638]">
                    No plywood or chipboard. 100% seasoned solid timber with lifetime termite resilience.
                  </span>
                </div>
              </div>
            </div>

            {/* Details Column */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#291C14] leading-tight">
                  {product.name}
                </h2>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-serif font-bold text-[#5C3E29] font-mono">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm line-through text-[#825638] font-mono">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase font-semibold">
                    Direct Workshop Pricing
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#3E291C] leading-relaxed">
                {product.description}
              </p>

              {/* Specs Table */}
              <div className="border border-[#E7D8C9] bg-[#FAF8F5] text-xs divide-y divide-[#E7D8C9]">
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-[#825638] font-medium">Timber Species:</span>
                  <span className="col-span-2 font-semibold text-[#291C14]">{product.woodType}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-[#825638] font-medium">Standard Dimensions:</span>
                  <span className="col-span-2 font-semibold text-[#291C14]">{product.dimensions}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-[#825638] font-medium">Surface Polish:</span>
                  <span className="col-span-2 font-semibold text-[#291C14]">{product.finish}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-[#825638] font-medium">Workshop Lead Time:</span>
                  <span className="col-span-2 font-semibold text-[#291C14]">{product.leadTime}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="text-[#825638] font-medium">Order Limits:</span>
                  <span className="col-span-2 font-semibold text-[#291C14]">
                    Min {product.minOrderQty} unit · Max {product.maxOrderQty} units per request
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#AA7248]">
                  Key Craftsmanship Highlights:
                </span>
                <ul className="space-y-1 text-xs text-[#3E291C]">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5C3E29] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Area */}
              <div className="pt-4 border-t border-[#E7D8C9] space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBuyNow(product);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-[#5C3E29] hover:bg-[#3E291C] transition-colors shadow-sm"
                >
                  <span>Buy Now — Submit Purchase Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-[11px] text-[#825638]">
                  No upfront online payment required. Directly connect with Master Artisan {supportSettings.ownerName}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
