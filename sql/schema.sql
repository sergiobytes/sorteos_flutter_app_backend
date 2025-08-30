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