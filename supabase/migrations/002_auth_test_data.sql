--Create test users in auth.users if they don't exist
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  'john@techstart.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "John Doe"}',
  false,
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = '11111111-1111-1111-1111-111111111111'
);

INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
SELECT 
  '22222222-2222-2222-2222-222222222222',
  'jane@vcp.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Jane Smith"}',
  false,
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = '22222222-2222-2222-2222-222222222222'
);

INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
SELECT 
  '33333333-3333-3333-3333-333333333333',
  'mike@tech.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Mike Johnson"}',
  false,
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = '33333333-3333-3333-3333-333333333333'
);

--Create identities for these users if they don't exist
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at,
  id
)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '{"sub": "11111111-1111-1111-1111-111111111111", "email": "john@techstart.com"}',
  'email',
  NOW(),
  NOW(),
  NOW(),
  '11111111-1111-1111-1111-111111111111'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE id = '11111111-1111-1111-1111-111111111111'
);

INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at,
  id
)
SELECT 
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '{"sub": "22222222-2222-2222-2222-222222222222", "email": "jane@vcp.com"}',
  'email',
  NOW(),
  NOW(),
  NOW(),
  '22222222-2222-2222-2222-222222222222'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE id = '22222222-2222-2222-2222-222222222222'
);

INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at,
  id
)
SELECT 
  '33333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  '{"sub": "33333333-3333-3333-3333-333333333333", "email": "mike@tech.com"}',
  'email',
  NOW(),
  NOW(),
  NOW(),
  '33333333-3333-3333-3333-333333333333'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE id = '33333333-3333-3333-3333-333333333333'
); 