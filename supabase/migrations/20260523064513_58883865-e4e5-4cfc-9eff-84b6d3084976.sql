
CREATE TABLE public.quiz_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text DEFAULT 'Brain',
  color text DEFAULT 'gradient-forest',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.quiz_categories(id) ON DELETE CASCADE,
  question text NOT NULL,
  options text[] NOT NULL DEFAULT '{}',
  correct_index integer NOT NULL DEFAULT 0,
  explanation text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  objective text,
  points integer NOT NULL DEFAULT 10,
  difficulty text NOT NULL DEFAULT 'facile',
  icon text DEFAULT 'TreePine',
  tips text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tree_guess_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  species_name text NOT NULL,
  scientific_name text,
  image_url text NOT NULL,
  hint text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tree_guess_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view published quiz categories" ON public.quiz_categories FOR SELECT TO authenticated USING (published = true);
CREATE POLICY "Admins manage quiz categories" ON public.quiz_categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone authenticated can view quiz questions" ON public.quiz_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage quiz questions" ON public.quiz_questions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone authenticated can view published missions" ON public.missions FOR SELECT TO authenticated USING (published = true);
CREATE POLICY "Admins manage missions" ON public.missions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone authenticated can view published tree guess" ON public.tree_guess_items FOR SELECT TO authenticated USING (published = true);
CREATE POLICY "Admins manage tree guess" ON public.tree_guess_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_quiz_categories_updated BEFORE UPDATE ON public.quiz_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_quiz_questions_updated BEFORE UPDATE ON public.quiz_questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_missions_updated BEFORE UPDATE ON public.missions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_tree_guess_updated BEFORE UPDATE ON public.tree_guess_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
