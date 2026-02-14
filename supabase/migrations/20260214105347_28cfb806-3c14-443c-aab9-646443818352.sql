
-- Add is_volunteer column to profiles
ALTER TABLE public.profiles ADD COLUMN is_volunteer boolean NOT NULL DEFAULT false;
