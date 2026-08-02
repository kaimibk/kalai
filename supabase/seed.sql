-- KĀLAI LOCAL SEED DATA

-- Demo Batches
INSERT INTO public.batches (id, title, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '6x Speckled Studio Mugs', 'Board of 6 identical thrown mugs with clean rims')
ON CONFLICT (id) DO NOTHING;

-- Demo Pieces
INSERT INTO public.ceramic_pieces (
  id, title, description, piece_type, clay_body_id, clay_body_name, 
  stage, batch_id, batch_sequence, is_failed, 
  target_bisque_cone, target_glaze_cone, 
  weight_grams, height_cm, width_cm,
  target_length_cm, target_width_cm, target_height_cm,
  formed_length_cm, formed_width_cm, formed_height_cm,
  initial_photo_url
) VALUES 
  (
    '22222222-2222-2222-2222-222222222201', 'Speckled Studio Mug #1', 'Thrown on wheel with 420g Laguna Speckled Buff.',
    'Mug', '00000000-0000-0000-0000-000000000001', 'Speckled Buff 80',
    'pending_bisque', '11111111-1111-1111-1111-111111111111', 1, FALSE,
    'Cone 04', 'Cone 6',
    420, 9.5, 8.5,
    8.5, 8.5, 9.5,
    9.66, 9.66, 10.80,
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80'
  ),
  (
    '22222222-2222-2222-2222-222222222202', 'Speckled Studio Mug #2', 'Thrown on wheel with 420g Laguna Speckled Buff.',
    'Mug', '00000000-0000-0000-0000-000000000001', 'Speckled Buff 80',
    'pending_bisque', '11111111-1111-1111-1111-111111111111', 2, FALSE,
    'Cone 04', 'Cone 6',
    420, 9.5, 8.5,
    8.5, 8.5, 9.5,
    9.66, 9.66, 10.80,
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80'
  ),
  (
    '22222222-2222-2222-2222-222222222203', 'Matcha Chawan Bowl', 'Deep foot ring, hand-fluted rim.',
    'Bowl', '00000000-0000-0000-0000-000000000002', 'B-Mix 5 (with Grog)',
    'bisqued', NULL, NULL, FALSE,
    'Cone 04', 'Cone 6',
    550, 8.0, 13.5,
    13.5, 13.5, 8.0,
    15.25, 15.25, 9.04,
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&auto=format&fit=crop&q=80'
  ),
  (
    '22222222-2222-2222-2222-222222222204', 'Ikebana Cylinder Vase', 'Tall faceted cylinder vase with heavy iron spots.',
    'Vase', '00000000-0000-0000-0000-000000000001', 'Speckled Buff 80',
    'done', NULL, NULL, FALSE,
    'Cone 04', 'Cone 6',
    850, 22.0, 10.0,
    10.0, 10.0, 22.0,
    11.36, 11.36, 25.00,
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=400&auto=format&fit=crop&q=80'
  )
ON CONFLICT (id) DO NOTHING;

-- Demo Glaze Layers for Matcha Chawan Bowl
INSERT INTO public.piece_glaze_layers (
  id, piece_id, glaze_id, glaze_name, manufacturer, layer_order, coat_count, application_method
) VALUES 
  (
    '33333333-3333-3333-3333-333333333301',
    '22222222-2222-2222-2222-222222222203',
    '00000000-0000-0000-0000-000000000013',
    'Celadon Jade Studio Dip', 'Custom Studio', 1, 1, 'dip'
  )
ON CONFLICT (id) DO NOTHING;
