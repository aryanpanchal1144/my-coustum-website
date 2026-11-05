import React, { useState } from 'react';
import {
  Package,
  Layers,
  Inbox,
  MapPin,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Phone,
  MessageSquare,
  LogOut,
  Image as ImageIcon,
  AlertCircle,
  Archive,
  ArchiveRestore,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import {
  Product,
  PurchaseRequest,
  DeliveryLocationNode,
  BusinessSupportSettings,
  DatabaseState,
} from '../types';
import { clearAdminSession } from '../storage';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbState: DatabaseState;
  onUpdateDbState: (newState: DatabaseState) => void;
}

type AdminTab = 'PRODUCTS' | 'CATEGORIES' | 'PURCHASE_REQUESTS' | 'LOCATIONS' | 'SUPPORT_SETTINGS';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  dbState,
  onUpdateDbState,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('PURCHASE_REQUESTS');

  // Product Editing / Creation State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // Confirmation dialog state (modal-based, avoids window.confirm sandbox issues)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'PRODUCT' | 'CATEGORY' | 'LOCATION';
    idOrName: string;
    title: string;
  } | null>(null);

  // New Category Input
  const [newCategoryName, setNewCategoryName] = useState('');

  // New Delivery Location Form State
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocationForm, setNewLocationForm] = useState({
    country: 'India',
    state: 'Gujarat',
    district: '',
    talukasInput: '',
    isEnabled: true,
  });

  // Support Settings Form State
  const [settingsForm, setSettingsForm] = useState<BusinessSupportSettings>(dbState.supportSettings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Purchase requests views: Active vs Archived
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const handleLogout = () => {
    clearAdminSession();
    onClose();
  };

  // 1. PRODUCT MANAGEMENT HANDLERS
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    const finalImages = editingProduct.images && editingProduct.images.length > 0
      ? editingProduct.images
      : [dbState.products[0]?.images[0] || ''];

    let updatedProducts: Product[];
    if (isCreatingProduct) {
      const newProd: Product = {
        id: `sg-prod-${Date.now()}`,
        name: editingProduct.name,
        category: editingProduct.category || dbState.categories[0] || 'General',
        woodType: editingProduct.woodType || 'Sagwan Teakwood',
        price: Number(editingProduct.price),
        originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
        availableStock: Number(editingProduct.availableStock ?? 1),
        minOrderQty: Number(editingProduct.minOrderQty ?? 1),
        maxOrderQty: Number(editingProduct.maxOrderQty ?? 5),
        isAvailable: editingProduct.isAvailable ?? true,
        images: finalImages,
        dimensions: editingProduct.dimensions || 'Custom as per order',
        finish: editingProduct.finish || 'Polyurethane natural matte finish',
        leadTime: editingProduct.leadTime || '10 - 15 Days',
        description: editingProduct.description || '',
        features: editingProduct.features?.length ? editingProduct.features : ['100% Solid Seasoned Wood'],
      };
      updatedProducts = [newProd, ...dbState.products];
    } else {
      updatedProducts = dbState.products.map((p) =>
        p.id === editingProduct.id
          ? ({
              ...p,
              ...editingProduct,
              images: finalImages,
              price: Number(editingProduct.price),
              originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
              availableStock: Number(editingProduct.availableStock ?? p.availableStock),
              minOrderQty: Number(editingProduct.minOrderQty ?? p.minOrderQty),
              maxOrderQty: Number(editingProduct.maxOrderQty ?? p.maxOrderQty),
            } as Product)
          : p
      );
    }

    onUpdateDbState({
      ...dbState,
      products: updatedProducts,
    });
    setEditingProduct(null);
    setIsCreatingProduct(false);
    setNewImageUrlInput('');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmation) return;

    if (deleteConfirmation.type === 'PRODUCT') {
      const updatedProducts = dbState.products.filter((p) => p.id !== deleteConfirmation.idOrName);
      onUpdateDbState({
        ...dbState,
        products: updatedProducts,
      });
    } else if (deleteConfirmation.type === 'CATEGORY') {
      const updatedCategories = dbState.categories.filter((c) => c !== deleteConfirmation.idOrName);
      onUpdateDbState({
        ...dbState,
        categories: updatedCategories,
      });
    } else if (deleteConfirmation.type === 'LOCATION') {
      const updatedLocations = dbState.deliveryLocations.filter(
        (loc) => `${loc.state}-${loc.district}` !== deleteConfirmation.idOrName
      );
      onUpdateDbState({
        ...dbState,
        deliveryLocations: updatedLocations,
      });
    }

    setDeleteConfirmation(null);
  };

  // Image Upload (File to Data URL) handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readFilesPromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readFilesPromises).then((uploadedUrls) => {
      setEditingProduct((prev) => {
        const currentImages = prev?.images || [];
        return {
          ...prev,
          images: [...currentImages, ...uploadedUrls],
        };
      });
    });
  };

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newImageUrlInput.trim();
    if (!trimmed) return;
    setEditingProduct((prev) => {
      const currentImages = prev?.images || [];
      return {
        ...prev,
        images: [...currentImages, trimmed],
      };
    });
    setNewImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setEditingProduct((prev) => {
      const currentImages = prev?.images || [];
      return {
        ...prev,
        images: currentImages.filter((_, idx) => idx !== indexToRemove),
      };
    });
  };

  // 2. CATEGORY HANDLERS
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed || dbState.categories.includes(trimmed)) return;
    onUpdateDbState({
      ...dbState,
      categories: [...dbState.categories, trimmed],
    });
    setNewCategoryName('');
  };

  // 3. PURCHASE REQUEST STATUS & ARCHIVE
  const handleUpdateRequestStatus = (requestId: string, status: PurchaseRequest['status']) => {
    const updated = dbState.purchaseRequests.map((r) =>
      r.id === requestId ? { ...r, status } : r
    );
    onUpdateDbState({
      ...dbState,
      purchaseRequests: updated,
    });
  };

  const handleToggleArchive = (requestId: string) => {
    const updated = dbState.purchaseRequests.map((r) =>
      r.id === requestId ? { ...r, isArchived: !r.isArchived } : r
    );
    onUpdateDbState({
      ...dbState,
      purchaseRequests: updated,
    });
  };

  const handleUpdateOwnerNotes = (requestId: string, ownerNotes: string) => {
    const updated = dbState.purchaseRequests.map((r) =>
      r.id === requestId ? { ...r, ownerNotes } : r
    );
    onUpdateDbState({
      ...dbState,
      purchaseRequests: updated,
    });
  };

  // 4. LOCATION SETTINGS
  const handleToggleLocation = (index: number) => {
    const updated = dbState.deliveryLocations.map((loc, idx) =>
      idx === index ? { ...loc, isEnabled: !loc.isEnabled } : loc
    );
    onUpdateDbState({
      ...dbState,
      deliveryLocations: updated,
    });
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationForm.district.trim()) return;

    const talukas = newLocationForm.talukasInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newNode: DeliveryLocationNode = {
      country: newLocationForm.country.trim() || 'India',
      state: newLocationForm.state.trim() || 'Gujarat',
      district: newLocationForm.district.trim(),
      talukas: talukas.length > 0 ? talukas : [newLocationForm.district.trim() + ' City'],
      isEnabled: newLocationForm.isEnabled,
    };

    onUpdateDbState({
      ...dbState,
      deliveryLocations: [...dbState.deliveryLocations, newNode],
    });

    setNewLocationForm({
      country: 'India',
      state: 'Gujarat',
      district: '',
      talukasInput: '',
      isEnabled: true,
    });
    setIsAddingLocation(false);
  };

  // 5. SUPPORT SETTINGS SAVE
  const handleSaveSupportSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDbState({
      ...dbState,
      supportSettings: settingsForm,
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  // Filter requests (Active vs Archived)
  const currentRequestsList = dbState.purchaseRequests.filter((r) => {
    const matchesArchive = showArchived ? Boolean(r.isArchived) : !r.isArchived;
    if (!matchesArchive) return false;
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const activeCount = dbState.purchaseRequests.filter((r) => !r.isArchived).length;
  const archivedCount = dbState.purchaseRequests.filter((r) => r.isArchived).length;
  const pendingCount = dbState.purchaseRequests.filter(
    (r) => !r.isArchived && r.status === 'PENDING_REVIEW'
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B130E]/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-6xl bg-white border border-[#E7D8C9] shadow-2xl h-[92vh] flex flex-col my-auto text-[#291C14] overflow-hidden">
        {/* Top Bar for Admin */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#E7D8C9] bg-[#291C14] text-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-serif font-bold tracking-wide">
              SHREE GANESHNATH FURNITURE WORKS
            </span>
            <span className="text-[10px] uppercase font-semibold font-sans bg-[#AA7248] text-white px-2 py-0.5">
              Sole Admin &amp; Seller Console
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline text-[#E7D8C9]">
              Signed in: <strong className="text-white">{dbState.supportSettings.authorizedAdminEmail}</strong>
            </span>
            <button
              onClick={handleLogout}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3E291C] hover:bg-[#5C3E29] text-white text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-[#E7D8C9] hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-[#E7D8C9] bg-[#FAF8F5] overflow-x-auto text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('PURCHASE_REQUESTS')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'PURCHASE_REQUESTS'
                ? 'border-[#5C3E29] text-[#5C3E29] bg-white'
                : 'border-transparent text-[#825638] hover:text-[#291C14]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Buyer Requests ({activeCount})</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px] font-mono">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'PRODUCTS'
                ? 'border-[#5C3E29] text-[#5C3E29] bg-white'
                : 'border-transparent text-[#825638] hover:text-[#291C14]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({dbState.products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CATEGORIES')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'CATEGORIES'
                ? 'border-[#5C3E29] text-[#5C3E29] bg-white'
                : 'border-transparent text-[#825638] hover:text-[#291C14]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories ({dbState.categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('LOCATIONS')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'LOCATIONS'
                ? 'border-[#5C3E29] text-[#5C3E29] bg-white'
                : 'border-transparent text-[#825638] hover:text-[#291C14]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Locations ({dbState.deliveryLocations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SUPPORT_SETTINGS')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'SUPPORT_SETTINGS'
                ? 'border-[#5C3E29] text-[#5C3E29] bg-white'
                : 'border-transparent text-[#825638] hover:text-[#291C14]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Support Settings</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF8F5]">
          {/* TAB 1: PURCHASE REQUESTS & ARCHIVE FEATURE */}
          {activeTab === 'PURCHASE_REQUESTS' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7D8C9]">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#291C14]">
                    {showArchived ? 'Archived Purchase Requests' : 'Active Buyer Purchase Requests'}
                  </h3>
                  <p className="text-xs text-[#825638]">
                    {showArchived
                      ? 'Past completed or archived requests. You can restore them to active at any time.'
                      : 'Real-time buyer purchase requests. Call or WhatsApp buyers directly, then archive when fulfilled.'}
                  </p>
                </div>

                {/* Archive Toggle & Status Filter */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Active / Archive Toggle */}
                  <div className="inline-flex border border-[#E7D8C9] bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setShowArchived(false)}
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        !showArchived
                          ? 'bg-[#5C3E29] text-white'
                          : 'text-[#825638] hover:text-[#291C14]'
                      }`}
                    >
                      Active ({activeCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowArchived(true)}
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                        showArchived
                          ? 'bg-[#5C3E29] text-white'
                          : 'text-[#825638] hover:text-[#291C14]'
                      }`}
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archived ({archivedCount})</span>
                    </button>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#825638]">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2.5 py-1 bg-white border border-[#E7D8C9] text-xs text-[#291C14]"
                    >
                      <option value="ALL">All</option>
                      <option value="PENDING_REVIEW">Pending Review</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="IN_PRODUCTION">In Production</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {currentRequestsList.length === 0 ? (
                <div className="p-12 text-center bg-white border border-[#E7D8C9] text-xs text-[#825638] space-y-2">
                  <Archive className="w-8 h-8 mx-auto text-[#AA7248]/50" />
                  <p className="font-semibold text-sm text-[#291C14]">
                    {showArchived ? 'No archived requests found.' : 'No active purchase requests.'}
                  </p>
                  <p>
                    {showArchived
                      ? 'Requests you archive from the Active tab will appear here.'
                      : 'New purchase requests from customers will appear here immediately.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentRequestsList.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white border border-[#E7D8C9] p-5 shadow-xs space-y-4"
                    >
                      {/* Top Info */}
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E7D8C9] pb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.productImage}
                            alt={req.productName}
                            className="w-14 h-14 object-cover border border-[#E7D8C9]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[#5C3E29]">
                                #{req.id}
                              </span>
                              <span className="text-[11px] text-[#825638]">· {req.requestDate}</span>
                              {req.isArchived && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-1.5 py-0.2 border border-amber-300">
                                  Archived
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-bold text-sm text-[#291C14]">
                              {req.productName}
                            </h4>
                            <div className="text-xs text-[#825638]">
                              Quantity: <strong className="text-[#291C14]">{req.quantity} unit(s)</strong> | Est. Total:{' '}
                              <strong className="text-[#5C3E29] font-mono">
                                ₹{req.totalEstimatedAmount.toLocaleString('en-IN')}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Status Select & Archive Button */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#825638]">Status:</span>
                          <select
                            value={req.status}
                            onChange={(e) =>
                              handleUpdateRequestStatus(
                                req.id,
                                e.target.value as PurchaseRequest['status']
                              )
                            }
                            className={`px-3 py-1.5 text-xs font-semibold font-mono border ${
                              req.status === 'PENDING_REVIEW'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : req.status === 'CONFIRMED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-gray-50 text-gray-800 border-gray-300'
                            }`}
                          >
                            <option value="PENDING_REVIEW">PENDING REVIEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="IN_PRODUCTION">IN PRODUCTION</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>

                          {/* Archive / Unarchive Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleArchive(req.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-[#E7D8C9] hover:bg-[#FAF8F5] transition-colors"
                            title={req.isArchived ? 'Restore to Active' : 'Archive Request'}
                          >
                            {req.isArchived ? (
                              <>
                                <ArchiveRestore className="w-3.5 h-3.5 text-[#5C3E29]" />
                                <span>Restore</span>
                              </>
                            ) : (
                              <>
                                <Archive className="w-3.5 h-3.5 text-[#825638]" />
                                <span>Archive</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Buyer Details & Direct Action Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Customer Contact */}
                        <div className="p-3 bg-[#FAF8F5] border border-[#E7D8C9] space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#AA7248]">
                            Customer Identity &amp; Contact
                          </div>
                          <div className="font-semibold text-sm text-[#291C14]">
                            {req.buyerName}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[#825638]">Calling:</span>{' '}
                            <span className="font-mono font-bold text-[#291C14]">{req.buyerPhone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[#825638]">WhatsApp:</span>{' '}
                            <span className="font-mono font-bold text-emerald-700">{req.buyerWhatsApp}</span>
                          </div>

                          {/* Direct Actions */}
                          <div className="pt-2 flex flex-wrap gap-2">
                            <a
                              href={`tel:${req.buyerPhone.replace(/\s+/g, '')}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5C3E29] hover:bg-[#3E291C] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call Buyer</span>
                            </a>
                            <a
                              href={`https://wa.me/${req.buyerWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Namaste ${req.buyerName}, this is ${dbState.supportSettings.ownerName} from ${dbState.supportSettings.businessName}. Thank you for your purchase request #${req.id} for "${req.productName}". We are reviewing delivery details.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp Buyer</span>
                            </a>
                          </div>
                        </div>

                        {/* Delivery Destination & Notes */}
                        <div className="p-3 bg-[#FAF8F5] border border-[#E7D8C9] space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#AA7248]">
                            Delivery Destination &amp; Notes
                          </div>
                          <p className="text-xs text-[#291C14] leading-relaxed">
                            <strong>{req.deliveryAddress.addressLine}</strong>,<br />
                            Taluka: {req.deliveryAddress.taluka}, District: {req.deliveryAddress.district}, State: {req.deliveryAddress.state} -{' '}
                            <span className="font-mono font-bold">{req.deliveryAddress.pincode}</span>
                          </p>
                          {req.additionalRequirements && (
                            <div className="pt-1 text-[11px] bg-white p-2 border border-[#E7D8C9]">
                              <span className="font-semibold text-[#5C3E29]">Buyer's Custom Notes:</span>{' '}
                              <span className="text-[#3E291C]">{req.additionalRequirements}</span>
                            </div>
                          )}

                          <div className="pt-2">
                            <label className="block text-[10px] font-semibold uppercase text-[#825638] mb-1">
                              Owner Internal Notes:
                            </label>
                            <input
                              type="text"
                              value={req.ownerNotes || ''}
                              onChange={(e) => handleUpdateOwnerNotes(req.id, e.target.value)}
                              placeholder="e.g. Called customer, confirmed finish..."
                              className="w-full px-2.5 py-1 text-xs bg-white border border-[#E7D8C9] focus:outline-none focus:border-[#5C3E29]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS WITH MULTI-IMAGE UPLOAD & DELETE */}
          {activeTab === 'PRODUCTS' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7D8C9]">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#291C14]">
                    Wooden Furniture Products
                  </h3>
                  <p className="text-xs text-[#825638]">
                    Manage your handcrafted furniture. Upload multiple gallery photos for buyers to scroll through.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingProduct(true);
                    setEditingProduct({
                      name: '',
                      category: dbState.categories[0] || 'General',
                      woodType: '100% Grade-A CP Teakwood',
                      price: 25000,
                      availableStock: 3,
                      minOrderQty: 1,
                      maxOrderQty: 5,
                      isAvailable: true,
                      images: [],
                      dimensions: 'Custom dimensions available',
                      finish: 'Hand-rubbed natural walnut matte finish',
                      leadTime: '10 - 15 Days',
                      description: '',
                      features: ['100% Seasoned Hardwood', 'Traditional Mortise & Tenon Joint'],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5C3E29] hover:bg-[#3E291C] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Product Modal Form with Multi-Image Uploader */}
              {(editingProduct || isCreatingProduct) && (
                <form
                  onSubmit={handleSaveProduct}
                  className="p-5 bg-white border border-[#AA7248] shadow-md space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-[#E7D8C9] pb-2">
                    <h4 className="font-serif font-bold text-sm text-[#291C14]">
                      {isCreatingProduct ? 'Add New Furniture Product' : `Edit Product: ${editingProduct?.name}`}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsCreatingProduct(false);
                      }}
                      className="text-xs text-[#825638] hover:text-[#291C14]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-medium mb-1">Product Title *</label>
                      <input
                        type="text"
                        value={editingProduct?.name || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Category *</label>
                      <select
                        value={editingProduct?.category || dbState.categories[0]}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, category: e.target.value })
                        }
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                      >
                        {dbState.categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Wood Type *</label>
                      <input
                        type="text"
                        value={editingProduct?.woodType || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, woodType: e.target.value })
                        }
                        placeholder="e.g. CP Teakwood / Sheesham"
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        value={editingProduct?.price || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                        }
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">MRP / Strikethrough Price (₹)</label>
                      <input
                        type="number"
                        value={editingProduct?.originalPrice || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            originalPrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        value={editingProduct?.availableStock ?? 1}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            availableStock: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Min Order Qty</label>
                      <input
                        type="number"
                        value={editingProduct?.minOrderQty ?? 1}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            minOrderQty: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Max Order Qty</label>
                      <input
                        type="number"
                        value={editingProduct?.maxOrderQty ?? 5}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            maxOrderQty: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Availability Status</label>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct?.isAvailable ?? true}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              isAvailable: e.target.checked,
                            })
                          }
                          className="rounded border-[#AA7248] text-[#5C3E29]"
                        />
                        <span className="text-xs">Product is Available for Order</span>
                      </label>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-medium mb-1">Detailed Description</label>
                      <textarea
                        rows={2}
                        value={editingProduct?.description || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  {/* MULTI-PHOTO UPLOAD SECTION */}
                  <div className="p-4 bg-[#FAF8F5] border border-[#E7D8C9] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase text-[#5C3E29] flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4" />
                        <span>Product Photo Gallery (Multiple Photos for Buyer Scroll)</span>
                      </span>
                      <span className="text-[11px] text-[#825638]">
                        {(editingProduct?.images?.length || 0)} photo(s) attached
                      </span>
                    </div>

                    {/* Upload from Device + Add URL options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Option A: Upload Device Photos */}
                      <div className="p-3 bg-white border border-[#E7D8C9] space-y-1.5">
                        <label className="block font-semibold text-[#291C14]">
                          Upload From Device / Computer
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="w-full text-[11px] text-[#5C3E29] file:mr-2 file:py-1 file:px-2.5 file:border file:border-[#AA7248] file:text-[11px] file:bg-[#F3ECE2] file:text-[#5C3E29] file:cursor-pointer hover:file:bg-[#E7D8C9]"
                        />
                        <p className="text-[10px] text-[#825638]">
                          Select 1 or more images at once (JPG, PNG, WebP).
                        </p>
                      </div>

                      {/* Option B: Enter image URL or Asset path */}
                      <div className="p-3 bg-white border border-[#E7D8C9] space-y-1.5">
                        <label className="block font-semibold text-[#291C14]">
                          Or Add via Image URL / Path
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newImageUrlInput}
                            onChange={(e) => setNewImageUrlInput(e.target.value)}
                            placeholder="https://... or /src/assets/..."
                            className="flex-1 px-2.5 py-1 text-xs border border-[#E7D8C9]"
                          />
                          <button
                            type="button"
                            onClick={handleAddImageUrl}
                            className="px-3 py-1 bg-[#5C3E29] text-white text-xs font-semibold uppercase"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Current Photo Previews */}
                    {editingProduct?.images && editingProduct.images.length > 0 ? (
                      <div className="pt-2">
                        <span className="text-[11px] text-[#825638] block mb-2">
                          Attached photos (first photo is thumbnail, buyers can scroll through all):
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {editingProduct.images.map((imgUrl, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative group w-20 h-20 border border-[#E7D8C9] bg-white overflow-hidden shadow-xs"
                            >
                              <img
                                src={imgUrl}
                                alt={`Product view ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(imgIdx)}
                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                                title="Remove photo"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              {imgIdx === 0 && (
                                <span className="absolute bottom-0 inset-x-0 bg-[#291C14]/80 text-white text-[9px] text-center font-bold">
                                  Main Cover
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 border border-amber-200">
                        No photos added yet. Please upload at least one photo.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#E7D8C9]">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsCreatingProduct(false);
                      }}
                      className="px-4 py-2 border border-[#E7D8C9] text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#5C3E29] hover:bg-[#3E291C] text-white text-xs font-semibold uppercase tracking-wider"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              )}

              {/* Product List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbState.products.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-white border border-[#E7D8C9] flex gap-4 items-start shadow-xs"
                  >
                    <div className="relative w-24 h-24 shrink-0">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-24 h-24 object-cover border border-[#E7D8C9]"
                      />
                      {p.images.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-[#1B130E]/80 text-white text-[10px] px-1 font-mono font-bold">
                          +{p.images.length - 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-[#AA7248] uppercase">
                          {p.category}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 ${
                            p.isAvailable
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-red-50 text-red-800'
                          }`}
                        >
                          {p.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#291C14] truncate mt-0.5">
                        {p.name}
                      </h4>
                      <p className="text-xs text-[#825638] truncate">{p.woodType}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-mono font-bold text-[#5C3E29]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-[#825638]">
                          Stock: {p.availableStock} | Photos: {p.images.length}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#E7D8C9] flex items-center justify-end gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingProduct(false);
                            setEditingProduct(p);
                          }}
                          className="inline-flex items-center gap-1 text-[#5C3E29] hover:text-[#3E291C] font-medium"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'PRODUCT',
                              idOrName: p.id,
                              title: p.name,
                            })
                          }
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'CATEGORIES' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#291C14]">
                  Furniture Categories
                </h3>
                <p className="text-xs text-[#825638]">
                  Manage custom product categories. Create or delete categories as your workshop needs.
                </p>
              </div>

              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Swings (Jhula), Bar Units, Office Desks..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-[#E7D8C9] focus:outline-none focus:border-[#5C3E29]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5C3E29] hover:bg-[#3E291C] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Add Category
                </button>
              </form>

              <div className="bg-white border border-[#E7D8C9] divide-y divide-[#E7D8C9]">
                {dbState.categories.map((cat) => {
                  const count = dbState.products.filter((p) => p.category === cat).length;
                  return (
                    <div key={cat} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-[#291C14]">{cat}</span>
                        <span className="ml-2 text-[11px] text-[#825638]">
                          ({count} product{count === 1 ? '' : 's'})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirmation({
                            type: 'CATEGORY',
                            idOrName: cat,
                            title: `Category "${cat}"`,
                          })
                        }
                        className="text-red-600 hover:text-red-800 p-1.5"
                        aria-label={`Delete ${cat}`}
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: LOCATIONS WITH ADD NEW LOCATION FEATURE */}
          {activeTab === 'LOCATIONS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7D8C9]">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#291C14]">
                    Delivery Location Availability Settings
                  </h3>
                  <p className="text-xs text-[#825638]">
                    Configure country, state, district, and talukas. Customers can only submit purchase requests for enabled locations.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingLocation(!isAddingLocation)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5C3E29] hover:bg-[#3E291C] text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingLocation ? 'Close Form' : 'Add New Location'}</span>
                </button>
              </div>

              {/* Add New Location Form */}
              {isAddingLocation && (
                <form
                  onSubmit={handleAddLocation}
                  className="p-5 bg-white border border-[#AA7248] shadow-sm space-y-4"
                >
                  <h4 className="font-serif font-bold text-sm text-[#291C14] border-b border-[#E7D8C9] pb-2">
                    Add New Serviced Delivery District / Region
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block font-medium mb-1">Country *</label>
                      <input
                        type="text"
                        value={newLocationForm.country}
                        onChange={(e) =>
                          setNewLocationForm({ ...newLocationForm, country: e.target.value })
                        }
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">State *</label>
                      <input
                        type="text"
                        value={newLocationForm.state}
                        onChange={(e) =>
                          setNewLocationForm({ ...newLocationForm, state: e.target.value })
                        }
                        placeholder="e.g. Gujarat / Rajasthan"
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">District Name *</label>
                      <input
                        type="text"
                        value={newLocationForm.district}
                        onChange={(e) =>
                          setNewLocationForm({ ...newLocationForm, district: e.target.value })
                        }
                        placeholder="e.g. Mehsana / Anand"
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Sub-Districts / Talukas</label>
                      <input
                        type="text"
                        value={newLocationForm.talukasInput}
                        onChange={(e) =>
                          setNewLocationForm({ ...newLocationForm, talukasInput: e.target.value })
                        }
                        placeholder="Comma-separated: Taluka 1, Taluka 2"
                        className="w-full px-3 py-1.5 border border-[#E7D8C9] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E7D8C9]">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLocationForm.isEnabled}
                        onChange={(e) =>
                          setNewLocationForm({ ...newLocationForm, isEnabled: e.target.checked })
                        }
                        className="rounded border-[#AA7248] text-[#5C3E29]"
                      />
                      <span>Enable this location immediately for buyer orders</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingLocation(false)}
                        className="px-3 py-1.5 border border-[#E7D8C9] text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#5C3E29] text-white text-xs font-semibold uppercase"
                      >
                        Save Location
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Location Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbState.deliveryLocations.map((loc, index) => (
                  <div
                    key={`${loc.state}-${loc.district}`}
                    className={`p-4 border transition-colors ${
                      loc.isEnabled
                        ? 'bg-white border-[#AA7248]'
                        : 'bg-[#FAF8F5] border-[#E7D8C9] opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#AA7248]">
                          {loc.country} · {loc.state}
                        </span>
                        <h4 className="text-base font-serif font-bold text-[#291C14]">
                          {loc.district} District
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleLocation(index)}
                          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                            loc.isEnabled
                              ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {loc.isEnabled ? 'Enabled' : 'Disabled'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'LOCATION',
                              idOrName: `${loc.state}-${loc.district}`,
                              title: `${loc.district} District (${loc.state})`,
                            })
                          }
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete location"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#E7D8C9] text-xs">
                      <div className="text-[#825638] font-medium mb-1">
                        Covered Talukas / Sub-Districts:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {loc.talukas.map((t) => (
                          <span
                            key={t}
                            className="bg-[#F3ECE2] px-2 py-0.5 text-[11px] text-[#3E291C]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SUPPORT SETTINGS */}
          {activeTab === 'SUPPORT_SETTINGS' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#291C14]">
                  Website Support &amp; Owner Contact Settings
                </h3>
                <p className="text-xs text-[#825638]">
                  Update your official business contact details and security email. These details are shared with buyers after a successful purchase request.
                </p>
              </div>

              {settingsSavedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Business support settings updated and persisted successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSupportSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Business Name *</label>
                    <input
                      type="text"
                      value={settingsForm.businessName}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, businessName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E7D8C9]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Master Artisan / Owner Name *</label>
                    <input
                      type="text"
                      value={settingsForm.ownerName}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, ownerName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E7D8C9]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Official Calling Phone *</label>
                    <input
                      type="text"
                      value={settingsForm.officialPhone}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, officialPhone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E7D8C9]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Official WhatsApp Number *</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E7D8C9]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium mb-1">Official Support Email *</label>
                    <input
                      type="email"
                      value={settingsForm.supportEmail}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, supportEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E7D8C9]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium mb-1">Workshop &amp; Showroom Address *</label>
                    <textarea
                      rows={2}
                      value={settingsForm.workshopAddress}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, workshopAddress: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E7D8C9]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium mb-1">Operating Hours</label>
                    <input
                      type="text"
                      value={settingsForm.operatingHours}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, operatingHours: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E7D8C9]"
                    />
                  </div>

                  <div className="sm:col-span-2 p-3 bg-amber-50 border border-amber-200">
                    <label className="block font-semibold text-amber-900 mb-1">
                      Authorized Admin Google Account Email *
                    </label>
                    <input
                      type="email"
                      value={settingsForm.authorizedAdminEmail}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, authorizedAdminEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-amber-300 font-mono text-[#291C14]"
                      required
                    />
                    <p className="mt-1 text-[11px] text-amber-800">
                      Security Enforcement: Only this specific Google account can access this admin &amp; seller console.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5C3E29] hover:bg-[#3E291C] text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Save All Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* IN-APP MODAL CONFIRMATION DIALOG (Guarantees Deletion works seamlessly in all sandboxes) */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border border-[#E7D8C9] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 text-red-700 rounded-full">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#291C14]">Confirm Deletion</h4>
                <p className="text-xs text-[#825638] mt-1">
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-[#291C14]">{deleteConfirmation.title}</strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E7D8C9]">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-3.5 py-1.5 text-xs border border-[#E7D8C9] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
