'use server'

import { createClient } from '@/lib/supabase/server'

export async function loginAction(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message === 'Invalid login credentials' 
        ? 'Emel atau kata laluan tidak sah' 
        : error.message
    }
  }

  return {
    success: true,
    error: null
  }
}
