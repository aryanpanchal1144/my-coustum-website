import React, { useState } from 'react';
import { X, Lock, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { AdminSessionData, saveAdminSession } from '../storage';
import { BusinessSupportSettings } from '../types';

interface AdminGoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportSettings: BusinessSupportSettings;
  onSuccess: (session: AdminSessionData) => void;
}

export const AdminGoogleLoginModal: React.FC<AdminGoogleLoginModalProps> = ({
  isOpen,
  onClose,
  supportSettings,
  onSuccess,
}) => {
  const [selectedEmail, setSelectedEmail] = useState(supportSettings.authorizedAdminEmail);
  const [customEmail, setCustomEmail] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleSimulateGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAuthenticating(true);

    const emailToTest = (useCustom ? customEmail : selectedEmail).trim().toLowerCase();

    setTimeout(() => {
      setIsAuthenticating(false);
      // Strictly enforce sole owner authorization rule:
      const authorized = supportSettings.authorizedAdminEmail.trim().toLowerCase();

      if (emailToTest !== authorized) {
        setError(
          `Access Denied: Google Account "${emailToTest}" is not authorized. Only the configured sole owner (${authorized}) can access the Admin & Seller Dashboard.`
        );
        return;
      }

      const session: AdminSessionData = {
        email: emailToTest,
        displayName: supportSettings.ownerName || 'Website Owner',
        authenticatedAt: new Date().toISOString(),
      };
      saveAdminSession(session);
      onSuccess(session);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B130E]/75 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white border border-[#E7D8C9] shadow-2xl p-6 sm:p-8 text-[#291C14]">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 text-[#825638] hover:text-[#291C14] hover:bg-[#F3ECE2] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[#AA7248]">
          <Lock className="w-4 h-4" />
          <span>Sole Owner &amp; Seller Security</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#291C14] mb-2">
          Admin Google Login
        </h2>
        <p className="text-xs text-[#825638] leading-relaxed mb-6">
          Access to product management, purchase requests, and delivery settings is strictly restricted to the authorized sole proprietor Google account.
        </p>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-xs text-red-800 flex gap-2 items-start">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold">Security Authorization Failed</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSimulateGoogleLogin} className="space-y-4">
          <div className="p-4 bg-[#FAF8F5] border border-[#E7D8C9] space-y-3">
            <div className="text-xs font-medium text-[#5C3E29]">
              Configured Authorized Owner Account:
            </div>
            <div className="flex items-center justify-between text-xs font-mono bg-white px-3 py-2 border border-[#E7D8C9]">
              <span className="font-semibold text-[#291C14]">{supportSettings.authorizedAdminEmail}</span>
              <span className="text-[10px] uppercase font-sans text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                Primary Owner
              </span>
            </div>

            <div className="pt-2 border-t border-[#E7D8C9] text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#3E291C]">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="rounded border-[#AA7248] text-[#5C3E29] focus:ring-[#5C3E29]"
                />
                <span>Test unauthorized account rejection</span>
              </label>
            </div>

            {useCustom && (
              <div className="pt-1">
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. random_user@gmail.com"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3 px-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#291C14] hover:bg-[#1B130E] transition-colors disabled:opacity-75"
          >
            {/* Google G icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isAuthenticating ? 'Authenticating with Google...' : 'Sign In with Authorized Google Account'}</span>
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-[#825638]">
          Protected by Shree Ganeshnath Security Policy. Public registration disabled.
        </p>
      </div>
    </div>
  );
};
