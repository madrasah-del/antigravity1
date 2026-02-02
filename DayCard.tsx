import React from 'react';
import { RamadanDay, Booking } from './types';
import { Icons, PRAYER_TIMES } from './constants';

interface DayCardProps {
  day: RamadanDay;
  sessionId: string;
  onSelect: (type: 'iftar' | 'suhoor', existing?: Booking) => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, sessionId, onSelect }) => {
  const isLastTen = day.dayNumber >= 21;
  const is27thNight = day.dayNumber === 27;

  const dayName = day.date.toLocaleDateString('en-GB', { weekday: 'short' });
  const dateNum = day.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const prayerData = PRAYER_TIMES.find(p => p.day === day.dayNumber);
  const maghribTime = prayerData?.maghrib || "--:--";

  const calculateSuhoorTime = (fajrStr: string | undefined) => {
    if (!fajrStr) return "--:--";
    const [h, m] = fajrStr.split(':').map(Number);
    let totalMinutes = h * 60 + m - 45;
    if (totalMinutes < 0) totalMinutes += 1440;
    const hh = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const mm = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const suhoorTime = calculateSuhoorTime(prayerData?.fajr);

  const renderBookingSlot = (booking: Booking | undefined, type: 'iftar' | 'suhoor' = 'iftar', label?: string) => {
    const isBooked = !!booking;
    const displayTime = type === 'iftar' ? maghribTime : suhoorTime;

    return (
      <div className="mt-3 first:mt-0 flex-1 flex flex-col">
        {label && <p className="text-[10px] font-bold uppercase text-slate-500/80 tracking-widest mb-2 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-slate-400"></span>
          {label}
        </p>}
        {isBooked ? (
          <div className="flex-1 flex flex-col">
            <div
              className="group p-5 rounded-[2rem] border border-slate-200/60 bg-white/60 hover:bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden flex-1 flex flex-col"
              onClick={() => onSelect(type, booking)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] transform group-hover:scale-110 transition-transform">
                <Icons.Check />
              </div>

              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest leading-none">Sponsored</p>
                <div className="bg-slate-900/5 text-slate-700 text-base font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-200/50">
                  <Icons.Clock />
                  <span className="text-lg font-black">{displayTime}</span>
                </div>
              </div>

              <p className="text-2xl font-bold text-slate-800 leading-tight tracking-tight break-words font-serif mb-auto">
                {booking.name}
              </p>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {booking.foodDetails && (
                    <p className="text-xs font-medium text-emerald-800 bg-emerald-50/80 px-3 py-2 rounded-xl border border-emerald-100/50 truncate">
                      {booking.foodDetails}
                    </p>
                  )}
                </div>
                {/* Phone removed as per request - moved to modal */}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onSelect(type)}
            className={`w-full h-full min-h-[140px] py-6 px-4 rounded-[2.5rem] relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl border flex flex-col items-center justify-center gap-2 ${is27thNight || isLastTen
              ? 'bg-gradient-to-br from-amber-400 to-amber-500 border-amber-400/50 text-white shadow-amber-500/20'
              : 'bg-gradient-to-br from-emerald-900 to-emerald-950 border-emerald-900 text-white shadow-emerald-900/20'
              }`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${is27thNight || isLastTen ? 'bg-white/20' : 'bg-white/10'}`} />

            <div className="relative z-10 flex flex-col items-center text-center">
              <span className={`text-sm font-black uppercase tracking-widest mb-1 opacity-80 ${is27thNight || isLastTen ? 'text-white' : 'text-emerald-200'}`}>
                {is27thNight ? `Book ${type}` : 'Available'}
              </span>
              <span className="text-2xl md:text-3xl font-serif font-bold italic tracking-tighter text-white">
                Book Slot
              </span>
              <span className={`mt-2 text-xs font-bold px-3 py-1.5 rounded-full border ${is27thNight || isLastTen
                ? 'bg-white/20 border-white/20 text-white'
                : 'bg-emerald-800/50 border-emerald-700/50 text-emerald-100'
                }`}>
                {displayTime}
              </span>
            </div>
          </button>
        )}
      </div>
    );
  };

  const allSlotsBooked = is27thNight
    ? (!!day.iftarBooking && !!day.suhoorBooking)
    : (!!day.booking);

  return (
    <div className={`
      relative p-6 rounded-[3rem] transition-all duration-500 flex flex-col text-left group
      ${allSlotsBooked
        ? 'bg-slate-100/50 grayscale opacity-80 border border-transparent'
        : is27thNight
          ? 'bg-amber-50/80 backdrop-blur-xl border border-amber-100/50 shadow-[0_20px_40px_-15px_rgba(251,191,36,0.3)] hover:shadow-[0_30px_60px_-15px_rgba(251,191,36,0.4)] ring-1 ring-amber-400/20'
          : 'bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_50px_-20px_rgba(16,185,129,0.15)] ring-1 ring-white/50 hover:bg-white/80'
      }
    `}>
      {/* Date Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className={`text-base font-black uppercase tracking-widest mb-1 ${is27thNight ? 'text-amber-800' : isLastTen ? 'text-indigo-800' : 'text-slate-500'}`}>
            Ramadan Day {day.dayNumber}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-black tracking-tighter leading-none font-serif ${is27thNight ? 'text-amber-950' : 'text-slate-800'}`}>
              {dateNum.split(' ')[0]}
            </span>
            <span className={`text-lg font-bold uppercase tracking-wide ${is27thNight ? 'text-amber-700' : 'text-slate-500'}`}>
              {dayName}
            </span>
          </div>
        </div>

        {/* Attendance Pill */}
        <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl border backdrop-blur-sm ${is27thNight
          ? 'bg-amber-100/50 border-amber-200/50 text-amber-800'
          : 'bg-slate-50/50 border-slate-100 text-slate-500'
          }`}>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Expected</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black leading-none">{day.expectedAttendance}</span>
            <div className="w-4 h-4"><Icons.Users /></div>
          </div>
        </div>
      </div>

      {/* Slots */}
      <div className="mt-auto flex flex-col gap-3">
        {is27thNight ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            {renderBookingSlot(day.iftarBooking, 'iftar', 'Iftar')}
            {renderBookingSlot(day.suhoorBooking, 'suhoor', 'Suhoor')}
          </div>
        ) : (
          renderBookingSlot(day.booking)
        )}
      </div>
    </div>
  );
};

export default DayCard;