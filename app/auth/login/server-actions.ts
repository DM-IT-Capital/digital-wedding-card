'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginWithCredentials(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      message: error.message === 'Invalid login credentials' 
        ? 'Emel atau kata laluan tidak sah' 
        : error.message
    }
  }

  // Don't redirect from server action, let client handle it
  return { success: true, message: null }
}
