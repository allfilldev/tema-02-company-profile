alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.home_content enable row level security;
alter table public.section_intros enable row level security;
alter table public.about_content enable row level security;
alter table public.company_vision enable row level security;
alter table public.mission_items enable row level security;
alter table public.company_values enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.team_members enable row level security;
alter table public.stats enable row level security;
alter table public.testimonials enable row level security;
alter table public.partners enable row level security;
alter table public.articles enable row level security;
alter table public.content_blocks enable row level security;
alter table public.content_block_items enable row level security;
alter table public.legal_pages enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admins enable row level security;

create policy "read" on public.media for select to anon, authenticated using (true);
create policy "read" on public.site_settings for select to anon, authenticated using (true);
create policy "read" on public.home_content for select to anon, authenticated using (true);
create policy "read" on public.section_intros for select to anon, authenticated using (true);
create policy "read" on public.about_content for select to anon, authenticated using (true);
create policy "read" on public.company_vision for select to anon, authenticated using (true);
create policy "read" on public.mission_items for select to anon, authenticated using (true);
create policy "read" on public.company_values for select to anon, authenticated using (true);
create policy "read" on public.stats for select to anon, authenticated using (true);
create policy "read" on public.legal_pages for select to anon, authenticated using (true);

create policy "read" on public.services for select to anon, authenticated using (is_published = true or public.is_admin());
create policy "read" on public.portfolio_items for select to anon, authenticated using (is_published = true or public.is_admin());
create policy "read" on public.team_members for select to anon, authenticated using (is_published = true or public.is_admin());
create policy "read" on public.testimonials for select to anon, authenticated using (is_published = true or public.is_admin());
create policy "read" on public.partners for select to anon, authenticated using (is_published = true or public.is_admin());
create policy "read" on public.content_blocks for select to anon, authenticated using (is_published = true or public.is_admin());
create policy "read" on public.articles for select to anon, authenticated using (status = 'published' or public.is_admin());

create policy "read" on public.content_block_items for select to anon, authenticated using (
  public.is_admin()
  or exists (select 1 from public.content_blocks block where block.id = block_id and block.is_published = true)
);

create policy "admin read" on public.contact_messages for select to authenticated using (public.is_admin());
create policy "admin read" on public.admins for select to authenticated using (public.is_admin());

do $$
declare
  target text;
begin
  foreach target in array array[
    'media', 'site_settings', 'home_content', 'section_intros', 'about_content', 'company_vision',
    'mission_items', 'company_values', 'services', 'portfolio_items', 'team_members', 'stats',
    'testimonials', 'partners', 'articles', 'content_blocks', 'content_block_items', 'legal_pages',
    'contact_messages', 'admins'
  ]
  loop
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (public.is_admin())', target);
    execute format('create policy "admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', target);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.is_admin())', target);
  end loop;
end;
$$;
