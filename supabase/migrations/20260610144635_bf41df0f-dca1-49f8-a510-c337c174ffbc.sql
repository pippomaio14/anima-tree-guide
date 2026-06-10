
DROP VIEW IF EXISTS public.trees_public;

CREATE OR REPLACE FUNCTION public.list_trees_public()
RETURNS TABLE (
  id uuid,
  tree_number text,
  adopter_name text,
  dedicated_to text,
  dedication_message text,
  adoption_period text,
  tree_species text,
  image_url text,
  published boolean,
  created_at timestamptz,
  updated_at timestamptz,
  latitude double precision,
  longitude double precision,
  is_owner boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id, t.tree_number, t.adopter_name, t.dedicated_to, t.dedication_message,
    t.adoption_period, t.tree_species, t.image_url, t.published, t.created_at, t.updated_at,
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
    END AS longitude,
    (public.has_role(auth.uid(), 'admin'::app_role) OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND (
          (t.adopter_email IS NOT NULL AND t.adopter_email <> ''
            AND lower(t.adopter_email) = lower(coalesce(p.email, '')))
          OR (t.adopter_phone IS NOT NULL AND t.adopter_phone <> ''
            AND regexp_replace(t.adopter_phone, '\D', '', 'g') = regexp_replace(coalesce(p.phone, ''), '\D', '', 'g')
            AND regexp_replace(coalesce(p.phone, ''), '\D', '', 'g') <> '')
        )
    )) AS is_owner
  FROM public.adopted_trees t
  WHERE t.published = true OR public.has_role(auth.uid(), 'admin'::app_role);
$$;

REVOKE EXECUTE ON FUNCTION public.list_trees_public() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_trees_public() TO authenticated;
