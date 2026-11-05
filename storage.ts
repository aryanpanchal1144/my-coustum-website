import { DatabaseState, Product, PurchaseRequest, BusinessSupportSettings, DeliveryLocationNode } from './types';
import { INITIAL_DATABASE_STATE } from './initialData';

const DB_STORAGE_KEY = 'sg_furniture_works_db_v1';
const BUYER_SESSION_KEY = 'sg_furniture_buyer_session_v1';
const ADMIN_SESSION_KEY = 'sg_furniture_admin_session_v1';

export function getDatabaseState(): DatabaseState {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      saveDatabaseState(INITIAL_DATABASE_STATE);
      return INITIAL_DATABASE_STATE;
    }
    const parsed = JSON.parse(raw);
    // Combine existing categories with any newly released catalog categories
    const mergedCategories = Array.from(
      new Set([...(Array.isArray(parsed.categories) ? parsed.categories : []), ...INITIAL_DATABASE_STATE.categories])
    );
    // Include newly released initial products while preserving any existing products
    const storedProducts: Product[] = Array.isArray(parsed.products) ? parsed.products : [];
    const storedIds = new Set(storedProducts.map((p) => p.id));
    const newInitialProducts = INITIAL_DATABASE_STATE.products.filter((p) => !storedIds.has(p.id));
    const mergedProducts = [...storedProducts, ...newInitialProducts];

    return {
      ...INITIAL_DATABASE_STATE,
      ...parsed,
      supportSettings: {
        ...INITIAL_DATABASE_STATE.supportSettings,
        ...(parsed.supportSettings || {}),
      },
      categories: mergedCategories,
      deliveryLocations: Array.isArray(parsed.deliveryLocations) ? parsed.deliveryLocations : INITIAL_DATABASE_STATE.deliveryLocations,
      products: mergedProducts,
      purchaseRequests: Array.isArray(parsed.purchaseRequests) ? parsed.purchaseRequests : INITIAL_DATABASE_STATE.purchaseRequests,
    };
  } catch (err) {
    console.error('Error reading database state from storage', err);
    return INITIAL_DATABASE_STATE;
  }
}

export function saveDatabaseState(state: DatabaseState): void {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(state));
    // Trigger custom window event so reactive subscribers update immediately
    window.dispatchEvent(new Event('sg_db_updated'));
  } catch (err) {
    console.error('Error saving database state', err);
  }
}

// Buyer Session Management (Mobile + OTP)
export interface BuyerSessionData {
  phone: string;
  name: string;
  whatsapp: string;
  isLoggedIn: boolean;
}

export function getBuyerSession(): BuyerSessionData | null {
  try {
    const raw = localStorage.getItem(BUYER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveBuyerSession(session: BuyerSessionData): void {
  localStorage.setItem(BUYER_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('sg_buyer_session_updated'));
}

export function clearBuyerSession(): void {
  localStorage.removeItem(BUYER_SESSION_KEY);
  window.dispatchEvent(new Event('sg_buyer_session_updated'));
}

// Admin Google Auth Session
export interface AdminSessionData {
  email: string;
  displayName: string;
  photoURL?: string;
  authenticatedAt: string;
}

export function getAdminSession(): AdminSessionData | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSessionData): void {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('sg_admin_session_updated'));
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.dispatchEvent(new Event('sg_admin_session_updated'));
}
