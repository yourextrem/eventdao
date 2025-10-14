# Supabase Email Configuration Fix

## Masalah
Profile tidak terbuat otomatis saat signup karena email confirmation required.

## Solusi

### 1. Disable Email Confirmation (Development)
1. Buka Supabase Dashboard
2. Pergi ke Authentication > Settings
3. Scroll ke "Email Confirmation"
4. **Uncheck** "Enable email confirmations"
5. Save changes

### 2. Atau Configure Email (Production)
1. Buka Supabase Dashboard
2. Pergi ke Authentication > Settings
3. Scroll ke "SMTP Settings"
4. Configure SMTP provider:
   - Gmail, SendGrid, Mailgun, dll
5. Set email templates
6. Save changes

### 3. Test Configuration
```sql
-- Test signup tanpa email confirmation
INSERT INTO auth.users (
    id,
    email,
    email_confirmed_at,  -- Set to NOW() to bypass confirmation
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'test@example.com',
    NOW(),  -- This bypasses email confirmation
    NOW(),
    NOW()
);
```

## Alternative: Manual Profile Creation
Jika trigger masih tidak bekerja, buat profile manual:

```sql
-- Buat profile untuk user yang sudah ada
INSERT INTO profiles (
    id,
    username,
    email,
    full_name,
    avatar_url,
    email_verified
)
SELECT 
    u.id,
    split_part(u.email, '@', 1) as username,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', '') as full_name,
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || split_part(u.email, '@', 1) as avatar_url,
    u.email_confirmed_at IS NOT NULL as email_verified
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

## Verification
Setelah konfigurasi, test signup dan check:
1. Apakah user terbuat di auth.users?
2. Apakah profile terbuat di profiles?
3. Apakah trigger berjalan?

## Production Notes
- Untuk production, gunakan SMTP yang proper
- Email confirmation penting untuk security
- Test dengan email yang valid
