import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageSquare,
  Lock,
  User,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Filter,
  CheckCircle2,
  Package,
  Layers,
  Heart,
  LogOut,
} from 'lucide-react';
import {
  Product,
  PurchaseRequest,
  DatabaseState,
  BusinessSupportSettings,
} from './types';
import {
  getDatabaseState,
  saveDatabaseState,
  getBuyerSession,
  clearBuyerSession,
  getAdminSession,
  BuyerSessionData,
  AdminSessionData,
} from './storage';
import { BuyerAuthModal } from './components/BuyerAuthModal';
import { AdminGoogleLoginModal } from './components/AdminGoogleLoginModal';
import { PurchaseRequestModal } from './components/PurchaseRequestModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { BuyerOrderHistoryModal } from './components/BuyerOrderHistoryModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import workshopHeroImg from './assets/images/ganeshnath_hero_workshop_1793851290154.jpg';
import shreeSacredLogo from './assets/images/shree_sacred_logo_1793864586699.jpg';

export function App() {
  // Database state
  const [dbState, setDbState] = useState<DatabaseState>(getDatabaseState);

  // Authentication sessions
  const [buyerSession, setBuyerSession] = useState<BuyerSessionData | null>(getBuyerSession);
  const [adminSession, setAdminSession] = useState<AdminSessionData | null>(getAdminSession);

  // Modals state
  const [isBuyerAuthOpen, setIsBuyerAuthOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<Product | null>(null);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Listen to storage sync events
  useEffect(() => {
    const handleDbChange = () => setDbState(getDatabaseState());
    const handleBuyerChange = () => setBuyerSession(getBuyerSession());
    const handleAdminChange = () => setAdminSession(getAdminSession());

    window.addEventListener('sg_db_updated', handleDbChange);
    window.addEventListener('sg_buyer_session_updated', handleBuyerChange);
    window.addEventListener('sg_admin_session_updated', handleAdminChange);

    return () => {
      window.removeEventListener('sg_db_updated', handleDbChange);
      window.removeEventListener('sg_buyer_session_updated', handleBuyerChange);
      window.removeEventListener('sg_admin_session_updated', handleAdminChange);
    };
  }, []);

  const handleUpdateDbState = (newState: DatabaseState) => {
    setDbState(newState);
    saveDatabaseState(newState);
  };

  const handlePurchaseSubmitSuccess = (newRequest: PurchaseRequest) => {
    const updatedRequests = [newRequest, ...dbState.purchaseRequests];
    handleUpdateDbState({
      ...dbState,
      purchaseRequests: updatedRequests,
    });
  };

  const filteredProducts = dbState.products.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.category === selectedCategory;
  });

  const pendingRequestsCount = dbState.purchaseRequests.filter(
    (r) => r.status === 'PENDING_REVIEW'
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#291C14] flex flex-col font-sans selection:bg-[#E7D8C9] selection:text-[#1B130E]">
      {/* Top Bar Contract (1-line Brand wordmark, concise links, primary action) */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E7D8C9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-8">
          {/* Brand Zone with Sacred Shree Logo */}
          <a
            href="/"
            className="flex items-center gap-3 text-lg sm:text-xl font-serif font-bold tracking-tight text-[#1B130E] whitespace-nowrap shrink-0 group"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#AA7248] shadow-sm shrink-0 bg-[#291C14]">
              <img
                src={shreeSacredLogo}
                alt="Shree Ganeshnath Sacred Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight text-[#1B130E] font-serif tracking-wide text-base sm:text-lg">
                SHREE GANESHNATH
              </span>
              <span className="text-[10px] font-sans font-semibold text-[#AA7248] tracking-widest uppercase">
                FURNITURE WORKS
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-[#5C3E29]"
          >
            <a
              href="#products-section"
              className="hover:text-[#1B130E] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#5C3E29]"
            >
              Furniture Catalog
            </a>
            <a
              href="#about-section"
              className="hover:text-[#1B130E] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#5C3E29]"
            >
              The Workshop
            </a>
            <a
              href="#service-coverage"
              className="hover:text-[#1B130E] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#5C3E29]"
            >
              Delivery Locations
            </a>
            <a
              href="#contact-support"
              className="hover:text-[#1B130E] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#5C3E29]"
            >
              Contact Owner
            </a>
          </nav>

          {/* User & Admin Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Buyer Account Button */}
            {buyerSession?.isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOrderHistoryOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5C3E29] bg-[#F3ECE2] hover:bg-[#E7D8C9] border border-[#E7D8C9] transition-colors whitespace-nowrap shrink-0"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>My Requests</span>
                </button>
                <button
                  type="button"
                  onClick={() => clearBuyerSession()}
                  className="p-1.5 text-[#825638] hover:text-[#291C14] text-xs"
                  title="Logout Mobile"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsBuyerAuthOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#5C3E29] hover:bg-[#3E291C] border border-[#5C3E29] transition-colors whitespace-nowrap shrink-0 shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Buyer Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#FAF8F5] border-b border-[#E7D8C9] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#AA7248] shadow-xs shrink-0">
                  <img src={shreeSacredLogo} alt="श्री" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#AA7248]">
                  <span>Sole Proprietary Wooden Furniture Studio</span>
                  <span>·</span>
                  <span>Direct Artisan Pricing</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1B130E] leading-[1.1] text-balance">
                Handcrafted solid teakwood &amp; sheesham furniture made for generations.
              </h1>

              <p className="text-sm sm:text-base text-[#5C3E29] leading-relaxed max-w-xl">
                I personally select every log of seasoned timber and oversee the traditional joinery in my workshop. Order directly from the craftsman without marketplace markups or middleman commissions.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#products-section"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-[#5C3E29] hover:bg-[#3E291C] transition-colors shadow-sm"
                >
                  <span>Explore Furniture Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/${dbState.supportSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Namaste ${dbState.supportSettings.ownerName}, I would like to inquire about custom wooden furniture from Shree Ganeshnath Furniture Works.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#291C14] bg-[#F3ECE2] hover:bg-[#E7D8C9] border border-[#E7D8C9] transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>WhatsApp Master Artisan</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#E7D8C9] grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-serif font-bold text-lg text-[#291C14]">100%</div>
                  <div className="text-[#825638]">Solid Seasoned Hardwood</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-lg text-[#291C14]">0%</div>
                  <div className="text-[#825638]">Middleman Commissions</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-lg text-[#291C14]">Direct</div>
                  <div className="text-[#825638]">Owner Call &amp; WhatsApp</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-5">
              <div className="relative border-4 border-[#F3ECE2] shadow-xl overflow-hidden bg-[#E7D8C9]">
                <img
                  src={workshopHeroImg}
                  alt="Shree Ganeshnath Furniture Works Carpentry Workshop"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1B130E]/90 via-[#1B130E]/50 to-transparent p-5 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#E7D8C9]">
                    The Workshop &amp; Studio
                  </span>
                  <p className="text-sm font-serif font-semibold mt-0.5">
                    Traditional Mortise &amp; Tenon Joinery in Action
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Catalog Section */}
        <section id="products-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E7D8C9]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#AA7248]">
                Direct From Master Craftsman
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1B130E] mt-1">
                Handcrafted Wooden Furniture Collection
              </h2>
              <p className="text-xs sm:text-sm text-[#825638] mt-2 max-w-xl">
                Each piece is carved, seasoned, and hand-finished in our Gandhinagar workshop. Submit a purchase request to connect directly with the owner.
              </p>
            </div>

            {/* Category Filter Pills (Functional Buttons) */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F3ECE2] border border-[#E7D8C9]">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#5C3E29] text-white shadow-xs'
                    : 'text-[#5C3E29] hover:text-[#1B130E]'
                }`}
              >
                All Pieces ({dbState.products.length})
              </button>
              {dbState.categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#5C3E29] text-white shadow-xs'
                      : 'text-[#5C3E29] hover:text-[#1B130E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="bg-white border border-[#E7D8C9] hover:border-[#AA7248] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Image */}
                <div>
                  <div
                    onClick={() => setSelectedProductForModal(product)}
                    className="aspect-[4/3] bg-[#FAF8F5] overflow-hidden cursor-pointer relative"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#1B130E]/80 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
                      {product.woodType}
                    </div>

                    {product.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-[#1B130E]/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 flex items-center gap-1 shadow-sm">
                        <span>{product.images.length} Photos</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Preview Strip on Card if multiple images */}
                  {product.images.length > 1 && (
                    <div className="px-5 pt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                      {product.images.slice(0, 4).map((thumb, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedProductForModal(product)}
                          className="w-10 h-8 border border-[#E7D8C9] shrink-0 cursor-pointer overflow-hidden hover:opacity-100 opacity-75"
                        >
                          <img src={thumb} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {product.images.length > 4 && (
                        <div
                          onClick={() => setSelectedProductForModal(product)}
                          className="w-10 h-8 border border-[#E7D8C9] shrink-0 cursor-pointer flex items-center justify-center bg-[#F3ECE2] text-[10px] font-bold text-[#5C3E29]"
                        >
                          +{product.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#AA7248]">
                      {product.category}
                    </div>

                    <h3
                      onClick={() => setSelectedProductForModal(product)}
                      className="font-serif font-bold text-base text-[#1B130E] hover:text-[#5C3E29] cursor-pointer line-clamp-2"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#5C3E29] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="pt-2 border-t border-[#E7D8C9] flex items-baseline justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-semibold text-[#825638]">
                          Direct Workshop Price
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-serif font-bold font-mono text-[#5C3E29]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs line-through text-[#825638] font-mono">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-[#825638]">
                        <span>Available: </span>
                        <strong className="text-[#291C14]">{product.availableStock}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with BUY NOW CTA */}
                <div className="p-5 pt-0 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProductForModal(product)}
                    className="flex-1 py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-[#291C14] bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#E7D8C9] transition-colors"
                  >
                    View Specs
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProductForPurchase(product)}
                    className="flex-1 py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#5C3E29] hover:bg-[#3E291C] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* About Workshop Section */}
        <section id="about-section" className="py-16 bg-[#F3ECE2] border-y border-[#E7D8C9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#AA7248]">
                Master Woodcrafting Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B130E]">
                Traditional Carpentry by Sole Artisan Aryan Panchal
              </h2>
              <p className="text-xs sm:text-sm text-[#3E291C] leading-relaxed">
                At <strong>SHREE GANESHNATH FURNITURE WORKS</strong>, we do not operate an anonymous automated factory or mass-import cheap MDF furniture. Every single bed frame, mandir, and dining suite is measured, hand-planed, and polished right here in our workshop.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-3 text-xs">
                <div className="p-3 bg-white border border-[#E7D8C9]">
                  <span className="font-bold text-[#5C3E29] block">Pure Teak &amp; Sheesham</span>
                  <span className="text-[#825638]">Seasoned timber with zero hollow cores or synthetic foils.</span>
                </div>
                <div className="p-3 bg-white border border-[#E7D8C9]">
                  <span className="font-bold text-[#5C3E29] block">Custom Dimension Adjustments</span>
                  <span className="text-[#825638]">We tailor width, height, and finishes to your home layout.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 bg-white border border-[#E7D8C9] shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#1B130E] border-b border-[#E7D8C9] pb-2">
                Direct Owner Contact Information
              </h3>
              <p className="text-xs text-[#5C3E29]">
                Have a custom interior design requirement or want to visit our workshop showroom? Connect with the owner directly:
              </p>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#825638]">Official Workshop:</span>{' '}
                  <span className="font-medium text-[#1B130E]">{dbState.supportSettings.workshopAddress}</span>
                </div>
                <div>
                  <span className="text-[#825638]">Proprietor:</span>{' '}
                  <span className="font-medium text-[#1B130E]">{dbState.supportSettings.ownerName}</span>
                </div>
                <div className="flex gap-4 pt-2">
                  <a
                    href={`tel:${dbState.supportSettings.officialPhone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5C3E29] hover:bg-[#3E291C] text-white font-semibold text-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {dbState.supportSettings.officialPhone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${dbState.supportSettings.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Locations Section */}
        <section id="service-coverage" className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#AA7248]">
              Admin-Configured Delivery Zones
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B130E] mt-1">
              Currently Serviced Locations
            </h2>
            <p className="text-xs sm:text-sm text-[#825638] mt-2">
              We ship our heavy wooden furniture through dedicated cushioned transport to prevent damage. Only admin-enabled locations are eligible for direct purchase requests.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dbState.deliveryLocations
              .filter((loc) => loc.isEnabled)
              .map((loc) => (
                <div
                  key={`${loc.state}-${loc.district}`}
                  className="p-4 bg-white border border-[#E7D8C9] shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-[#1B130E]">
                      {loc.district}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-[#825638] mt-0.5">{loc.state}, India</div>
                  <div className="mt-3 pt-2 border-t border-[#E7D8C9] text-[11px] text-[#5C3E29]">
                    Covered Talukas: {loc.talukas.join(', ')}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact-support" className="bg-[#1B130E] text-[#FAF8F5] border-t border-[#3E291C] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#AA7248] shrink-0 bg-[#291C14]">
                <img src={shreeSacredLogo} alt="Shree Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-tight">
                  SHREE GANESHNATH
                </h3>
                <span className="text-[10px] uppercase font-sans tracking-widest text-[#AA7248] block">
                  FURNITURE WORKS
                </span>
              </div>
            </div>
            <p className="text-xs text-[#E7D8C9] mt-2 leading-relaxed">
              Sole proprietorship wooden furniture business. All products handcrafted and sold exclusively by the website owner.
            </p>
            <p className="text-[11px] text-[#AA7248] mt-4">
              © {new Date().getFullYear()} Shree Ganeshnath Furniture Works. All rights reserved.
            </p>
          </div>

          <div className="text-xs space-y-2 text-[#E7D8C9]">
            <span className="font-bold uppercase tracking-wider text-[#AA7248] block">
              Official Workshop &amp; Support
            </span>
            <p>{dbState.supportSettings.workshopAddress}</p>
            <p>
              Phone:{' '}
              <a href={`tel:${dbState.supportSettings.officialPhone}`} className="text-white hover:underline">
                {dbState.supportSettings.officialPhone}
              </a>
            </p>
            <p>
              WhatsApp:{' '}
              <a href={`https://wa.me/${dbState.supportSettings.whatsappNumber.replace(/\D/g, '')}`} className="text-emerald-400 hover:underline">
                {dbState.supportSettings.whatsappNumber}
              </a>
            </p>
            <p>Email: {dbState.supportSettings.supportEmail}</p>
          </div>

          <div className="text-xs text-[#E7D8C9] space-y-3">
            <span className="font-bold uppercase tracking-wider text-[#AA7248] block">
              Direct Business Policy
            </span>
            <p>
              ✓ No multi-vendor marketplace<br />
              ✓ No public seller registrations<br />
              ✓ Direct buyer-to-artisan contact sharing
            </p>

            <div className="pt-1">
              {adminSession ? (
                <button
                  type="button"
                  onClick={() => setIsAdminDashboardOpen(true)}
                  className="text-xs text-[#E7D8C9]/80 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Admin &amp; Seller console</span>
                  {pendingRequestsCount > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="text-xs text-[#E7D8C9]/60 hover:text-white transition-colors cursor-pointer"
                >
                  Owner login
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Buyer Mobile Auth Modal */}
      <BuyerAuthModal
        isOpen={isBuyerAuthOpen}
        onClose={() => setIsBuyerAuthOpen(false)}
        onSuccess={(session) => {
          setBuyerSession(session);
          // If a product was queued for purchase, open purchase modal
          if (selectedProductForPurchase) {
            // Already set
          }
        }}
        promptMessage={
          selectedProductForPurchase
            ? `Please verify your mobile number to complete your purchase request for "${selectedProductForPurchase.name}".`
            : undefined
        }
      />

      {/* 2. Admin Google Login Modal */}
      <AdminGoogleLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        supportSettings={dbState.supportSettings}
        onSuccess={(session) => {
          setAdminSession(session);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* 3. Admin & Seller Unified Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        dbState={dbState}
        onUpdateDbState={handleUpdateDbState}
      />

      {/* 4. Purchase Request Modal */}
      <PurchaseRequestModal
        isOpen={Boolean(selectedProductForPurchase)}
        onClose={() => setSelectedProductForPurchase(null)}
        product={selectedProductForPurchase}
        buyerSession={buyerSession}
        onRequireLogin={() => setIsBuyerAuthOpen(true)}
        deliveryLocations={dbState.deliveryLocations}
        supportSettings={dbState.supportSettings}
        onSubmitSuccess={handlePurchaseSubmitSuccess}
      />

      {/* 5. Product Detail Monograph Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onBuyNow={(prod) => {
          setSelectedProductForPurchase(prod);
        }}
        supportSettings={dbState.supportSettings}
      />

      {/* 6. Buyer Purchase Request History Modal */}
      <BuyerOrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        buyerPhone={buyerSession?.phone || ''}
        purchaseRequests={dbState.purchaseRequests}
        supportSettings={dbState.supportSettings}
      />
    </div>
  );
}

export default App;
