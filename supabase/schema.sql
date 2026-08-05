-- LocalEats Supabase schema
-- Apply this in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  city text default 'Lomé',
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_moderator(user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = user_id
      and p.role in ('moderator', 'admin')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    coalesce(new.raw_user_meta_data ->> 'username', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.spots (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  category text not null check (category in ('street', 'maquis', 'restaurant', 'patisserie', 'cafe')),
  price_range text not null check (price_range in ('$','$$','$$$')),
  address_description text not null,
  neighborhood text not null,
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  photo text not null,
  description text not null,
  opening_hours text not null default '',
  rating double precision not null default 0,
  review_count integer not null default 0,
  trending boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published', 'hidden', 'rejected')),
  added_by text not null default 'community',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.spots enable row level security;

create index if not exists spots_status_idx on public.spots (status);
create index if not exists spots_created_at_idx on public.spots (created_at desc);
create index if not exists spots_location_idx on public.spots (lat, lng);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.spots(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_name text not null,
  avatar text,
  rating integer not null check (rating between 1 and 5),
  text text not null,
  visited_tag boolean not null default false,
  date text not null default 'just now',
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create index if not exists reviews_spot_id_idx on public.reviews (spot_id);
create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  spot_id uuid not null references public.spots(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, spot_id)
);

alter table public.bookmarks enable row level security;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_type text not null check (target_type in ('spot', 'review', 'user')),
  target_id uuid not null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewed', 'resolved')),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

-- RLS policies

-- Profiles
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Spots
create policy "Published spots are viewable by everyone"
  on public.spots for select
  using (status = 'published');

create policy "Authenticated users can create spots"
  on public.spots for insert
  with check (auth.uid() is not null and owner_id = auth.uid());

create policy "Owners can update their own spots"
  on public.spots for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Moderators can manage any spot"
  on public.spots for update
  using (public.is_moderator(auth.uid()))
  with check (public.is_moderator(auth.uid()));

create policy "Owners can delete their own spots"
  on public.spots for delete
  using (auth.uid() = owner_id);

-- Reviews
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() is not null and user_id = auth.uid());

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

create policy "Moderators can manage reviews"
  on public.reviews for update
  using (public.is_moderator(auth.uid()))
  with check (public.is_moderator(auth.uid()));

-- Bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Reports
create policy "Authenticated users can create reports"
  on public.reports for insert
  with check (auth.uid() is not null and reporter_id = auth.uid());

create policy "Moderators can view reports"
  on public.reports for select
  using (public.is_moderator(auth.uid()));

create policy "Moderators can update reports"
  on public.reports for update
  using (public.is_moderator(auth.uid()))
  with check (public.is_moderator(auth.uid()));
