-- RiseLooter unique public usernames.
-- Usernames are case-insensitive: Venomous, venomous and VENOMOUS are identical.

create table if not exists public.username_claims (
  user_id uuid primary key,
  username text not null,
  username_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.username_claims enable row level security;

create or replace function public.claim_username(p_username text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  clean text := trim(coalesce(p_username,''));
  key text := lower(trim(coalesce(p_username,'')));
begin
  if uid is null then
    raise exception 'authentication required';
  end if;
  if clean !~ '^[A-Za-z0-9_-]{3,20}$' then
    return jsonb_build_object('ok',false,'error','invalid_username');
  end if;

  begin
    insert into public.username_claims(user_id,username,username_key)
    values(uid,clean,key)
    on conflict (user_id) do update
      set username=excluded.username,
          username_key=excluded.username_key,
          updated_at=now();
  exception when unique_violation then
    return jsonb_build_object('ok',false,'error','username_taken');
  end;

  -- Keep leaderboard profile in sync when the production schema exposes player_name.
  begin
    execute 'update public.profiles set player_name=$1 where id=$2' using clean,uid;
  exception when undefined_column then
    null;
  end;

  return jsonb_build_object('ok',true,'username',clean);
end;
$$;

revoke all on function public.claim_username(text) from public;
revoke all on function public.claim_username(text) from anon;
grant execute on function public.claim_username(text) to authenticated;

create or replace function public.username_available(p_username text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select case
    when trim(coalesce(p_username,'')) !~ '^[A-Za-z0-9_-]{3,20}$' then false
    else not exists (
      select 1 from public.username_claims
      where username_key = lower(trim(p_username))
        and user_id is distinct from auth.uid()
    )
  end;
$$;

revoke all on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;
