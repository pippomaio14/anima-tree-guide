
CREATE TABLE public.dichotomous_key_nodes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_type text NOT NULL CHECK (key_type IN ('leaf','flower','fruit','bud')),
  node_id text NOT NULL,
  node_type text NOT NULL CHECK (node_type IN ('question','result')),
  question text,
  hint text,
  option_a_label text,
  option_a_next text,
  option_b_label text,
  option_b_next text,
  species text,
  scientific_name text,
  description text,
  characteristics text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(key_type, node_id)
);

ALTER TABLE public.dichotomous_key_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage dichotomous keys"
  ON public.dichotomous_key_nodes
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view dichotomous keys"
  ON public.dichotomous_key_nodes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TRIGGER trg_dichotomous_keys_updated_at
  BEFORE UPDATE ON public.dichotomous_key_nodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_dichotomous_key_type ON public.dichotomous_key_nodes(key_type);
