import React, { useState } from 'react';
import { ACCESS_KEY } from '../utils/bracketLogic';
import { Lock, KeyRound, X } from 'lucide-react';

interface LockModalProps {
  isOpen: boolean;
  isLocked: boolean;
  onClose: () => void;
  onSuccessUnlock: () => void;
  onLock: () => void;
}

export const LockModal: React.FC<LockModalProps> = ({
  isOpen,
  isLocked,
  onClose,
  onSuccessUnlock,
  onLock,
}) => {
  const [inputKey, setInputKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLocked) {
      onLock();
      onClose();
      return;
    }

    if (inputKey === ACCESS_KEY) {
      setErrorMsg('');
      setInputKey('');
      onSuccessUnlock();
      onClose();
    } else {
      setErrorMsg('Key salah. Input tetap terkunci.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#16304f] border border-[#33517a] rounded-xl w-full max-w-md p-6 shadow-2xl relative text-[#eef3f8]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7d93b8] hover:text-[#eef3f8] p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#0c1f3a] border border-[#33517a] flex items-center justify-center text-[#d7ff4e]">
            {isLocked ? <KeyRound className="w-5 h-5 text-[#d7ff4e]" /> : <Lock className="w-5 h-5 text-[#ff6f57]" />}
          </div>
          <div>
            <h3 className="font-['Oswald',sans-serif] text-[18px] uppercase tracking-wide">
              {isLocked ? 'Buka Kunci Input' : 'Kunci Kembali Input'}
            </h3>
            <p className="text-[12px] text-[#7d93b8]">
              {isLocked
                ? 'Masukkan access key untuk mengubah skor & pemenang.'
                : 'Kunci kembali input agar tidak sengaja terubah.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {isLocked && (
            <div>
              <label className="block text-[12px] font-['JetBrains_Mono',monospace] text-[#7d93b8] mb-1.5 uppercase">
                Access Key
              </label>
              <input
                type="password"
                autoFocus
                placeholder="Masukkan key"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full bg-[#0c1f3a] border border-[#33517a] rounded-lg px-3.5 py-2 text-[14px] text-[#eef3f8] focus:outline-none focus:ring-2 focus:ring-[#d7ff4e] focus:border-[#d7ff4e]"
              />
              {errorMsg && (
                <p className="text-[12px] text-[#ff6f57] font-['JetBrains_Mono',monospace] mt-1.5">
                  {errorMsg}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-['JetBrains_Mono',monospace] text-[#7d93b8] hover:text-[#eef3f8] rounded-md transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[13px] font-['JetBrains_Mono',monospace] font-semibold uppercase bg-[#d7ff4e] text-[#0c1f3a] hover:bg-[#d7ff4e]/90 rounded-md shadow-md transition-all"
            >
              {isLocked ? 'Buka Kunci' : 'Kunci Input'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
