# Database Setup Instructions

## Supabase Setup

### 1. Create a Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project

### 2. Get Your Credentials
1. Go to Project Settings > API
2. Copy your Project URL
3. Copy your anon/public key

### 3. Configure Environment Variables
1. Open `.env.local` file
2. Replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Create the Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop items table if it exists
DROP TABLE IF EXISTS items CASCADE;

-- Create children table for pediatric dentist records
CREATE TABLE children (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  parent_name TEXT NOT NULL,
  contact_details TEXT NOT NULL,
  treatment TEXT,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for faster queries
CREATE INDEX idx_children_created_at ON children(created_at DESC);

-- Create an index on name for search functionality
CREATE INDEX idx_children_name ON children(name);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function
CREATE TRIGGER update_children_updated_at 
    BEFORE UPDATE ON children 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO children (name, age, parent_name, contact_details) VALUES
  ('Emma Johnson', 8, 'Sarah Johnson', '555-0123, sarah.j@email.com'),
  ('Liam Smith', 5, 'Michael Smith', '555-0456, mike.smith@email.com'),
  ('Olivia Brown', 10, 'Jennifer Brown', '555-0789, jen.brown@email.com');
```

### 5. Set Up Storage Bucket for Images

Run this SQL to create a storage bucket:

```sql
-- Create storage bucket for patient images
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-images', 'patient-images', true);
```

Or create it via Supabase Dashboard:
1. Go to **Storage** in the left sidebar
2. Click **New Bucket**
3. Name it `patient-images`
4. Make it **Public** (so images can be displayed)
4. Click **Create Bucket**

### 5. Set Up Storage Bucket for Images

Run this SQL to create a storage bucket:

```sql
-- Create storage bucket for patient images
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-images', 'patient-images', true);
```

Or create it via Supabase Dashboard:
1. Go to **Storage** in the left sidebar
2. Click **New Bucket**
3. Name it `patient-images`
4. M7ke it **Public** (so images can be displayed)
4. Click **Create Bucket**

### 6. Enable Row Level Security (RLS) - Optional but Recommended

```sql
-- Enable RLS on children table
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- (You should customize this based on your authentication needs)
CREATE POLICY "Allow all operations for now" ON children
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Storage policies for patient-images bucket
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'patient-images');

CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'patient-images');

CREATE POLICY "Allow authenticated updates" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'patient-images');

CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'patient-images');
```

### 6. Restart Your Development Server

After setting up the environment variables, restart your dev server:

```bash
npm run dev
```

## Updating Existing Database

If you already have a `children` table and want to add the new treatment and notes fields:

```sql
-- Add treatment column
ALTER TABLE children 
ADD COLUMN IF NOT EXISTS treatment TEXT;

-- Add notes column  
ALTER TABLE children 
ADD COLUMN IF NOT EXISTS notes TEXT;
```

## Troubleshooting

- **Connection Error**: Verify your Supabase URL and API key are correct
- **Table Not Found**: Make sure you ran the SQL script in your Supabase project
- **Permission Error**: Check your Row Level Security policies
