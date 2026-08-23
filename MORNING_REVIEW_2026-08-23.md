# RiseLooter — morning review — 2026-08-23

## Asset milestone

The approved character asset pass is now in a verifiable completed state.

- 16 canonical character masters are recorded as validated at **3072×4096** (`master-rebuild-status.txt`: `quality_guard=passed`, `masters=16`, `binary_transfer=verified`).
- The final female Rise Looter master was repaired at `76298f650d5e3c6195a76161ee0e2fe7d353a2b9`.
- All **16 gender-specific silhouettes** were rebuilt afterward at `facf390edbe560aab0d993de0ff5a717a7681c02`.
- The silhouette builder uses the approved masters, human segmentation, foreground-area sanity checks, border-touch rejection, 3072×4096 output validation, white-corner validation and black/white contrast validation.
- Runtime paths remain eight male + eight female stages with unchanged evolution names and levels.
- Beginner creator preview resolves the canonical male/female `01-debutant` asset from the selected gender.

## Cloudflare

`cloudflare-deploy-status.txt` records a successful deployment for source commit `c64aa84fcca9a75ea4dc8b00f41196c64ae73012`, which is newer than both the final female-master repair and the 16-silhouette rebuild. The recorded Worker version deploy completed successfully with rollback-source deployment disabled.

## CPX safety

Verified in code / SQL definition:

- 70% user share / 30% publisher share.
- Server-side CPX hash check before reward processing.
- Unique `(provider, transaction_id)` ledger key.
- `SELECT ... FOR UPDATE` transaction locking.
- Duplicate validated callbacks do not double-credit.
- Reversal after credit debits once.
- Reversal arriving before credit becomes terminal and blocks a later credit.
- Reward RPC is revoked from public / anon / authenticated and granted to `service_role` only.
- Updated reward SQL adds XP together with validated RL Coins and reverses the same XP on fraud/reversal.

### Important production caveat

The repository contains the updated `supabase/cpx_rewards.sql`, but a Git commit does **not** prove that the SQL has been executed in the live Supabase database. The XP/default migration therefore remains a production verification item before paid end-to-end CPX testing.

## New-user state

The intended baseline is now explicit: **0 RL Coins, 0 XP, level 1**. Existing earned balances must never be reset. The SQL hardening changes only null/default handling and the client already renders missing values as zero.

## Admin / test controls

The admin endpoint remains server-protected by a verified Supabase session and `ADMIN_USER_ID`. The UI now limits the owner control to the owner UUID, but that client check never grants admin data access.

Current unresolved runtime report: the owner still did not see the admin button after earlier changes. Since the code-side fix has been deployed, the remaining verification is the live Cloudflare `ADMIN_USER_ID` binding/session match. Do not weaken the server guard as a workaround.

The creator/evolution test control remains hidden from normal users and is tied to the owner/admin path.

## Changes made during this review pass

- Confirmed the final female master repair predates the 16-silhouette rebuild, resolving the stale “silhouettes still waiting” note.
- Confirmed the latest recorded Cloudflare success is newer than the final master/silhouette integration.
- Re-checked canonical gender routing in `fixed-stage-home.js` and `silhouette-stage-locks.js`.
- Re-checked CPX idempotency, reversal-before-credit handling and service-role-only reward execution.
- Re-checked new-account zero-baseline SQL without destructive resets.
- Refreshed `launch-readiness-overnight.txt` to reflect completed asset/deployment verification and the two real remaining production checks.

## Remaining launch blockers

1. **Apply/verify the Supabase CPX SQL migration in production** before declaring XP rewards/reversals live.
2. **Confirm live Cloudflare admin binding/session matching** so the owner account reliably exposes the admin UI while all other users remain excluded.

No character-master rewrite, evolution-name change, monetization-policy change or destructive schema operation was performed in this pass.
