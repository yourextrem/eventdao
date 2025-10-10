# 🚀 Supabase Setup Guide untuk EventDAO

## 📋 Langkah-langkah Setup

### 1. Buat Project Supabase
1. Buka [supabase.com](https://supabase.com)
2. Sign up/Login
3. Klik "New Project"
4. Pilih organization
5. Isi project details:
   - Name: `eventdao`
   - Database Password: (buat password kuat)
   - Region: pilih yang terdekat (Singapore untuk Indonesia)

### 2. Dapatkan Credentials
1. Di dashboard Supabase, klik **Settings** → **API**
2. Copy:
   - **Project URL** (misal: `https://abcdefgh.supabase.co`)
   - **anon public** key (key yang panjang)
   - **service_role** key (untuk admin operations)

### 3. Buat File .env.local
Buat file `.env.local` di folder `eventdao-frontend`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=GNe8wwPpE95PUCpSJsYf32Z3HLtL5CwaxoVRmd7DFsCH
```

**⚠️ Ganti `your-project-id`, `your-anon-key-here`, dan `your-service-role-key-here` dengan credentials asli dari Supabase!**

### 4. Setup Database Schema
1. Di dashboard Supabase, klik **SQL Editor**
2. Buka file `supabase-auth-with-verification.sql`
3. Copy semua isinya
4. Paste di SQL Editor
5. Klik **Run** untuk menjalankan script

### 5. Konfigurasi Authentication
1. Di dashboard Supabase, klik **Authentication** → **Settings**
2. Di tab **General**:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/**`
3. Di tab **Email**:
   - **Enable email confirmations**: ✅
   - **Enable email change confirmations**: ✅

### 6. Test Setup
1. Jalankan: `npm run dev`
2. Buka `http://localhost:3000`
3. Klik "Sign In"
4. Test sign up dengan email yang valid
5. Check email untuk verification link
6. Klik verification link
7. Test sign in setelah verification

## 🔧 Fitur yang Tersedia

### ✅ Authentication
- Email/password sign up
- Email verification
- Sign in/sign out
- Username dan full name support

### ✅ User Profiles
- Avatar generation (DiceBear API)
- Username, full name, bio
- Wallet address
- Reputation score
- Email verification status

### ✅ Database Tables
- `profiles` - User profiles
- `events` - Event data
- `event_claims` - Event claims
- `verifications` - Claim verifications
- `stakes` - Staking data
- `notifications` - User notifications

### ✅ Security
- Row Level Security (RLS)
- Email verification required
- Secure password requirements
- Protected API endpoints

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Pastikan `.env.local` sudah dibuat dengan credentials yang benar
- Restart development server setelah update `.env.local`

### Error: "Email not confirmed"
- Check email untuk verification link
- Klik verification link
- Tunggu beberapa detik, lalu refresh page

### Error: "Database connection failed"
- Pastikan SQL script sudah dijalankan di Supabase
- Check apakah semua tables sudah dibuat
- Pastikan RLS policies sudah aktif

### Development Mode
Jika Supabase belum dikonfigurasi, aplikasi akan menggunakan development mode dengan localStorage untuk testing.

## 📞 Support
Jika ada masalah, check:
1. Browser console untuk error messages
2. Supabase dashboard untuk logs
3. Email spam folder untuk verification links
