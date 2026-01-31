
import React, { useState } from 'react';
import { RamadanDay } from '../types';
import { Icons, CARETAKER_NAME } from '../constants';

interface BookingModalProps {
  day: RamadanDay;
  onClose: () => void;
  onConfirm: (name: string, phone: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ day, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const dateStr = day.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone && acceptedTerms) {
      onConfirm(name, phone);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-emerald-700 px-6 py-6 text-white relative">
             <button onClick={onClose} className="absolute top-4 right-4 text-emerald-200 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
             <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-200">Confirming Slot for</h3>
             <p className="text-2xl font-extrabold mt-1">{dateStr}</p>
             <p className="text-emerald-100 text-sm font-medium opacity-90 mt-1">Ramadan Day {day.dayNumber}</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Your Full Name</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="e.g. Ahmed Ali"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Contact Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="e.g. 07700 900000"
                />
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <div className="flex space-x-3 items-start">
                  <div className="text-amber-500 mt-0.5">
                    <Icons.Alert />
                  </div>
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <p className="font-bold mb-1">Important Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Expected attendance: <strong>{day.expectedAttendance} people</strong>.</li>
                      <li>You must clear away all leftovers - no food left on site.</li>
                      <li>Please assist <strong>{CARETAKER_NAME}</strong> with setup and serving.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 mt-4">
                <input 
                  id="terms" 
                  type="checkbox" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer" 
                  required
                />
                <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer font-medium">
                  I agree to provide the catering and ensure the premises are cleared and tidied after Iftar as per the guidelines.
                </label>
              </div>
            </div>

            <div className="mt-8 flex space-x-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-6 py-4 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!acceptedTerms}
                className={`flex-1 px-6 py-4 text-sm font-bold text-white rounded-xl transition-all shadow-lg ${acceptedTerms ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-300 cursor-not-allowed'}`}
              >
                Confirm Slot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
