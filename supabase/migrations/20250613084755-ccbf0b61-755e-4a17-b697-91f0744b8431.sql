
-- Create a users table to store user information
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  profile_picture TEXT,
  followers TEXT[] DEFAULT '{}',
  following TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the 3 sample users with proper UUIDs
INSERT INTO public.users (id, first_name, last_name, email, phone, date_of_birth, profile_picture, followers, following, created_at) VALUES
(
  '00000000-0000-0000-0000-000000000001'::UUID,
  'Alice',
  'Johnson',
  'alice.johnson@email.com',
  '+1 (555) 123-4567',
  '1992-03-15',
  'https://images.unsplash.com/photo-1494790108755-2616b612b605?w=150&h=150&fit=crop&crop=face',
  ARRAY['00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003'],
  ARRAY['00000000-0000-0000-0000-000000000002'],
  '2024-01-15T10:30:00Z'
),
(
  '00000000-0000-0000-0000-000000000002'::UUID,
  'Bob',
  'Smith',
  'bob.smith@email.com',
  '+1 (555) 987-6543',
  '1988-07-22',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  ARRAY['00000000-0000-0000-0000-000000000001'],
  ARRAY['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'],
  '2024-01-10T14:20:00Z'
),
(
  '00000000-0000-0000-0000-000000000003'::UUID,
  'Carol',
  'Wilson',
  'carol.wilson@email.com',
  '+1 (555) 456-7890',
  '1995-11-08',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  ARRAY['00000000-0000-0000-0000-000000000002'],
  ARRAY[]::TEXT[],
  '2024-01-12T09:15:00Z'
);

-- Enable realtime for the users table so we get live updates
ALTER TABLE public.users REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
