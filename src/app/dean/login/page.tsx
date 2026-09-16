import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SmokeyBackground, LoginForm } from "@/components/ui/login-form";

export default async function DeanLogin() {
  // If already logged in, go to dashboard
  const cookieStore = await cookies();
  if (cookieStore.get('sb-access-token')?.value) {
    redirect('/dean');
  }

  return (
    <main className="relative w-full min-h-screen bg-gray-900 overflow-hidden flex flex-col">
      {/* Background layer */}
      <SmokeyBackground className="absolute inset-0 z-0" />
      
      {/* Optional header over the background */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center bg-transparent">
        <a href="/" className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-black/30 transition text-white">
          <span className="font-bold text-white tracking-wide">← Back to Home</span>
        </a>
      </header>

      {/* Main content area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <LoginForm />
      </div>
    </main>
  );
}
