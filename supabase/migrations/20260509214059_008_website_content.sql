/*
  # Website Content Tables

  1. New Tables
    - `website_news` - News/blog posts with category, image, and publication status
    - `website_events` - School calendar events with start/end dates and category
    - `website_staff` - Staff directory entries with photo, bio, and department
    - `website_gallery` - Media gallery items (photos/videos) grouped by album
    - `website_inquiries` - Contact form submissions from prospective families
    - `website_fee_payments` - Online fee payment records

  2. Security
    - RLS enabled on all tables
    - Public SELECT on published content (news, events, staff, gallery)
    - INSERT on inquiries for anonymous users (contact form)
    - Admin-only mutations via authenticated + school_admin role check
*/

-- News / Blog
CREATE TABLE IF NOT EXISTS website_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text DEFAULT '',
  body text DEFAULT '',
  category text DEFAULT 'news',
  image_url text DEFAULT '',
  author_name text DEFAULT '',
  published_at timestamptz,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, slug)
);

ALTER TABLE website_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published news"
  ON website_news FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can insert news"
  ON website_news FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_news.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update news"
  ON website_news FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_news.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_news.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  );

-- Events / Calendar
CREATE TABLE IF NOT EXISTS website_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'general',
  start_date date NOT NULL,
  end_date date,
  all_day boolean DEFAULT true,
  location text DEFAULT '',
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE website_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published events"
  ON website_events FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can insert events"
  ON website_events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_events.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update events"
  ON website_events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_events.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_events.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  );

-- Staff Directory
CREATE TABLE IF NOT EXISTS website_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  title text DEFAULT '',
  department text DEFAULT '',
  bio text DEFAULT '',
  photo_url text DEFAULT '',
  email text DEFAULT '',
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE website_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published staff"
  ON website_staff FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can insert staff"
  ON website_staff FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_staff.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update staff"
  ON website_staff FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_staff.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_staff.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  );

-- Gallery
CREATE TABLE IF NOT EXISTS website_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  album text DEFAULT 'General',
  title text DEFAULT '',
  caption text DEFAULT '',
  media_url text NOT NULL,
  media_type text DEFAULT 'photo',
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE website_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published gallery items"
  ON website_gallery FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can insert gallery items"
  ON website_gallery FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_gallery.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update gallery items"
  ON website_gallery FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_gallery.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_gallery.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  );

-- Contact / Inquiry form
CREATE TABLE IF NOT EXISTS website_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  inquiry_type text DEFAULT 'general',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE website_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry"
  ON website_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read inquiries"
  ON website_inquiries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_inquiries.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update inquiries"
  ON website_inquiries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_inquiries.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = website_inquiries.tenant_id
        AND user_roles.role IN ('school_admin', 'super_admin')
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_website_news_tenant ON website_news(tenant_id);
CREATE INDEX IF NOT EXISTS idx_website_events_tenant ON website_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_website_events_date ON website_events(start_date);
CREATE INDEX IF NOT EXISTS idx_website_staff_tenant ON website_staff(tenant_id);
CREATE INDEX IF NOT EXISTS idx_website_gallery_tenant ON website_gallery(tenant_id);
CREATE INDEX IF NOT EXISTS idx_website_inquiries_tenant ON website_inquiries(tenant_id);
