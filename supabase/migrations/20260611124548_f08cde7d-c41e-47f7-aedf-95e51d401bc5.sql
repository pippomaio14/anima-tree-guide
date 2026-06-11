
-- 1. Harden list_trees_public: use auth.users (verified) instead of profiles (user-editable)
CREATE OR REPLACE FUNCTION public.list_trees_public()
RETURNS TABLE(id uuid, tree_number text, adopter_name text, dedicated_to text, dedication_message text, adoption_period text, tree_species text, image_url text, published boolean, created_at timestamp with time zone, updated_at timestamp with time zone, latitude double precision, longitude double precision, is_owner boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT
    t.id, t.tree_number, t.adopter_name, t.dedicated_to, t.dedication_message,
    t.adoption_period, t.tree_species, t.image_url, t.published, t.created_at, t.updated_at,
    CASE
      WHEN public.has_role(auth.uid(), 'admin'::app_role) THEN t.latitude
      WHEN EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = auth.uid()
          AND (
            (t.adopter_email IS NOT NULL AND t.adopter_email <> ''
              AND lower(t.adopter_email) = lower(coalesce(u.email, '')))
            OR (t.adopter_phone IS NOT NULL AND t.adopter_phone <> ''
              AND regexp_replace(t.adopter_phone, '\D', '', 'g') = regexp_replace(coalesce(u.phone, ''), '\D', '', 'g')
              AND regexp_replace(coalesce(u.phone, ''), '\D', '', 'g') <> '')
          )
      ) THEN t.latitude
      ELSE NULL
    END AS latitude,
    CASE
      WHEN public.has_role(auth.uid(), 'admin'::app_role) THEN t.longitude
      WHEN EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = auth.uid()
          AND (
            (t.adopter_email IS NOT NULL AND t.adopter_email <> ''
              AND lower(t.adopter_email) = lower(coalesce(u.email, '')))
            OR (t.adopter_phone IS NOT NULL AND t.adopter_phone <> ''
              AND regexp_replace(t.adopter_phone, '\D', '', 'g') = regexp_replace(coalesce(u.phone, ''), '\D', '', 'g')
              AND regexp_replace(coalesce(u.phone, ''), '\D', '', 'g') <> '')
          )
      ) THEN t.longitude
      ELSE NULL
    END AS longitude,
    (public.has_role(auth.uid(), 'admin'::app_role) OR EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
        AND (
          (t.adopter_email IS NOT NULL AND t.adopter_email <> ''
            AND lower(t.adopter_email) = lower(coalesce(u.email, '')))
          OR (t.adopter_phone IS NOT NULL AND t.adopter_phone <> ''
            AND regexp_replace(t.adopter_phone, '\D', '', 'g') = regexp_replace(coalesce(u.phone, ''), '\D', '', 'g')
            AND regexp_replace(coalesce(u.phone, ''), '\D', '', 'g') <> '')
        )
    )) AS is_owner
  FROM public.adopted_trees t
  WHERE (t.published = true OR public.has_role(auth.uid(), 'admin'::app_role))
    AND auth.uid() IS NOT NULL;
$function$;

-- 2. Restrict EXECUTE on list_trees_public to authenticated only (revoke from anon/public)
REVOKE ALL ON FUNCTION public.list_trees_public() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_trees_public() TO authenticated;

-- 3. Storage: restrict listing of content-images to admins (files still public via direct URL since bucket is public)
DROP POLICY IF EXISTS "Anyone can view content images" ON storage.objects;
CREATE POLICY "Admins can list content images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'::app_role));
