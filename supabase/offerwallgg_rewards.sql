-- Offerwall.GG secure reward ledger support.
-- Offerwall.GG currencyAmount is already the placement currency (RL Coins).
-- Credits/reversals are idempotent and keyed by provider + transaction id.

create or replace function public.apply_offerwall_reward(
  p_provider text,
  p_transaction_id text,
  p_user_id uuid,
  p_offer_id text,
  p_status text,
  p_amount_usd numeric,
  p_reward_coins bigint
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  tx public.partner_reward_transactions%rowtype;
  delta bigint := 0;
  xp_delta bigint := 0;
  calc_reward_xp bigint := greatest(1, coalesce(p_reward_coins,0));
begin
  if p_provider <> 'offerwallgg' then raise exception 'unsupported provider'; end if;
  if p_transaction_id is null or length(p_transaction_id)=0 then raise exception 'missing transaction id'; end if;
  if p_reward_coins < 0 then raise exception 'invalid reward'; end if;
  if p_amount_usd < 0 then raise exception 'invalid amount'; end if;
  if p_status not in ('1','2') then raise exception 'invalid status'; end if;

  insert into public.partner_reward_transactions(
    provider,transaction_id,user_id,offer_id,status,amount_usd,
    user_share_usd,publisher_share_usd,reward_coins,reward_xp
  ) values (
    p_provider,p_transaction_id,p_user_id,p_offer_id,p_status,p_amount_usd,
    0,0,p_reward_coins,calc_reward_xp
  ) on conflict(provider,transaction_id) do nothing;

  select * into tx from public.partner_reward_transactions
   where provider=p_provider and transaction_id=p_transaction_id for update;

  if tx.user_id <> p_user_id then raise exception 'transaction user mismatch'; end if;

  if p_status='1' and not tx.credited and not tx.reversed then
    update public.profiles
       set lootix_available=coalesce(lootix_available,0)+tx.reward_coins,
           xp=coalesce(xp,0)+tx.reward_xp
     where id=tx.user_id;
    if not found then raise exception 'user profile not found'; end if;
    delta:=tx.reward_coins; xp_delta:=tx.reward_xp;
    update public.partner_reward_transactions set credited=true,status=p_status,updated_at=now() where id=tx.id;
  elsif p_status='2' and tx.credited and not tx.reversed then
    update public.profiles
       set lootix_available=greatest(0,coalesce(lootix_available,0)-tx.reward_coins),
           xp=greatest(0,coalesce(xp,0)-tx.reward_xp)
     where id=tx.user_id;
    if not found then raise exception 'user profile not found'; end if;
    delta:=-tx.reward_coins; xp_delta:=-tx.reward_xp;
    update public.partner_reward_transactions set reversed=true,status=p_status,updated_at=now() where id=tx.id;
  elsif p_status='2' and not tx.credited and not tx.reversed then
    update public.partner_reward_transactions set reversed=true,status=p_status,updated_at=now() where id=tx.id;
  else
    update public.partner_reward_transactions set status=p_status,updated_at=now() where id=tx.id;
  end if;

  return jsonb_build_object('ok',true,'transaction_id',p_transaction_id,'user_reward_coins_delta',delta,'user_xp_delta',xp_delta);
end;
$$;

revoke all on function public.apply_offerwall_reward(text,text,uuid,text,text,numeric,bigint) from public;
revoke all on function public.apply_offerwall_reward(text,text,uuid,text,text,numeric,bigint) from anon;
revoke all on function public.apply_offerwall_reward(text,text,uuid,text,text,numeric,bigint) from authenticated;
grant execute on function public.apply_offerwall_reward(text,text,uuid,text,text,numeric,bigint) to service_role;
