DROP POLICY IF EXISTS "Authenticated users can upload content images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete content images" ON storage.objects;

CREATE POLICY "Admins can upload content images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update content images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete content images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));