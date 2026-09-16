'use server';

import fs from 'fs/promises';
import path from 'path';

export async function submitFeedback(data: { rating: string; feedback: string; type?: string }) {
  const { rating, feedback: message, type = 'suggestion' } = data;
  
  if (!rating || !message) {
    return { success: false };
  }
  
  try {
    const dataFilePath = path.join(process.cwd(), 'data.json');
    let feedbacks = [];
    
    try {
      const fileData = await fs.readFile(dataFilePath, 'utf8');
      feedbacks = JSON.parse(fileData);
    } catch (err) {
      // File might not exist yet
    }
    
    feedbacks.push({
      id: crypto.randomUUID(),
      type,
      message,
      raw_rating: rating,
      created_at: new Date().toISOString()
    });
    
    await fs.writeFile(dataFilePath, JSON.stringify(feedbacks, null, 2), 'utf8');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    return { success: false, error: error.message };
  }
}
