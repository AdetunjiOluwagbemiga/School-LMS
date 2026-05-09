/*
  # Seed Website Demo Content

  Populates website content tables for the demo tenant "Oakridge Academy"
  with realistic news articles, calendar events, staff members, and gallery items.
*/

-- News articles
INSERT INTO website_news (tenant_id, title, slug, excerpt, body, category, image_url, author_name, published_at, is_published)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Oakridge Sweeps National Coding Championship', 'national-coding-championship', 'Our Year 12 team claimed gold at the 2026 National Schools Coding Challenge in Abuja, beating over 200 schools.', 'Full article content here...', 'achievement', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg', 'Admin Office', '2026-04-28 09:00:00+00', true),
  ('a0000000-0000-0000-0000-000000000001', 'IGCSE Results 2025: 97% Pass Rate', 'igcse-results-2025', 'We are proud to announce our best-ever IGCSE results, with 97% of candidates achieving 5 or more A*–C grades.', 'Full article content here...', 'academics', 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg', 'Academic Office', '2026-03-15 08:00:00+00', true),
  ('a0000000-0000-0000-0000-000000000001', 'New STEM Lab Opens — Powered by Solar Energy', 'new-stem-lab-opens', 'Our state-of-the-art STEM innovation lab was officially opened today, featuring 40 workstations, 3D printers, and robotics kits.', 'Full article content here...', 'campus', 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg', 'Principal Adeyemi', '2026-02-01 10:00:00+00', true),
  ('a0000000-0000-0000-0000-000000000001', 'Inter-House Sports Day 2026 Recap', 'inter-house-sports-2026', 'Red House claimed the Inter-House Sports Day trophy after a thrilling final day of athletics and swimming.', 'Full article content here...', 'sports', 'https://images.pexels.com/photos/163487/pexels-photo-163487.jpeg', 'Sports Department', '2026-01-20 12:00:00+00', true),
  ('a0000000-0000-0000-0000-000000000001', 'Scholarship Applications Now Open for 2026/2027', 'scholarship-2027', 'Applications for academic and sports scholarships for the 2026/2027 academic year are now open. Deadline: 31 July 2026.', 'Full article content here...', 'admissions', 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg', 'Admissions Office', '2026-05-01 08:00:00+00', true)
ON CONFLICT (tenant_id, slug) DO NOTHING;

-- Calendar Events
INSERT INTO website_events (tenant_id, title, description, category, start_date, end_date, location, is_published)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Term 3 Begins', 'Students return for the final term of the academic year.', 'term', '2026-05-11', '2026-05-11', 'Oakridge Campus', true),
  ('a0000000-0000-0000-0000-000000000001', 'Mid-Term Exams', 'Scheduled mid-term examinations for all year groups.', 'exam', '2026-05-25', '2026-05-29', 'Examination Hall', true),
  ('a0000000-0000-0000-0000-000000000001', 'Founders Day Celebration', 'Annual celebration of Oakridge Academy founding. Guests, alumni, and awards ceremony.', 'event', '2026-06-07', '2026-06-07', 'Main Auditorium', true),
  ('a0000000-0000-0000-0000-000000000001', 'IGCSE Mock Exams', 'Mock examinations for Year 10 & 11 IGCSE candidates.', 'exam', '2026-06-15', '2026-06-26', 'Examination Hall', true),
  ('a0000000-0000-0000-0000-000000000001', 'Parent-Teacher Conference', 'Biannual P-T conference. Booking slots open two weeks prior.', 'event', '2026-06-20', '2026-06-20', 'Classrooms', true),
  ('a0000000-0000-0000-0000-000000000001', 'Inter-School Debate Competition', 'Regional qualifying round of the National Schools Debate League.', 'event', '2026-07-05', '2026-07-05', 'Assembly Hall', true),
  ('a0000000-0000-0000-0000-000000000001', 'End of Term 3 / Graduation', 'Final day of term. Year 12 graduation ceremony at 4 PM.', 'term', '2026-07-18', '2026-07-18', 'Sports Ground', true),
  ('a0000000-0000-0000-0000-000000000001', 'Long Vacation', 'School closed for summer holidays.', 'holiday', '2026-07-19', '2026-09-06', 'N/A', true),
  ('a0000000-0000-0000-0000-000000000001', 'New Academic Year 2026/2027 Begins', 'First day of Term 1 for the 2026/2027 session. All students and new admissions report.', 'term', '2026-09-07', '2026-09-07', 'Oakridge Campus', true)
ON CONFLICT DO NOTHING;

-- Staff
INSERT INTO website_staff (tenant_id, full_name, title, department, bio, photo_url, email, sort_order, is_published)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Dr. Chidera Adeyemi', 'Principal', 'Leadership', 'Dr. Adeyemi holds a PhD in Educational Leadership from the University of Lagos and has led Oakridge Academy since 2019, overseeing its growth from 300 to 1,200 students.', 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg', 'principal@oakridge.edu', 1, true),
  ('a0000000-0000-0000-0000-000000000001', 'Mrs. Funke Okafor', 'Vice Principal (Academics)', 'Leadership', 'With 18 years in education, Mrs. Okafor oversees curriculum development and academic standards across all year groups.', 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg', 'vp.academics@oakridge.edu', 2, true),
  ('a0000000-0000-0000-0000-000000000001', 'Mr. Tunde Fashola', 'Head of Mathematics', 'Sciences & Maths', 'Mr. Fashola is a Cambridge-trained educator with a passion for making abstract mathematics tangible. His students consistently top the IGCSE rankings.', 'https://images.pexels.com/photos/8617742/pexels-photo-8617742.jpeg', 't.fashola@oakridge.edu', 3, true),
  ('a0000000-0000-0000-0000-000000000001', 'Ms. Amara Eze', 'Head of Sciences', 'Sciences & Maths', 'Ms. Eze leads the newly opened STEM Innovation Lab and has published research on inquiry-based learning in secondary schools.', 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg', 'a.eze@oakridge.edu', 4, true),
  ('a0000000-0000-0000-0000-000000000001', 'Mr. James Adebayo', 'Head of ICT', 'Technology', 'A software engineer turned educator, Mr. Adebayo coaches our award-winning coding team and teaches Computer Science from JSS1 through Year 12.', 'https://images.pexels.com/photos/5212339/pexels-photo-5212339.jpeg', 'j.adebayo@oakridge.edu', 5, true),
  ('a0000000-0000-0000-0000-000000000001', 'Mrs. Grace Nwosu', 'Head of English & Literature', 'Humanities', 'Mrs. Nwosu is an award-winning author who brings her love of storytelling to the classroom, running our acclaimed Creative Writing Club.', 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg', 'g.nwosu@oakridge.edu', 6, true),
  ('a0000000-0000-0000-0000-000000000001', 'Coach Emeka Obi', 'Director of Sports', 'Sports', 'Coach Obi is a former national-level sprinter who has led our athletics programme to three consecutive national titles.', 'https://images.pexels.com/photos/6456303/pexels-photo-6456303.jpeg', 'e.obi@oakridge.edu', 7, true),
  ('a0000000-0000-0000-0000-000000000001', 'Ms. Halima Bello', 'School Counsellor', 'Student Welfare', 'Ms. Bello holds an MSc in Educational Psychology and provides pastoral support and career guidance to all students.', 'https://images.pexels.com/photos/3769999/pexels-photo-3769999.jpeg', 'h.bello@oakridge.edu', 8, true)
ON CONFLICT DO NOTHING;

-- Gallery
INSERT INTO website_gallery (tenant_id, album, title, caption, media_url, media_type, sort_order, is_published)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Campus Life', 'Students in the STEM Lab', 'Year 10 students working on robotics projects in the new STEM Innovation Lab.', 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg', 'photo', 1, true),
  ('a0000000-0000-0000-0000-000000000001', 'Campus Life', 'Library & Study Spaces', 'Our award-winning library houses over 15,000 volumes and 60 student workstations.', 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg', 'photo', 2, true),
  ('a0000000-0000-0000-0000-000000000001', 'Campus Life', 'Sports Facilities', 'The main athletics track and football pitch at Oakridge.', 'https://images.pexels.com/photos/163487/pexels-photo-163487.jpeg', 'photo', 3, true),
  ('a0000000-0000-0000-0000-000000000001', 'Events', 'Founders Day 2025', 'Students performing at the annual Founders Day celebration.', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'photo', 4, true),
  ('a0000000-0000-0000-0000-000000000001', 'Events', 'Graduation Ceremony 2025', 'Year 12 class of 2025 during the graduation ceremony.', 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg', 'photo', 5, true),
  ('a0000000-0000-0000-0000-000000000001', 'Academics', 'Coding Competition Win', 'Our team celebrating the national coding championship win.', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg', 'photo', 6, true),
  ('a0000000-0000-0000-0000-000000000001', 'Campus Life', 'Science Labs', 'State-of-the-art biology and chemistry laboratories.', 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg', 'photo', 7, true),
  ('a0000000-0000-0000-0000-000000000001', 'Sports', 'Inter-House Athletics 2026', 'Athletes competing in the 100m sprint on Sports Day.', 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg', 'photo', 8, true)
ON CONFLICT DO NOTHING;
