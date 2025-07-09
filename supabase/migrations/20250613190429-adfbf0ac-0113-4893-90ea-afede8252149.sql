
-- Remover completamente o usuário auxiliar@ldsnews.com.br
DELETE FROM auth.identities WHERE identity_data->>'email' = 'auxiliar@ldsnews.com.br';
DELETE FROM auth.users WHERE email = 'auxiliar@ldsnews.com.br';
