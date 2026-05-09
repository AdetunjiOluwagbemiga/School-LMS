/*
  # Demo Seed Data

  Creates a demo tenant with sample data for showcasing the LMS:
  - Demo school tenant
  - Sample courses with modules and content
  - Sample badges for gamification
  - Sample forums
  - Sample grade items
*/

-- Insert demo tenant
insert into public.tenants (id, slug, name, primary_color, secondary_color, plan, is_active, gdpr_dpa_signed, ndpa_accepted)
values (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'demo-school',
  'Oakridge Academy',
  '#2563EB',
  '#0EA5E9',
  'pro',
  true,
  true,
  true
) on conflict (slug) do nothing;

-- Insert demo courses
insert into public.courses (id, tenant_id, title, slug, description, status, delivery_mode, category, difficulty, estimated_hours, is_featured, thumbnail_url, passing_grade)
values
  (
    'b0000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Introduction to Mathematics',
    'intro-mathematics',
    'A comprehensive introduction to algebra, geometry, and calculus fundamentals designed for secondary school students.',
    'published',
    'blended',
    'Mathematics',
    'beginner',
    40,
    true,
    'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=800',
    65
  ),
  (
    'b0000000-0000-0000-0000-000000000002'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'English Language & Literature',
    'english-language-literature',
    'Develop strong reading comprehension, essay writing, and literary analysis skills through classic and modern texts.',
    'published',
    'instructor_led',
    'Languages',
    'intermediate',
    35,
    true,
    'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=800',
    70
  ),
  (
    'b0000000-0000-0000-0000-000000000003'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Computer Science Fundamentals',
    'computer-science-fundamentals',
    'Learn programming, algorithms, data structures, and the building blocks of modern software development.',
    'published',
    'self_paced',
    'Technology',
    'beginner',
    50,
    true,
    'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    60
  ),
  (
    'b0000000-0000-0000-0000-000000000004'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Biology & Life Sciences',
    'biology-life-sciences',
    'Explore cells, genetics, ecosystems, and the molecular basis of life in this engaging science course.',
    'published',
    'blended',
    'Sciences',
    'intermediate',
    45,
    false,
    'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
    65
  ),
  (
    'b0000000-0000-0000-0000-000000000005'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'World History & Civilizations',
    'world-history-civilizations',
    'Journey through human history from ancient civilizations to the modern era, analyzing key events and their impacts.',
    'published',
    'self_paced',
    'Humanities',
    'beginner',
    30,
    false,
    'https://images.pexels.com/photos/36366/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
    60
  )
on conflict (tenant_id, slug) do nothing;

-- Insert modules for Mathematics course
insert into public.modules (id, course_id, tenant_id, title, description, sort_order)
values
  ('c0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Algebra Basics', 'Variables, expressions, and equations', 1),
  ('c0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Fractions & Ratios', 'Working with fractions, decimals, and ratios', 2),
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Geometry Fundamentals', 'Shapes, angles, area, and perimeter', 3),
  ('c0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Reading Comprehension', 'Strategies for understanding complex texts', 1),
  ('c0000000-0000-0000-0000-000000000005'::uuid, 'b0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Essay Writing', 'Structuring arguments and academic writing', 2),
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Introduction to Programming', 'Variables, loops, and functions', 1),
  ('c0000000-0000-0000-0000-000000000007'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Data Structures', 'Arrays, lists, and dictionaries', 2)
on conflict do nothing;

-- Insert content items
insert into public.content_items (id, module_id, tenant_id, title, content_type, body, duration_mins, sort_order, points_value)
values
  ('d0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'What is Algebra?', 'lesson', '<h2>Introduction to Algebra</h2><p>Algebra is the branch of mathematics dealing with symbols and the rules for manipulating those symbols. In elementary algebra, those symbols (today written as Latin and Greek letters) represent quantities without fixed values, known as variables.</p><h3>Key Concepts</h3><ul><li>Variables and constants</li><li>Expressions vs equations</li><li>The order of operations</li></ul><p>Learning algebra provides the foundation for all advanced mathematics and is essential for science, engineering, and technology.</p>', 15, 1, 10),
  ('d0000000-0000-0000-0000-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Variables and Expressions', 'video', null, 20, 2, 15),
  ('d0000000-0000-0000-0000-000000000003'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Algebra Quiz 1', 'quiz', null, 30, 3, 25),
  ('d0000000-0000-0000-0000-000000000004'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Understanding Fractions', 'microlesson', '<h2>Fractions</h2><p>A fraction represents a part of a whole. It consists of a numerator (top number) and denominator (bottom number).</p>', 10, 1, 10),
  ('d0000000-0000-0000-0000-000000000005'::uuid, 'c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Hello World in Python', 'lesson', '<h2>Your First Python Program</h2><pre><code>print("Hello, World!")</code></pre><p>This simple program demonstrates the basic syntax of Python. The print() function outputs text to the screen.</p>', 20, 1, 10),
  ('d0000000-0000-0000-0000-000000000006'::uuid, 'c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Variables and Data Types', 'video', null, 25, 2, 15)
on conflict do nothing;

-- Insert badges
insert into public.badges (id, tenant_id, name, description, icon_url, criteria, points_value, rarity)
values
  ('e0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'First Steps', 'Complete your first lesson', null, '{"type":"lesson_complete","count":1}', 50, 'common'),
  ('e0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Quiz Master', 'Score 90%+ on any quiz', null, '{"type":"quiz_score","threshold":90}', 100, 'uncommon'),
  ('e0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Course Completer', 'Finish an entire course', null, '{"type":"course_complete","count":1}', 200, 'rare'),
  ('e0000000-0000-0000-0000-000000000004'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Streak Keeper', 'Log in 7 days in a row', null, '{"type":"login_streak","days":7}', 150, 'uncommon'),
  ('e0000000-0000-0000-0000-000000000005'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Top Scholar', 'Reach the top 10 on the leaderboard', null, '{"type":"leaderboard_rank","rank":10}', 500, 'epic'),
  ('e0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Perfect Score', 'Get 100% on any exam', null, '{"type":"perfect_score"}', 300, 'epic'),
  ('e0000000-0000-0000-0000-000000000007'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Legend', 'Complete 5 courses with distinction', null, '{"type":"course_complete_distinction","count":5}', 1000, 'legendary')
on conflict do nothing;

-- Insert forums
insert into public.forums (id, tenant_id, title, description, is_general, sort_order)
values
  ('f0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'General Discussion', 'Talk about anything school-related', true, 1),
  ('f0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Study Groups', 'Find study partners and discuss coursework', true, 2)
on conflict do nothing;

insert into public.forums (id, tenant_id, course_id, title, description, is_general, sort_order)
values
  ('f0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Mathematics Forum', 'Questions and discussions about math', false, 3),
  ('f0000000-0000-0000-0000-000000000004'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'CS Forum', 'Programming help and discussions', false, 4)
on conflict do nothing;

-- Insert grade items for courses
insert into public.grade_items (course_id, tenant_id, title, category, weight, max_points, sort_order)
values
  ('b0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Mid-term Exam', 'exam', 30, 100, 1),
  ('b0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Algebra Quiz 1', 'quiz', 10, 100, 2),
  ('b0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Final Exam', 'exam', 40, 100, 3),
  ('b0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Participation', 'participation', 10, 100, 4),
  ('b0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Programming Project', 'assignment', 40, 100, 1),
  ('b0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Data Structures Quiz', 'quiz', 20, 100, 2)
on conflict do nothing;
