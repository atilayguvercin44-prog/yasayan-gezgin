-- ─── Yaşayan Gezgin — Seed Data ──────────────────────────────
-- schema.sql'den SONRA çalıştır

-- Ülkeler
INSERT INTO countries (name, slug, published) VALUES
  ('Birleşik Krallık', 'birlesik-krallik', true),
  ('Azerbaycan',       'azerbaycan',       true),
  ('Romanya',          'romanya',          true),
  ('Mısır',            'misir',            true),
  ('Çekya',            'cekya',            true),
  ('Avusturya',        'avusturya',        true),
  ('Slovakya',         'slovakya',         true),
  ('Türkiye',          'turkiye',          true),
  ('İsviçre',          'isvicre',          true),
  ('İtalya',           'italya',           true),
  ('Liechtenstein',    'liechtenstein',    true),
  ('Bahreyn',          'bahreyn',          true),
  ('Hollanda',         'hollanda',         true),
  ('Belçika',          'belcika',          true),
  ('Almanya',          'almanya',          true),
  ('İspanya',          'ispanya',          true),
  ('İsveç',            'isvec',            true),
  ('Danimarka',        'danimarka',        true),
  ('Yunanistan',       'yunanistan',       true),
  ('Bulgaristan',      'bulgaristan',      true),
  ('Kuzey Makedonya',  'kuzey-makedonya',  true),
  ('Sırbistan',        'sirbistan',        true),
  ('Bosna-Hersek',     'bosna-hersek',     true),
  ('Hırvatistan',      'hirvatistan',      true),
  ('Karadağ',          'karadag',          true),
  ('Arnavutluk',       'arnavutluk',       true)
ON CONFLICT (slug) DO NOTHING;

-- ─── Şehirler ─────────────────────────────────────────────────

-- Birleşik Krallık
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Liverpool',  'liverpool'),
    ('Manchester', 'manchester'),
    ('Londra',     'londra'),
    ('Glasgow',    'glasgow'),
    ('Edinburgh',  'edinburgh')
  ) AS city(name, slug)
WHERE countries.slug = 'birlesik-krallik'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Azerbaycan
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES ('Bakü', 'baku')) AS city(name, slug)
WHERE countries.slug = 'azerbaycan'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Romanya
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Cluj-Napoca', 'cluj-napoca'),
    ('Sighișoara',  'sighisoara'),
    ('Sibiu',       'sibiu'),
    ('Brașov',      'brasov'),
    ('Bükreş',      'bukres')
  ) AS city(name, slug)
WHERE countries.slug = 'romanya'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Mısır
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Kahire',       'kahire'),
    ('İskenderiye',  'iskenderiye')
  ) AS city(name, slug)
WHERE countries.slug = 'misir'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Çekya
INSERT INTO cities (country_id, name, slug, published)
SELECT id, 'Prag', 'prag', true FROM countries
WHERE countries.slug = 'cekya'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Avusturya
INSERT INTO cities (country_id, name, slug, published)
SELECT id, 'Viyana', 'viyana', true FROM countries
WHERE countries.slug = 'avusturya'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Slovakya
INSERT INTO cities (country_id, name, slug, published)
SELECT id, 'Bratislava', 'bratislava', true FROM countries
WHERE countries.slug = 'slovakya'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Türkiye
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('İstanbul',   'istanbul'),
    ('Gaziantep',  'gaziantep'),
    ('Antakya',    'antakya')
  ) AS city(name, slug)
WHERE countries.slug = 'turkiye'
ON CONFLICT (country_id, slug) DO NOTHING;

-- İsviçre
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Cenevre', 'cenevre'),
    ('Chur',    'chur'),
    ('Zürih',   'zurih')
  ) AS city(name, slug)
WHERE countries.slug = 'isvicre'
ON CONFLICT (country_id, slug) DO NOTHING;

-- İtalya
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Milano', 'milano'),
    ('Tirano', 'tirano')
  ) AS city(name, slug)
WHERE countries.slug = 'italya'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Hollanda
INSERT INTO cities (country_id, name, slug, published)
SELECT id, 'Amsterdam', 'amsterdam', true FROM countries
WHERE countries.slug = 'hollanda'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Belçika
INSERT INTO cities (country_id, name, slug, published)
SELECT id, 'Brüksel', 'bruksel', true FROM countries
WHERE countries.slug = 'belcika'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Almanya
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Köln',       'koln'),
    ('Düsseldorf', 'dusseldorf')
  ) AS city(name, slug)
WHERE countries.slug = 'almanya'
ON CONFLICT (country_id, slug) DO NOTHING;

-- İspanya
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Barcelona', 'barcelona'),
    ('Girona',    'girona')
  ) AS city(name, slug)
WHERE countries.slug = 'ispanya'
ON CONFLICT (country_id, slug) DO NOTHING;

-- İsveç
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Stockholm', 'stockholm'),
    ('Malmö',     'malmo')
  ) AS city(name, slug)
WHERE countries.slug = 'isvec'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Danimarka
INSERT INTO cities (country_id, name, slug, published)
SELECT id, 'Kopenhag', 'kopenhag', true FROM countries
WHERE countries.slug = 'danimarka'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Yunanistan
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Selanik', 'selanik'),
    ('Kavala',  'kavala')
  ) AS city(name, slug)
WHERE countries.slug = 'yunanistan'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Bulgaristan
INSERT INTO cities (country_id, name, slug, published)
SELECT id, 'Sofya', 'sofya', true FROM countries
WHERE countries.slug = 'bulgaristan'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Kuzey Makedonya
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Üsküp', 'uskup'),
    ('Ohrid',  'ohrid'),
    ('Bitola', 'bitola')
  ) AS city(name, slug)
WHERE countries.slug = 'kuzey-makedonya'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Sırbistan
INSERT INTO cities (country_id, name, slug, published)
SELECT id, 'Belgrad', 'belgrad', true FROM countries
WHERE countries.slug = 'sirbistan'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Bosna-Hersek
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Saraybosna', 'saraybosna'),
    ('Mostar',     'mostar')
  ) AS city(name, slug)
WHERE countries.slug = 'bosna-hersek'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Hırvatistan
INSERT INTO cities (country_id, name, slug, published)
SELECT id, 'Dubrovnik', 'dubrovnik', true FROM countries
WHERE countries.slug = 'hirvatistan'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Karadağ
INSERT INTO cities (country_id, name, slug, published)
SELECT id, city.name, city.slug, true FROM countries,
  (VALUES
    ('Budva',  'budva'),
    ('Kotor',  'kotor'),
    ('Perast', 'perast')
  ) AS city(name, slug)
WHERE countries.slug = 'karadag'
ON CONFLICT (country_id, slug) DO NOTHING;

-- Arnavutluk
INSERT INTO cities (country_id, name, slug, published)
SELECT id, 'Tiran', 'tiran', true FROM countries
WHERE countries.slug = 'arnavutluk'
ON CONFLICT (country_id, slug) DO NOTHING;
