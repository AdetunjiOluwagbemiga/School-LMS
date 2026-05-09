/*
  # Tenant Settings for Site Editor / CMS

  1. New Tables
    - `tenant_settings` — one row per tenant with JSONB settings blob

  2. Security
    - RLS enabled; public can SELECT; admins can UPDATE their own tenant row
*/

CREATE TABLE IF NOT EXISTS tenant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  CONSTRAINT tenant_settings_tenant_id_unique UNIQUE (tenant_id)
);

ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tenant settings"
  ON tenant_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update own tenant settings"
  ON tenant_settings FOR UPDATE
  TO authenticated
  USING (
    tenant_id IN (
      SELECT ur.tenant_id FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('school_admin', 'super_admin')
    )
  )
  WITH CHECK (
    tenant_id IN (
      SELECT ur.tenant_id FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('school_admin', 'super_admin')
    )
  );

-- Seed default settings for the demo tenant
DO $$
DECLARE
  default_settings jsonb;
BEGIN
  default_settings := jsonb_build_object(
    'branding', jsonb_build_object(
      'school_name', 'Oakridge Academy',
      'tagline', 'Excellence in Education',
      'logo_url', '',
      'primary_color', '#2563eb',
      'phone', '+234 801 234 5678',
      'email', 'info@oakridgeacademy.edu',
      'address', '12 Innovation Drive, Victoria Island, Lagos',
      'office_hours', 'Mon-Fri: 7:30 AM - 5:00 PM'
    ),
    'homepage', jsonb_build_object(
      'hero_headline', 'Shaping Tomorrow''s Leaders, Today',
      'hero_subtext', 'A world-class British-curriculum school in the heart of Lagos, combining academic rigour with character development since 2008.',
      'hero_image_url', 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
      'principal_name', 'Dr. Adaeze Okonkwo',
      'principal_title', 'Principal & CEO',
      'principal_photo_url', 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg',
      'principal_quote', 'At Oakridge, we believe every child has limitless potential. Our role is to unlock it through outstanding teaching, a rich curriculum, and a culture of excellence.',
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Students Enrolled', 'value', '1,200+'),
        jsonb_build_object('label', 'Qualified Teachers', 'value', '85'),
        jsonb_build_object('label', 'IGCSE Pass Rate', 'value', '97%'),
        jsonb_build_object('label', 'Years of Excellence', 'value', '17')
      )
    ),
    'pages', jsonb_build_object(
      'about_mission', 'To provide an outstanding British-standard education that develops the intellectual, moral, and social capabilities of every learner, preparing them for success in a global society.',
      'about_vision', 'To be Africa''s most innovative and inclusive school, recognised for producing confident, compassionate, and globally-competitive graduates.',
      'admissions_intro', 'We welcome applications from talented students across all backgrounds. Our admissions process is designed to identify potential and match learners to the programme that best suits their abilities.',
      'contact_intro', 'We''d love to hear from you. Whether you''re a prospective family, current parent, or alumni - our team is here to help.'
    )
  );

  INSERT INTO tenant_settings (tenant_id, settings)
  VALUES ('a0000000-0000-0000-0000-000000000001', default_settings)
  ON CONFLICT (tenant_id) DO NOTHING;
END $$;
