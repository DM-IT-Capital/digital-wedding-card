import { PelangganForm } from '@/components/dashboard/pelanggan-form'

export default function NewPelangganPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold">Tambah Pelanggan Baru</h1>
        <p className="text-muted-foreground">
          Isi maklumat kad kahwin digital untuk pelanggan anda
        </p>
      </div>
      
      <PelangganForm />
    </div>
  )
}
