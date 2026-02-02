
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
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsStandalone(isStandaloneMode);

        // Detect iOS (simpler check usually suffices but sticking to previous logic)
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(iOS);

        // Listen for install prompt (Android/Chrome)
        const promptHandler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        // Listen for successful install event (Global)
        const installHandler = () => {
            setDeferredPrompt(null);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 4000); // Show success for 4 seconds then close
        };

        window.addEventListener('beforeinstallprompt', promptHandler);
        window.addEventListener('appinstalled', installHandler);

        return () => {
            window.removeEventListener('beforeinstallprompt', promptHandler);
            window.removeEventListener('appinstalled', installHandler);
        };
    }, [onClose]);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                // Trigger success UI explicitly to ensure user sees it
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 4000);
            }
        }
    };

    if (!isVisible || isStandalone) return null;

    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-300">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center animate-in zoom-in-50 duration-500">
                    <img
                        src="/logo.png"
                        alt="App Icon"
                        className="w-40 h-40 rounded-[2.5rem] shadow-lg mb-6 animate-pulse"
                    />
                    <h3 className="text-4xl font-black text-emerald-900 uppercase tracking-tight mb-2">App Installed!</h3>
                    <p className="text-2xl font-bold text-slate-500">Look for this icon on your screen.</p>
                </div>
            </div>
        );
    }

    // Manual iOS or Fallback
    if (!isIOS && !deferredPrompt) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-none p-4 pb-24 md:pb-6">
            <div className="bg-white/95 backdrop-blur-2xl border border-white/60 p-8 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] w-full max-w-lg pointer-events-auto animate-in slide-in-from-bottom duration-500 ring-1 ring-black/10 relative overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 bg-slate-100 hover:bg-slate-200 text-slate-500 p-3 rounded-full transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="flex gap-8 items-start">
                    <div className="bg-emerald-100/50 p-8 rounded-[2.5rem] text-emerald-600 shadow-sm hidden md:block">
                        <div className="scale-[3]"><Icons.Alert /></div>
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="text-slate-900 font-black text-6xl uppercase tracking-tighter mb-8 leading-[0.9]">Save App?</h3>
                        <div className="text-slate-600 text-4xl font-bold leading-tight mb-10">
                            Add to Home Screen for easier access?
                            <div className="mt-8 p-6 bg-slate-100 rounded-3xl border-2 border-slate-200">
                                <span className="text-3xl text-slate-600 font-bold block italic leading-snug">
                                    Samsung Users: Check "App Library" if icon doesn't appear.
                                </span>
                            </div>
                        </div>

                        {isIOS ? (
                            <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-200 text-3xl font-bold text-slate-600 space-y-8">
                                <p className="flex items-center gap-6">
                                    <span className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center text-blue-600 scale-125">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    </span>
                                    Tap <span className="text-slate-900 font-black uppercase">Share</span>
                                </p>
                                <p className="flex items-center gap-6">
                                    <span className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center scale-125">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                                    </span>
                                    Tap <span className="text-slate-900 font-black uppercase">Add to Home Screen</span>
                                </p>
                            </div>
                        ) : deferredPrompt ? (
                            <button
                                onClick={handleInstallClick}
                                className="w-full py-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-4xl rounded-[3rem] shadow-2xl shadow-emerald-500/40 transition-all active:scale-95"
                            >
                                Install Now
                            </button>
                        ) : (
                            <p className="text-slate-400 text-2xl italic text-center py-6 font-bold">
                                Check browser menu for "Install" option.
                            </p>
                        )}

                        <button
                            onClick={onClose}
                            className="mt-10 w-full py-6 text-slate-400 font-black uppercase tracking-widest text-2xl hover:text-slate-600"
                        >
                            No Thanks
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
