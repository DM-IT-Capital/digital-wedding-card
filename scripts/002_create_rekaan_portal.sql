CREATE TABLE IF NOT EXISTS public.rekaan_portal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tajuk TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  penerangan TEXT,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  urutan INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.rekaan_portal ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active portal designs" ON public.rekaan_portal;
CREATE POLICY "Public can view active portal designs"
ON public.rekaan_portal
FOR SELECT
TO public
USING (is_active = TRUE);

DROP POLICY IF EXISTS "Boss can manage portal designs" ON public.rekaan_portal;
CREATE POLICY "Boss can manage portal designs"
ON public.rekaan_portal
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.creators
    WHERE creators.id = auth.uid()
      AND creators.peranan = 'boss'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.creators
    WHERE creators.id = auth.uid()
      AND creators.peranan = 'boss'
  )
);
