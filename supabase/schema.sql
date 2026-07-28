-- KĀLAI SUPABASE POSTGRESQL SCHEMA FOR CERAMIC ARTISTS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  studio_name TEXT DEFAULT 'My Pottery Studio',
  default_cone TEXT DEFAULT 'Cone 6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Pyrometric Cones Lookup Table (Orton / Skutt Chart)
CREATE TABLE IF NOT EXISTS public.pyrometric_cones (
  name TEXT PRIMARY KEY, -- e.g. 'Cone 022' through 'Cone 10'
  display_order INT UNIQUE NOT NULL,
  temp_f INT NOT NULL,
  temp_c INT NOT NULL,
  color_fire TEXT,
  firing_category TEXT NOT NULL CHECK (firing_category IN ('enamel_luster', 'bisque_lowfire', 'mid_fire', 'high_fire'))
);

INSERT INTO public.pyrometric_cones (name, display_order, temp_f, temp_c, color_fire, firing_category)
VALUES 
  ('Cone 022', 1,  1087, 586,  'Dull Red',   'enamel_luster'),
  ('Cone 021', 2,  1112, 600,  'Dull Red',   'enamel_luster'),
  ('Cone 020', 3,  1159, 626,  'Dull Red',   'enamel_luster'),
  ('Cone 019', 4,  1252, 678,  'Dull Red',   'enamel_luster'),
  ('Cone 018', 5,  1319, 715,  'Dull Red',   'enamel_luster'),
  ('Cone 017', 6,  1360, 738,  'Dull Red',   'enamel_luster'),
  ('Cone 016', 7,  1422, 772,  'Red',        'enamel_luster'),
  ('Cone 015', 8,  1456, 791,  'Red',        'enamel_luster'),
  ('Cone 014', 9,  1485, 807,  'Red',        'enamel_luster'),
  ('Cone 013', 10, 1539, 837,  'Cherry Red', 'bisque_lowfire'),
  ('Cone 012', 11, 1582, 861,  'Cherry Red', 'bisque_lowfire'),
  ('Cone 011', 12, 1607, 875,  'Orange',     'bisque_lowfire'),
  ('Cone 010', 13, 1657, 903,  'Orange',     'bisque_lowfire'),
  ('Cone 09',  14, 1688, 920,  'Orange',     'bisque_lowfire'),
  ('Cone 08',  15, 1728, 942,  'Orange',     'bisque_lowfire'),
  ('Cone 07',  16, 1789, 976,  'Orange',     'bisque_lowfire'),
  ('Cone 06',  17, 1828, 998,  'Orange',     'bisque_lowfire'),
  ('Cone 05',  18, 1888, 1031, 'Orange',     'bisque_lowfire'),
  ('Cone 04',  19, 1945, 1063, 'Yellow',     'bisque_lowfire'),
  ('Cone 03',  20, 1987, 1086, 'Yellow',     'bisque_lowfire'),
  ('Cone 02',  21, 2016, 1102, 'Yellow',     'bisque_lowfire'),
  ('Cone 01',  22, 2046, 1119, 'Yellow',     'bisque_lowfire'),
  ('Cone 1',   23, 2079, 1137, 'Yellow',     'mid_fire'),
  ('Cone 2',   24, 2088, 1142, 'Yellow',     'mid_fire'),
  ('Cone 3',   25, 2106, 1152, 'Yellow',     'mid_fire'),
  ('Cone 4',   26, 2124, 1162, 'Yellow',     'mid_fire'),
  ('Cone 5',   27, 2167, 1186, 'Yellow',     'mid_fire'),
  ('Cone 6',   28, 2232, 1222, 'White',      'mid_fire'),
  ('Cone 7',   29, 2262, 1239, 'White',      'high_fire'),
  ('Cone 8',   30, 2280, 1249, 'White',      'high_fire'),
  ('Cone 9',   31, 2300, 1260, 'White',      'high_fire'),
  ('Cone 10',  32, 2345, 1285, 'White',      'high_fire')
ON CONFLICT (name) DO NOTHING;

-- 3. Manufacturers Lookup Table
CREATE TABLE IF NOT EXISTS public.manufacturers (
  name TEXT PRIMARY KEY,
  category TEXT DEFAULT 'both' CHECK (category IN ('clay', 'glaze', 'both'))
);

INSERT INTO public.manufacturers (name, category)
VALUES 
  ('Amaco', 'glaze'),
  ('Mayco', 'glaze'),
  ('Coyote', 'glaze'),
  ('Spectrum', 'glaze'),
  ('Laguna Clay', 'both'),
  ('Highwater', 'clay'),
  ('Standard Clay', 'clay'),
  ('Custom Studio', 'both')
ON CONFLICT (name) DO NOTHING;

-- 4. Piece Form Types Lookup Table
CREATE TABLE IF NOT EXISTS public.piece_types (
  name TEXT PRIMARY KEY,
  description TEXT
);

INSERT INTO public.piece_types (name, description)
VALUES 
  ('Mug', 'Handles, coffee cups, espresso cups'),
  ('Bowl', 'Matcha, ramen, cereal, nesting bowls'),
  ('Vase', 'Ikebana, bud, tall cylinder vases'),
  ('Planter', 'Drainage planters, pots, saucers'),
  ('Plate', 'Dinner, side, serving platters'),
  ('Teapot', 'Poured spouts & lid fits'),
  ('Sculpture', 'Handbuilt artistic sculptures'),
  ('Tile', 'Ceramic flat tiles & wall hangings')
ON CONFLICT (name) DO NOTHING;

-- 5. Streamlined 6-Stage Kanban Lifecycle Table
CREATE TABLE IF NOT EXISTS public.kanban_stages (
  id TEXT PRIMARY KEY,
  display_order INT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT
);

INSERT INTO public.kanban_stages (id, display_order, label, icon, description)
VALUES 
  ('backlog', 1, 'Backlog / To-Do', '💡', 'Planned ideas and commission requests'),
  ('formed', 2, 'Formed', '🏺', 'Wheel thrown, handbuilt, slab, or slipcast wet clay'),
  ('ready_to_trim', 3, 'Trimming (Leather-Hard)', '🔪', 'Leather-hard trimming, carving, and handle joining'),
  ('bone_dry', 4, 'Bone Dry (Bisque Pending)', '☀️', 'Bone dry drying prior to bisque firing'),
  ('glazed', 5, 'Glazed (Glaze Fire Pending)', '🖌️', 'Bisque fired, glazed, and waiting for glaze kiln fire'),
  ('done', 6, 'Finished', '✨', 'Finished ceramic piece')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, icon = EXCLUDED.icon;

-- 6. Clay Bodies
CREATE TABLE IF NOT EXISTS public.clay_bodies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_global BOOLEAN DEFAULT FALSE,
  name TEXT NOT NULL,
  manufacturer TEXT REFERENCES public.manufacturers(name) ON DELETE SET NULL,
  firing_range TEXT DEFAULT 'Cone 5-10',
  min_cone TEXT REFERENCES public.pyrometric_cones(name),
  max_cone TEXT REFERENCES public.pyrometric_cones(name),
  shrinkage_pct NUMERIC(4,2) DEFAULT 12.0,
  raw_color TEXT DEFAULT 'Warm Buff',
  fired_color TEXT DEFAULT 'Speckled Cream',
  stock_lbs NUMERIC(6,2) DEFAULT 50.0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.clay_bodies (id, is_global, name, manufacturer, min_cone, max_cone, firing_range, shrinkage_pct, raw_color, fired_color)
VALUES 
  ('00000000-0000-0000-0000-000000000001', TRUE, 'Speckled Buff 80', 'Laguna Clay', 'Cone 5', 'Cone 10', 'Cone 5-10', 12.0, 'Greyish Buff', 'Warm Speckled Buff'),
  ('00000000-0000-0000-0000-000000000002', TRUE, 'B-Mix 5 (with Grog)', 'Laguna Clay', 'Cone 5', 'Cone 6', 'Cone 5-6', 11.5, 'Off-White', 'Cream Smooth'),
  ('00000000-0000-0000-0000-000000000003', TRUE, 'Frost Porcelain 365', 'Standard Clay', 'Cone 6', 'Cone 6', 'Cone 6', 14.0, 'Pure White', 'Translucent White'),
  ('00000000-0000-0000-0000-000000000004', TRUE, 'Red Terracotta Earthenware', 'Highwater', 'Cone 06', 'Cone 04', 'Cone 06-04', 9.5, 'Dark Red', 'Terracotta Rust'),
  ('00000000-0000-0000-0000-000000000005', TRUE, 'Ochre Heavy Stoneware', 'Laguna Clay', 'Cone 6', 'Cone 10', 'Cone 6-10', 13.0, 'Dark Brown', 'Toast Ochre')
ON CONFLICT (id) DO NOTHING;

-- 7. Batches Table (For multi-piece duplicate creation and split job tracking)
CREATE TABLE IF NOT EXISTS public.batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  parent_batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Ceramic Pieces (Streamlined 6 Kanban Stages)
CREATE TABLE IF NOT EXISTS public.ceramic_pieces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  piece_type TEXT REFERENCES public.piece_types(name) DEFAULT 'Mug',
  clay_body_id UUID REFERENCES public.clay_bodies(id) ON DELETE SET NULL,
  clay_body_name TEXT,
  
  stage TEXT REFERENCES public.kanban_stages(id) DEFAULT 'backlog',

  batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  batch_sequence INT,

  is_failed BOOLEAN DEFAULT FALSE,
  failure_stage TEXT REFERENCES public.kanban_stages(id),
  failure_reason TEXT, -- Free-form failure reason (e.g. S-crack in base, handle popped off, glaze ran)
  failed_at TIMESTAMPTZ,

  target_bisque_cone TEXT REFERENCES public.pyrometric_cones(name) DEFAULT 'Cone 06',
  target_glaze_cone TEXT REFERENCES public.pyrometric_cones(name) DEFAULT 'Cone 6',
  
  weight_grams INT,
  height_cm NUMERIC(5,2),
  width_cm NUMERIC(5,2),
  initial_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Stage Snapshots & Photo History
CREATE TABLE IF NOT EXISTS public.piece_stage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  piece_id UUID NOT NULL REFERENCES public.ceramic_pieces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage TEXT REFERENCES public.kanban_stages(id) NOT NULL,
  photo_url TEXT,
  notes TEXT,
  weight_grams INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Glaze Recipes & Predefined Library
CREATE TABLE IF NOT EXISTS public.glaze_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_global BOOLEAN DEFAULT FALSE,
  name TEXT NOT NULL,
  manufacturer TEXT REFERENCES public.manufacturers(name) DEFAULT 'Amaco',
  default_style TEXT DEFAULT 'brush' CHECK (default_style IN ('dip', 'brush', 'spray', 'pour', 'underglaze')),
  min_cone TEXT REFERENCES public.pyrometric_cones(name) DEFAULT 'Cone 5',
  max_cone TEXT REFERENCES public.pyrometric_cones(name) DEFAULT 'Cone 6',
  target_cone TEXT REFERENCES public.pyrometric_cones(name) DEFAULT 'Cone 6',
  atmosphere TEXT DEFAULT 'Oxidation',
  batch_liters NUMERIC(5,2) DEFAULT 5.0,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.glaze_recipes (id, is_global, name, manufacturer, default_style, min_cone, max_cone, target_cone, atmosphere, notes)
VALUES 
  ('00000000-0000-0000-0000-000000000010', TRUE, 'PC-20 Blue Rutile', 'Amaco', 'brush', 'Cone 5', 'Cone 6', 'Cone 6', 'Oxidation', 'Flowing blue and rutile highlights. Apply 3 brushed coats.'),
  ('00000000-0000-0000-0000-000000000011', TRUE, 'PC-50 Seafoam', 'Amaco', 'brush', 'Cone 5', 'Cone 6', 'Cone 6', 'Oxidation', 'Soft satin green glaze. Beautiful over texture.'),
  ('00000000-0000-0000-0000-000000000012', TRUE, 'SW-119 Honey Flux', 'Mayco', 'brush', 'Cone 5', 'Cone 6', 'Cone 6', 'Oxidation', 'High mobility accent glaze. Combines with PC glazes.'),
  ('00000000-0000-0000-0000-000000000013', TRUE, 'Celadon Jade Studio Dip', 'Custom Studio', 'dip', 'Cone 5', 'Cone 6', 'Cone 6', 'Oxidation', 'Translucent green bucket glaze for 3-second dipping.'),
  ('00000000-0000-0000-0000-000000000014', TRUE, 'Floating Blue Studio Dip', 'Custom Studio', 'dip', 'Cone 5', 'Cone 6', 'Cone 6', 'Oxidation', 'Variegated cobalt float bucket glaze.')
ON CONFLICT (id) DO NOTHING;

-- 10. Glaze Layers Applied on Ceramic Pieces
CREATE TABLE IF NOT EXISTS public.piece_glaze_layers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  piece_id UUID NOT NULL REFERENCES public.ceramic_pieces(id) ON DELETE CASCADE,
  glaze_id UUID REFERENCES public.glaze_recipes(id) ON DELETE SET NULL,
  glaze_name TEXT NOT NULL,
  manufacturer TEXT REFERENCES public.manufacturers(name) DEFAULT 'Amaco',
  layer_order INT DEFAULT 1,
  coat_count INT DEFAULT 2,
  application_method TEXT DEFAULT 'brush' CHECK (application_method IN ('dip', 'brush', 'spray', 'pour', 'underglaze', 'wax_accent')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyrometric_cones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.piece_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clay_bodies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceramic_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.piece_stage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glaze_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.piece_glaze_layers ENABLE ROW LEVEL SECURITY;

-- Public Read for Lookup Tables
CREATE POLICY "Public read pyrometric cones" ON public.pyrometric_cones FOR SELECT USING (TRUE);
CREATE POLICY "Public read manufacturers" ON public.manufacturers FOR SELECT USING (TRUE);
CREATE POLICY "Public read piece types" ON public.piece_types FOR SELECT USING (TRUE);
CREATE POLICY "Public read kanban stages" ON public.kanban_stages FOR SELECT USING (TRUE);

-- Batches: Owner isolated
CREATE POLICY "Users access own batches" ON public.batches 
  FOR ALL USING (user_id = auth.uid());

-- Clay Bodies
CREATE POLICY "Read global or own clay bodies" ON public.clay_bodies 
  FOR SELECT USING (is_global = TRUE OR user_id = auth.uid());
CREATE POLICY "Manage own clay bodies" ON public.clay_bodies 
  FOR ALL USING (user_id = auth.uid());

-- Ceramic Pieces: Owner isolated
CREATE POLICY "Users access own pieces" ON public.ceramic_pieces 
  FOR ALL USING (user_id = auth.uid());

-- Stage Logs: Owner isolated
CREATE POLICY "Users access own stage logs" ON public.piece_stage_logs 
  FOR ALL USING (user_id = auth.uid());

-- Glaze Recipes: Public read for global, owner read/write for custom
CREATE POLICY "Read global or own glazes" ON public.glaze_recipes 
  FOR SELECT USING (is_global = TRUE OR user_id = auth.uid());
CREATE POLICY "Manage own glazes" ON public.glaze_recipes 
  FOR ALL USING (user_id = auth.uid());

-- Glaze Layers: Owner isolated
CREATE POLICY "Users access own glaze layers" ON public.piece_glaze_layers 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.ceramic_pieces p WHERE p.id = piece_id AND p.user_id = auth.uid())
  );
