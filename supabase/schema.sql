-- Create a custom type for lead status
CREATE TYPE lead_status AS ENUM ('New Lead', 'Contacted', 'Qualified', 'Lost', 'Closed');

-- Create the leads table
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    source TEXT NOT NULL,
    status lead_status DEFAULT 'New Lead'::lead_status NOT NULL,
    notes TEXT,
    follow_up_status TEXT DEFAULT 'Pending',
    last_contacted_at TIMESTAMPTZ,
    assigned_agent_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 1. Allow public to insert leads (Lead Capture Form)
CREATE POLICY "Public: Can submit leads" ON leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 2. Allow authenticated users to view all leads (Team model)
-- In a larger app, you'd scope this by organization/team
CREATE POLICY "Agents: Can view all leads" ON leads
    FOR SELECT
    TO authenticated
    USING (true);

-- 3. Allow authenticated users to update/delete leads
CREATE POLICY "Agents: Can manage leads" ON leads
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

