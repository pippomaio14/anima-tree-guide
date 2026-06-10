
ALTER TABLE public.adopted_trees
  ADD COLUMN IF NOT EXISTS adopter_email TEXT,
  ADD COLUMN IF NOT EXISTS adopter_phone TEXT;

-- Restrict base table SELECT to admin only; non-admin reads go through the view
DROP POLICY IF EXISTS "Authenticated users view published trees" ON public.adopted_trees;

CREATE POLICY "Admins can view trees directly"
  ON public.adopted_trees FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Public view: same data, lat/lng masked unless admin or owner (email/phone match)
DROP VIEW IF EXISTS public.trees_public;

CREATE VIEW public.trees_public
WITH (security_invoker = off) AS
SELECT
  t.id,
  t.tree_number,
  t.adopter_name,
  t.dedicated_to,
  t.dedication_message,
  t.adoption_period,
  t.tree_species,
  t.image_url,
  t.published,
  t.created_at,
  t.updated_at,
  CASE
    WHEN public.has_role(auth.uid(), 'admin'::app_role) THEN t.latitude
    WHEN EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND (
          (t.adopter_email IS NOT NULL AND t.adopter_email <> ''
            AND lower(t.adopter_email) = lower(coalesce(p.email, '')))
          OR (t.adopter_phone IS NOT NULL AND t.adopter_phone <> ''
            AND regexp_replace(t.adopter_phone, '\D', '', 'g') = regexp_replace(coalesce(p.phone, ''), '\D', '', 'g')
            AND regexp_replace(coalesce(p.phone, ''), '\D', '', 'g') <> '')
        )
    ) THEN t.latitude
    ELSE NULL
  END AS latitude,
  CASE
    WHEN public.has_role(auth.uid(), 'admin'::app_role) THEN t.longitude
    WHEN EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND (
          (t.adopter_email IS NOT NULL AND t.adopter_email <> ''
            AND lower(t.adopter_email) = lower(coalesce(p.email, '')))
          OR (t.adopter_phone IS NOT NULL AND t.adopter_phone <> ''
            AND regexp_replace(t.adopter_phone, '\D', '', 'g') = regexp_replace(coalesce(p.phone, ''), '\D', '', 'g')
            AND regexp_replace(coalesce(p.phone, ''), '\D', '', 'g') <> '')
        )
    ) THEN t.longitude
    ELSE NULL
  END AS longitude
FROM public.adopted_trees t
WHERE t.published = true OR public.has_role(auth.uid(), 'admin'::app_role);

GRANT SELECT ON public.trees_public TO authenticated;
