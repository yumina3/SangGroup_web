-- Baseline SANG Group sesuai SRS.md §7 dan PRD.md.
--
-- Prasyarat: database Supabase (schema auth tersedia). Migrasi ini membuat
-- seluruh tabel bisnis, constraint, trigger status, dan policy RLS.
--
-- Catatan: backend (Prisma) terhubung sebagai role privileged sehingga RLS
-- tidak membatasi query server; RLS tetap berlaku untuk akses langsung memakai
-- anon key + JWT pengguna (Supabase REST/JS) dan menjadi lapisan pertahanan
-- tambahan. Semua keputusan akses di server tetap diperiksa di service layer.

create extension if not exists pgcrypto;

-- Bersihkan skema lama (proyek sebelumnya) agar baseline bisa dijalankan pada
-- database yang pernah memakai skema awal.
drop table if exists public.notifications cascade;
drop table if exists public.push_subscriptions cascade;
drop table if exists public.inquiry_updates cascade;
drop table if exists public.property_inquiries cascade;
drop table if exists public.favorites cascade;
drop table if exists public.property_images cascade;
drop table if exists public.site_plans cascade;
drop table if exists public.properties cascade;
drop table if exists public.property_categories cascade;
drop table if exists public.projects cascade;
drop table if exists public.contact_events cascade;
drop table if exists public.contacts cascade;
drop table if exists public.conversations cascade;
drop table if exists public.messages cascade;
drop table if exists public.tasks cascade;
drop table if exists public.inquiry_events cascade;
drop table if exists public.inquiries cascade;
drop table if exists public.verification_logs cascade;
drop table if exists public.property_photos cascade;
drop table if exists public.accounts cascade;
drop table if exists public.sessions cascade;
drop table if exists public.auth_events cascade;
drop table if exists public.profiles cascade;

drop type if exists public."UserStatus" cascade;
drop type if exists public."UserRole" cascade;
drop type if exists public."PropertyCategory" cascade;
drop type if exists public."ListingStatus" cascade;
drop type if exists public."SaleStatus" cascade;
drop type if exists public."VerificationDecision" cascade;
drop type if exists public."InquiryType" cascade;
drop type if exists public."InquiryStatus" cascade;
drop type if exists public."ContactStatus" cascade;
drop type if exists public."MessageSender" cascade;
drop type if exists public."TaskType" cascade;
drop type if exists public."TaskStatus" cascade;
drop type if exists public."NotificationStatus" cascade;
drop type if exists public."BusinessStatus" cascade;
drop type if exists public."VerificationStatus" cascade;

-- === Tipe ===

create type public."UserRole" as enum ('buyer', 'agent', 'admin');
create type public."BusinessStatus" as enum ('tersedia', 'dipesan', 'terjual');
create type public."VerificationStatus" as enum ('pending', 'approved', 'rejected');
create type public."InquiryType" as enum ('kunjungan', 'minat_beli');
create type public."InquiryStatus" as enum (
  'menunggu', 'dihubungi', 'kunjungan_dijadwalkan', 'selesai', 'dibatalkan', 'ditolak'
);
create type public."NotificationStatus" as enum ('pending', 'sent', 'failed', 'skipped');

-- === Tabel ===

create table public.profiles (
  id uuid primary key,
  full_name text not null,
  phone text,
  role public."UserRole" not null default 'buyer',
  is_active boolean not null default true,
  created_at timestamptz(3) not null default now(),
  updated_at timestamptz(3) not null default now(),
  constraint profiles_full_name_not_blank check (btrim(full_name) <> ''),
  constraint profiles_full_name_len check (char_length(full_name) between 2 and 120),
  constraint profiles_phone_format check (phone is null or phone ~ '^\+62[0-9]{8,13}$')
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text not null default '',
  address text not null default '',
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  cover_image_path text,
  is_active boolean not null default true,
  created_at timestamptz(3) not null default now(),
  updated_at timestamptz(3) not null default now(),
  constraint projects_name_not_blank check (btrim(name) <> ''),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint projects_latitude_range check (latitude is null or latitude between -90 and 90),
  constraint projects_longitude_range check (longitude is null or longitude between -180 and 180),
  constraint projects_coordinate_pair check (
    (latitude is null) = (longitude is null)
  )
);

create table public.property_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  is_active boolean not null default true,
  created_at timestamptz(3) not null default now(),
  constraint property_categories_name_not_blank check (btrim(name) <> ''),
  constraint property_categories_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  owner_id uuid not null,
  category_id uuid not null,
  slug text not null,
  title text not null,
  description text not null default '',
  price bigint not null,
  land_area integer not null,
  building_area integer not null,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  address text not null,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  business_status public."BusinessStatus" not null default 'tersedia',
  verification_status public."VerificationStatus" not null default 'pending',
  verification_note text,
  verified_by uuid,
  verified_at timestamptz(3),
  created_at timestamptz(3) not null default now(),
  updated_at timestamptz(3) not null default now(),
  constraint properties_title_len check (char_length(btrim(title)) between 3 and 160),
  constraint properties_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint properties_price_non_negative check (price >= 0),
  constraint properties_land_area_positive check (land_area > 0),
  constraint properties_building_area_positive check (building_area > 0),
  constraint properties_bedrooms_range check (bedrooms between 0 and 20),
  constraint properties_bathrooms_range check (bathrooms between 0 and 20),
  constraint properties_address_not_blank check (btrim(address) <> ''),
  constraint properties_latitude_range check (latitude is null or latitude between -90 and 90),
  constraint properties_longitude_range check (longitude is null or longitude between -180 and 180),
  constraint properties_coordinate_pair check ((latitude is null) = (longitude is null)),
  constraint properties_note_len check (verification_note is null or char_length(verification_note) <= 500)
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null,
  storage_path text not null,
  alt_text text not null default '',
  sort_order integer not null,
  is_primary boolean not null default false,
  created_at timestamptz(3) not null default now(),
  constraint property_images_storage_path_not_blank check (btrim(storage_path) <> ''),
  constraint property_images_alt_text_len check (char_length(alt_text) <= 300),
  constraint property_images_sort_order_range check (sort_order between 0 and 19)
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null,
  property_id uuid not null,
  created_at timestamptz(3) not null default now()
);

create table public.property_inquiries (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null,
  property_id uuid not null,
  inquiry_type public."InquiryType" not null,
  message text,
  status public."InquiryStatus" not null default 'menunggu',
  created_at timestamptz(3) not null default now(),
  updated_at timestamptz(3) not null default now(),
  constraint property_inquiries_message_len check (message is null or char_length(message) <= 1000)
);

create table public.inquiry_updates (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null,
  actor_id uuid,
  old_status public."InquiryStatus",
  new_status public."InquiryStatus" not null,
  note text,
  created_at timestamptz(3) not null default now(),
  constraint inquiry_updates_note_len check (note is null or char_length(note) <= 500)
);

create table public.site_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  file_path text not null,
  version text not null default '1',
  approved_for_use boolean not null default false,
  created_at timestamptz(3) not null default now(),
  constraint site_plans_file_path_not_blank check (btrim(file_path) <> '')
);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz(3) not null default now(),
  last_success_at timestamptz(3),
  revoked_at timestamptz(3),
  constraint push_subscriptions_endpoint_https check (endpoint like 'https://%'),
  constraint push_subscriptions_keys_not_blank check (btrim(p256dh) <> '' and btrim(auth) <> '')
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,
  title text not null,
  body text not null,
  url text not null,
  dedupe_key text not null,
  status public."NotificationStatus" not null default 'pending',
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz(3) not null default now(),
  sent_at timestamptz(3),
  read_at timestamptz(3),
  constraint notifications_url_internal check (url like '/%' and url not like '//%'),
  constraint notifications_attempts_range check (attempts between 0 and 10),
  constraint notifications_sent_consistent check (status <> 'sent' or sent_at is not null)
);

-- === Index & unique ===

create unique index projects_slug_key on public.projects (slug);
create index projects_is_active_idx on public.projects (is_active);

create unique index property_categories_slug_key on public.property_categories (slug);
create index property_categories_is_active_idx on public.property_categories (is_active);

create unique index properties_slug_key on public.properties (slug);
create index properties_project_verification_idx on public.properties (project_id, verification_status);
create index properties_owner_verification_idx on public.properties (owner_id, verification_status);
create index properties_verification_business_idx on public.properties (verification_status, business_status);
create index properties_category_idx on public.properties (category_id);

create unique index property_images_property_sort_key on public.property_images (property_id, sort_order);
create unique index property_images_one_primary_idx on public.property_images (property_id) where is_primary;

create unique index favorites_buyer_property_key on public.favorites (buyer_id, property_id);
create index favorites_buyer_created_idx on public.favorites (buyer_id, created_at);

create index property_inquiries_property_status_idx on public.property_inquiries (property_id, status);
create index property_inquiries_buyer_created_idx on public.property_inquiries (buyer_id, created_at);
create index property_inquiries_status_created_idx on public.property_inquiries (status, created_at);
-- Satu pengajuan aktif per pembeli+listing (FR-30, mencegah kiriman ganda).
create unique index property_inquiries_one_active_idx
  on public.property_inquiries (buyer_id, property_id)
  where status in ('menunggu', 'dihubungi', 'kunjungan_dijadwalkan');

create index inquiry_updates_inquiry_created_idx on public.inquiry_updates (inquiry_id, created_at);

create index site_plans_project_approved_idx on public.site_plans (project_id, approved_for_use);

create unique index push_subscriptions_endpoint_key on public.push_subscriptions (endpoint);
create index push_subscriptions_user_revoked_idx on public.push_subscriptions (user_id, revoked_at);

create unique index notifications_dedupe_key_key on public.notifications (dedupe_key);
create index notifications_user_created_idx on public.notifications (user_id, created_at);
create index notifications_status_created_idx on public.notifications (status, created_at);

-- === Foreign key ===

alter table public.properties
  add constraint properties_project_id_fkey foreign key (project_id) references public.projects (id) on delete restrict on update cascade,
  add constraint properties_owner_id_fkey foreign key (owner_id) references public.profiles (id) on delete restrict on update cascade,
  add constraint properties_category_id_fkey foreign key (category_id) references public.property_categories (id) on delete restrict on update cascade,
  add constraint properties_verified_by_fkey foreign key (verified_by) references public.profiles (id) on delete set null on update cascade;

alter table public.property_images
  add constraint property_images_property_id_fkey foreign key (property_id) references public.properties (id) on delete cascade on update cascade;

alter table public.favorites
  add constraint favorites_buyer_id_fkey foreign key (buyer_id) references public.profiles (id) on delete cascade on update cascade,
  add constraint favorites_property_id_fkey foreign key (property_id) references public.properties (id) on delete cascade on update cascade;

alter table public.property_inquiries
  add constraint property_inquiries_buyer_id_fkey foreign key (buyer_id) references public.profiles (id) on delete restrict on update cascade,
  add constraint property_inquiries_property_id_fkey foreign key (property_id) references public.properties (id) on delete restrict on update cascade;

alter table public.inquiry_updates
  add constraint inquiry_updates_inquiry_id_fkey foreign key (inquiry_id) references public.property_inquiries (id) on delete cascade on update cascade,
  add constraint inquiry_updates_actor_id_fkey foreign key (actor_id) references public.profiles (id) on delete set null on update cascade;

alter table public.site_plans
  add constraint site_plans_project_id_fkey foreign key (project_id) references public.projects (id) on delete cascade on update cascade;

alter table public.push_subscriptions
  add constraint push_subscriptions_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade on update cascade;

alter table public.notifications
  add constraint notifications_user_id_fkey foreign key (user_id) references public.profiles (id) on delete cascade on update cascade;

-- === Trigger updated_at ===

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
create trigger properties_set_updated_at before update on public.properties
  for each row execute function public.set_updated_at();
create trigger property_inquiries_set_updated_at before update on public.property_inquiries
  for each row execute function public.set_updated_at();

-- === Profil otomatis dari Supabase Auth (FR-21) ===

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role, is_active)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    nullif(btrim(new.raw_user_meta_data ->> 'phone'), ''),
    'buyer',
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- === Proteksi role/status akun (FR-22, FR-41) ===

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role or new.is_active is distinct from old.is_active then
    -- Role privileged = backend Prisma/worker atau admin lewat JWT.
    if current_user in ('postgres', 'supabase_admin', 'service_role') then
      return new;
    end if;
    if coalesce(public.is_admin(), false) then
      return new;
    end if;
    raise exception 'role dan status akun hanya dapat diubah oleh admin'
      using errcode = '46001';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_fields before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- === Penjaga status verifikasi (hanya admin/proses berwenang) ===

create or replace function public.guard_verification_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.verification_status is distinct from old.verification_status then
    if current_user in ('postgres', 'supabase_admin', 'service_role') then
      return new;
    end if;
    if coalesce(public.is_admin(), false) then
      return new;
    end if;
    raise exception 'status verifikasi hanya dapat diubah admin'
      using errcode = '46002';
  end if;
  return new;
end;
$$;

create trigger properties_guard_verification before update on public.properties
  for each row execute function public.guard_verification_status();

-- === Penjaga status bisnis: terjual final ===

create or replace function public.guard_business_status()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.business_status = 'terjual' and new.business_status is distinct from 'terjual' then
    raise exception 'properti terjual tidak dapat dibuka kembali'
      using errcode = '46003';
  end if;
  return new;
end;
$$;

create trigger properties_guard_business before update on public.properties
  for each row execute function public.guard_business_status();

-- === Penjaga transisi status pengajuan (VL-17) ===

create or replace function public.guard_inquiry_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    if old.status in ('selesai', 'dibatalkan', 'ditolak') then
      raise exception 'status pengajuan % sudah final', old.status using errcode = '46004';
    end if;

    -- Pembeli hanya boleh membatalkan.
    if auth.uid() is not null
       and coalesce(public.current_user_role(), '') = 'buyer'
       and new.status <> 'dibatalkan' then
      raise exception 'pembeli hanya dapat membatalkan pengajuan' using errcode = '46005';
    end if;

    if new.status <> 'dibatalkan' and not (
      (old.status = 'menunggu' and new.status in ('dihubungi', 'kunjungan_dijadwalkan', 'ditolak'))
      or (old.status = 'dihubungi' and new.status in ('kunjungan_dijadwalkan', 'selesai', 'ditolak'))
      or (old.status = 'kunjungan_dijadwalkan' and new.status in ('selesai', 'ditolak'))
    ) then
      raise exception 'transisi status pengajuan % -> % tidak diizinkan', old.status, new.status
        using errcode = '46006';
    end if;
  end if;
  return new;
end;
$$;

create trigger property_inquiries_guard_status before update on public.property_inquiries
  for each row execute function public.guard_inquiry_status();

-- === RLS helper ===

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

grant execute on function public.current_user_role() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- === RLS: aktifkan semua tabel ===

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.property_categories enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.favorites enable row level security;
alter table public.property_inquiries enable row level security;
alter table public.inquiry_updates enable row level security;
alter table public.site_plans enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.notifications enable row level security;

-- profiles: baca milik sendiri, admin semua; ubah milik sendiri (role/status
-- dilindungi trigger).
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- projects: publik hanya proyek aktif.
create policy projects_public_read on public.projects
  for select to anon, authenticated
  using (is_active = true or public.is_admin());

create policy projects_admin_write on public.projects
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- categories: publik hanya kategori aktif.
create policy categories_public_read on public.property_categories
  for select to anon, authenticated
  using (is_active = true or public.is_admin());

create policy categories_admin_write on public.property_categories
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- properties: publik hanya listing approved; agen hanya miliknya; admin semua.
create policy properties_public_read on public.properties
  for select to anon, authenticated
  using (verification_status = 'approved');

create policy properties_owner_read on public.properties
  for select to authenticated
  using (owner_id = auth.uid());

create policy properties_admin_all on public.properties
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy properties_owner_insert on public.properties
  for insert to authenticated
  with check (
    owner_id = auth.uid()
    and coalesce(public.current_user_role(), '') in ('agent', 'admin')
  );

create policy properties_owner_update on public.properties
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy properties_owner_delete on public.properties
  for delete to authenticated
  using (owner_id = auth.uid() and verification_status in ('pending', 'rejected'));

-- property_images: publik untuk listing approved; agen pemilik listing.
create policy images_public_read on public.property_images
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.verification_status = 'approved'
    )
  );

create policy images_owner_read on public.property_images
  for select to authenticated
  using (
    exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid())
  );

create policy images_admin_all on public.property_images
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy images_owner_write on public.property_images
  for all to authenticated
  using (
    exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid())
  );

-- favorites: hanya milik pembeli sendiri.
create policy favorites_own on public.favorites
  for all to authenticated
  using (buyer_id = auth.uid())
  with check (buyer_id = auth.uid());

-- property_inquiries: pembeli miliknya; agen pemilik listing; admin semua.
create policy inquiries_buyer_read on public.property_inquiries
  for select to authenticated
  using (buyer_id = auth.uid());

create policy inquiries_agent_read on public.property_inquiries
  for select to authenticated
  using (
    exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid())
  );

create policy inquiries_admin_all on public.property_inquiries
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy inquiries_buyer_insert on public.property_inquiries
  for insert to authenticated
  with check (
    buyer_id = auth.uid()
    and coalesce(public.current_user_role(), '') = 'buyer'
    and exists (
      select 1 from public.properties p
      where p.id = property_id
        and p.verification_status = 'approved'
        and p.business_status <> 'terjual'
    )
  );

create policy inquiries_buyer_cancel on public.property_inquiries
  for update to authenticated
  using (buyer_id = auth.uid() and status in ('menunggu', 'dihubungi', 'kunjungan_dijadwalkan'))
  with check (buyer_id = auth.uid());

create policy inquiries_agent_update on public.property_inquiries
  for update to authenticated
  using (
    exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid())
  );

-- inquiry_updates: terlihat oleh pihak terkait; ditulis oleh aktor terkait.
create policy inquiry_updates_read on public.inquiry_updates
  for select to authenticated
  using (
    exists (
      select 1
      from public.property_inquiries i
      join public.properties p on p.id = i.property_id
      where i.id = inquiry_id
        and (i.buyer_id = auth.uid() or p.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy inquiry_updates_insert on public.inquiry_updates
  for insert to authenticated
  with check (
    actor_id = auth.uid()
    and exists (
      select 1
      from public.property_inquiries i
      join public.properties p on p.id = i.property_id
      where i.id = inquiry_id
        and (i.buyer_id = auth.uid() or p.owner_id = auth.uid() or public.is_admin())
    )
  );

-- site_plans: publik hanya yang disetujui pengembang.
create policy site_plans_public_read on public.site_plans
  for select to anon, authenticated
  using (approved_for_use = true or public.is_admin());

create policy site_plans_admin_all on public.site_plans
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- push_subscriptions: milik sendiri.
create policy push_subscriptions_own on public.push_subscriptions
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- notifications: milik sendiri (insert hanya lewat backend/worker).
create policy notifications_own_read on public.notifications
  for select to authenticated
  using (user_id = auth.uid());

create policy notifications_own_update on public.notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
