DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
CREATE POLICY "Authenticated users view published events"
  ON public.events FOR SELECT TO authenticated
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can view trees" ON public.adopted_trees;
CREATE POLICY "Authenticated users view published trees"
  ON public.adopted_trees FOR SELECT TO authenticated
  USING (published = true OR public.has_role(auth.uid(), 'admin'));