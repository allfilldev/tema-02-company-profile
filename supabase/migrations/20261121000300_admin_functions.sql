create function public.move_sort_order(p_table text, p_id uuid, p_direction text) returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  current_order int;
  neighbor_id uuid;
  neighbor_order int;
begin
  if p_table not in ('services', 'portfolio_items', 'team_members', 'stats', 'testimonials', 'partners') then
    raise exception 'unsupported table';
  end if;
  if p_direction not in ('up', 'down') then
    raise exception 'unsupported direction';
  end if;

  execute format('select sort_order from public.%I where id = $1', p_table) into current_order using p_id;
  if current_order is null then
    return;
  end if;

  if p_direction = 'up' then
    execute format('select id, sort_order from public.%I where sort_order < $1 order by sort_order desc limit 1', p_table)
      into neighbor_id, neighbor_order using current_order;
  else
    execute format('select id, sort_order from public.%I where sort_order > $1 order by sort_order asc limit 1', p_table)
      into neighbor_id, neighbor_order using current_order;
  end if;

  if neighbor_id is null then
    return;
  end if;

  execute format('update public.%I set sort_order = case id when $1 then $2 when $3 then $4 end where id in ($1, $3)', p_table)
    using p_id, neighbor_order, neighbor_id, current_order;
end;
$$;

create function public.media_usages(p_media_id uuid) returns table (source text, label text)
language sql
stable
security invoker
set search_path = public
as $$
  with target as (select id, url from public.media where id = p_media_id)
  select 'site_settings'::text, 'Pengaturan situs'::text
    from public.site_settings s, target t where s.logo_media_id = t.id or s.default_og_media_id = t.id
  union all
  select 'home_content', 'Beranda' from public.home_content h, target t where h.hero_media_id = t.id
  union all
  select 'about_content', 'Tentang' from public.about_content a, target t
    where a.media_id = t.id or position(t.url in a.body_md) > 0
  union all
  select 'services', 'Layanan: ' || s.title from public.services s, target t
    where s.cover_media_id = t.id or position(t.url in s.body_md) > 0
  union all
  select 'portfolio_items', 'Portofolio: ' || p.title from public.portfolio_items p, target t
    where p.cover_media_id = t.id or t.id = any(p.gallery_media_ids) or position(t.url in p.body_md) > 0
  union all
  select 'team_members', 'Tim: ' || m.name from public.team_members m, target t where m.photo_media_id = t.id
  union all
  select 'testimonials', 'Testimoni: ' || x.name from public.testimonials x, target t where x.photo_media_id = t.id
  union all
  select 'partners', 'Partner: ' || r.name from public.partners r, target t where r.logo_media_id = t.id
  union all
  select 'articles', 'Artikel: ' || a.title from public.articles a, target t
    where a.cover_media_id = t.id or position(t.url in a.body_md) > 0
  union all
  select 'content_block_items', 'Blok konten: ' || b.title
    from public.content_block_items i
    join public.content_blocks b on b.id = i.block_id, target t
    where i.media_id = t.id
  union all
  select 'legal_pages', 'Halaman hukum: ' || l.title from public.legal_pages l, target t
    where position(t.url in l.sections::text) > 0;
$$;

revoke all on function public.move_sort_order(text, uuid, text) from public;
revoke all on function public.media_usages(uuid) from public;
grant execute on function public.move_sort_order(text, uuid, text) to authenticated;
grant execute on function public.media_usages(uuid) to authenticated;

create policy "media admin select" on storage.objects for select to authenticated
using (bucket_id = 'media' and public.is_admin());
