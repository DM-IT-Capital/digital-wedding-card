'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeletePelangganButtonProps {
  pelangganId: string
}

export function DeletePelangganButton({ pelangganId }: DeletePelangganButtonProps) {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from('pelanggan')
      .delete()
      .eq('id', pelangganId)

    if (error) {
      toast.error('Gagal memadam pelanggan')
      setDeleting(false)
      return
    }

    toast.success('Pelanggan berjaya dipadam')
    setShowDialog(false)
    router.refresh()
  }

  return (
    <>
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onSelect={(e) => {
          e.preventDefault()
          setShowDialog(true)
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Padam
      </DropdownMenuItem>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Padam Pelanggan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak boleh dibatalkan. Kad kahwin dan semua data berkaitan 
              akan dipadam secara kekal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Sedang memadam...' : 'Ya, Padam'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
