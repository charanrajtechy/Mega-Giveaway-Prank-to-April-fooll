
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (no auth required)
CREATE POLICY "Anyone can join giveaway"
ON public.participants
FOR INSERT
WITH CHECK (true);

-- Anyone can read participants
CREATE POLICY "Anyone can read participants"
ON public.participants
FOR SELECT
USING (true);
