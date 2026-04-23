import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Trophy, Flame, Target, Star, Brain, Mic2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { GermanLevel } from '@/src/types';
import { useAuth } from '../contexts/AuthContext';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const levels: { id: GermanLevel; description: string; color: string }[] = [
  { id: 'A1', description: 'Beginner', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-50' },
  { id: 'A2', description: 'Elementary', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-emerald-100' },
  { id: 'B1', description: 'Intermediate', color: 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-indigo-50' },
  { id: 'B2', description: 'Upper-Intermediate', color: 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-200' },
  { id: 'C1', description: 'Advanced', color: 'bg-slate-800 text-white border-slate-700 shadow-slate-200' },
  { id: 'C2', description: 'Mastery', color: 'bg-black text-white border-black shadow-slate-900' },
];

export default function Dashboard() {
  const { userProfile, user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<GermanLevel>(userProfile?.level || 'B2');
  
  const displayName = userProfile?.displayName || user?.displayName?.split(' ')[0] || 'Student';

  const handleLevelChange = async (level: GermanLevel) => {
    setSelectedLevel(level);
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          level,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.error("Failed to update level:", e);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section - High Density Style */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Active Scenario</span>
            <span className="text-[10px] text-slate-400 font-medium">Mock Interview at BMW Group</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
            Guten Tag, <span className="text-indigo-600">{displayName}</span>.
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Your use of <span className="font-bold text-slate-700">Konjunktiv II</span> has improved by 20% this week. 
            Ready to tackle today's business presentation module?
          </p>
          <div className="flex gap-3 pt-2">
            <Link to="/practice?mode=career&topic=Business%20Presentation" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-lg font-bold text-white transition-all text-sm shadow-lg shadow-indigo-100">
              Resume Session
            </Link>
            <Link to="/practice?mode=general&topic=Practice%20History" className="bg-white hover:bg-slate-50 px-6 py-2.5 rounded-lg font-bold text-slate-700 border border-slate-200 transition-all text-sm flex items-center justify-center">
              Practice History
            </Link>
          </div>
        </div>
        <div className="shrink-0 w-48 h-48 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
          <Brain className="w-24 h-24 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute bottom-4 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">AI Ready</span>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Learning Path</h2>
            <div className="flex gap-1">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelChange(level.id)}
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-black transition-all border shadow-sm",
                    selectedLevel === level.id 
                      ? "ring-2 ring-indigo-500 ring-offset-2 scale-110 z-10" 
                      : "opacity-40 hover:opacity-100 hover:scale-105",
                    level.color
                  )}
                >
                  {level.id}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              title="Daily Vocabulary" 
              subtitle="Focus: The Office & Project Management" 
              icon={Target}
              progress={65}
              color="text-indigo-600"
              bgColor="bg-indigo-50"
              link="/practice?mode=general&topic=Office%20Vocabulary"
            />
            <Card 
              title="Grammar Focus" 
              subtitle="Mastering Passive Voice in Business" 
              icon={Brain}
              progress={32}
              color="text-emerald-600"
              bgColor="bg-emerald-50"
              link="/practice?mode=general&topic=Passive%20Voice"
            />
          </div>

          <Link to="/exams" className="block p-6 rounded-xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Next Milestone</h3>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Goethe-Zertifikat B2 Preparation</p>
                </div>
              </div>
              <span className="bg-white/10 text-indigo-300 text-[10px] font-black px-2 py-1 rounded">82% READY</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Complete 3 more conversation roleplays with <span className="text-indigo-400 font-bold">Anja</span> to unlock the full B2 Mock Exam suite.
            </p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
            </div>
          </Link>
        </section>

        {/* Right Column */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Global Standings</h2>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-xs uppercase tracking-tight">Daily Leaderboard</h3>
              <Link to="/career" className="text-[10px] font-bold text-indigo-600 underline">VIEW ALL</Link>
            </div>
            <Achievement 
              icon={Trophy} 
              title="Top 3% This Week" 
              desc="8.4k Points earned in B2 Practice" 
              completed
            />
            <Achievement 
              icon={Mic2} 
              title="Clarity King" 
              desc="98% Pronunciation score on complex sentences" 
              progress={70}
            />
            <Achievement 
              icon={Star} 
              title="Vocab Specialist" 
              desc="Mastered 42 new Business German terms" 
              progress={24}
            />
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Recommendation</p>
                <p className="text-xs italic text-slate-600">"Your fluency peaks between 8am and 10am. Schedule your next live session for tomorrow morning."</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({ title, subtitle, icon: Icon, progress, color, bgColor, link }: any) {
  return (
    <Link to={link || '/practice'} className="group text-left p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col h-full ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110", bgColor, color)}>
        <Icon className="w-5 h-5 font-black" />
      </div>
      <h3 className="font-bold text-sm tracking-tight text-slate-900">{title}</h3>
      <p className="text-slate-500 text-[10px] mb-4 flex-1">{subtitle}</p>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div style={{ width: `${progress}%` }} className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", color.replace('text', 'bg'))} />
      </div>
    </Link>
  );
}

function Achievement({ icon: Icon, title, desc, completed, progress }: any) {
  return (
    <div className="flex gap-4 group">
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
        completed ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400 border border-slate-100 shadow-inner"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-xs tracking-tight">{title}</h4>
        <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
        {!completed && progress && (
          <div className="w-full h-1 bg-slate-100 rounded-full mt-2">
            <div style={{ width: `${progress}%` }} className="h-full bg-indigo-500 rounded-full shadow-[0_0_4px_rgba(99,102,241,0.5)]" />
          </div>
        )}
      </div>
    </div>
  );
}

