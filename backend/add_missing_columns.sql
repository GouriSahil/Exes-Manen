-- Create enum type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userroleenum') THEN
        CREATE TYPE userroleenum AS ENUM ('admin', 'manager', 'employee');
        RAISE NOTICE 'Created userroleenum type';
    END IF;
END$$;

-- Add role column to users table
DO $$
BEGIN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'role') THEN
        -- Add the role column with default value
        ALTER TABLE users ADD COLUMN role userroleenum NOT NULL DEFAULT 'employee';
        
        RAISE NOTICE 'Added role column to users table';
    ELSE
        RAISE NOTICE 'Role column already exists in users table';
    END IF;
END$$;

-- Add owner_id column to companies table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'owner_id') THEN
        ALTER TABLE companies ADD COLUMN owner_id UUID REFERENCES users(id);
        
        RAISE NOTICE 'Added owner_id column to companies table';
    ELSE
        RAISE NOTICE 'owner_id column already exists in companies table';
    END IF;
END$$;

