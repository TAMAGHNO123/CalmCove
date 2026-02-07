-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own appointments
-- Note: 'anon' role is used when connecting with the anon key, but we filter by user_id in the query
-- Ideally, you would use Supabase Auth and 'auth.uid()', but since we are handling auth via Clerk 
-- and passing user_id explicitly in the query, we need a policy that allows access based on the query.
-- However, for simple anon key usage WITHOUT Supabase Auth integration (using custom auth/Clerk),
-- the simplest secure way is to allow ALL access for the anon role BUT enforcing filtering in the application logic requires trust in the key.
-- A better approach with the current setup (where backend holds the key and filters) is to allow all for authenticated service role (if used)
-- OR for the current setup using anon key, we can allow operation if the user_id matches.

-- Since the backend uses the ANON key, Supabase treats it as an 'anon' user.
-- We'll permit all operations for now since the backend layer handles the security (filtering by user_id).
-- In a production app using Clerk + Supabase properly, you'd use a JWT modification or a service role key.
CREATE POLICY "Allow anon access for now" ON appointments FOR ALL USING (true);


-- Create tips table
CREATE TABLE IF NOT EXISTS tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tip_text TEXT NOT NULL,
    date TEXT UNIQUE NOT NULL, -- Format YYYY-MM-DD
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone for tips
CREATE POLICY "Allow public read access" ON tips FOR SELECT USING (true);

-- Allow insert access only for authenticated admins/service role (or open for now for testing)
CREATE POLICY "Allow insert for all" ON tips FOR INSERT WITH CHECK (true);

-- Seed some initial data for tips
INSERT INTO tips (tip_text, date) VALUES
('Stand up and stretch your legs.', '2025-02-08')
ON CONFLICT (date) DO NOTHING;

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for quiz_results
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Allow insert/read for everyone (mock auth) or specific user
CREATE POLICY "Allow all access to quiz_results" ON quiz_results FOR ALL USING (true);
