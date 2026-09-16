'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (email === 'dean_student@crescent.education' && password === '12345678') {
    const cookieStore = await cookies();
    cookieStore.set('sb-access-token', 'local-auth-token', { 
      httpOnly: true, 
      secure: true, 
      path: '/' 
    });
    
    redirect('/dean');
  } else {
    redirect('/dean/login?error=1');
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('sb-access-token');
  
  redirect('/dean/login');
}
