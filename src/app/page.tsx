import Link from 'next/link';
import { ShaderBackground } from '@/components/ui/ass';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-slate-900 flex flex-col items-center justify-center p-6">
      {/* Dynamic WebGL Background */}
      <div className="absolute inset-0 z-0">
        <ShaderBackground className="h-full w-full" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center mb-12 p-8 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-700 fill-mode-both">
        <div className="flex flex-col items-center gap-6 mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-150 fill-mode-both">
          {/* HapSync Logo + Text */}
          <div className="flex flex-col items-center gap-3">
            <img src="/logos/hapsync-logo.jpg" alt="HapSync Icon" className="h-24 w-auto object-contain rounded-full shadow-lg bg-white p-2" />
            <h1 className="text-5xl font-extrabold text-white drop-shadow-md tracking-tight">HapSync</h1>
            <p className="text-white/90 font-medium text-lg drop-shadow-sm">Happiness Index & Feedback System</p>
          </div>
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-3 w-full animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-both">
          <Link 
            href="/feedback" 
            className="flex-1 min-w-[140px] bg-white hover:bg-slate-50 text-[#2D5F5D] border border-transparent hover:border-white hover:scale-105 font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 text-sm group"
          >
            <span>Student Feedback</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          
          <Link 
            href="/dean/login" 
            className="flex-1 min-w-[140px] bg-[#2D5F5D] hover:bg-[#1f4240] text-white hover:scale-105 font-bold py-2.5 px-4 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 text-sm"
          >
            <span>Dean Portal</span>
          </Link>
        </div>
      </div>
      <div className="absolute z-10 bottom-6 text-sm text-white/80 font-medium">
        &copy; {new Date().getFullYear()} Crescent Institute
      </div>
    </div>
  );
}
