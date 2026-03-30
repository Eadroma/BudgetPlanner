-- ============================================================
-- TABLE: savings_pots
-- Un "coffre" nommé que l'utilisateur crée pour tracker une épargne.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.savings_pots (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name          TEXT NOT NULL,
  target_amount NUMERIC(12, 2),           -- null = pas d'objectif défini
  color         TEXT NOT NULL DEFAULT '#3b82f6',
  icon          TEXT NOT NULL DEFAULT 'PiggyBank',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.savings_pots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own pots select" ON public.savings_pots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own pots insert" ON public.savings_pots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own pots update" ON public.savings_pots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own pots delete" ON public.savings_pots FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- TABLE: savings_entries
-- Dépôt ou retrait individuel vers/depuis un coffre.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.savings_entries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pot_id      UUID REFERENCES public.savings_pots(id) ON DELETE CASCADE NOT NULL,
  amount      NUMERIC(12, 2) NOT NULL,
  type        TEXT CHECK (type IN ('deposit', 'withdrawal')) NOT NULL,
  date        DATE NOT NULL,
  note        TEXT,
  member_id   UUID REFERENCES public.members(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.savings_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own entries select" ON public.savings_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own entries insert" ON public.savings_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own entries update" ON public.savings_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own entries delete" ON public.savings_entries FOR DELETE USING (auth.uid() = user_id);
