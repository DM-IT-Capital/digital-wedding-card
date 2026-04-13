-- Digital Wedding Card Portal Database Schema

-- Creators table (staff who manage wedding cards)
CREATE TABLE IF NOT EXISTS public.creators (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nama TEXT NOT NULL,
  peranan TEXT NOT NULL DEFAULT 'staff' CHECK (peranan IN ('boss', 'staff')),
  telefon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers/Wedding Cards table
CREATE TABLE IF NOT EXISTS public.pelanggan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draf' CHECK (status IN ('draf', 'aktif', 'tamat')),
  
  -- Maklumat Pengantin Lelaki
  nama_pengantin_lelaki TEXT NOT NULL,
  nama_bapa_lelaki TEXT,
  nama_ibu_lelaki TEXT,
  
  -- Maklumat Pengantin Perempuan
  nama_pengantin_perempuan TEXT NOT NULL,
  nama_bapa_perempuan TEXT,
  nama_ibu_perempuan TEXT,
  
  -- Maklumat Majlis
  tarikh_nikah DATE,
  masa_nikah TIME,
  lokasi_nikah TEXT,
  alamat_nikah TEXT,
  google_maps_nikah TEXT,
  waze_nikah TEXT,
  
  tarikh_resepsi DATE,
  masa_resepsi_mula TIME,
  masa_resepsi_tamat TIME,
  lokasi_resepsi TEXT,
  alamat_resepsi TEXT,
  google_maps_resepsi TEXT,
  waze_resepsi TEXT,
  
  -- Tema & Design
  tema TEXT,
  warna_tema TEXT,
  lagu_latar TEXT,
  
  -- Dress Code
  dress_code_lelaki TEXT,
  dress_code_perempuan TEXT,
  
  -- Hadiah/Sumbangan
  bank_nama TEXT,
  bank_akaun TEXT,
  bank_pemegang TEXT,
  duitnow_nombor TEXT,
  
  -- Extras
  ucapan_alu_aluan TEXT,
  hashtag TEXT,
  
  -- Contact for RSVP
  rsvp_telefon TEXT,
  rsvp_whatsapp TEXT,
  
  -- Tentative/Timeline
  tentative JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wedding Photos/Media table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pelanggan_id UUID NOT NULL REFERENCES public.pelanggan(id) ON DELETE CASCADE,
  jenis TEXT NOT NULL CHECK (jenis IN ('gambar_utama', 'galeri', 'video')),
  url TEXT NOT NULL,
  storage_path TEXT,
  urutan INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings/Tetapan table (for contact info, company info)
CREATE TABLE IF NOT EXISTS public.tetapan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kunci TEXT UNIQUE NOT NULL,
  nilai TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiry/Contact submissions
CREATE TABLE IF NOT EXISTS public.pertanyaan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  telefon TEXT,
  email TEXT,
  mesej TEXT NOT NULL,
  status TEXT DEFAULT 'baru' CHECK (status IN ('baru', 'dibaca', 'selesai')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
