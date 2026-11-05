import React, { useState } from 'react';
import { X, Phone, MessageSquare, CheckCircle2, MapPin, Package, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { Product, PurchaseRequest, BusinessSupportSettings, DeliveryLocationNode } from '../types';
import { BuyerSessionData } from '../storage';

interface PurchaseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  buyerSession: BuyerSessionData | null;
  onRequireLogin: () => void;
  deliveryLocations: DeliveryLocationNode[];
  supportSettings: BusinessSupportSettings;
  onSubmitSuccess: (request: PurchaseRequest) => void;
}

export const PurchaseRequestModal: React.FC<PurchaseRequestModalProps> = ({
  isOpen,
  onClose,
  product,
  buyerSession,
  onRequireLogin,
  deliveryLocations,
  supportSettings,
  onSubmitSuccess,
}) => {
  if (!isOpen || !product) return null;

  // Filter only enabled delivery locations
  const activeLocations = deliveryLocations.filter((loc) => loc.isEnabled);

  const [quantity, setQuantity] = useState<number>(product.minOrderQty || 1);
  const [buyerName, setBuyerName] = useState(buyerSession?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(buyerSession?.phone || '');
  const [buyerWhatsApp, setBuyerWhatsApp] = useState(buyerSession?.whatsapp || buyerSession?.phone || '');
  
  // Location selections
  const [selectedState, setSelectedState] = useState(activeLocations[0]?.state || 'Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState(activeLocations[0]?.district || 'Ahmedabad');
  const [selectedTaluka, setSelectedTaluka] = useState(activeLocations[0]?.talukas[0] || 'Ahmedabad City');
  const [addressLine, setAddressLine] = useState('');
  const [pincode, setPincode] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Success view state
  const [submittedRequest, setSubmittedRequest] = useState<PurchaseRequest | null>(null);

  // Update district/taluka cascades when state changes
  const availableDistricts = activeLocations.filter((l) => l.state === selectedState);
  const currentLocNode = activeLocations.find(
    (l) => l.state === selectedState && l.district === selectedDistrict
  ) || availableDistricts[0];

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const firstDistrict = activeLocations.find((l) => l.state === stateName);
    if (firstDistrict) {
      setSelectedDistrict(firstDistrict.district);
      setSelectedTaluka(firstDistrict.talukas[0] || '');
    }
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const node = activeLocations.find((l) => l.state === selectedState && l.district === distName);
    if (node && node.talukas.length > 0) {
      setSelectedTaluka(node.talukas[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!buyerSession?.isLoggedIn) {
      onRequireLogin();
      return;
    }

    if (!buyerName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!buyerPhone.trim() || buyerPhone.trim().length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!addressLine.trim() || addressLine.trim().length < 10) {
      setValidationError('Please enter your complete delivery house/street address (min 10 characters).');
      return;
    }
    if (!pincode.trim() || pincode.trim().length < 6) {
      setValidationError('Please enter a valid 6-digit postal pincode.');
      return;
    }

    setValidationError(null);

    const totalEstimatedAmount = product.price * quantity;
    const newRequest: PurchaseRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestDate: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
      productImage: product.images[0],
      unitPrice: product.price,
      quantity,
      totalEstimatedAmount,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      buyerWhatsApp: (buyerWhatsApp || buyerPhone).trim(),
      deliveryAddress: {
        country: 'India',
        state: selectedState,
        district: selectedDistrict,
        taluka: selectedTaluka,
        addressLine: addressLine.trim(),
        pincode: pincode.trim(),
      },
      additionalRequirements: additionalRequirements.trim() || undefined,
      status: 'PENDING_REVIEW',
    };

    onSubmitSuccess(newRequest);
    setSubmittedRequest(newRequest);
  };

  const handleCleanClose = () => {
    setSubmittedRequest(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B130E]/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white border border-[#E7D8C9] shadow-2xl max-h-[92vh] flex flex-col my-auto text-[#291C14]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7D8C9] bg-[#FAF8F5]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#AA7248]">
              {submittedRequest ? 'Purchase Request Confirmed' : 'Direct Artisan Purchase Request'}
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#291C14]">
              {submittedRequest ? 'Contact Information Exchange' : 'Order Direct from Workshop'}
            </h2>
          </div>
          <button
            onClick={handleCleanClose}
            type="button"
            className="p-1.5 text-[#825638] hover:text-[#291C14] hover:bg-[#F3ECE2] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {submittedRequest ? (
            /* SUCCESS VIEW: Clear sharing of Business Owner and Buyer Contact details */
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">
                    Purchase Request #{submittedRequest.id} Received Successfully!
                  </h3>
                  <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                    Your request for <span className="font-semibold">{submittedRequest.quantity}x {submittedRequest.productName}</span> has been directly notified to the workshop owner. Both party contact details are unlocked below.
                  </p>
                </div>
              </div>

              {/* Business Owner Contact Card */}
              <div className="p-5 bg-[#F3ECE2] border border-[#AA7248]/40">
                <div className="flex items-center justify-between mb-3 border-b border-[#E7D8C9] pb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#5C3E29]">
                      Official Workshop &amp; Seller Contact
                    </span>
                    <h4 className="text-lg font-serif font-bold text-[#291C14]">
                      {supportSettings.businessName}
                    </h4>
                    <p className="text-xs text-[#825638]">
                      Master Craftsman &amp; Sole Owner: <span className="font-medium text-[#291C14]">{supportSettings.ownerName}</span>
                    </p>
                  </div>
                  <ShieldCheck className="w-7 h-7 text-[#5C3E29]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#825638] block">Workshop Address:</span>
                    <span className="text-[#291C14] font-medium leading-relaxed">
                      {supportSettings.workshopAddress}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-[#825638]">Official Calling Number:</span>{' '}
                      <span className="font-mono font-bold text-[#291C14]">{supportSettings.officialPhone}</span>
                    </div>
                    <div>
                      <span className="text-[#825638]">Official WhatsApp:</span>{' '}
                      <span className="font-mono font-bold text-emerald-700">{supportSettings.whatsappNumber}</span>
                    </div>
                    <div>
                      <span className="text-[#825638]">Support Email:</span>{' '}
                      <span className="text-[#291C14] font-medium">{supportSettings.supportEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-5 pt-3 border-t border-[#E7D8C9] flex flex-wrap gap-3">
                  <a
                    href={`tel:${supportSettings.officialPhone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#5C3E29] hover:bg-[#3E291C] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Workshop Owner Now</span>
                  </a>

                  <a
                    href={`https://wa.me/${supportSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Namaste ${supportSettings.ownerName}, I have placed purchase request #${submittedRequest.id} for "${submittedRequest.productName}" (Qty: ${submittedRequest.quantity}). Please share delivery confirmation.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Submitted Details Review */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E7D8C9] text-xs space-y-2">
                <div className="font-semibold text-[#5C3E29]">
                  Buyer Information Logged in Workshop System:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[#3E291C]">
                  <div><span className="text-[#825638]">Buyer Name:</span> {submittedRequest.buyerName}</div>
                  <div><span className="text-[#825638]">Phone:</span> {submittedRequest.buyerPhone}</div>
                  <div><span className="text-[#825638]">WhatsApp:</span> {submittedRequest.buyerWhatsApp}</div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-[#825638]">Delivery Location:</span>{' '}
                    {submittedRequest.deliveryAddress.addressLine}, {submittedRequest.deliveryAddress.taluka},{' '}
                    {submittedRequest.deliveryAddress.district}, {submittedRequest.deliveryAddress.state} -{' '}
                    {submittedRequest.deliveryAddress.pincode}
                  </div>
                  {submittedRequest.additionalRequirements && (
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-[#825638]">Custom Notes:</span> {submittedRequest.additionalRequirements}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={handleCleanClose}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#291C14] bg-[#F3ECE2] hover:bg-[#E7D8C9] transition-colors"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          ) : (
            /* PURCHASE REQUEST FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Summary Row */}
              <div className="flex gap-4 p-3 bg-[#FAF8F5] border border-[#E7D8C9]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover border border-[#E7D8C9] shrink-0"
                />
                <div className="flex-1">
                  <div className="text-xs text-[#825638]">{product.category} · {product.woodType}</div>
                  <h4 className="text-sm font-serif font-bold text-[#291C14] leading-snug">
                    {product.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-base font-semibold font-mono text-[#5C3E29]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#825638]">
                      (Direct Workshop Price · No Middleman)
                    </span>
                  </div>
                </div>
              </div>

              {/* Requirement: Check Buyer Login */}
              {!buyerSession?.isLoggedIn ? (
                <div className="p-4 bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Buyer Login Required to Submit Purchase Request</span>
                  </div>
                  <p>
                    Please log in or register with your mobile number to submit purchase requests and view the official artisan contact details.
                  </p>
                  <button
                    type="button"
                    onClick={onRequireLogin}
                    className="py-2 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#5C3E29] hover:bg-[#3E291C] transition-colors"
                  >
                    Login / Register with Mobile Number
                  </button>
                </div>
              ) : (
                <>
                  {/* Quantity Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-3 bg-[#F3ECE2]/60 border border-[#E7D8C9]">
                    <div>
                      <label htmlFor="req-qty" className="block text-xs font-semibold text-[#291C14]">
                        Select Quantity
                      </label>
                      <span className="text-[11px] text-[#825638]">
                        Min: {product.minOrderQty || 1} | Max: {product.maxOrderQty || 5} units per order
                      </span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <div className="flex items-center border border-[#AA7248] bg-white">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(product.minOrderQty || 1, q - 1))}
                          className="px-3 py-1.5 text-sm font-bold text-[#5C3E29] hover:bg-[#FAF8F5]"
                        >
                          -
                        </button>
                        <span id="req-qty" className="px-4 py-1.5 text-sm font-mono font-bold text-[#291C14]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((q) =>
                              Math.min(
                                product.maxOrderQty || 5,
                                Math.min(product.availableStock || 5, q + 1)
                              )
                            )
                          }
                          className="px-3 py-1.5 text-sm font-bold text-[#5C3E29] hover:bg-[#FAF8F5]"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-[#825638] uppercase">Est. Total</div>
                        <div className="text-sm font-mono font-bold text-[#5C3E29]">
                          ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buyer Contact Details */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#AA7248]">
                      Your Contact Details (Shared with Workshop Owner)
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="buyer-name" className="block text-xs font-medium text-[#291C14] mb-1">
                          Full Name *
                        </label>
                        <input
                          id="buyer-name"
                          type="text"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="buyer-phone" className="block text-xs font-medium text-[#291C14] mb-1">
                          Mobile Number *
                        </label>
                        <input
                          id="buyer-phone"
                          type="tel"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          placeholder="10-digit number"
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="buyer-wa" className="block text-xs font-medium text-[#291C14] mb-1">
                          WhatsApp Number *
                        </label>
                        <input
                          id="buyer-wa"
                          type="tel"
                          value={buyerWhatsApp}
                          onChange={(e) => setBuyerWhatsApp(e.target.value)}
                          placeholder="WhatsApp for photos"
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location Section */}
                  <div className="space-y-3 pt-2 border-t border-[#E7D8C9]">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#AA7248]">
                        Delivery Location (Admin Configured Locations)
                      </div>
                      <span className="text-[11px] text-[#825638]">
                        Country: <strong className="text-[#291C14]">India</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="loc-state" className="block text-xs font-medium text-[#291C14] mb-1">
                          State *
                        </label>
                        <select
                          id="loc-state"
                          value={selectedState}
                          onChange={(e) => handleStateChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                        >
                          {Array.from(new Set(activeLocations.map((l) => l.state))).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="loc-district" className="block text-xs font-medium text-[#291C14] mb-1">
                          District *
                        </label>
                        <select
                          id="loc-district"
                          value={selectedDistrict}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                        >
                          {availableDistricts.map((d) => (
                            <option key={d.district} value={d.district}>
                              {d.district}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="loc-taluka" className="block text-xs font-medium text-[#291C14] mb-1">
                          Sub-District / Taluka *
                        </label>
                        <select
                          id="loc-taluka"
                          value={selectedTaluka}
                          onChange={(e) => setSelectedTaluka(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                        >
                          {currentLocNode?.talukas?.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label htmlFor="loc-addr" className="block text-xs font-medium text-[#291C14] mb-1">
                          Delivery House / Flat / Street Address *
                        </label>
                        <input
                          id="loc-addr"
                          type="text"
                          value={addressLine}
                          onChange={(e) => setAddressLine(e.target.value)}
                          placeholder="e.g. Bungalow No. 12, Swaminarayan Society"
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="loc-pincode" className="block text-xs font-medium text-[#291C14] mb-1">
                          Pincode *
                        </label>
                        <input
                          id="loc-pincode"
                          type="text"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="380060"
                          className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div>
                    <label htmlFor="custom-notes" className="block text-xs font-medium text-[#291C14] mb-1">
                      Custom Carpentry &amp; Polish Requirements (Optional)
                    </label>
                    <textarea
                      id="custom-notes"
                      rows={2}
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      placeholder="e.g. Please match dark walnut finish, need delivery by next weekend, include matching side stool..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                    />
                  </div>

                  {validationError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-red-700">
                      {validationError}
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E7D8C9]">
                    <div className="text-[11px] text-[#825638]">
                      ✓ No online payment required now · Direct contact with master artisan
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#5C3E29] hover:bg-[#3E291C] transition-colors"
                    >
                      <span>Submit Purchase Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
