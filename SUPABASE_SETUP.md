# Supabase Setup Guide untuk EventDAO

## 🚀 Setup Supabase Authentication

### 1. Buat Proyek Supabase

1. Kunjungi [supabase.com](https://supabase.com)
2. Klik "Start your project"
3. Login dengan GitHub atau email
4. Klik "New Project"
5. Pilih organization dan isi detail proyek:
   - **Name**: `eventdao-auth`
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih region terdekat (Singapore untuk Indonesia)

### 2. Dapatkan API Keys

1. Di dashboard Supabase, klik **Settings** → **API**
2. Copy **Project URL** dan **anon public** key
3. Simpan kedua nilai ini untuk konfigurasi

### 3. Setup Environment Variables

Buat file `.env.local` di folder `eventdao-frontend/`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Server-side only
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Konfigurasi Authentication

1. Di dashboard Supabase, klik **Authentication** → **Settings**
2. Di tab **General**:
   - **Site URL**: `http://localhost:3002` (untuk development)
   - **Redirect URLs**: `http://localhost:3002/**`

3. Di tab **Email**:
   - **Enable email confirmations**: ✅ (opsional)
   - **Enable email change confirmations**: ✅ (opsional)

### 5. Setup Database Schema

Jalankan SQL berikut di **SQL Editor** di dashboard Supabase:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  username TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 6. Test Authentication

1. Restart development server:
   ```bash
   cd eventdao-frontend
   npm run dev
   ```

2. Buka `http://localhost:3002`
3. Klik tombol "Sign In"
4. Coba daftar dengan email baru
5. Periksa email untuk konfirmasi (jika email confirmation diaktifkan)

### 7. Production Setup

Untuk production, update environment variables:

```bash
# Production Environment
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Update Site URL di Supabase Dashboard
# Authentication → Settings → Site URL: https://yourdomain.com
```

## 🔧 Troubleshooting

### Error: "Supabase not configured"
- Pastikan file `.env.local` ada dan berisi URL dan key yang benar
- Restart development server setelah menambah environment variables

### Error: "Invalid API key"
- Periksa apakah anon key sudah benar
- Pastikan tidak ada spasi atau karakter tambahan

### Error: "Email not confirmed"
- Periksa folder spam email
- Atau disable email confirmation di Supabase dashboard

### Error: "CORS error"
- Pastikan Site URL dan Redirect URLs sudah dikonfigurasi dengan benar
- Untuk development: `http://localhost:3002`

## 📚 Referensi

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Supabase Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

## 🎯 Next Steps

Setelah Supabase dikonfigurasi:

1. ✅ Authentication akan berfungsi penuh
2. ✅ User profiles akan tersimpan di database
3. ✅ Session management otomatis
4. ✅ Ready untuk production deployment

---

**Note**: File `.env.local` tidak boleh di-commit ke repository. Pastikan sudah ditambahkan ke `.gitignore`.
