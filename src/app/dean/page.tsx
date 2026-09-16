import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import CleanWireframeAnalytics from '@/components/ui/line-graph-statistics';
import { AlertCircle, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default async function DeanDashboard() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sb-access-token');

  if (!sessionToken?.value) {
    redirect('/dean/login');
  }

  let feedbacks: any[] = [];
  
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    if (data) feedbacks = data;
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
  }

  const complaintsCount = feedbacks.filter(f => f.type === 'complaint').length;
  const suggestionsCount = feedbacks.filter(f => f.type === 'suggestion').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-200">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 transition-all">
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="bg-white p-1 rounded-full shadow-sm inline-block">
            <img src="/logos/hapsync-logo.jpg" alt="HapSync" className="w-8 h-8 object-contain rounded-full" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">HapSync Dean Portal</span>
        </div>
        
        <form action={async () => {
          'use server';
          const cookieStore = await cookies();
          cookieStore.delete('sb-access-token');
          redirect('/dean/login');
        }}>
          <button type="submit" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors animate-in fade-in slide-in-from-right-4 duration-500">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </form>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-6">
        <div className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both">
          <CleanWireframeAnalytics feedbacks={feedbacks} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-150 fill-mode-both">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Complaints</h3>
            <p className="text-4xl font-bold text-slate-800">{complaintsCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-teal-500 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Suggestions</h3>
            <p className="text-4xl font-bold text-slate-800">{suggestionsCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-500 delay-300 fill-mode-both">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Submissions</h2>
          </div>
          
          <div className="divide-y divide-slate-100">
            {feedbacks.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                No feedback received yet.
              </div>
            ) : (
              feedbacks.map((item, idx) => (
                <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        item.type === 'complaint' ? 'bg-red-100 text-red-800' : 
                        item.type === 'suggestion' ? 'bg-teal-100 text-teal-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {item.type}
                      </span>
                      {item.raw_rating && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                          Mood: {item.raw_rating.replace('-', ' ')}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-slate-400">
                      {new Date(item.created_at || item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
