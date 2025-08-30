create extension if not exists pgcrypto;

create table if not exists participants (
  id UUID primary key default gen_random_uuid (),
  name text not null,
  wallet_number text not null,
  photo_public_id text not null,
  photo_version text,
  phone_enc bytea not null,
  phone_last4 text not null,
  phone_hash bytea not null,
  created_at timestamptz not null default now ()
);

create unique index if not exists idx_participants_phonehash on participants (phone_hash);

create or replace view participants_masked as
select
  id,
  name,
  wallet_number,
  photo_public_id,
  photo_version,
  ('***_***_' | | phone_last4) AS phone_masked,
  created_at
from
  participants
order by
  created_at desc;

  alter table participants add column is_paid boolean default false;
  alter table participants add column paid_at timestamptz;
  alter table participants add column marked_by_email text;

  alter table participants
  add constraint chk_wallet_number_format
  check (wallet_number ~ '^[0-9]{3}$' and wallet_number::int between 1 and 840);

  create unique index if not exists idx_participants_wallet_number on participants (wallet_number);

  drop index if exists idx_participants_phonehash;