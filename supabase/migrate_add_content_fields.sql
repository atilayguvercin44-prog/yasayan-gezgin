-- ─── Migration: İçerik Alanları Eklendi ──────────────────────
-- Supabase Dashboard > SQL Editor > New Query > Çalıştır
-- Bu script mevcut tablolara eksik sütunları ekler.

-- ─── ÜLKELER: Yeni sütunlar ───────────────────────────────────
ALTER TABLE countries
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS flag              TEXT,
  ADD COLUMN IF NOT EXISTS continent         TEXT,
  ADD COLUMN IF NOT EXISTS visited_year      INT,
  ADD COLUMN IF NOT EXISTS city_count        INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS highlights        JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hero_image        TEXT,
  ADD COLUMN IF NOT EXISTS lat               FLOAT,
  ADD COLUMN IF NOT EXISTS lng               FLOAT;

-- ─── ŞEHİRLER: Yeni sütunlar ──────────────────────────────────
ALTER TABLE cities
  ADD COLUMN IF NOT EXISTS hero_image      TEXT,
  ADD COLUMN IF NOT EXISTS excerpt         TEXT,
  ADD COLUMN IF NOT EXISTS full_description TEXT,
  ADD COLUMN IF NOT EXISTS highlights      JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gallery         JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS lat             FLOAT,
  ADD COLUMN IF NOT EXISTS lng             FLOAT,
  ADD COLUMN IF NOT EXISTS visit_duration  TEXT,
  ADD COLUMN IF NOT EXISTS tags            JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tips            JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS must_see        JSONB DEFAULT '[]'::jsonb;

-- ─── RLS: Yeni sütunlar için mevcut politikalar geçerli ───────
-- (published = true kontrolü tüm sütunları kapsıyor)
