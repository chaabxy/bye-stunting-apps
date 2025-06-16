-- perubahan Ihsan: Menambahkan tabel articles untuk sistem edukasi
-- Script untuk membuat tabel articles dan tabel terkait

-- Tabel untuk menyimpan artikel edukasi
/*
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    header_image VARCHAR(500),
    publish_date DATE NOT NULL,
    reading_time INTEGER DEFAULT 5,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk menyimpan konten artikel (sections)
CREATE TABLE IF NOT EXISTS article_sections (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    heading VARCHAR(255) NOT NULL,
    paragraph TEXT NOT NULL,
    section_order INTEGER NOT NULL,
    illustration_type VARCHAR(20), -- 'image' atau 'video'
    illustration_url VARCHAR(500),
    illustration_caption VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk menyimpan kesimpulan artikel
CREATE TABLE IF NOT EXISTS article_conclusions (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    heading VARCHAR(255) NOT NULL DEFAULT 'Kesimpulan',
    paragraph TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk menyimpan poin-poin penting
CREATE TABLE IF NOT EXISTS article_important_points (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    point_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk optimasi query
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_popular ON articles(is_popular);
CREATE INDEX IF NOT EXISTS idx_article_sections_article_id ON article_sections(article_id);
CREATE INDEX IF NOT EXISTS idx_article_sections_order ON article_sections(article_id, section_order);
