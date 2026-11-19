grant usage on schema public to anon, authenticated;

grant select on public.media to anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant select on public.home_content to anon, authenticated;
grant select on public.section_intros to anon, authenticated;
grant select on public.about_content to anon, authenticated;
grant select on public.company_vision to anon, authenticated;
grant select on public.mission_items to anon, authenticated;
grant select on public.company_values to anon, authenticated;
grant select on public.services to anon, authenticated;
grant select on public.portfolio_items to anon, authenticated;
grant select on public.team_members to anon, authenticated;
grant select on public.stats to anon, authenticated;
grant select on public.testimonials to anon, authenticated;
grant select on public.partners to anon, authenticated;
grant select on public.articles to anon, authenticated;
grant select on public.content_blocks to anon, authenticated;
grant select on public.content_block_items to anon, authenticated;
grant select on public.legal_pages to anon, authenticated;

grant insert, update, delete on public.media to authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant insert, update, delete on public.home_content to authenticated;
grant insert, update, delete on public.section_intros to authenticated;
grant insert, update, delete on public.about_content to authenticated;
grant insert, update, delete on public.company_vision to authenticated;
grant insert, update, delete on public.mission_items to authenticated;
grant insert, update, delete on public.company_values to authenticated;
grant insert, update, delete on public.services to authenticated;
grant insert, update, delete on public.portfolio_items to authenticated;
grant insert, update, delete on public.team_members to authenticated;
grant insert, update, delete on public.stats to authenticated;
grant insert, update, delete on public.testimonials to authenticated;
grant insert, update, delete on public.partners to authenticated;
grant insert, update, delete on public.articles to authenticated;
grant insert, update, delete on public.content_blocks to authenticated;
grant insert, update, delete on public.content_block_items to authenticated;
grant insert, update, delete on public.legal_pages to authenticated;

grant select, insert, update, delete on public.contact_messages to authenticated;
grant select, insert, update, delete on public.admins to authenticated;

alter function public.set_updated_at() set search_path = public;
alter function public.articles_published_at() set search_path = public;
