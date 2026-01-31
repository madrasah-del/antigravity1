import React from 'react';

export const SUPABASE_URL = 'https://mzofxwcyrlcnschwelto.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_YAuO6f3ymjNekQs7c2il8A_EUreMUGE';

export const RAMADAN_START_DATE = new Date('2026-02-18');
export const TOTAL_DAYS = 30;
export const ADMIN_PASSWORD = 'EEIS';
export const SOCIETY_EMAIL = 'Eeis@Hotmail.Co.Uk';
export const NOTIFICATION_EMAIL = 'madrasah@eeis.co.uk';
export const CARETAKER_NAME = 'Bhai Edoo';
export const CARETAKER_PHONE = '07413922062';

export const PRAYER_TIMES = [
  // ... existing prayer times array ...
  { day: 1, maghrib: "17:22", fajr: "05:28" }, { day: 2, maghrib: "17:24", fajr: "05:26" },
  { day: 3, maghrib: "17:26", fajr: "05:24" }, { day: 4, maghrib: "17:28", fajr: "05:22" },
  { day: 5, maghrib: "17:30", fajr: "05:20" }, { day: 6, maghrib: "17:32", fajr: "05:18" },
  { day: 7, maghrib: "17:34", fajr: "05:16" }, { day: 8, maghrib: "17:36", fajr: "05:14" },
  { day: 9, maghrib: "17:37", fajr: "05:12" }, { day: 10, maghrib: "17:39", fajr: "05:10" },
  { day: 11, maghrib: "17:41", fajr: "05:08" }, { day: 12, maghrib: "17:43", fajr: "05:06" },
  { day: 13, maghrib: "17:45", fajr: "05:04" }, { day: 14, maghrib: "17:47", fajr: "05:02" },
  { day: 15, maghrib: "17:49", fajr: "05:00" }, { day: 16, maghrib: "17:51", fajr: "04:58" },
  { day: 17, maghrib: "17:53", fajr: "04:56" }, { day: 18, maghrib: "17:55", fajr: "04:54" },
  { day: 19, maghrib: "17:57", fajr: "04:52" }, { day: 20, maghrib: "17:59", fajr: "04:50" },
  { day: 21, maghrib: "18:01", fajr: "04:48" }, { day: 22, maghrib: "18:03", fajr: "04:46" },
  { day: 23, maghrib: "18:04", fajr: "04:44" }, { day: 24, maghrib: "18:06", fajr: "04:42" },
  { day: 25, maghrib: "18:08", fajr: "04:40" }, { day: 26, maghrib: "18:10", fajr: "04:38" },
  { day: 27, maghrib: "18:12", fajr: "04:36" }, { day: 28, maghrib: "18:14", fajr: "04:34" },
  { day: 29, maghrib: "18:16", fajr: "04:32" }, { day: 30, maghrib: "18:18", fajr: "04:30" }
];

export const Icons = {
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
  )
};