
import React, { useState, useEffect } from 'react';
import { Icons } from './constants';

interface InstallPromptProps {
    isVisible: boolean;
    onClose: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ isVisible, onClose }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsStandalone(isStandaloneMode);

        // Detect iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(iOS);

        // Listen for install prompt (Android/Chrome)
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        }
    };

    if (!isVisible || isStandalone) return null;

    // NOTE: Removed the early return for (!isIOS && !deferredPrompt) so manual triggering works.
    // If we don't have a prompt or iOS, we show generic instructions.

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-none p-4 pb-24 md:pb-6">
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 p-6 rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] w-full max-w-md pointer-events-auto animate-in slide-in-from-bottom duration-500 ring-1 ring-black/5 relative overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-slate-100/50 hover:bg-slate-200 text-slate-400 p-2 rounded-full transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="flex gap-5 items-start">
                    <div className="bg-emerald-100/50 p-4 rounded-2xl text-emerald-600 shadow-sm">
                        <div className="scale-125"><Icons.Alert /></div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-slate-900 font-black text-lg uppercase tracking-tight mb-2">Save for easier access?</h3>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4">
                            Add this app to your home screen to find your bookings easily next time.
                        </p>

                        {isIOS ? (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-bold text-slate-500 space-y-2">
                                <p className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center text-blue-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    </span>
                                    Tap the <span className="text-slate-800 font-extrabold uppercase tracking-wide">Share</span> button
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    </span>
                                    Scroll down & tap <span className="text-slate-800 font-extrabold uppercase tracking-wide">Add to Home Screen</span>
                                </p>
                            </div>
                        ) : deferredPrompt ? (
                            <button
                                onClick={handleInstallClick}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                            >
                                Install App
                            </button>
                        ) : (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-bold text-slate-500 space-y-2">
                                <p className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                    </span>
                                    Tap your browser's <span className="text-slate-800 font-extrabold uppercase tracking-wide">Menu</span> button
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    </span>
                                    Select <span className="text-slate-800 font-extrabold uppercase tracking-wide">Install App</span> or <span className="text-slate-800 font-extrabold uppercase tracking-wide">Add to Home Screen</span>
                                </p>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="mt-3 w-full py-3 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
