export interface Product {
  id: string;
  name: string;
  category: string;
  woodType: string;
  price: number;
  originalPrice?: number;
  availableStock: number;
  minOrderQty: number;
  maxOrderQty: number;
  isAvailable: boolean;
  images: string[];
  dimensions: string;
  finish: string;
  leadTime: string;
  description: string;
  features: string[];
}

export interface PurchaseRequest {
  id: string;
  requestDate: string;
  productId: string;
  productName: string;
  productCategory: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalEstimatedAmount: number;
  buyerName: string;
  buyerPhone: string;
  buyerWhatsApp: string;
  deliveryAddress: {
    country: string;
    state: string;
    district: string;
    taluka: string;
    addressLine: string;
    pincode: string;
  };
  additionalRequirements?: string;
  status: 'PENDING_REVIEW' | 'CONTACTED' | 'CONFIRMED' | 'IN_PRODUCTION' | 'DELIVERED' | 'CANCELLED';
  ownerNotes?: string;
  isArchived?: boolean;
}

export interface BuyerSession {
  phone: string;
  name?: string;
  whatsapp?: string;
  verifiedAt: string;
}

export interface DeliveryLocationNode {
  country: string;
  state: string;
  district: string;
  talukas: string[];
  isEnabled: boolean;
}

export interface BusinessSupportSettings {
  businessName: string;
  ownerName: string;
  officialPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  workshopAddress: string;
  operatingHours: string;
  aboutText: string;
  authorizedAdminEmail: string;
}

export interface DatabaseState {
  products: Product[];
  categories: string[];
  purchaseRequests: PurchaseRequest[];
  deliveryLocations: DeliveryLocationNode[];
  supportSettings: BusinessSupportSettings;
}
