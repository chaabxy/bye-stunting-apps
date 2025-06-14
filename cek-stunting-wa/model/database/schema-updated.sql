-- Updated schema untuk mendukung semua fitur form

-- Articles/Educational content
CREATE TABLE educations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    tags TEXT[], -- PostgreSQL array type
    author_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'edukasi biasa' CHECK (status IN ('edukasi populer', 'edukasi biasa')),
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 5, -- Tambahan: waktu baca dalam menit
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content sections untuk konten utama
CREATE TABLE content_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    education_id UUID REFERENCES educations(id) ON DELETE CASCADE,
    section_order INT,
    heading TEXT,
    paragraph TEXT,
    slug VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ilustrasi untuk content sections (opsional)
CREATE TABLE content_illustrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_section_id UUID REFERENCES content_sections(id) ON DELETE CASCADE,
    type VARCHAR(10) CHECK (type IN ('image', 'video')),
    url VARCHAR(500),
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Poin-poin penting
CREATE TABLE important_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    education_id UUID REFERENCES educations(id) ON DELETE CASCADE,
    point_order INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kesimpulan
CREATE TABLE conclusions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    education_id UUID REFERENCES educations(id) ON DELETE CASCADE,
    heading VARCHAR(255) DEFAULT 'Kesimpulan',
    paragraph TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table of contents (auto-generated, bisa disimpan untuk performa)
CREATE TABLE table_of_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    education_id UUID REFERENCES educations(id) ON DELETE CASCADE,
    item_order INT,
    title VARCHAR(255),
    slug VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE education_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    education_id UUID REFERENCES educations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (education_id, user_id)
);

-- Indexes untuk performa
CREATE INDEX idx_educations_status ON educations(status);
CREATE INDEX idx_educations_category ON educations(category);
CREATE INDEX idx_educations_published_at ON educations(published_at);
CREATE INDEX idx_content_sections_education_id ON content_sections(education_id);
CREATE INDEX idx_content_sections_order ON content_sections(education_id, section_order);
