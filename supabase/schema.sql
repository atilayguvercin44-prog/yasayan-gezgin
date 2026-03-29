-- ─── Yaşayan Gezgin — Supabase Şema ─────────────────────────
-- Supabase Dashboard > SQL Editor > New Query > Çalıştır

-- Ülkeler tablosu
CREATE TABLE IF NOT EXISTS countries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  published   BOOLEAN DEFAULT false NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Şehirler tablosu
CREATE TABLE IF NOT EXISTS cities (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id                UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  name                      TEXT NOT NULL,
  slug                      TEXT NOT NULL,
  description               TEXT,
  cover_image               TEXT,
  instagram_highlight_name  TEXT,
  published                 BOOLEAN DEFAULT false NOT NULL,
  created_at                TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at                TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(country_id, slug)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_countries_slug      ON countries(slug);
CREATE INDEX IF NOT EXISTS idx_countries_published ON countries(published);
CREATE INDEX IF NOT EXISTS idx_cities_country_id   ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_slug         ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_published    ON cities(published);

-- updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_countries_updated_at
  BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON cities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities    ENABLE ROW LEVEL SECURITY;

-- Public: sadece yayınlanmış içerikleri okuyabilir
CREATE POLICY "public_read_published_countries" ON countries
  FOR SELECT USING (published = true);

CREATE POLICY "public_read_published_cities" ON cities
  FOR SELECT USING (published = true);

-- Service role tüm işlemleri yapabilir (RLS bypass — API routes bunu kullanır)
