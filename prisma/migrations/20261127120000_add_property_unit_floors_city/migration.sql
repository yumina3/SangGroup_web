-- Menambahkan informasi unit, lantai, dan kota
-- tanpa menghapus data properti yang sudah ada.

ALTER TABLE public.properties
  ADD COLUMN unit TEXT NOT NULL DEFAULT 'Belum ditentukan',
  ADD COLUMN floors INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN city TEXT NOT NULL DEFAULT 'Belum ditentukan';

-- Constraint untuk menjaga validitas data.

ALTER TABLE public.properties
  ADD CONSTRAINT properties_unit_len
    CHECK (char_length(btrim(unit)) BETWEEN 1 AND 30),

  ADD CONSTRAINT properties_floors_range
    CHECK (floors BETWEEN 1 AND 5),

  ADD CONSTRAINT properties_city_len
    CHECK (char_length(btrim(city)) BETWEEN 2 AND 80);