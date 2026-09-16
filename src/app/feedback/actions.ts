'use server';

export async function submitFeedback(data: { rating: string; feedback: string; type?: string }) {
  const { rating, feedback: message, type = 'suggestion' } = data;
  
  if (!rating || !message) {
    return { success: false };
  }
  
  try {
    const { supabase } = await import('@/lib/supabase');
    
    const { error } = await supabase
      .from('feedbacks')
      .insert([
        {
          type,
          message,
          raw_rating: rating,
        }
      ]);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    return { success: false, error: error.message };
  }
}
