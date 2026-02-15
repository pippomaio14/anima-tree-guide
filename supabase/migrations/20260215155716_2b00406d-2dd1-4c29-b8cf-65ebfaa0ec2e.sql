
-- Create park_sections table
CREATE TABLE public.park_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text,
  image_url text,
  icon text DEFAULT 'TreePine',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.park_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage park_sections"
  ON public.park_sections FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published park_sections"
  ON public.park_sections FOR SELECT
  USING (published = true);

CREATE TRIGGER update_park_sections_updated_at
  BEFORE UPDATE ON public.park_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed existing content
INSERT INTO public.park_sections (title, content, icon, sort_order) VALUES
  ('Il Bosco Anima Mundi', 'Il Parco Bosco Anima Mundi nasce a Camisano Vicentino con l''obiettivo di creare un''oasi verde dove la natura e la comunità si incontrano. Ogni albero racconta una storia, ogni sentiero è un invito alla scoperta.', 'TreePine', 0),
  ('I Nostri Obiettivi', 'Promuovere la biodiversità, educare alla sostenibilità ambientale, creare uno spazio di incontro per la comunità e preservare il patrimonio naturale per le generazioni future.', 'Target', 1),
  ('Adotta un Albero', 'Il programma di adozione permette a chiunque di contribuire alla crescita del bosco. Ogni albero adottato può essere dedicato a una persona cara, creando un legame speciale con la natura.', 'Heart', 2),
  ('Sostenibilità', 'Il parco è gestito seguendo principi di sostenibilità ambientale, utilizzando pratiche di cura naturali e promuovendo la partecipazione attiva dei cittadini nella tutela dell''ambiente.', 'Globe', 3);
