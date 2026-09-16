import Link from 'next/link';
import { motion } from 'motion/react';
import * as React from 'react';

export default function SuccessPage() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-[#F0FDF4]">
      {/* Optional Header - kept minimal to match feedback page */}
      <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <img src="/logos/hapsync-logo.jpg" alt="HapSync" className="h-10 w-auto object-contain rounded-full bg-white p-1 shadow-sm" />
          <span className="font-bold text-[#2D5F5D] text-xl">HapSync</span>
        </div>
      </div>
      
      <div className="z-10 p-4 w-full flex justify-center">
        <div className="w-full max-w-[420px] overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-8 text-center text-zinc-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)]">
          
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500 ring-8 ring-green-50/50">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <h2 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900">
            Feedback Submitted!
          </h2>
          
          <p className="mb-8 text-[14px] leading-relaxed text-zinc-500">
            Thank you for sharing your thoughts. Your feedback has been recorded securely.
          </p>

          <Link
            href="/"
            className="block w-full rounded-xl bg-zinc-900 px-6 py-3 text-center font-bold text-[13px] text-white transition-all hover:bg-zinc-800 active:scale-95"
          >
            Submit Another
          </Link>
        </div>
      </div>
    </div>
  );
}
