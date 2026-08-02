-- Add due_date and notes columns to ceramic_pieces table
ALTER TABLE public.ceramic_pieces 
  ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notes TEXT;
