create function public.articles_published_at() returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' then
    if old.published_at is not null then
      new.published_at := old.published_at;
    elsif new.status = 'published' then
      new.published_at := now();
    else
      new.published_at := null;
    end if;
  elsif new.status = 'published' then
    new.published_at := coalesce(new.published_at, now());
  else
    new.published_at := null;
  end if;
  return new;
end;
$$;

create trigger articles_published_at before insert or update on public.articles
for each row execute function public.articles_published_at();

create function public.submit_contact_message(
  p_name text,
  p_email text,
  p_phone text,
  p_message text,
  p_ip_hash text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  if p_name is null or char_length(trim(p_name)) < 2 or char_length(p_name) > 100 then
    raise exception 'invalid name';
  end if;
  if p_email is null or char_length(p_email) > 254 or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid email';
  end if;
  if p_message is null or char_length(trim(p_message)) < 10 or char_length(p_message) > 2000 then
    raise exception 'invalid message';
  end if;
  if p_ip_hash is null or char_length(p_ip_hash) = 0 then
    raise exception 'invalid ip hash';
  end if;

  select count(*) into recent_count
  from public.contact_messages
  where ip_hash = p_ip_hash and created_at > now() - interval '60 minutes';

  if recent_count >= 5 then
    return 'rate_limited';
  end if;

  insert into public.contact_messages (name, email, phone, message, ip_hash)
  values (trim(p_name), trim(p_email), nullif(trim(p_phone), ''), trim(p_message), p_ip_hash);

  return 'sent';
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text, text) to anon, authenticated;

create function public.site_route_catalog() returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'services', coalesce((select jsonb_agg(slug order by sort_order) from public.services where is_published = true), '[]'::jsonb),
    'portfolio', coalesce((select jsonb_agg(slug order by sort_order) from public.portfolio_items where is_published = true), '[]'::jsonb),
    'articles', coalesce((select jsonb_agg(slug order by published_at desc) from public.articles where status = 'published'), '[]'::jsonb),
    'articleCount', (select count(*) from public.articles where status = 'published')
  );
$$;

revoke all on function public.site_route_catalog() from public;
grant execute on function public.site_route_catalog() to anon, authenticated;
