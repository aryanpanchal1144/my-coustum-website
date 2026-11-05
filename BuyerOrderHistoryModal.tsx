import React from 'react';
import { X, Clock, Package, MapPin, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { PurchaseRequest, BusinessSupportSettings } from '../types';

interface BuyerOrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerPhone: string;
  purchaseRequests: PurchaseRequest[];
  supportSettings: BusinessSupportSettings;
  onSelectProductForDetails?: (productId: string) => void;
}

export const BuyerOrderHistoryModal: React.FC<BuyerOrderHistoryModalProps> = ({
  isOpen,
  onClose,
  buyerPhone,
  purchaseRequests,
  supportSettings,
}) => {
  if (!isOpen) return null;

  // Filter requests submitted by this buyer's phone
  const cleanPhone = buyerPhone.replace(/\D/g, '');
  const myRequests = purchaseRequests.filter((req) => {
    const reqPhone = req.buyerPhone.replace(/\D/g, '');
    return reqPhone.includes(cleanPhone) || cleanPhone.includes(reqPhone);
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B130E]/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-white border border-[#E7D8C9] shadow-2xl max-h-[90vh] flex flex-col my-auto text-[#291C14]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7D8C9] bg-[#FAF8F5]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#AA7248]">
              Customer Request History
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#291C14]">
              My Purchase Requests (+91 {buyerPhone})
            </h2>
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

        {/* List of Requests */}
        <div className="p-6 overflow-y-auto space-y-4">
          {myRequests.length === 0 ? (
            <div className="p-10 text-center bg-[#FAF8F5] border border-[#E7D8C9] text-xs text-[#825638] space-y-2">
              <Package className="w-8 h-8 mx-auto text-[#AA7248]/60" />
              <p className="font-semibold text-sm text-[#291C14]">No purchase requests placed yet</p>
              <p>Browse our handcrafted solid wooden furniture collection and click "Buy Now" on any piece.</p>
            </div>
          ) : (
            myRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-white border border-[#E7D8C9] shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E7D8C9] pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.productImage}
                      alt={req.productName}
                      className="w-16 h-16 object-cover border border-[#E7D8C9]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#5C3E29]">
                          #{req.id}
                        </span>
                        <span className="text-[11px] text-[#825638]">· {req.requestDate}</span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#291C14]">
                        {req.productName}
                      </h4>
                      <div className="text-xs text-[#825638]">
                        Qty: <strong>{req.quantity}</strong> | Est. Total:{' '}
                        <strong className="text-[#5C3E29] font-mono">
                          ₹{req.totalEstimatedAmount.toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-xs font-semibold font-mono border ${
                      req.status === 'PENDING_REVIEW'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : req.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-gray-50 text-gray-800 border-gray-300'
                    }`}
                  >
                    {req.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Shared Contact Info */}
                <div className="p-3 bg-[#F3ECE2]/80 border border-[#AA7248]/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#5C3E29] uppercase tracking-wider text-[10px]">
                      Workshop Direct Contact: {supportSettings.businessName}
                    </span>
                    <span className="text-[11px] text-[#825638]">Sole Owner: {supportSettings.ownerName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    <a
                      href={`tel:${supportSettings.officialPhone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#5C3E29] hover:bg-[#3E291C] text-white text-[11px] font-semibold transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call {supportSettings.officialPhone}</span>
                    </a>

                    <a
                      href={`https://wa.me/${supportSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Namaste ${supportSettings.ownerName}, I am following up on my purchase request #${req.id} for "${req.productName}".`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp {supportSettings.whatsappNumber}</span>
                    </a>
                  </div>
                </div>

                <div className="text-xs text-[#825638]">
                  Delivery to: <span className="text-[#291C14]">{req.deliveryAddress.addressLine}, {req.deliveryAddress.taluka}, {req.deliveryAddress.district}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
