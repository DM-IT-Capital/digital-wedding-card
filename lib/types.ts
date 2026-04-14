export interface Creator {
  id: string
  email: string
  nama: string
  peranan: 'boss' | 'staff'
  telefon: string | null
  created_at: string
  updated_at: string
}

export interface Pelanggan {
  id: string
  creator_id: string
  slug: string
  
  // Maklumat Pengantin Lelaki
  nama_pengantin_lelaki: string
  nama_bapa_lelaki: string | null
  nama_ibu_lelaki: string | null
  
  // Maklumat Pengantin Perempuan
  nama_pengantin_perempuan: string
  nama_bapa_perempuan: string | null
  nama_ibu_perempuan: string | null
  
  // Tarikh & Masa Majlis - Nikah
  tarikh_nikah: string | null
  masa_nikah: string | null
  lokasi_nikah: string | null
  alamat_nikah: string | null
  google_maps_nikah: string | null
  waze_nikah: string | null
  
  // Tarikh & Masa Majlis - Sanding Lelaki
  tarikh_sanding_lelaki: string | null
  masa_mula_sanding_lelaki: string | null
  masa_tamat_sanding_lelaki: string | null
  lokasi_sanding_lelaki: string | null
  alamat_sanding_lelaki: string | null
  google_maps_sanding_lelaki: string | null
  waze_sanding_lelaki: string | null
  
  // Tarikh & Masa Majlis - Sanding Perempuan
  tarikh_sanding_perempuan: string | null
  masa_mula_sanding_perempuan: string | null
  masa_tamat_sanding_perempuan: string | null
  lokasi_sanding_perempuan: string | null
  alamat_sanding_perempuan: string | null
  google_maps_sanding_perempuan: string | null
  waze_sanding_perempuan: string | null
  
  // Design & Theme
  tema_warna: string
  font_style: string
  template: string
  
  // Tetamu & Dress Code
  dress_code: string | null
  dress_code_warna: string | null
  
  // Hadiah/Money Gift
  enable_money_gift: boolean
  nama_bank: string | null
  nombor_akaun: string | null
  nama_pemilik_akaun: string | null
  qr_duitnow: string | null
  
  // Contact
  telefon_pengantin_lelaki: string | null
  telefon_pengantin_perempuan: string | null
  whatsapp_rsvp: string | null
  
  // Extras
  ucapan_alu_aluan: string | null
  hashtag_wedding: string | null
  spotify_playlist: string | null
  
  // Status
  status: 'draft' | 'published' | 'archived'
  
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  pelanggan_id: string
  jenis: 'foto_pengantin' | 'foto_galeri' | 'video' | 'qr_duitnow'
  url: string
  caption: string | null
  urutan: number
  created_at: string
}

export interface Tetapan {
  id: string
  nama_perniagaan: string
  logo_url: string | null
  telefon_perniagaan: string | null
  email_perniagaan: string | null
  whatsapp_perniagaan: string | null
  alamat_perniagaan: string | null
  facebook_url: string | null
  instagram_url: string | null
  tiktok_url: string | null
  website_url: string | null
  created_at: string
  updated_at: string
}

export interface Pertanyaan {
  id: string
  nama: string
  email: string | null
  telefon: string | null
  mesej: string
  status: 'baru' | 'dibaca' | 'selesai'
  created_at: string
}

export type PelangganWithMedia = Pelanggan & {
  media: Media[]
}
