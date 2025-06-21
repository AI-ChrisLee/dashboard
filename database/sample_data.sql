-- =============================================================================
-- SAMPLE DATA FOR PROJECT DASHBOARD
-- =============================================================================

-- Note: This assumes you have users created through Supabase Auth
-- You'll need to replace the UUIDs with actual user IDs from your auth.users table

-- =============================================================================
-- 1. INSERT SAMPLE USERS (public.users table)
-- =============================================================================
-- These should be created after users sign up through Supabase Auth
-- Example inserts (replace with actual auth user IDs):

INSERT INTO public.users (id, email, full_name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'John Doe', 'manager'),
  ('550e8400-e29b-41d4-a716-446655440002', 'alice.johnson@example.com', 'Alice Johnson', 'developer'),
  ('550e8400-e29b-41d4-a716-446655440003', 'bob.smith@example.com', 'Bob Smith', 'developer'),
  ('550e8400-e29b-41d4-a716-446655440004', 'carol.davis@example.com', 'Carol Davis', 'designer'),
  ('550e8400-e29b-41d4-a716-446655440005', 'david.wilson@example.com', 'David Wilson', 'developer'),
  ('550e8400-e29b-41d4-a716-446655440006', 'eve.brown@example.com', 'Eve Brown', 'qa'),
  ('550e8400-e29b-41d4-a716-446655440007', 'frank.miller@example.com', 'Frank Miller', 'developer'),
  ('550e8400-e29b-41d4-a716-446655440008', 'grace.lee@example.com', 'Grace Lee', 'designer'),
  ('550e8400-e29b-41d4-a716-446655440009', 'henry.taylor@example.com', 'Henry Taylor', 'developer'),
  ('550e8400-e29b-41d4-a716-446655440010', 'ivy.chen@example.com', 'Ivy Chen', 'analyst')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. INSERT SAMPLE CLIENTS
-- =============================================================================
INSERT INTO public.clients (id, name, email, company, contact_person, status) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'TechCorp Inc.', 'contact@techcorp.com', 'TechCorp Inc.', 'Sarah Johnson', 'active'),
  ('c1000000-0000-0000-0000-000000000002', 'RetailMax Ltd.', 'hello@retailmax.com', 'RetailMax Ltd.', 'Michael Chen', 'active'),
  ('c1000000-0000-0000-0000-000000000003', 'StartupXYZ', 'info@startupxyz.com', 'StartupXYZ', 'Emma Rodriguez', 'active'),
  ('c1000000-0000-0000-0000-000000000004', 'DataDriven Corp.', 'contact@datadriven.com', 'DataDriven Corp.', 'James Wilson', 'active'),
  ('c1000000-0000-0000-0000-000000000005', 'BusinessPro Inc.', 'support@businesspro.com', 'BusinessPro Inc.', 'Lisa Anderson', 'active'),
  ('c1000000-0000-0000-0000-000000000006', 'HR Solutions Ltd.', 'info@hrsolutions.com', 'HR Solutions Ltd.', 'Robert Taylor', 'prospect');

-- =============================================================================
-- 3. INSERT SAMPLE PROJECTS (matching dashboard data)
-- =============================================================================
INSERT INTO public.projects (
  id, title, description, status, priority, progress, budget, start_date, due_date,
  client_id, project_manager_id, created_by, created_at
) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Project Alpha',
    'Developing a new customer management system with modern React architecture and advanced analytics capabilities.',
    'In Progress',
    'High',
    65,
    125000.00,
    '2024-01-10',
    '2024-03-15',
    'c1000000-0000-0000-0000-000000000001',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '2024-01-10 10:00:00+00'
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'Project Beta',
    'Building a comprehensive e-commerce platform with integrated payment processing and inventory management.',
    'Planning',
    'Medium',
    15,
    95000.00,
    '2024-02-01',
    '2024-04-20',
    'c1000000-0000-0000-0000-000000000002',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '2024-02-01 09:00:00+00'
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'Project Gamma',
    'Creating a mobile application for real-time collaboration and project management with cross-platform support.',
    'Completed',
    'High',
    100,
    150000.00,
    '2023-12-01',
    '2024-02-28',
    'c1000000-0000-0000-0000-000000000003',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '2023-12-01 08:00:00+00'
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'Project Delta',
    'Implementing an AI-powered data analytics dashboard for business intelligence and reporting.',
    'In Progress',
    'High',
    45,
    200000.00,
    '2024-01-15',
    '2024-05-10',
    'c1000000-0000-0000-0000-000000000004',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '2024-01-15 11:00:00+00'
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    'Project Epsilon',
    'Developing a cloud-based CRM solution with automated workflow management and customer support integration.',
    'Delayed',
    'Medium',
    30,
    110000.00,
    '2023-11-20',
    '2024-03-30',
    'c1000000-0000-0000-0000-000000000005',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '2023-11-20 14:00:00+00'
  ),
  (
    'p1000000-0000-0000-0000-000000000006',
    'Project Zeta',
    'Building a modern HR management system with employee self-service portal and performance tracking.',
    'Planning',
    'Low',
    5,
    80000.00,
    '2024-02-10',
    '2024-06-15',
    'c1000000-0000-0000-0000-000000000006',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '2024-02-10 13:00:00+00'
  );

-- =============================================================================
-- 4. INSERT PROJECT TEAM MEMBERS
-- =============================================================================
-- Project Alpha team (5 members)
INSERT INTO public.project_team_members (project_id, user_id, role, hourly_rate) VALUES
  ('p1000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440002', 'developer', 85.00),
  ('p1000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440003', 'developer', 80.00),
  ('p1000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440004', 'designer', 75.00),
  ('p1000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440005', 'developer', 82.00),
  ('p1000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440006', 'qa', 70.00);

-- Project Beta team (4 members)
INSERT INTO public.project_team_members (project_id, user_id, role, hourly_rate) VALUES
  ('p1000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440007', 'developer', 80.00),
  ('p1000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440008', 'designer', 75.00),
  ('p1000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440009', 'developer', 78.00),
  ('p1000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440010', 'analyst', 65.00);

-- Project Gamma team (6 members)
INSERT INTO public.project_team_members (project_id, user_id, role, hourly_rate) VALUES
  ('p1000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440002', 'developer', 85.00),
  ('p1000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440003', 'developer', 80.00),
  ('p1000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440004', 'designer', 75.00),
  ('p1000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440005', 'developer', 82.00),
  ('p1000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440006', 'qa', 70.00),
  ('p1000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440007', 'developer', 80.00);

-- =============================================================================
-- 5. INSERT SAMPLE TASKS
-- =============================================================================
-- Tasks for Project Alpha
INSERT INTO public.tasks (
  title, description, status, priority, project_id, assigned_to, created_by,
  estimated_hours, actual_hours, due_date, tags
) VALUES
  (
    'Database Schema Design',
    'Design and implement the database schema for the customer management system',
    'Completed',
    'High',
    'p1000000-0000-0000-0000-000000000001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    40.0,
    38.5,
    '2024-01-25',
    ARRAY['database', 'backend', 'schema']
  ),
  (
    'React Component Development',
    'Develop reusable React components for the customer interface',
    'In Progress',
    'High',
    'p1000000-0000-0000-0000-000000000001',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    60.0,
    45.0,
    '2024-02-15',
    ARRAY['frontend', 'react', 'components']
  ),
  (
    'Analytics Dashboard UI',
    'Create the analytics dashboard with charts and metrics',
    'Todo',
    'Medium',
    'p1000000-0000-0000-0000-000000000001',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440001',
    35.0,
    0.0,
    '2024-03-01',
    ARRAY['ui', 'analytics', 'charts']
  );

-- Tasks for Project Beta
INSERT INTO public.tasks (
  title, description, status, priority, project_id, assigned_to, created_by,
  estimated_hours, actual_hours, due_date, tags
) VALUES
  (
    'E-commerce Platform Architecture',
    'Design the overall architecture for the e-commerce platform',
    'In Progress',
    'High',
    'p1000000-0000-0000-0000-000000000002',
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440001',
    50.0,
    12.0,
    '2024-02-20',
    ARRAY['architecture', 'planning', 'ecommerce']
  ),
  (
    'Payment Integration Research',
    'Research and evaluate payment gateway options',
    'Todo',
    'Medium',
    'p1000000-0000-0000-0000-000000000002',
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440001',
    20.0,
    0.0,
    '2024-03-01',
    ARRAY['payment', 'research', 'integration']
  );

-- =============================================================================
-- 6. INSERT SAMPLE TIME ENTRIES
-- =============================================================================
INSERT INTO public.time_entries (
  project_id, user_id, description, hours, date, billable
) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    '550e8400-e29b-41d4-a716-446655440002',
    'Database schema design and implementation',
    8.0,
    '2024-01-15',
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000001',
    '550e8400-e29b-41d4-a716-446655440003',
    'React component development',
    7.5,
    '2024-01-16',
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    '550e8400-e29b-41d4-a716-446655440007',
    'Architecture planning and documentation',
    6.0,
    '2024-02-05',
    true
  );

-- =============================================================================
-- 7. INSERT SAMPLE PROJECT COMMENTS
-- =============================================================================
INSERT INTO public.project_comments (
  project_id, user_id, comment, is_internal
) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    '550e8400-e29b-41d4-a716-446655440001',
    'Project is progressing well. Database schema completed ahead of schedule.',
    false
  ),
  (
    'p1000000-0000-0000-0000-000000000001',
    '550e8400-e29b-41d4-a716-446655440002',
    'Need to discuss API endpoints with the team before proceeding with backend implementation.',
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    '550e8400-e29b-41d4-a716-446655440001',
    'Project is facing delays due to client requirement changes. Reassessing timeline.',
    false
  ); 