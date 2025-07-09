
-- Primeiro, vamos limpar o usuário problemático forçando a remoção
DELETE FROM auth.identities WHERE user_id = '1e4a2795-760d-47c9-b9ee-7e81199ae3e2';
DELETE FROM auth.users WHERE id = '1e4a2795-760d-47c9-b9ee-7e81199ae3e2';

-- Agora vamos criar um novo usuário auxiliar com dados corretos
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'auxiliar@ldsnews.com.br',
  crypt('aux@lds2025', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Auxiliar LDS News"}',
  false,
  'authenticated',
  'authenticated'
);

-- Criar entrada na tabela de identities
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'auxiliar@ldsnews.com.br'),
  jsonb_build_object(
    'sub', (SELECT id FROM auth.users WHERE email = 'auxiliar@ldsnews.com.br')::text,
    'email', 'auxiliar@ldsnews.com.br'
  ),
  'email',
  (SELECT id FROM auth.users WHERE email = 'auxiliar@ldsnews.com.br')::text,
  now(),
  now()
);
