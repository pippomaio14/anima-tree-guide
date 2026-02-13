
-- Create storage bucket for content images
INSERT INTO storage.buckets (id, name, public) VALUES ('content-images', 'content-images', true);

-- Allow authenticated users to upload images (admin check in app)
CREATE POLICY "Authenticated users can upload content images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-images');

-- Anyone can view content images
CREATE POLICY "Anyone can view content images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

-- Authenticated users can delete content images
CREATE POLICY "Authenticated users can delete content images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-images');
