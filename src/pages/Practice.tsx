import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Volume2, Image as ImageIcon, Loader2, Sparkles, Wand2, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'react-router-dom';
import { getGeminiResponse, generateTTS } from '@/src/lib/gemini';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  role: 'user' | 'model';
  content: string;
  audio?: string;
  image?: {
    data: string;
    mimeType: string;
  };
}

export default function Practice() {
  const { userProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'general';
  const topic = searchParams.get('topic') || '';

  const getInitialMessage = () => {
    if (mode === 'exam') return `Hallo! Willkommen zum Vorbereitungskurs für ${topic || 'deine Prüfung'}. Sollen wir mit einer Leseübung oder einem mündlichen Rollenspiel beginnen?`;
    if (mode === 'career') return `Guten Tag. Ich bin Ihr Karriere-Coach. Sind Sie bereit für Ihr ${topic || 'Gesprächstraining'}? Wir können ein Vorstellungsgespräch oder eine Gehaltsverhandlung üben.`;
    return 'Hallo! Ich bin dein Deutsch-Lehrer. Möchtest du heute etwas Bestimmtes üben oder sollen wir ein Rollenspiel machen?';
  };

  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      content: getInitialMessage() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showImage, setShowImage] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<{ data: string, mimeType: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'de-DE';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }
  }, []);

  const handleVisualize = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPendingImage({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if ((!text.trim() && !pendingImage) || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: text || (pendingImage ? '[Bild hochgeladen]' : '') 
    };

    if (pendingImage) {
      userMessage.image = pendingImage;
    }

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const currentImageData = pendingImage;
    setPendingImage(null);
    setIsLoading(true);

    const systemPrompt = `You are a friendly German tutor named Anja. 
    1. Respond primarily in German, but provide English translations for complex phrases in brackets [like this].
    2. Encourage the user to speak and correct their grammar gently.
    3. Keep responses conversational and interactive.
    4. Current mode: ${mode}. Topic: ${topic}.
    5. User profile: ${JSON.stringify(userProfile || { level: 'B1' })}.
    6. If an image is provided, comment on it in German to help the student learn relevant vocabulary.`;

    const history = messages.map(m => ({ 
      role: m.role, 
      text: m.content,
      image: m.image ? { inlineData: m.image } : undefined
    }));

    const responseText = await getGeminiResponse(text, history, systemPrompt, currentImageData);

    const actualModelMessage: Message = { role: 'model', content: responseText };
    
    // Only generate TTS if it's not a long response to keep it snappy
    if (responseText.length < 500) {
      const audio = await generateTTS(responseText);
      if (audio) {
        actualModelMessage.audio = audio;
      }
    }

    setMessages(prev => [...prev, actualModelMessage]);
    setIsLoading(false);

    if (actualModelMessage.audio) {
      playAudio(actualModelMessage.audio);
    }
  };

  const playAudio = (base64: string) => {
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64}`);
      audio.play().catch(e => console.error("Audio playback failed:", e));
    } catch (e) {
      console.error("Audio creation failed:", e);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        setIsRecording(true);
        recognitionRef.current.start();
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-10rem)] grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50">
      {/* Left: Chat Area */}
      <div className="md:col-span-12 lg:col-span-7 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-600 uppercase tracking-tight">Live AI Tutor: Anja</span>
              {topic && (
                <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-tighter truncate max-w-[150px]">
                  {topic}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter",
              mode === 'exam' ? "bg-amber-100 text-amber-800" : mode === 'career' ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-800"
            )}>
              {mode} MODE
            </span>
            <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/20">
          <AnimatePresence>
            {showImage && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-lg overflow-hidden shadow-md border border-slate-200 mb-6 group"
              >
                <img src={showImage} alt="Visual Aid" className="w-full h-auto max-h-64 object-cover" />
                <button 
                  onClick={() => setShowImage(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                >
                  <Loader2 className="w-3 h-3 rotate-45" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col group",
                msg.role === 'user' ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "p-4 rounded-xl text-sm leading-relaxed shadow-sm max-w-[90%]",
                msg.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
              )}>
                <div className={cn("markdown-body", msg.role === 'user' ? "text-indigo-50" : "text-slate-700 font-medium")}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                {msg.audio && (
                  <button 
                    onClick={() => playAudio(msg.audio!)}
                    className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-indigo-600 transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className={cn(
                  "text-[9px] uppercase font-black tracking-widest",
                  msg.role === 'user' ? "text-slate-400" : "text-indigo-400"
                )}>
                  {msg.role === 'user' ? 'Du' : 'Tutor'}
                </span>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 italic text-[11px] animate-pulse">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Anja is formulating a response...</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          {pendingImage && (
            <div className="mb-2 relative inline-block">
              <img 
                src={`data:${pendingImage.mimeType};base64,${pendingImage.data}`} 
                alt="Pending" 
                className="w-16 h-16 object-cover rounded-lg border border-indigo-200"
              />
              <button 
                onClick={() => setPendingImage(null)}
                className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 shadow-sm"
              >
                <Loader2 className="w-3 h-3 rotate-45" />
              </button>
            </div>
          )}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center bg-slate-50 rounded-xl p-1.5 border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50 transition-all shadow-inner"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              type="button"
              onClick={handleVisualize}
              disabled={isLoading}
              className="p-3 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-30"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Schreibe eine Nachricht..."
              className="flex-1 bg-transparent px-2 py-3 focus:outline-none text-sm text-slate-700 font-medium"
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleRecording}
                className={cn(
                  "p-3 rounded-lg transition-all",
                  isRecording ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "text-slate-400 hover:bg-slate-200"
                )}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-lg shadow-indigo-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right: Immersive AI Panel - Desktop Only */}
      <div className="hidden lg:flex lg:col-span-5 flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
        
        {/* AI Status / Avatar Area */}
        <div className="flex-1 relative flex items-center justify-center p-8">
          <div className="text-center space-y-6">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-48 h-48 bg-slate-800 rounded-full mx-auto border-2 border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.2)] flex items-center justify-center overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.2),transparent_70%)]" />
              <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 absolute opacity-50" />
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="w-24 h-24 text-indigo-400 opacity-80" />
              </motion.div>
            </motion.div>
            
            <div className="flex gap-1.5 justify-center h-12 items-end">
              {[0.4, 0.8, 0.6, 1.0, 0.5, 0.9, 0.7].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: isRecording || isLoading ? [`${h*100}%`, `${h*50}%`, `${h*80}%`, `${h*100}%`] : '10%' }}
                  transition={{ repeat: Infinity, duration: 0.5 + i * 0.1 }}
                  className="w-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.5)]"
                />
              ))}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-white font-black uppercase text-xs tracking-[0.2em]">Voice Mode Active</h3>
              <p className="text-slate-500 text-[10px] font-bold">Immersive German Roleplay System v4.2</p>
            </div>
          </div>
        </div>

        {/* Transcription Overlay */}
        <div className="p-6 bg-slate-800/50 backdrop-blur-md border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Live Analysis</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-indigo-400 rounded-full" />
              <div className="w-1 h-1 bg-indigo-400 rounded-full opacity-50" />
            </div>
          </div>
          <p className="text-sm italic text-slate-300 leading-relaxed font-medium">
            "Your use of sentence structures is fluid. Try to incorporate the 'Präteritum' for past events to sound more professional."
          </p>
        </div>
      </div>
    </div>
  );
}

