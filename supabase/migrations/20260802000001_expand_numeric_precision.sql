-- Expand dimension columns from NUMERIC(5,2) (max 999.99) to NUMERIC(10,2) (max 99,999,999.99) to prevent numeric field overflow (22003)
ALTER TABLE public.ceramic_pieces
  ALTER COLUMN length_cm TYPE NUMERIC(10,2),
  ALTER COLUMN height_cm TYPE NUMERIC(10,2),
  ALTER COLUMN width_cm TYPE NUMERIC(10,2),
  ALTER COLUMN target_length_cm TYPE NUMERIC(10,2),
  ALTER COLUMN target_width_cm TYPE NUMERIC(10,2),
  ALTER COLUMN target_height_cm TYPE NUMERIC(10,2),
  ALTER COLUMN formed_length_cm TYPE NUMERIC(10,2),
  ALTER COLUMN formed_width_cm TYPE NUMERIC(10,2),
  ALTER COLUMN formed_height_cm TYPE NUMERIC(10,2),
  ALTER COLUMN actual_formed_length_cm TYPE NUMERIC(10,2),
  ALTER COLUMN actual_formed_width_cm TYPE NUMERIC(10,2),
  ALTER COLUMN actual_formed_height_cm TYPE NUMERIC(10,2),
  ALTER COLUMN actual_fired_length_cm TYPE NUMERIC(10,2),
  ALTER COLUMN actual_fired_width_cm TYPE NUMERIC(10,2),
  ALTER COLUMN actual_fired_height_cm TYPE NUMERIC(10,2);
