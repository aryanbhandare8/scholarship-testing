import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, Mail } from 'lucide-react';
import { Scholarship } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarship: Scholarship;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, scholarship }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareText = `Check out the ${scholarship.title} offering ${scholarship.amountFormatted} on Scholarship Finder!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${currentUrl}`)}`, '_blank');
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(scholarship.title)}&body=${encodeURIComponent(`${shareText}\n\nApply here: ${currentUrl}`)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Share Opportunity</h3>
            <p className="text-xs text-slate-500">Spread the word to fellow students.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={handleWhatsApp}
            className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-800 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-[11px] font-bold">WhatsApp</span>
          </button>

          <button
            onClick={handleTwitter}
            className="p-3 rounded-2xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-sky-800 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-5 h-5 text-sky-600" />
            <span className="text-[11px] font-bold">Twitter</span>
          </button>

          <button
            onClick={handleEmail}
            className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Mail className="w-5 h-5 text-slate-600" />
            <span className="text-[11px] font-bold">Email</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 p-1.5 pl-3 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-xs text-slate-500 truncate flex-1">{currentUrl}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
