'use server'

import { createClient } from '@/lib/supabase/server'

export async function loginWithCredentials(email: string, password: string) {
  try {
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

    // Verify the session was actually created
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return {
        success: false,
        message: 'Gagal mendapatkan sesi selepas log masuk'
      }
    }

    return { success: true, message: null }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Berlaku ralat yang tidak dijangka'
    }
  }
}

