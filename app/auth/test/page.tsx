import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TestPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Not authenticated</h1>
        <p>No user session found</p>
      </div>
    )
  }

  // Get creator
  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Debug Info</h1>
      
      <div className="bg-blue-100 p-4 rounded">
        <h2 className="font-bold">User:</h2>
        <pre className="text-sm overflow-auto">{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div className="bg-green-100 p-4 rounded">
        <h2 className="font-bold">Creator:</h2>
        {creatorError ? (
          <p className="text-red-600">Error: {creatorError.message}</p>
        ) : creator ? (
          <pre className="text-sm overflow-auto">{JSON.stringify(creator, null, 2)}</pre>
        ) : (
          <p className="text-red-600">No creator record found!</p>
        )}
      </div>
    </div>
  )
}
