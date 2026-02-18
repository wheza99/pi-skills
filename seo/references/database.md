# SEO Database Schema

## Core Tables

### posts
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  canonical_url TEXT,
  og_image TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  author_id UUID REFERENCES profiles(id),
  category_id UUID REFERENCES categories(id),
  
  -- SEO Score (optional)
  seo_score INTEGER,
  word_count INTEGER,
  reading_time INTEGER
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at DESC);
CREATE INDEX idx_posts_category ON posts(category_id);
```

### profiles (Authors)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  
  -- Social Links
  twitter_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Expertise (for E-E-A-T)
  expertise TEXT[],
  credentials TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_slug ON profiles(slug);
```

### categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Hierarchy (optional)
  parent_id UUID REFERENCES categories(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
```

### tags
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT
);

-- Many-to-many relationship
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

## GEO Tables (Structured Data)

### faqs
```sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faqs_post ON faqs(post_id);
```

### how_to_steps
```sql
CREATE TABLE how_to_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_howto_post ON how_to_steps(post_id);
CREATE INDEX idx_howto_order ON how_to_steps(post_id, step_number);
```

## SEO Management Tables

### redirects
```sql
CREATE TABLE redirects (
  id SERIAL PRIMARY KEY,
  source_path TEXT UNIQUE NOT NULL,
  destination_path TEXT NOT NULL,
  is_permanent BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_redirects_source ON redirects(source_path);
```

### site_settings
```sql
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  
  -- Basic
  site_name TEXT NOT NULL,
  site_description TEXT,
  site_url TEXT,
  
  -- Images
  default_og_image TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  
  -- Verification
  google_site_verification TEXT,
  bing_site_verification TEXT,
  
  -- Social
  twitter_handle TEXT,
  facebook_app_id TEXT,
  
  -- Contact
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Address (for LocalBusiness schema)
  street_address TEXT,
  city TEXT,
  region TEXT,
  postal_code TEXT,
  country TEXT,
  
  -- Social Links
  social_links JSONB DEFAULT '{}',
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### keywords
```sql
CREATE TABLE keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  difficulty INTEGER,
  
  -- Current ranking
  current_position FLOAT,
  previous_position FLOAT,
  
  -- Target page
  post_id UUID REFERENCES posts(id),
  
  -- Tracking
  tracked_since TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_keywords_keyword ON keywords(keyword);
```

### backlinks
```sql
CREATE TABLE backlinks (
  id BIGSERIAL PRIMARY KEY,
  source_url TEXT NOT NULL,
  source_domain TEXT NOT NULL,
  target_page TEXT NOT NULL,
  anchor_text TEXT,
  
  -- Link attributes
  link_type TEXT DEFAULT 'dofollow' CHECK (link_type IN ('dofollow', 'nofollow', 'sponsored', 'ugc')),
  
  -- Metrics
  domain_authority INTEGER,
  page_authority INTEGER,
  
  -- Status
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_checked TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  
  UNIQUE(source_url, target_page)
);

CREATE INDEX idx_backlinks_domain ON backlinks(source_domain);
CREATE INDEX idx_backlinks_target ON backlinks(target_page);
```

## Analytics Tables

### page_views
```sql
CREATE TABLE page_views (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  country TEXT,
  session_id TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pageviews_path ON page_views(path);
CREATE INDEX idx_pageviews_date ON page_views(visited_at);

-- Optional: Partitioning for large data
-- CREATE INDEX idx_pageviews_month ON page_views(date_trunc('month', visited_at));
```

### search_analytics (from Google Search Console)
```sql
CREATE TABLE search_analytics (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  query TEXT NOT NULL,
  page TEXT NOT NULL,
  country TEXT,
  device TEXT CHECK (device IN ('desktop', 'mobile', 'tablet')),
  clicks INTEGER,
  impressions INTEGER,
  ctr FLOAT,
  position FLOAT,
  
  UNIQUE(date, query, page, country, device)
);

CREATE INDEX idx_search_analytics_date ON search_analytics(date);
CREATE INDEX idx_search_analytics_query ON search_analytics(query);
CREATE INDEX idx_search_analytics_page ON search_analytics(page);
```

### seo_issues
```sql
CREATE TABLE seo_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  suggestion TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_seo_issues_page ON seo_issues(page_path);
CREATE INDEX idx_seo_issues_resolved ON seo_issues(is_resolved);
```

## Views for Analytics

### popular_pages
```sql
CREATE VIEW popular_pages AS
SELECT 
  path,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_visitors
FROM page_views
WHERE visited_at > NOW() - INTERVAL '30 days'
GROUP BY path
ORDER BY views DESC;
```

### seo_opportunities
```sql
CREATE VIEW seo_opportunities AS
SELECT 
  query,
  page,
  AVG(position) as avg_position,
  SUM(impressions) as total_impressions,
  SUM(clicks) as total_clicks
FROM search_analytics
WHERE date > CURRENT_DATE - INTERVAL '28 days'
GROUP BY query, page
HAVING AVG(position) BETWEEN 5 AND 20
ORDER BY total_impressions DESC;
```

### backlink_summary
```sql
CREATE VIEW backlink_summary AS
SELECT 
  source_domain,
  COUNT(*) as total_links,
  AVG(domain_authority) as avg_da,
  SUM(CASE WHEN link_type = 'dofollow' THEN 1 ELSE 0 END) as dofollow_count,
  MIN(first_seen) as oldest_link
FROM backlinks
WHERE is_active = TRUE
GROUP BY source_domain
ORDER BY avg_da DESC;
```

## Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read for published posts
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (status = 'published');

-- Authors can manage their own posts
CREATE POLICY "Authors can manage own posts"
  ON posts FOR ALL
  USING (auth.uid() = author_id);

-- Admin can do everything
CREATE POLICY "Admin full access"
  ON posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Functions & Triggers

### Update timestamp trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Auto-generate slug
```sql
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert to slug format
  base_slug := lower(title);
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '^-|-$', '', 'g');
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add suffix if needed
  WHILE EXISTS (SELECT 1 FROM posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;
```

### Calculate reading time
```sql
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- Average reading speed: 200 words per minute
  RETURN CEIL(array_length(regexp_split_to_array(content, '\s+'), 1) / 200.0);
END;
$$ LANGUAGE plsql;
```
