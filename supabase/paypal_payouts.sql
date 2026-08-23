-- RiseLooter PayPal payout ledger.
-- Apply once in Supabase SQL Editor before enabling live payouts.

create extension if not exists pgcrypto;

create table if not exists public.withdrawal_payouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_coins integer not null check (amount_coins >= 1000),
  amount_eur numeric(12,2) not null check (amount_eur > 0),
  paypal_email text not null,
  status text not null default 'pending_partner_validation' check (status in (
    'pending_partner_validation','payout_processing','paypal_pending','paid','failed','refunded'
  )),
  paypal_sender_batch_id text unique,
  paypal_batch_id text unique,
  paypal_batch_status text,
  paypal_error text,
  created_at timestamptz not null default now(),
  partner_validated_at timestamptz,
  payout_started_at timestamptz,
  paid_at timestamptz,
  refunded_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists withdrawal_payouts_user_created_idx
  on public.withdrawal_payouts(user_id, created_at desc);
create index if not exists withdrawal_payouts_status_idx
  on public.withdrawal_payouts(status, created_at);

alter table public.withdrawal_payouts enable row level security;

drop policy if exists withdrawal_payouts_read_own on public.withdrawal_payouts;
create policy withdrawal_payouts_read_own on public.withdrawal_payouts
  for select to authenticated
  using (user_id = auth.uid());

create or replace function public.create_paypal_withdrawal(p_amount_coins integer, p_paypal_email text)
returns public.withdrawal_payouts
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  mail text := lower(trim(coalesce(p_paypal_email,'')));
  balance integer;
  row_out public.withdrawal_payouts;
begin
  if uid is null then raise exception 'authentication required'; end if;
  if p_amount_coins < 1000 then raise exception 'minimum withdrawal is 1000 RL Coins'; end if;
  if mail !~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$' then raise exception 'invalid paypal email'; end if;

  select coalesce(lootix_available,0)::integer into balance
  from public.profiles where id=uid for update;
  if balance is null then raise exception 'profile not found'; end if;
  if balance < p_amount_coins then raise exception 'insufficient RL Coins'; end if;

  update public.profiles
  set lootix_available = lootix_available - p_amount_coins
  where id=uid;

  insert into public.withdrawal_payouts(user_id,amount_coins,amount_eur,paypal_email)
  values(uid,p_amount_coins,round((p_amount_coins::numeric/100),2),mail)
  returning * into row_out;
  return row_out;
end;
$$;

revoke all on function public.create_paypal_withdrawal(integer,text) from public, anon;
grant execute on function public.create_paypal_withdrawal(integer,text) to authenticated;

create or replace function public.prepare_paypal_payout(p_withdrawal_id uuid)
returns public.withdrawal_payouts
language plpgsql
security definer
set search_path = public
as $$
declare row_out public.withdrawal_payouts;
begin
  update public.withdrawal_payouts
  set status='payout_processing',
      partner_validated_at=coalesce(partner_validated_at,now()),
      payout_started_at=coalesce(payout_started_at,now()),
      paypal_sender_batch_id=coalesce(paypal_sender_batch_id,'riselooter-'||id::text),
      updated_at=now()
  where id=p_withdrawal_id and status='pending_partner_validation'
  returning * into row_out;
  if row_out.id is null then
    select * into row_out from public.withdrawal_payouts where id=p_withdrawal_id;
  end if;
  return row_out;
end;
$$;

create or replace function public.record_paypal_payout(
  p_withdrawal_id uuid,
  p_batch_id text,
  p_batch_status text,
  p_error text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.withdrawal_payouts
  set paypal_batch_id=coalesce(p_batch_id,paypal_batch_id),
      paypal_batch_status=p_batch_status,
      paypal_error=p_error,
      status=case
        when p_batch_status='SUCCESS' then 'paid'
        when p_batch_status in ('DENIED','CANCELED') then 'failed'
        else 'paypal_pending'
      end,
      paid_at=case when p_batch_status='SUCCESS' then coalesce(paid_at,now()) else paid_at end,
      updated_at=now()
  where id=p_withdrawal_id;
end;
$$;

create or replace function public.refund_failed_paypal_payout(p_withdrawal_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare r public.withdrawal_payouts;
begin
  select * into r from public.withdrawal_payouts where id=p_withdrawal_id for update;
  if r.id is null or r.status <> 'failed' or r.refunded_at is not null then return false; end if;
  update public.profiles set lootix_available=lootix_available+r.amount_coins where id=r.user_id;
  update public.withdrawal_payouts set status='refunded',refunded_at=now(),updated_at=now() where id=r.id;
  return true;
end;
$$;

revoke all on function public.prepare_paypal_payout(uuid) from public, anon, authenticated;
revoke all on function public.record_paypal_payout(uuid,text,text,text) from public, anon, authenticated;
revoke all on function public.refund_failed_paypal_payout(uuid) from public, anon, authenticated;
