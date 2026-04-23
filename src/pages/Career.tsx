import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, MessageSquare, Handshake, FileSearch, ArrowRight, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

const scenarios = [
  {
    title: "Job Interview Mock",
    desc: "Practice answering common interview questions in German for your desired industry.",
    icon: UserCheck,
    difficulty: "Advanced",
    category: "Interview"
  },
  {
    title: "Project Meeting",
    desc: "Learn phrases for presenting ideas, disagreeing politely, and managing deadlines.",
    icon: Handshake,
    difficulty: "Intermediate",
    category: "Business"
  },
  {
    title: "Writing Professional Emails",
    desc: "Master formal greetings, out-of-office replies, and professional sign-offs.",
    icon: FileSearch,
    difficulty: "Beginner+",
    category: "Correspondence"
  },
  {
    title: "Salary Negotiation",
    desc: "Learn relevant vocabulary and cultural nuances for negotiating your contract.",
    icon: MessageSquare,
    difficulty: "Advanced",
    category: "Career Growth"
  }
];

export default function Career() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase tracking-widest">
          Career Path Accelerator
        </div>
        <h1 className="text-3xl font-black tracking-tight max-w-2xl text-slate-900 uppercase">
          DACH Region Success
        </h1>
        <p className="text-slate-500 text-sm max-w-3xl leading-relaxed">
          Tailored modules for professional success in Germany, Austria, and Switzerland. From corporate etiquette to advanced industry-specific terminology.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
        {scenarios.map((scene, idx) => (
          <motion.div
            key={idx}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ y: -2 }}
            className="group flex flex-col p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all h-full"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                <scene.icon className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-black border border-slate-100 px-2.5 py-1 rounded uppercase tracking-widest text-slate-400">
                {scene.difficulty}
              </span>
            </div>
            
            <h3 className="text-lg font-black mb-2 text-slate-900 tracking-tight">{scene.title}</h3>
            <p className="text-slate-500 text-xs line-clamp-3 mb-6 leading-relaxed">
              {scene.desc}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{scene.category}</span>
              <Link 
                to={`/practice?mode=career&topic=${encodeURIComponent(scene.title)}`}
                className="flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest group/btn text-slate-900 hover:text-indigo-600 transition-colors"
              >
                Start Lab
                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-slate-900 rounded-xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-6 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">Live Lab Active</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight uppercase">Interactive Interview Lab</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our AI simulates real HR managers from TOP German firms. 
            Get instant feedback on industry-specific vocabulary and cultural nuance.
          </p>
          <Link 
            to="/practice?mode=career&topic=HR%20Mock%20Interview"
            className="bg-white text-slate-900 px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all inline-flex items-center gap-3 shadow-xl"
          >
            Enter Mock Interview
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <Briefcase className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 -rotate-12" />
      </section>
    </div>
  );
}

