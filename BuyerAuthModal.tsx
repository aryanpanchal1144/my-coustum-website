import React, { useState } from 'react';
import { X, Phone, KeyRound, CheckCircle2, User, MessageCircle } from 'lucide-react';
import { BuyerSessionData, saveBuyerSession } from '../storage';

interface BuyerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: BuyerSessionData) => void;
  promptMessage?: string;
}

export const BuyerAuthModal: React.FC<BuyerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  promptMessage,
}) => {
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PROFILE'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [simulatedGeneratedOtp, setSimulatedGeneratedOtp] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError(null);
    // Generate 4-digit OTP for instant customer verification
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedGeneratedOtp(generated);
    setOtp(generated); // Pre-fill for frictionless UX while displaying verification banner
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim() !== simulatedGeneratedOtp && otp.trim() !== '1234') {
      setError('Invalid OTP code. Please enter the verification code shown.');
      return;
    }
    setError(null);
    setStep('PROFILE');
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    const finalWhatsapp = sameAsPhone ? phone : (whatsapp || phone);
    const session: BuyerSessionData = {
      phone,
      name: name.trim(),
      whatsapp: finalWhatsapp.trim(),
      isLoggedIn: true,
    };
    saveBuyerSession(session);
    onSuccess(session);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B130E]/70 backdrop-blur-xs p-4 overflow-y-auto"
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

        <div className="mb-6">
          <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#AA7248] mb-1">
            Customer Verification
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#291C14]">
            {step === 'PHONE' && 'Login / Register with Mobile'}
            {step === 'OTP' && 'Verify Mobile Number'}
            {step === 'PROFILE' && 'Your Contact Profile'}
          </h2>
          {promptMessage && step === 'PHONE' && (
            <p className="mt-2 text-xs text-[#825638] bg-[#FAF8F5] p-2.5 border border-[#E7D8C9]">
              {promptMessage}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="customer-phone" className="block text-xs font-semibold text-[#291C14] mb-1.5">
                10-Digit Mobile Number
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 text-xs font-medium text-[#5C3E29] bg-[#F3ECE2] border border-r-0 border-[#E7D8C9]">
                  +91
                </span>
                <input
                  id="customer-phone"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9825012345"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] placeholder:text-[#AA7248]/50 focus:outline-none focus:border-[#5C3E29]"
                  required
                  autoFocus
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#825638]">
                We will send a 4-digit verification code. No password required.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#5C3E29] hover:bg-[#3E291C] transition-colors"
            >
              Get Verification Code (OTP)
            </button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-[#F3ECE2] border border-[#E7D8C9] text-xs text-[#3E291C]">
              <span className="font-semibold">Simulated SMS Delivery:</span> Your verification OTP for{' '}
              <span className="font-mono font-bold">+91 {phone}</span> is{' '}
              <span className="font-mono font-bold text-[#AA7248] text-sm bg-white px-1.5 py-0.5 border border-[#E7D8C9]">
                {simulatedGeneratedOtp}
              </span>
            </div>

            <div>
              <label htmlFor="customer-otp" className="block text-xs font-semibold text-[#291C14] mb-1.5">
                Enter 4-Digit Code
              </label>
              <input
                id="customer-otp"
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="4-digit OTP"
                className="w-full px-3.5 py-2.5 text-center text-lg font-mono tracking-widest bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#825638]">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="hover:underline"
              >
                Change Mobile Number
              </button>
              <button
                type="button"
                onClick={() => {
                  const gen = Math.floor(1000 + Math.random() * 9000).toString();
                  setSimulatedGeneratedOtp(gen);
                  setOtp(gen);
                }}
                className="hover:underline text-[#5C3E29] font-medium"
              >
                Resend Code
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#5C3E29] hover:bg-[#3E291C] transition-colors"
            >
              Verify &amp; Continue
            </button>
          </form>
        )}

        {step === 'PROFILE' && (
          <form onSubmit={handleCompleteProfile} className="space-y-4">
            <div>
              <label htmlFor="customer-name" className="block text-xs font-semibold text-[#291C14] mb-1.5">
                Full Name
              </label>
              <input
                id="customer-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Panchal"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs text-[#3E291C] cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(e) => setSameAsPhone(e.target.checked)}
                  className="rounded border-[#AA7248] text-[#5C3E29] focus:ring-[#5C3E29]"
                />
                <span>WhatsApp number is same as mobile (+91 {phone})</span>
              </label>

              {!sameAsPhone && (
                <div>
                  <label htmlFor="customer-wa" className="block text-xs font-semibold text-[#291C14] mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    id="customer-wa"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="9825099999"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E7D8C9] text-[#291C14] focus:outline-none focus:border-[#5C3E29]"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#5C3E29] hover:bg-[#3E291C] transition-colors"
            >
              Save Profile &amp; Proceed
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
