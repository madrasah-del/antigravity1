import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RamadanDay, Booking } from './types';
import { RAMADAN_START_DATE, TOTAL_DAYS, CARETAKER_NAME, CARETAKER_PHONE, Icons, SUPABASE_URL, SUPABASE_ANON_KEY, NOTIFICATION_EMAIL } from './constants';
import DayCard from './DayCard';
import BookingModal from './BookingModal';
import Header from './Header';
import ContactModal from './ContactModal';

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const SESSION_KEY = 'eeis_user_session';

const App: React.FC = () => {
  const [ramadanDays, setRamadanDays] = useState<RamadanDay[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ day: RamadanDay, type: 'iftar' | 'suhoor', existingBooking?: Booking } | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = Math.random().toString(36).substring(7);
      localStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);
    fetchData();
  }, []);

  const handleAdminLogin = () => {
    if (isAdmin) {
      if (confirm("Logout of Admin?")) setIsAdmin(false);
      return;
    }
    const password = prompt("Enter Admin Password:");
    if (password === "eeis") {
      setIsAdmin(true);
      alert("Admin Mode Enabled - You can now edit and delete any booking.");
    } else if (password) {
      alert("Incorrect Password");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    let bookings: Record<string, Booking> = {};

    if (supabase) {
      try {
        const { data, error } = await supabase.from('bookings').select('*');
        if (!error && data) {
          data.forEach((b: any) => {
            bookings[b.id] = {
              id: b.id,
              date: new Date(b.id.split('_')[0]),
              name: b.name,
              phone: b.phone,
              foodDetails: b.food_details,
              isBooked: true,
              bookedBySessionId: b.session_id,
              type: b.id.includes('suhoor') ? 'suhoor' : 'iftar'
            };
          });
        }
      } catch (e) {
        console.error("Supabase fetch error:", e);
      }
    }

    const days: RamadanDay[] = [];
    for (let i = 0; i < TOTAL_DAYS; i++) {
      const date = new Date(RAMADAN_START_DATE);
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const id = date.toISOString().split('T')[0];
      const dayNumber = i + 1;

      if (dayNumber === 27) {
        days.push({
          date,
          dayNumber,
          isWeekend,
          expectedAttendance: 75,
          iftarBooking: bookings[`${id}_iftar`],
          suhoorBooking: bookings[`${id}_suhoor`]
        });
      } else {
        days.push({
          date,
          dayNumber,
          isWeekend,
          expectedAttendance: isWeekend ? 75 : 25,
          booking: bookings[id]
        });
      }
    }
    setRamadanDays(days);
    setIsLoading(false);
  };

  const sendNotification = async (subject: string, body: string) => {
    if (!supabase) return;
    try {
      console.log("Sending email notification...");
      const { error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          subject,
          body,
          to: [NOTIFICATION_EMAIL]
        }
      });

      if (error) {
        console.error("Failed to send email:", error);
      } else {
        console.log("Email sent successfully");
      }
    } catch (err) {
      console.error("Error invoking email function:", err);
    }
  };

  const handleBooking = async (name: string, phone: string, food: string) => {
    if (!selectedSlot) return;
    const { day, type } = selectedSlot;
    const dateId = day.date.toISOString().split('T')[0];
    const finalId = day.dayNumber === 27 ? `${dateId}_${type}` : dateId;

    const isUpdate = !!selectedSlot.existingBooking;

    setSelectedSlot(null);

    if (supabase) {
      try {
        const { error } = await supabase.from('bookings').upsert([{
          id: finalId,
          name,
          phone,
          food_details: food,
          session_id: sessionId
        }]);

        if (error) {
          alert("Update failed. Please try again.");
          return;
        }
        await fetchData();

        const action = isUpdate ? 'UPDATED' : 'NEW';
        const dateStr = day.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
        const subject = `[Iftar Planner] Booking ${action}: ${dateStr} (${type})`;

        let changesStr = '';
        if (isUpdate && selectedSlot.existingBooking) {
          const old = selectedSlot.existingBooking;
          const changes: string[] = [];
          if (old.name !== name) changes.push(`- Name: "${old.name}" -> "${name}"`);
          if (old.phone !== phone) changes.push(`- Phone: "${old.phone}" -> "${phone}"`);
          if (old.foodDetails !== food) changes.push(`- Details: "${old.foodDetails}" -> "${food}"`);

          if (changes.length > 0) {
            changesStr = `\n\nCHANGES MADE:\n${changes.join('\n')}`;
          } else {
            changesStr = `\n\n(No details were changed, only confirmed)`;
          }
        }

        const body = `Booking Details:\n\nDate: ${dateStr}\nType: ${type}\nName: ${name}\nPhone: ${phone}\nDetails: ${food}${changesStr}\n\nProcessed via EEIS Planner.`;

        sendNotification(subject, body);

      } catch (err) {
        console.error("Booking error:", err);
      }
    }
  };

  const handleUnbook = async (dayId: string) => {
    // Capture booking details BEFORE clearing selection
    const bookingToDelete = selectedSlot?.existingBooking;

    setSelectedSlot(null);

    if (supabase) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', dayId);
        if (error) throw error;
        await fetchData();

        const subject = `[Iftar Planner] Booking CANCELLED: ${dayId}`;

        let detailsStr = '';
        if (bookingToDelete) {
          detailsStr = `\n\nCANCELLED BOOKING DETAILS:\nName: ${bookingToDelete.name}\nPhone: ${bookingToDelete.phone}\nFood: ${bookingToDelete.foodDetails}`;
        }

        const body = `The following booking has been cancelled completely.${detailsStr}\n\nSlot ID: ${dayId}`;
        sendNotification(subject, body);

      } catch (err: any) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  const bookedCount = ramadanDays.reduce((acc, d) => {
    if (d.dayNumber === 27) {
      return acc + (d.iftarBooking ? 1 : 0) + (d.suhoorBooking ? 1 : 0);
    }
    return acc + (d.booking ? 1 : 0);
  }, 0);

  const totalPossibleSlots = TOTAL_DAYS + 1;

  return (
    <div className="min-h-screen bg-slate-50 pb-40 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100 via-slate-50 to-white -z-10" />

      <Header />

      <main className="max-w-5xl mx-auto px-4 -mt-20 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-100/50 rounded-full animate-spin border-t-emerald-600 shadow-lg backdrop-blur-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              </div>
            </div>
            <p className="mt-8 text-emerald-800/80 font-bold uppercase tracking-[0.3em] text-xs animate-pulse">Syncing Calendar...</p>
          </div>
        ) : (
          <>
            {/* Stats Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] border border-emerald-100/50 p-8 md:p-10 mb-8 animate-in text-left mx-2 ring-1 ring-white/60">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                  <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none font-serif">
                    {bookedCount} <span className="text-slate-300 text-3xl md:text-4xl font-light">/ {totalPossibleSlots}</span>
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mt-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Community Iftars Planned
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-black px-8 py-5 rounded-[2rem] text-3xl shadow-[0_15px_30px_-10px_rgba(5,150,105,0.4)] flex items-baseline gap-1">
                  {Math.round((bookedCount / totalPossibleSlots) * 100)}
                  <span className="text-sm font-bold opacity-60">%</span>
                </div>
              </div>
              <div className="w-full bg-slate-100/80 h-4 rounded-full overflow-hidden p-[3px] shadow-inner ring-1 ring-slate-200/50">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden"
                  style={{ width: `${(bookedCount / totalPossibleSlots) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>

            {/* Policy Card */}
            <div className="bg-amber-50/80 backdrop-blur-md border border-amber-100/50 p-8 md:p-10 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(251,191,36,0.15)] mb-12 animate-in mx-2 text-left relative overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(251,191,36,0.2)] transition-all duration-500">
              <div className="absolute -top-10 -right-10 text-amber-500/10 transform rotate-12 transition-transform duration-700 group-hover:rotate-6 scale-150">
                <Icons.Alert />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-amber-100/80 rounded-2xl text-amber-700 shadow-sm">
                    <Icons.Alert />
                  </div>
                  <h3 className="text-slate-900 font-black text-2xl md:text-3xl uppercase tracking-tight font-serif">EEIS Iftar Rules</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6 text-slate-700 font-medium leading-relaxed bg-white/40 p-6 rounded-[2rem] border border-amber-100/50 shadow-sm text-justify">
                  <div className="space-y-4">
                    <p className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/50 transition-colors">
                      <span className="text-amber-500 text-xl">✦</span>
                      <span>Arrive <strong className="text-amber-700 font-black decoration-amber-300 underline underline-offset-2">ONE HOUR</strong> before Iftar for parking & setup</span>
                    </p>
                    <p className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/50 transition-colors">
                      <span className="text-amber-500 text-xl">✦</span>
                      <span>Assist with <strong className="text-amber-700 font-black">SERVING</strong> & <strong className="text-amber-700 font-black">CLEARING</strong></span>
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/50 transition-colors">
                      <span className="text-amber-500 text-xl">✦</span>
                      <span>Remove <strong className="text-amber-700 font-black">ALL</strong> waste & leftovers same-day</span>
                    </p>
                    <p className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/50 transition-colors">
                      <span className="text-amber-500 text-xl">✦</span>
                      <span>Coordinate with <strong className="text-amber-700 font-black">{CARETAKER_NAME}</strong></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in px-2">
              {ramadanDays.map((day) => (
                <DayCard
                  key={day.date.toISOString()}
                  day={day}
                  sessionId={sessionId}
                  onSelect={(type, booking) => setSelectedSlot({ day, type, existingBooking: booking })}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 md:p-8 z-50 flex justify-center pointer-events-none">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 p-2 md:p-2.5 rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] flex items-center pointer-events-auto hover:scale-105 transition-transform duration-300 ring-1 ring-black/5 relative">
          <button
            onClick={() => setShowContactModal(true)}
            className="bg-slate-900 text-white py-4 px-8 rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg hover:bg-emerald-800 transition-colors group"
          >
            <span className="bg-white/10 p-2 rounded-full group-hover:bg-emerald-500/20 transition-colors">
              <Icons.Phone />
            </span>
            <span>Contact {CARETAKER_NAME}</span>
          </button>
        </div>
      </footer>

      <button
        onClick={handleAdminLogin}
        className={`fixed bottom-4 left-4 z-50 p-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isAdmin ? 'bg-red-500 text-white shadow-lg' : 'text-slate-300 hover:text-emerald-600'}`}
      >
        {isAdmin ? 'Admin Active' : 'Admin'}
      </button>

      {selectedSlot && (
        <BookingModal
          day={selectedSlot.day}
          type={selectedSlot.type}
          initialData={selectedSlot.existingBooking}
          currentSessionId={sessionId}
          isAdmin={isAdmin}
          onClose={() => setSelectedSlot(null)}
          onConfirm={handleBooking}
          onDelete={handleUnbook}
        />
      )}

      {showContactModal && (
        <ContactModal
          name={CARETAKER_NAME}
          phone={CARETAKER_PHONE}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
};

export default App;