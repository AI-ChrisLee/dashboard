-- =============================================================================
-- SUPABASE DATABASE SCHEMA FOR PROJECT DASHBOARD
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================================================
-- 1. USERS TABLE (for authentication and team members)
-- =============================================================================
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text check (role in ('admin', 'manager', 'developer', 'designer', 'client', 'qa', 'analyst')) default 'developer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================================================
-- 2. CLIENTS TABLE
-- =============================================================================
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text,
  phone text,
  company text,
  address text,
  website text,
  contact_person text,
  notes text,
  status text check (status in ('active', 'inactive', 'prospect')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================================================
-- 3. PROJECTS TABLE
-- =============================================================================
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text check (status in ('Planning', 'In Progress', 'Completed', 'Delayed', 'On Hold', 'Cancelled')) default 'Planning',
  priority text check (priority in ('Low', 'Medium', 'High', 'Critical')) default 'Medium',
  progress integer check (progress >= 0 and progress <= 100) default 0,
  budget decimal(12,2),
  actual_cost decimal(12,2) default 0,
  start_date date,
  due_date date,
  completed_date date,
  client_id uuid references public.clients(id) on delete set null,
  project_manager_id uuid references public.users(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================================================
-- 4. PROJECT TEAM MEMBERS (Many-to-Many relationship)
-- =============================================================================
create table public.project_team_members (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  role text check (role in ('manager', 'developer', 'designer', 'qa', 'analyst', 'admin')) default 'developer',
  hourly_rate decimal(8,2),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  left_at timestamp with time zone,
  unique(project_id, user_id)
);

-- =============================================================================
-- 5. TASKS TABLE
-- =============================================================================
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text check (status in ('Todo', 'In Progress', 'In Review', 'Completed', 'Blocked')) default 'Todo',
  priority text check (priority in ('Low', 'Medium', 'High', 'Critical')) default 'Medium',
  project_id uuid references public.projects(id) on delete cascade not null,
  assigned_to uuid references public.users(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  estimated_hours decimal(6,2),
  actual_hours decimal(6,2) default 0,
  due_date date,
  completed_date date,
  tags text[], -- Array of tags
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================================================
-- 6. TIME TRACKING TABLE
-- =============================================================================
create table public.time_entries (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  description text,
  hours decimal(6,2) not null check (hours > 0),
  date date not null default current_date,
  billable boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================================================
-- 7. PROJECT COMMENTS/NOTES TABLE
-- =============================================================================
create table public.project_comments (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  comment text not null,
  is_internal boolean default false, -- Internal comments vs client-visible
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Projects indexes
create index idx_projects_status on public.projects(status);
create index idx_projects_client_id on public.projects(client_id);
create index idx_projects_project_manager_id on public.projects(project_manager_id);
create index idx_projects_due_date on public.projects(due_date);
create index idx_projects_created_at on public.projects(created_at);

-- Tasks indexes
create index idx_tasks_project_id on public.tasks(project_id);
create index idx_tasks_assigned_to on public.tasks(assigned_to);
create index idx_tasks_status on public.tasks(status);
create index idx_tasks_due_date on public.tasks(due_date);

-- Time entries indexes
create index idx_time_entries_project_id on public.time_entries(project_id);
create index idx_time_entries_user_id on public.time_entries(user_id);
create index idx_time_entries_date on public.time_entries(date);

-- Team members indexes
create index idx_project_team_members_project_id on public.project_team_members(project_id);
create index idx_project_team_members_user_id on public.project_team_members(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_team_members enable row level security;
alter table public.tasks enable row level security;
alter table public.time_entries enable row level security;
alter table public.project_comments enable row level security;

-- Users can read their own profile and team members they work with
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Projects visibility based on team membership
create policy "Users can view projects they're assigned to" on public.projects for select using (
  auth.uid() in (
    select user_id from public.project_team_members where project_id = projects.id
  ) or auth.uid() = project_manager_id or auth.uid() = created_by
);

-- Tasks visibility based on project membership
create policy "Users can view tasks for their projects" on public.tasks for select using (
  project_id in (
    select project_id from public.project_team_members where user_id = auth.uid()
  )
);

-- Time entries - users can only see their own
create policy "Users can view own time entries" on public.time_entries for select using (auth.uid() = user_id);
create policy "Users can insert own time entries" on public.time_entries for insert with check (auth.uid() = user_id);
create policy "Users can update own time entries" on public.time_entries for update using (auth.uid() = user_id);

-- =============================================================================
-- FUNCTIONS AND TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_updated_at before update on public.users
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.clients
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.projects
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.tasks
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.time_entries
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.project_comments
  for each row execute procedure public.handle_updated_at();

-- =============================================================================
-- VIEWS FOR DASHBOARD QUERIES
-- =============================================================================

-- Project dashboard view with aggregated data
create or replace view public.project_dashboard as
select 
  p.id,
  p.title,
  p.description,
  p.status,
  p.priority,
  p.progress,
  p.budget,
  p.actual_cost,
  p.start_date,
  p.due_date,
  p.completed_date,
  p.created_at,
  p.updated_at,
  c.name as client_name,
  c.company as client_company,
  pm.full_name as project_manager_name,
  (select count(*) from public.tasks where project_id = p.id) as total_tasks,
  (select count(*) from public.tasks where project_id = p.id and status = 'Completed') as completed_tasks,
  (select count(*) from public.project_team_members where project_id = p.id) as team_size,
  (select sum(hours) from public.time_entries where project_id = p.id) as total_hours,
  array(
    select u.full_name 
    from public.users u 
    join public.project_team_members ptm on u.id = ptm.user_id 
    where ptm.project_id = p.id
  ) as team_members
from public.projects p
left join public.clients c on p.client_id = c.id
left join public.users pm on p.project_manager_id = pm.id;

-- Task summary view
create or replace view public.task_summary as
select 
  t.id,
  t.title,
  t.description,
  t.status,
  t.priority,
  t.project_id,
  p.title as project_title,
  t.assigned_to,
  u.full_name as assigned_to_name,
  t.estimated_hours,
  t.actual_hours,
  t.due_date,
  t.completed_date,
  t.created_at,
  t.updated_at
from public.tasks t
left join public.projects p on t.project_id = p.id
left join public.users u on t.assigned_to = u.id; 