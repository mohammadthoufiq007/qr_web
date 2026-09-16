"use client";

import { FeedbackWidget } from "@/components/ui/feedback-widget";
import { submitFeedback } from "./actions";
import { useRouter } from "next/navigation";

export default function StudentForm() {
  const router = useRouter();

  const handleSubmit = async (data: { rating: string; feedback: string; type: string }) => {
    const res = await submitFeedback(data);
    if (res?.success) {
      router.push("/success");
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-[#F0FDF4]">
      {/* Optional Header - kept minimal to focus on the widget */}
      <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <img src="/logos/hapsync-logo.jpg" alt="HapSync" className="h-10 w-auto object-contain rounded-full bg-white p-1 shadow-sm" />
          <span className="font-bold text-[#2D5F5D] text-xl">HapSync</span>
        </div>
      </div>
      
      <div className="z-10 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 fill-mode-both">
        <FeedbackWidget
          onSubmit={handleSubmit}
          label="How are you feeling today?"
          placeholder="Share your thoughts anonymously..."
        />
      </div>
    </div>
  );
}
