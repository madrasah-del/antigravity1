
import React from 'react';
import { RamadanDay, ViewMode } from '../types';
import { Icons } from '../constants';

interface DayCardProps {
  day: RamadanDay;
  viewMode: ViewMode;
  sessionId: string;
  onSelect: () => void;
  onUnbook: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, viewMode, sessionId, onSelect, onUnbook }) => {
  const isBooked = !!day.booking;
  const isOwnBooking = day.booking?.bookedBySessionId === sessionId;
  const isLastTen = day.dayNumber >= 21 && day.dayNumber <= 30;
  
  const dayName = day.date.toLocaleDateString('en-GB', { weekday: 'long' });
  const dateNum = day.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  
  return (
    <div className={`
      relative p-8 rounded-[40px] shadow-sm border-2 transition-all duration-500 flex flex-col min-h-[280px]
      ${isBooked 
        ? 'bg-slate-50 border-slate-100 opacity-90' 
        : 'bg-white border-white hover:border-emerald-300 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] cursor-pointer group hover:-translate-y-1'}
      ${day.isWeekend && !isBooked ? 'ring-8 ring-amber-50 border-amber-200 bg-gradient-to-br from-white to-amber-50/30' : ''}
      ${isLastTen && !isBooked ? 'border-emerald-100 bg-emerald-50/20' : ''}
    `}
    onClick={() => !isBooked && onSelect()}
    >
      {/* Badges */}
      <div className="absolute top-6 right-6 flex flex-col items-end space-y-2">
        {day.isWeekend && (
          <div className="bg-amber-600 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.15em] shadow-lg animate-pulse">
            High Volume
          </div>
        )}
        {isLastTen && (
          <div className="bg-emerald-700 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.15em] shadow-lg">
            Last 10 Nights
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isLastTen ? 'text-emerald-700' : 'text-slate-400'}`}>
          Ramadan Day {day.dayNumber}
        </h3>
        <p className="flex flex-col">
          <span className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">{dayName}</span>
          <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none mt-1">{dateNum}</span>
        </p>
      </div>

      <div className={`flex items-center space-x-5 p-5 rounded-[24px] mb-8 ${day.isWeekend ? 'bg-amber-100/50 border border-amber-200' : 'bg-slate-100/60 border border-slate-200'}`}>
        <div className={`p-3 rounded-2xl shadow-sm ${day.isWeekend ? 'bg-amber-600 text-white' : 'bg-emerald-800 text-white'}`}>
          <Icons.Users />
        </div>
        <div>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Guests</p>
          <p className={`text-2xl font-black leading-none ${day.isWeekend ? 'text-amber-900' : 'text-slate-900'}`}>
            {day.expectedAttendance}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        {isBooked ? (
          <div className="space-y-4">
            <div className={`flex items-center space-x-4 p-5 rounded-[28px] border-2 transition-all ${isOwnBooking ? 'bg-emerald-100 border-emerald-500 shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className={`rounded-full p-2 flex-shrink-0 ${isOwnBooking ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
                <Icons.Check />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 leading-none">
                  {isOwnBooking ? 'YOU' : 'SPONSORED BY'}
                </p>
                <p className="text-lg font-black text-slate-900 truncate leading-tight">{day.booking?.name}</p>
                
                {viewMode === ViewMode.ADMIN && (
                  <div className="mt-3 pt-3 border-t border-slate-200/50">
                    <a 
                      href={`tel:${day.booking?.phone}`} 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-2 text-emerald-800 font-black text-xs hover:underline"
                    >
                      <Icons.Phone />
                      <span className="font-mono tracking-tighter">{day.booking?.phone}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {(isOwnBooking || viewMode === ViewMode.ADMIN) && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onUnbook();
                }}
                className={`w-full py-5 text-[10px] font-black uppercase tracking-[0.25em] rounded-[24px] transition-all shadow-sm ${viewMode === ViewMode.ADMIN ? 'text-red-700 bg-red-50 border-2 border-red-200 hover:bg-red-100' : 'text-slate-500 bg-white border-2 border-slate-100'}`}
              >
                {viewMode === ViewMode.ADMIN ? 'Force Remove Slot' : 'Cancel My Slot'}
              </button>
            )}
          </div>
        ) : (
          <button className="w-full py-6 bg-emerald-800 text-white rounded-[28px] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-900/10 group-hover:bg-emerald-900 group-hover:scale-[1.02] active:scale-95 transition-all">
            Provide Iftar
          </button>
        )}
      </div>
    </div>
  );
};

export default DayCard;
