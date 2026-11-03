-- Modul identity: enum peran/status, tabel profiles dan auth_events.
-- Constraint dan trigger di bawah tidak dapat diekspresikan lewat schema.prisma.

CREATE TYPE "UserRole" AS ENUM ('buyer', 'agent', 'admin');
CREATE TYPE "UserStatus" AS ENUM ('pending', 'active', 'inactive');

CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'buyer',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "agency_name" TEXT,
    "avatar_path" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "detail" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
CREATE INDEX "auth_events_user_id_idx" ON "auth_events"("user_id");
CREATE INDEX "auth_events_created_at_idx" ON "auth_events"("created_at");

ALTER TABLE "auth_events" ADD CONSTRAINT "auth_events_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Lapisan ketiga validasi (klien -> Server Action -> database).
ALTER TABLE "profiles"
    ADD CONSTRAINT "profiles_full_name_not_blank" CHECK (btrim("full_name") <> ''),
    ADD CONSTRAINT "profiles_email_normalized" CHECK (
        "email" = lower(btrim("email")) AND "email" LIKE '%_@_%.__%'
    ),
    ADD CONSTRAINT "profiles_phone_format" CHECK ("phone" ~ '^\+62[0-9]{8,13}$'),
    ADD CONSTRAINT "profiles_agent_needs_agency" CHECK (
        "role" <> 'agent' OR ("agency_name" IS NOT NULL AND btrim("agency_name") <> '')
    );

-- Peran dan status tidak boleh diubah lewat jalur biasa. Hanya pernyataan
-- yang menandai dirinya sebagai operasi administratif yang diizinkan.
CREATE FUNCTION protect_profile_columns()
RETURNS TRIGGER
SET search_path = pg_catalog, public
AS $$
BEGIN
    IF (NEW."role" IS DISTINCT FROM OLD."role" OR NEW."status" IS DISTINCT FROM OLD."status")
       AND coalesce(current_setting('sang.admin_context', true), '') <> 'on' THEN
        RAISE EXCEPTION 'role dan status hanya dapat diubah oleh admin'
            USING ERRCODE = '46001';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION set_updated_at()
RETURNS TRIGGER
SET search_path = pg_catalog, public
AS $$
BEGIN
    NEW."updated_at" = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_set_updated_at
    BEFORE UPDATE ON "profiles"
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER profiles_protect_columns
    BEFORE UPDATE ON "profiles"
    FOR EACH ROW EXECUTE FUNCTION protect_profile_columns();
