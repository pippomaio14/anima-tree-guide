
-- Add published column to adopted_trees
ALTER TABLE public.adopted_trees ADD COLUMN published boolean DEFAULT true;

-- Add published column to events  
ALTER TABLE public.events ADD COLUMN published boolean DEFAULT true;
