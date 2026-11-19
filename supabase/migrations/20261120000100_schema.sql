create function public.set_updated_at() returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text,
  public_path text,
  url text not null,
  alt text not null,
  width int not null,
  height int not null,
  size_bytes int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_has_path check (storage_path is not null or public_path is not null)
);

create table public.site_settings (
  id boolean primary key default true check (id),
  site_name text not null,
  tagline text not null,
  logo_media_id uuid references public.media (id) on delete restrict,
  default_og_media_id uuid references public.media (id) on delete restrict,
  email text not null,
  phone text not null,
  whatsapp_number text not null,
  whatsapp_message text not null,
  address_street text not null,
  address_city text not null,
  address_region text not null,
  postal_code text not null,
  address_country text not null default 'ID',
  maps_embed_url text,
  opening_hours text,
  social_links jsonb not null default '[]',
  schema_type text not null check (schema_type in ('Organization', 'LocalBusiness')),
  founded_year int,
  google_site_verification text,
  ga_measurement_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.home_content (
  id boolean primary key default true check (id),
  hero_eyebrow text,
  hero_title text not null,
  hero_subtitle text not null,
  hero_media_id uuid references public.media (id) on delete restrict,
  hero_primary_cta_label text,
  hero_primary_cta_href text,
  hero_secondary_cta_label text,
  hero_secondary_cta_href text,
  meta_title text not null,
  meta_description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.section_intros (
  section_key text primary key check (
    section_key in ('services', 'portfolio', 'team', 'stats', 'testimonials', 'partners', 'articles', 'vision', 'about', 'contact')
  ),
  eyebrow text,
  title text not null,
  description text,
  meta_title text not null,
  meta_description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.about_content (
  id boolean primary key default true check (id),
  summary text not null,
  body_md text not null,
  media_id uuid references public.media (id) on delete restrict,
  meta_title text not null,
  meta_description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_vision (
  id boolean primary key default true check (id),
  vision text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mission_items (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  sort_order int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  sort_order int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body_md text not null default '',
  cover_media_id uuid references public.media (id) on delete restrict,
  meta_title text,
  meta_description text,
  faq jsonb not null default '[]',
  sort_order int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client_name text,
  category text,
  summary text,
  body_md text not null default '',
  cover_media_id uuid references public.media (id) on delete restrict,
  gallery_media_ids uuid[] not null default '{}',
  completed_on date,
  meta_title text,
  meta_description text,
  sort_order int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  job_title text,
  bio text,
  photo_media_id uuid references public.media (id) on delete restrict,
  years_experience int,
  profiles jsonb not null default '[]',
  sort_order int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stats (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  value int not null,
  suffix text,
  sort_order int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  job_title text,
  company text,
  quote text,
  photo_media_id uuid references public.media (id) on delete restrict,
  sort_order int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_media_id uuid references public.media (id) on delete restrict,
  url text,
  sort_order int not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  meta_title text,
  meta_description text,
  lead text,
  body_md text not null default '',
  cover_media_id uuid references public.media (id) on delete restrict,
  author_id uuid references public.team_members (id) on delete restrict,
  faq jsonb not null default '[]',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  block_key text not null unique,
  eyebrow text,
  title text not null,
  description text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_block_items (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references public.content_blocks (id) on delete cascade,
  title text,
  description text,
  icon text,
  media_id uuid references public.media (id) on delete restrict,
  link_label text,
  link_href text,
  sort_order int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.legal_pages (
  slug text primary key check (slug in ('privasi', 'syarat-ketentuan', 'kebijakan-editorial')),
  title text not null,
  intro text not null,
  sections jsonb not null,
  meta_description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  ip_hash text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create function public.is_admin() returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create index services_sort_idx on public.services (sort_order);
create index portfolio_items_sort_idx on public.portfolio_items (sort_order);
create index team_members_sort_idx on public.team_members (sort_order);
create index stats_sort_idx on public.stats (sort_order);
create index testimonials_sort_idx on public.testimonials (sort_order);
create index partners_sort_idx on public.partners (sort_order);
create index articles_published_idx on public.articles (status, published_at desc);
create index content_block_items_block_idx on public.content_block_items (block_id, sort_order);
create index contact_messages_rate_idx on public.contact_messages (ip_hash, created_at desc);

create trigger set_updated_at before update on public.media for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.home_content for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.section_intros for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.about_content for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.company_vision for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.mission_items for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.company_values for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.services for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.portfolio_items for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.team_members for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.stats for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.testimonials for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.partners for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.articles for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.content_blocks for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.content_block_items for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.legal_pages for each row execute function public.set_updated_at();
