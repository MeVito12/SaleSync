
-- Primeiro, vamos remover qualquer usuário auxiliar existente
DELETE FROM auth.identities WHERE identity_data->>'email' = 'auxiliar@ldsnews.com.br';
DELETE FROM auth.users WHERE email = 'auxiliar@ldsnews.com.br';

-- Agora vamos criar um novo usuário auxiliar com TODOS os campos necessários
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
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token,
  phone_change_token
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
  'authenticated',
  '',
  '',
  '',
  ''
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
    'email', 'auxiliar@ldsnews.com.br',
    'email_verified', true,
    'provider', 'email'
  ),
  'email',
  (SELECT id FROM auth.users WHERE email = 'auxiliar@ldsnews.com.br')::text,
  now(),
  now()
);
