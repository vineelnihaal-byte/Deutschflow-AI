import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Sparkles, Languages } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
              <Languages className="w-8 h-8 text-indigo-400" />
            </div>
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase tracking-widest">
                 DeutschFlow v2.0
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                Willkommen
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Unlock your potential with immersive AI-powered German learning. Choose excellence, choose DeutschFlow.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={loginWithGoogle}
                className="w-full bg-slate-900 hover:bg-black text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl group"
              >
                <LogIn className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                Sign in with Google
              </button>
              
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-slate-100 flex-1" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Enterprise Standard Security</span>
                <div className="h-px bg-slate-100 flex-1" />
              </div>
              
              <p className="text-[10px] text-slate-400 leading-tight italic">
                "The only way to learn a language is to live it. Our AI brings the DACH region to you."
              </p>
            </div>
          </div>
          
          <div className="bg-slate-900 p-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Core Online</span>
            </div>
            <Sparkles className="w-4 h-4 text-indigo-500/50" />
          </div>
        </div>
        
        <div className="mt-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] space-y-2">
          <p>© 2026 DEUTSCHFLOW INTERACTIVE</p>
          <p>ENGINEERED FOR EXCELLENCE</p>
        </div>
      </div>
    </div>
  );
}
