# 🧪 Testing Guide - Supabase Login & Event Management

## 📋 Setup Database

### 1. Reset Database (Optional)
Jika ada konflik, jalankan `reset-supabase-complete.sql` terlebih dahulu.

### 2. Setup Complete Schema
Jalankan `complete-supabase-test.sql` di Supabase SQL Editor.

## 🔐 Testing Login/Sign Up

### 1. Test Sign Up
1. Buka http://localhost:3001
2. Klik "Sign In" → "Sign Up"
3. Isi form:
   - Email: `test@example.com`
   - Username: `testuser`
   - Full Name: `Test User`
   - Password: `password123`
4. Klik "Sign Up"
5. Check email untuk verification link
6. Klik verification link

### 2. Verify Profile Creation
1. Buka Supabase Dashboard → Table Editor
2. Pilih table `profiles`
3. Check apakah profile otomatis dibuat dengan:
   - Username dari email
   - Avatar URL dari DiceBear
   - Email verification status

### 3. Test Sign In
1. Setelah email verified, klik "Sign In"
2. Masukkan email dan password
3. Check apakah login berhasil
4. Check apakah user profile muncul di UI

## 📅 Testing Event Management

### 1. Test Create Event
1. Login sebagai user
2. Navigate ke halaman create event (jika ada)
3. Atau test via Supabase Dashboard:
   - Buka SQL Editor
   - Jalankan query:

```sql
-- Test create event function
SELECT public.create_event(
    'Test Event',
    'This is a test event description',
    '2024-12-31 18:00:00+00',
    'Jakarta, Indonesia',
    'Test Venue',
    'meetup',
    50,
    true,
    'https://example.com/register',
    'https://example.com/image.jpg'
);
```

### 2. Verify Event Creation
1. Buka Table Editor → `events`
2. Check apakah event baru muncul
3. Verify semua field terisi dengan benar

### 3. Test Get Events
Jalankan query di SQL Editor:

```sql
-- Get all events
SELECT * FROM public.get_all_events();

-- Get user's events
SELECT * FROM public.get_user_events();
```

## 🔍 Debugging

### 1. Check Trigger Status
```sql
-- Check if trigger exists
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name = 'on_auth_user_created';
```

### 2. Check Function Status
```sql
-- Check if function exists
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';
```

### 3. Check User Count
```sql
-- Count users in auth.users
SELECT COUNT(*) as total_users FROM auth.users;

-- Count profiles
SELECT COUNT(*) as total_profiles FROM public.profiles;
```

### 4. Check Recent Activity
```sql
-- Recent users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Recent profiles
SELECT 
    id,
    username,
    email,
    created_at
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Recent events
SELECT 
    id,
    title,
    organizer_name,
    created_at
FROM public.events 
ORDER BY created_at DESC 
LIMIT 5;
```

## 🚨 Common Issues

### 1. Profile Not Created
- Check apakah trigger `on_auth_user_created` ada
- Check apakah function `handle_new_user` ada
- Check browser console untuk error

### 2. Email Not Verified
- Check email spam folder
- Pastikan email verification enabled di Supabase
- Check `email_confirmed_at` field

### 3. Event Creation Failed
- Check apakah user sudah login
- Check RLS policies
- Check function permissions

### 4. RLS Policy Issues
- Check apakah RLS enabled
- Check policy definitions
- Test dengan different user roles

## 📊 Expected Results

### After Sign Up:
- User created in `auth.users`
- Profile created in `public.profiles`
- Username generated from email
- Avatar URL generated
- Email verification status set

### After Event Creation:
- Event created in `public.events`
- Organizer ID set to current user
- All fields populated correctly
- Event visible in public queries

### After Login:
- User session established
- Profile data loaded
- UI shows user information
- Navigation updated

## 🔧 Next Steps

1. Test semua functionality
2. Check error handling
3. Test edge cases
4. Verify security policies
5. Test performance dengan banyak data
