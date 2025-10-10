-- Complete Supabase Setup untuk Testing Login dan Event Management
-- Script lengkap untuk test sign up/sign in dan add event functionality

-- =============================================
-- ENABLE EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CREATE CUSTOM TYPES
-- =============================================
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE claim_status AS ENUM ('pending', 'verified', 'rejected');

-- =============================================
-- PROFILES TABLE (User Profiles)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    bio TEXT,
    wallet_address VARCHAR(44),
    reputation_score INTEGER DEFAULT 0,
    total_claims INTEGER DEFAULT 0,
    verified_claims INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    venue VARCHAR(255),
    organizer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    organizer_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100),
    max_attendees INTEGER,
    registration_required BOOLEAN DEFAULT false,
    registration_url TEXT,
    event_image_url TEXT,
    status event_status DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- EVENT_CLAIMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS event_claims (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    claim_text TEXT NOT NULL,
    evidence_url TEXT,
    evidence_type VARCHAR(50),
    status claim_status DEFAULT 'pending',
    stake_amount DECIMAL(18, 8) DEFAULT 0,
    verification_deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_claims_event ON event_claims(event_id);
CREATE INDEX IF NOT EXISTS idx_event_claims_user ON event_claims(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_claims ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Event organizers can update their events" ON events FOR UPDATE USING (auth.uid() = organizer_id);

-- Event claims policies
CREATE POLICY "Event claims are viewable by everyone" ON event_claims FOR SELECT USING (true);
CREATE POLICY "Users can create their own claims" ON event_claims FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own claims" ON event_claims FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_claims_updated_at BEFORE UPDATE ON event_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- AUTHENTICATION FUNCTIONS
-- =============================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    username_from_email TEXT;
    avatar_url TEXT;
BEGIN
    -- Generate username from email (part before @)
    username_from_email := split_part(NEW.email, '@', 1);
    
    -- Ensure username is unique by appending numbers if needed
    WHILE EXISTS (SELECT 1 FROM profiles WHERE username = username_from_email) LOOP
        username_from_email := username_from_email || '_' || floor(random() * 1000);
    END LOOP;
    
    -- Generate avatar URL using DiceBear API
    avatar_url := 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || username_from_email;
    
    -- Insert profile with generated username and avatar
    INSERT INTO public.profiles (id, username, email, full_name, avatar_url, email_verified)
    VALUES (
        NEW.id, 
        username_from_email,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        avatar_url,
        NEW.email_confirmed_at IS NOT NULL
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the signup
        RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update email verification status
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    -- Update email_verified status when email is confirmed
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.profiles 
        SET email_verified = true, updated_at = NOW()
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update email verification status
CREATE TRIGGER on_auth_user_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmation();

-- =============================================
-- EVENT MANAGEMENT FUNCTIONS
-- =============================================

-- Function to create event
CREATE OR REPLACE FUNCTION public.create_event(
    event_title VARCHAR(255),
    event_description TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    event_location VARCHAR(255),
    event_venue VARCHAR(255),
    event_type VARCHAR(100),
    max_attendees INTEGER DEFAULT NULL,
    registration_required BOOLEAN DEFAULT false,
    registration_url TEXT DEFAULT NULL,
    event_image_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_event_id UUID;
    user_profile RECORD;
BEGIN
    -- Get user profile info
    SELECT username, full_name INTO user_profile
    FROM profiles 
    WHERE id = auth.uid();
    
    -- Create event
    INSERT INTO events (
        title, description, event_date, location, venue,
        organizer_id, organizer_name, event_type, max_attendees,
        registration_required, registration_url, event_image_url
    )
    VALUES (
        event_title, event_description, event_date, event_location, event_venue,
        auth.uid(), COALESCE(user_profile.full_name, user_profile.username), event_type, max_attendees,
        registration_required, registration_url, event_image_url
    )
    RETURNING id INTO new_event_id;
    
    RETURN new_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get events by user
CREATE OR REPLACE FUNCTION public.get_user_events()
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    venue VARCHAR(255),
    organizer_name VARCHAR(255),
    event_type VARCHAR(100),
    max_attendees INTEGER,
    registration_required BOOLEAN,
    registration_url TEXT,
    event_image_url TEXT,
    status event_status,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id, e.title, e.description, e.event_date, e.location, e.venue,
        e.organizer_name, e.event_type, e.max_attendees, e.registration_required,
        e.registration_url, e.event_image_url, e.status, e.created_at
    FROM events e
    WHERE e.organizer_id = auth.uid()
    ORDER BY e.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all events (public)
CREATE OR REPLACE FUNCTION public.get_all_events()
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    venue VARCHAR(255),
    organizer_name VARCHAR(255),
    event_type VARCHAR(100),
    max_attendees INTEGER,
    registration_required BOOLEAN,
    registration_url TEXT,
    event_image_url TEXT,
    status event_status,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id, e.title, e.description, e.event_date, e.location, e.venue,
        e.organizer_name, e.event_type, e.max_attendees, e.registration_required,
        e.registration_url, e.event_image_url, e.status, e.created_at
    FROM events e
    ORDER BY e.event_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample events
INSERT INTO events (title, description, event_date, location, organizer_name, event_type, max_attendees) VALUES
('Solana DevCon 2024', 'Annual Solana developer conference', '2024-12-15 09:00:00+00', 'San Francisco, CA', 'Solana Foundation', 'conference', 1000),
('Web3 Meetup Jakarta', 'Monthly Web3 community meetup', '2024-11-20 18:00:00+00', 'Jakarta, Indonesia', 'Web3 Indonesia', 'meetup', 100),
('NFT Workshop', 'Learn how to create and deploy NFTs', '2024-11-25 14:00:00+00', 'Online', 'EventDAO Team', 'workshop', 50)
ON CONFLICT DO NOTHING;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if tables were created successfully
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if functions were created successfully
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;

-- Check if triggers were created successfully
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY trigger_name;

-- Check sample events
SELECT 
    id,
    title,
    event_date,
    organizer_name,
    status
FROM events 
ORDER BY created_at DESC 
LIMIT 5;
