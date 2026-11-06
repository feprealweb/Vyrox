
-- ==========================================
-- VYROX DATABASE FOUNDATION
-- ==========================================

create extension if not exists pgcrypto;

-- 1. USER PROFILES
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique,
    display_name text,
    avatar_url text,
    created_at timestamptz default now()
);

-- 2. CONVERSATIONS
create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),
    title text,
    is_group boolean default false,
    created_at timestamptz default now()
);

-- 3. CONVERSATION MEMBERS
create table if not exists public.conversation_members (
    conversation_id uuid references public.conversations(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    joined_at timestamptz default now(),
    primary key (conversation_id, user_id)
);

-- 4. MESSAGES
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid references public.conversations(id) on delete cascade,
    sender_id uuid references auth.users(id) on delete cascade,
    content text,
    created_at timestamptz default now()
);

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

-- ==========================================
-- PROFILE POLICIES
-- ==========================================

create policy "Users can read profiles"
on public.profiles
for select
to authenticated
using (true);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- ==========================================
-- CONVERSATION POLICIES
-- ==========================================

create policy "Members can read conversations"
on public.conversations
for select
to authenticated
using (
    exists (
        select 1
        from public.conversation_members m
        where m.conversation_id = id
        and m.user_id = auth.uid()
    )
);

-- ==========================================
-- MEMBERSHIP POLICIES
-- ==========================================

create policy "Users can read their memberships"
on public.conversation_members
for select
to authenticated
using (user_id = auth.uid());

-- ==========================================
-- MESSAGE POLICIES
-- ==========================================

create policy "Members can read messages"
on public.messages
for select
to authenticated
using (
    exists (
        select 1
        from public.conversation_members m
        where m.conversation_id = messages.conversation_id
        and m.user_id = auth.uid()
    )
);

create policy "Members can send messages"
on public.messages
for insert
to authenticated
with check (
    sender_id = auth.uid()
    and exists (
        select 1
        from public.conversation_members m
        where m.conversation_id = messages.conversation_id
        and m.user_id = auth.uid()
    )
);

