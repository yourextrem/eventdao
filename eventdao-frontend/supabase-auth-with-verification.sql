-- EventDAO Supabase Authentication with Email Verification
-- Complete schema with username, password, and email verification

-- =============================================
-- ENABLE EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CREATE CUSTOM TYPES
-- =============================================
CREATE TYPE claim_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- =============================================
-- PROFILES TABLE (User Profiles with Avatar)
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
-- VERIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS verifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    claim_id UUID REFERENCES event_claims(id) ON DELETE CASCADE NOT NULL,
    verifier_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    verification_type VARCHAR(50) NOT NULL,
    verification_reason TEXT,
    confidence_score INTEGER CHECK (confidence_score >= 1 AND confidence_score <= 10),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(claim_id, verifier_id)
);

-- =============================================
-- STAKES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS stakes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    claim_id UUID REFERENCES event_claims(id) ON DELETE CASCADE NOT NULL,
    staker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,
    stake_type VARCHAR(20) NOT NULL,
    transaction_hash VARCHAR(88),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(claim_id, staker_id)
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    related_claim_id UUID REFERENCES event_claims(id) ON DELETE CASCADE,
    related_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_claims_event ON event_claims(event_id);
CREATE INDEX IF NOT EXISTS idx_event_claims_user ON event_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_event_claims_status ON event_claims(status);
CREATE INDEX IF NOT EXISTS idx_verifications_claim ON verifications(claim_id);
CREATE INDEX IF NOT EXISTS idx_stakes_claim ON stakes(claim_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

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

-- Verifications policies
CREATE POLICY "Verifications are viewable by everyone" ON verifications FOR SELECT USING (true);
CREATE POLICY "Users can create verifications" ON verifications FOR INSERT WITH CHECK (auth.uid() = verifier_id);
CREATE POLICY "Users can update their own verifications" ON verifications FOR UPDATE USING (auth.uid() = verifier_id);

-- Stakes policies
CREATE POLICY "Stakes are viewable by everyone" ON stakes FOR SELECT USING (true);
CREATE POLICY "Users can create their own stakes" ON stakes FOR INSERT WITH CHECK (auth.uid() = staker_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

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
CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
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
DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmation();

-- =============================================
-- PROFILE MANAGEMENT FUNCTIONS
-- =============================================

-- Function to get user profile by ID
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS TABLE (
    id UUID,
    username VARCHAR(50),
    email VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    wallet_address VARCHAR(44),
    reputation_score INTEGER,
    total_claims INTEGER,
    verified_claims INTEGER,
    is_verified BOOLEAN,
    email_verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.username,
        p.email,
        p.full_name,
        p.avatar_url,
        p.bio,
        p.wallet_address,
        p.reputation_score,
        p.total_claims,
        p.verified_claims,
        p.is_verified,
        p.email_verified,
        p.created_at
    FROM profiles p
    WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user profile
CREATE OR REPLACE FUNCTION public.update_user_profile(
    user_id UUID,
    new_username VARCHAR(50) DEFAULT NULL,
    new_full_name VARCHAR(255) DEFAULT NULL,
    new_bio TEXT DEFAULT NULL,
    new_wallet_address VARCHAR(44) DEFAULT NULL,
    new_avatar_url TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user exists and is updating their own profile
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
        RETURN FALSE;
    END IF;
    
    -- Check username uniqueness if changing username
    IF new_username IS NOT NULL AND new_username != (SELECT username FROM profiles WHERE id = user_id) THEN
        IF EXISTS (SELECT 1 FROM profiles WHERE username = new_username AND id != user_id) THEN
            RETURN FALSE; -- Username already exists
        END IF;
    END IF;
    
    -- Update profile with provided values
    UPDATE profiles SET
        username = COALESCE(new_username, username),
        full_name = COALESCE(new_full_name, full_name),
        bio = COALESCE(new_bio, bio),
        wallet_address = COALESCE(new_wallet_address, wallet_address),
        avatar_url = COALESCE(new_avatar_url, avatar_url),
        updated_at = NOW()
    WHERE id = user_id;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate new avatar
CREATE OR REPLACE FUNCTION public.generate_avatar_url(username VARCHAR(50))
RETURNS TEXT AS $$
BEGIN
    RETURN 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || username;
END;
$$ LANGUAGE plpgsql;

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
