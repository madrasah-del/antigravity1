import React, { useState, useEffect } from 'react';
import { RamadanDay, Booking } from './types';
import { Icons, CARETAKER_NAME } from './constants';
import { formatPhoneNumber } from './utils';

interface BookingModalProps {
  day: RamadanDay;
  type: 'iftar' | 'suhoor';
  initialData?: Booking;
  currentSessionId: string;
  isAdmin: boolean;
  onClose: () => void;
  onConfirm: (name: string, phone: string, food: string) => void;
  onDelete: (id: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ day, type, initialData, currentSessionId, isAdmin, onClose, onConfirm, onDelete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [food, setFood] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Determine if the current user is the owner of the booking or an admin
  const isOwner = isAdmin || !initialData || initialData.bookedBySessionId === currentSessionId;

  useEffect(() => {
    if (showDeleteConfirm && modalRef.current) {
      // scroll to bottom smoothly
      setTimeout(() => {
        modalRef.current?.scrollTo({ top: modalRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, [showDeleteConfirm]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhone(formatPhoneNumber(initialData.phone));
      setFood(initialData.foodDetails || '');
      setAcceptedTerms(true);
    }
  }, [initialData]);

  const dateStr = day.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', weekday: 'long' });
  const isSuhoor = type === 'suhoor';

  // Use the ID from the existing booking if available, otherwise calculate it
  const slotId = initialData?.id || (day.dayNumber === 27 ? `${day.date.toISOString().split('T')[0]}_${type}` : day.date.toISOString().split('T')[0]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isOwner) {
      setPhone(formatPhoneNumber(e.target.value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOwner && name && phone && acceptedTerms) {
      const finalFood = food.trim() || "To be confirmed";
      onConfirm(name, phone, finalFood);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div ref={modalRef} className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-white/50 max-h-[90vh] overflow-y-auto animate-in relative z-10 ring-1 ring-black/5">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 bg-white/50 backdrop-blur-sm text-slate-500 p-3 rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-sm border border-slate-200/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className={`relative p-10 text-white overflow-hidden ${isSuhoor ? 'bg-gradient-to-br from-amber-500 to-amber-700' : 'bg-gradient-to-br from-emerald-600 to-emerald-800'}`}>
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Icons.Lock />
          </div>

          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2 flex items-center gap-2">
            {!isOwner ? 'Booking Details' : initialData ? 'Update Details' : 'Book Catering'}
            <span className="w-10 h-[1px] bg-white/50"></span>
          </h3>
          <p className="text-3xl md:text-4xl font-black leading-none uppercase tracking-tighter font-serif">{dateStr}</p>
          <p className="mt-4 inline-flex items-center gap-2 bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 shadow-inner">
            <Icons.Clock />
            <span>{type === 'iftar' ? 'Iftar Slot' : 'Suhoor Slot'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white">
          {!isOwner && (
            <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200 text-slate-600 flex gap-4 text-sm font-bold items-center">
              <div className="text-slate-400 scale-125"><Icons.Lock /></div>
              <p>This slot is already booked. You can contact the sponsor below.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <label className="text-sm font-black uppercase text-slate-400 tracking-widest pl-1">Sponsor Name</label>
              <input
                required
                readOnly={!isOwner}
                type="text"
                value={name}
                onChange={(e) => isOwner && setName(e.target.value)}
                className={`w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none font-bold text-slate-800 text-3xl transition-all placeholder:font-normal placeholder:text-slate-300 ${isOwner ? 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10' : 'opacity-70 cursor-not-allowed'}`}
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-black uppercase text-slate-400 tracking-widest pl-1">Contact Phone</label>
              <input
                required
                readOnly={!isOwner}
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className={`w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none font-bold text-slate-800 text-3xl transition-all placeholder:font-normal placeholder:text-slate-300 ${isOwner ? 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10' : 'opacity-70 cursor-not-allowed'}`}
                placeholder="07xxx xxx xxx"
              />
              {initialData && (
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      const cleanPhone = phone.replace(/\s+/g, '');
                      window.open(`https://wa.me/${cleanPhone.replace(/^0/, '44')}?text=Salaam ${name}, contacting you regarding your booking.`, '_blank');
                    }}
                    className="flex-1 py-4 px-6 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-2xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-[#25D366]/20"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.href = `tel:${phone}`}
                    className="flex-1 py-4 px-6 bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white rounded-2xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <Icons.Phone />
                    Call
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black uppercase text-slate-400 tracking-widest pl-1">Catering Details</label>
            <textarea
              // required removed to make optional
              readOnly={!isOwner}
              rows={3}
              value={food}
              onChange={(e) => isOwner && setFood(e.target.value)}
              className={`w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none font-medium text-3xl text-slate-800 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none ${isOwner ? 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10' : 'opacity-70 cursor-not-allowed'}`}
              placeholder="e.g. 2 Pots of Lamb Biryani, 50 cartons of juice, Fruit platter..."
            />
          </div>

          <div className="bg-amber-100 p-6 rounded-3xl border border-amber-200 text-amber-900 flex gap-5 items-start">
            <div className="mt-1 text-amber-600 scale-150"><Icons.Alert /></div>
            <div>
              <strong className="block text-lg font-black uppercase tracking-wider mb-2 text-amber-700">Food Safety Notice</strong>
              <p className="text-xl font-bold leading-relaxed">
                Sponsors must clearly label any foods containing <strong>nuts, gluten, or lactose</strong> and inform the serving teams before Iftar begins.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-slate-600 leading-relaxed font-bold relative overflow-hidden">
            <p className="mb-6 uppercase tracking-wider text-slate-800 font-black text-2xl flex items-center gap-3 border-b-4 border-slate-200 pb-4 underline decoration-4 underline-offset-4 decoration-emerald-500/30">
              <div className="scale-125"><Icons.Check /></div>
              EEIS Iftar Rules
            </p>
            <ul className="text-lg text-slate-700 space-y-4 font-bold bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <li className="flex gap-3"><span className="text-emerald-500 text-2xl">✦</span> <span>Arrive <strong>ONE HOUR</strong> early for parking & setup.</span></li>
              <li className="flex gap-3"><span className="text-emerald-500 text-2xl">✦</span> <span>Assist with <strong>SERVING</strong> and <strong>CLEARING</strong>.</span></li>
              <li className="flex gap-3"><span className="text-emerald-500 text-2xl">✦</span> <span>Remove <strong>ALL</strong> waste & leftovers same-day.</span></li>
            </ul>
          </div>

          {isOwner && (
            <label className="flex items-start space-x-4 cursor-pointer group p-4 rounded-2xl border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-all">
              <div className={`mt-1 w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${acceptedTerms ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                {acceptedTerms && <div className="scale-150"><Icons.Check /></div>}
              </div>
              <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="hidden" required />
              <span className="text-xl font-bold text-slate-600 uppercase tracking-tight group-hover:text-slate-800 transition-colors leading-relaxed pt-2">I confirm I have read the rules and will arrive early to help serve and clear away.</span>
            </label>
          )}

          <div className="flex flex-col gap-3 pt-2">
            {!isOwner ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full p-4 font-black uppercase text-sm tracking-[0.2em] text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-[2rem] transition-all"
              >
                Close
              </button>
            ) : !showDeleteConfirm ? (
              <>
                <button
                  type="submit"
                  disabled={!acceptedTerms}
                  className={`w-full p-5 font-black uppercase text-sm tracking-[0.2em] text-white rounded-[2rem] shadow-xl transform transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${acceptedTerms ? (isSuhoor ? 'bg-gradient-to-r from-amber-500 to-amber-700 shadow-amber-500/25 hover:shadow-amber-500/40' : 'bg-gradient-to-r from-emerald-600 to-emerald-800 shadow-emerald-600/25 hover:shadow-emerald-600/40') : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'}`}>
                  <Icons.Check />
                  <span>{initialData ? 'Update Booking' : 'Confirm & Book'}</span>
                </button>

                {initialData && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full p-5 font-black uppercase text-base tracking-[0.2em] text-red-600 border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 rounded-full transition-all mt-2"
                  >
                    Cancel Sponsorship
                  </button>
                )}
              </>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 pt-4">
                <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[2rem] text-center">
                  <p className="text-red-800 font-black text-3xl uppercase tracking-tight mb-2">Are you sure?</p>
                  <p className="text-red-600 text-sm font-bold uppercase tracking-widest opacity-80">This action cannot be undone.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full p-5 font-black uppercase text-xl tracking-widest text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-[2rem] transition-all"
                  >
                    Keep It
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(slotId)}
                    className="w-full p-5 font-black uppercase text-xl tracking-widest text-white bg-red-600 hover:bg-red-700 shadow-xl shadow-red-500/30 rounded-[2rem] transition-all scale-105"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;