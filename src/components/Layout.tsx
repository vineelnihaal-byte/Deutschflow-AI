import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Mic2, Briefcase, GraduationCap, Home, Settings, LogOut, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Mic2, label: 'Practice', path: '/practice' },
    { icon: GraduationCap, label: 'Exams', path: '/exams' },
    { icon: Briefcase, label: 'Career', path: '/career' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shrink-0 shadow-2xl relative z-20">
        <div className="p-8 space-y-8 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter uppercase italic text-white">DeutschFlow</h1>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block -mt-1">PREMIUM ACCESS</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all group uppercase tracking-widest",
                  location.pathname === item.path
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  location.pathname === item.path ? "text-white" : "text-indigo-400/60"
                )} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-8 border-t border-slate-800">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Quick Stats</h3>
            <Link to="/practice?mode=general&topic=Daily%20Goals" className="space-y-4 block group">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Daily Goal</span>
                <span className="text-xs font-black text-indigo-400">82%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[82%] h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] group-hover:bg-indigo-400 transition-all" />
              </div>
            </Link>
          </div>
        </div>

        {/* User Profile Area */}
        <div className="p-4 bg-slate-800/50 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-slate-700 shadow-xl overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate uppercase tracking-tight">{userProfile?.displayName || user?.displayName || 'Student'}</p>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Level {userProfile?.level || 'A1'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link 
              to="/practice?mode=general&topic=Profile%20Settings"
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white group border border-transparent"
            >
              <Settings className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest text-inherit">Set</span>
            </Link>
            <button 
              onClick={logout}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-800 hover:bg-rose-900/30 transition-colors text-slate-400 hover:text-rose-400 group border border-transparent hover:border-rose-900/50"
            >
              <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest text-inherit">Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 bg-slate-900 text-white p-4 flex items-center justify-between z-30 shadow-lg border-b border-indigo-900/20">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h1 className="font-black text-sm tracking-tighter uppercase italic">DeutschFlow</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-500 border border-slate-700 overflow-hidden">
             {user?.photoURL && <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />}
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-indigo-900/20 px-6 py-4 flex justify-between items-center z-30 backdrop-blur-md bg-opacity-95">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                location.pathname === item.path ? "text-indigo-400 scale-110" : "text-slate-500"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em]">{item.label.slice(0, 4)}</span>
            </Link>
          ))}
          <button 
            onClick={logout}
            className="flex flex-col items-center gap-1 text-slate-500"
          >
             <LogOut className="w-5 h-5" />
             <span className="text-[9px] font-black uppercase tracking-[0.1em]">Exit</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
