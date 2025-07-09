
-- Criar usuário master para testes reais - versão corrigida
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
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'auxiliar@ldsnews.com.br',
  crypt('aux@lds2025', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Vitor Santos"}',
  false,
  'authenticated'
);

-- Criar entrada na tabela de identities com provider_id correto
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
