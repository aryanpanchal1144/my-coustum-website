import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { JournalEssay } from '../data/architectureData';

interface JournalReaderModalProps {
  essay: JournalEssay | null;
  onClose: () => void;
}

export const JournalReaderModal: React.FC<JournalReaderModalProps> = ({
  essay,
  onClose,
}) => {
  useEffect(() => {
    if (!essay) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [essay, onClose]);

  if (!essay) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1419]/60 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="essay-title"
      onClick={onClose}
    >
      <article
        className="relative w-full max-w-2xl bg-white border border-[#E2E5E9] shadow-xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E5E9]">
          <div className="flex items-center gap-2 text-xs text-[#52555A]">
            <span>{essay.category}</span>
            <span aria-hidden="true">·</span>
            <span>{essay.date}</span>
            <span aria-hidden="true">·</span>
            <span>{essay.readTime}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close essay"
            className="p-2 text-[#52555A] hover:text-[#0F1419] hover:bg-[#F6F7F8] transition-colors focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-10 space-y-6 max-h-[80vh] overflow-y-auto">
          <h2
            id="essay-title"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F1419] text-balance"
          >
            {essay.title}
          </h2>
          <p className="text-base font-medium text-[#0F1419] leading-relaxed">
            {essay.excerpt}
          </p>
          <div className="h-px bg-[#E2E5E9]" />
          <div className="space-y-4 text-[15px] text-[#52555A] leading-[1.7]">
            {essay.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};
