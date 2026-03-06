
-- Add referral_code and referred_by columns to participants
ALTER TABLE public.participants 
  ADD COLUMN referral_code TEXT UNIQUE,
  ADD COLUMN referred_by TEXT;

-- Create a function to generate a unique 6-char referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.participants WHERE referral_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  NEW.referral_code := new_code;
  RETURN NEW;
END;
$$;

-- Auto-generate referral code on insert
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON public.participants
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_referral_code();
