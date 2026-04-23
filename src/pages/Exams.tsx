import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, FileText, CheckCircle2, Clock, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

const exams = [
  {
    id: 'goethe',
    title: 'Goethe-Zertifikat',
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    desc: 'The official certification from Goethe-Institut, globally recognized by employers and universities.',
    accent: 'border-slate-200 bg-white',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'telc',
    title: 'telc Deutsch',
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    desc: 'European Language Certificates, often used for visa requirements and naturalization in Germany.',
    accent: 'border-slate-200 bg-white',
    badge: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'testdaf',
    title: 'TestDaF',
    levels: ['B2', 'C1'],
    desc: 'Advanced language exam for international students who want to study at German universities.',
    accent: 'border-indigo-200 bg-indigo-50/30',
    badge: 'bg-indigo-600 text-white'
  },
  {
    id: 'dsh',
    title: 'DSH',
    levels: ['B2', 'C1'],
    desc: 'University entrance exam for foreign students, administered by individual German universities.',
    accent: 'border-slate-200 bg-white',
    badge: 'bg-slate-800 text-white'
  }
];

export default function ExamPrep() {
  return (
    <div className="space-y-8">
      <header className="space-y-2 max-w-2xl bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Exam Center</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Master the structure and content of official German language certifications with AI-generated mock tests and feedback.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <motion.div
            key={exam.id}
            whileHover={{ y: -2 }}
            className={cn(
              "p-6 rounded-xl border shadow-sm flex flex-col justify-between transition-all",
              exam.accent
            )}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={cn("px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest", exam.badge)}>
                  {exam.title.split('-')[0].split(' ')[0]}
                </div>
                <div className="flex gap-1 flex-wrap justify-end max-w-[120px]">
                  {exam.levels.map(l => (
                    <span key={l} className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">{exam.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {exam.desc}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link 
                to={`/practice?mode=exam&topic=${encodeURIComponent(exam.title)}`}
                className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest"
              >
                Mock Exams
              </Link>
              <Link 
                to={`/practice?mode=exam&topic=${encodeURIComponent(exam.title)}`}
                className="bg-slate-900 text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
              >
                Start Prep
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-full bg-slate-50 border-l border-slate-100" />
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Module Breakdown</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <Module icon={FileText} title="Leseverstehen" sub="Reading" status="60%" color="text-indigo-600" topic="Leseverstehen (Reading)" />
          <Module icon={Clock} title="Hörverstehen" sub="Listening" status="24%" color="text-emerald-600" topic="Hörverstehen (Listening)" />
          <Module icon={CheckCircle2} title="Schriftlicher" sub="Writing" status="READY" color="text-slate-400" topic="Schriftlicher Ausdruck (Writing)" />
          <Module icon={GraduationCap} title="Mündlicher" sub="Speaking" status="ACTIVE" color="text-rose-500" topic="Mündlicher Ausdruck (Speaking)" />
        </div>
      </section>
    </div>
  );
}

function Module({ icon: Icon, title, sub, status, color, topic }: any) {
  return (
    <Link 
      to={`/practice?mode=exam&topic=${encodeURIComponent(topic)}`}
      className="flex flex-col items-center text-center p-4 rounded-lg bg-white border border-slate-100 hover:border-slate-300 transition-all group shadow-sm hover:shadow-md"
    >
      <div className={cn("w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="font-bold text-xs tracking-tight text-slate-900">{title}</h4>
      <p className="text-[10px] text-slate-400 mb-2 uppercase font-bold tracking-tighter">{sub}</p>
      <div className="w-full bg-slate-50 h-1 rounded-full mb-1">
        <div className={cn("h-full rounded-full transition-all duration-1000", color.replace('text', 'bg'))} style={{ width: status.includes('%') ? status : '10%' }} />
      </div>
      <span className={cn("text-[9px] font-black uppercase tracking-widest", color)}>{status}</span>
    </Link>
  );
}

