-- ═══════════════════════════════════════════════
-- Road Safety Myanmar — Full Supabase Schema
-- Run this in your Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════

-- 1. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('student', 'teacher', 'parent')),
  display_name text,
  language_pref text DEFAULT 'mm',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. PARENT-STUDENT LINKS
CREATE TABLE IF NOT EXISTS parent_student_links (
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (parent_id, student_id)
);

ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;

-- 3. CLASSES
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  grade_level text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- 4. CLASS-STUDENT ENROLLMENT
CREATE TABLE IF NOT EXISTS class_students (
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, student_id)
);

ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;

-- 5. TOPICS
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_mm text NOT NULL,
  emoji text DEFAULT '📖',
  "order" int DEFAULT 0
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- 6. RULE CARDS
CREATE TABLE IF NOT EXISTS rule_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  title text,
  title_mm text,
  wrong_description text,
  right_description text,
  short_rule_mm text,
  wrong_image_url text,
  right_image_url text,
  "order" int DEFAULT 0
);

ALTER TABLE rule_cards ENABLE ROW LEVEL SECURITY;

-- 7. QUIZ QUESTIONS
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  question text NOT NULL,
  question_mm text NOT NULL,
  choices jsonb NOT NULL,
  correct_choice_index int NOT NULL,
  "order" int DEFAULT 0
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- 8. QUIZ ATTEMPTS (never overwritten — each retake creates a new row)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_type text CHECK (quiz_type IN ('pre', 'post', 'topic')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  score int DEFAULT 0,
  total int DEFAULT 0
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 9. QUIZ ATTEMPT ANSWERS
CREATE TABLE IF NOT EXISTS quiz_attempt_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id uuid REFERENCES quiz_questions(id),
  selected_choice_index int NOT NULL,
  is_correct boolean NOT NULL
);

ALTER TABLE quiz_attempt_answers ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES
-- ═══════════════════════════════════════════════

-- PROFILES
DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
CREATE POLICY "profiles_read_own" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- PARENT-STUDENT LINKS
DROP POLICY IF EXISTS "parents_read_own_links" ON parent_student_links;
CREATE POLICY "parents_read_own_links" ON parent_student_links
  FOR SELECT USING (auth.uid() = parent_id);
DROP POLICY IF EXISTS "teachers_read_links" ON parent_student_links;
CREATE POLICY "teachers_read_links" ON parent_student_links
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher'));
DROP POLICY IF EXISTS "parents_insert_links" ON parent_student_links;
CREATE POLICY "parents_insert_links" ON parent_student_links
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- CLASSES
DROP POLICY IF EXISTS "teachers_manage_classes" ON classes;
CREATE POLICY "teachers_manage_classes" ON classes
  FOR ALL USING (teacher_id = auth.uid());
DROP POLICY IF EXISTS "students_read_enrolled_classes" ON classes;
CREATE POLICY "students_read_enrolled_classes" ON classes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM class_students WHERE class_id = classes.id AND student_id = auth.uid()
  ));
DROP POLICY IF EXISTS "parents_read_child_classes" ON classes;
CREATE POLICY "parents_read_child_classes" ON classes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM parent_student_links psl
    JOIN class_students cs ON cs.student_id = psl.student_id
    WHERE psl.parent_id = auth.uid() AND cs.class_id = classes.id
  ));

-- CLASS-STUDENTS
DROP POLICY IF EXISTS "teachers_manage_enrollment" ON class_students;
CREATE POLICY "teachers_manage_enrollment" ON class_students
  FOR ALL USING (EXISTS (
    SELECT 1 FROM classes WHERE id = class_students.class_id AND teacher_id = auth.uid()
  ));
DROP POLICY IF EXISTS "students_read_own_enrollment" ON class_students;
CREATE POLICY "students_read_own_enrollment" ON class_students
  FOR SELECT USING (student_id = auth.uid());
DROP POLICY IF EXISTS "parents_read_child_enrollment" ON class_students;
CREATE POLICY "parents_read_child_enrollment" ON class_students
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM parent_student_links WHERE parent_id = auth.uid() AND student_id = class_students.student_id
  ));

-- TOPICS + RULE CARDS: public read
DROP POLICY IF EXISTS "topics_read_all" ON topics;
CREATE POLICY "topics_read_all" ON topics FOR SELECT USING (true);
DROP POLICY IF EXISTS "rule_cards_read_all" ON rule_cards;
CREATE POLICY "rule_cards_read_all" ON rule_cards FOR SELECT USING (true);

-- QUIZ QUESTIONS: public read
DROP POLICY IF EXISTS "quiz_questions_read_all" ON quiz_questions;
CREATE POLICY "quiz_questions_read_all" ON quiz_questions FOR SELECT USING (true);

-- QUIZ ATTEMPTS
DROP POLICY IF EXISTS "students_manage_own_attempts" ON quiz_attempts;
CREATE POLICY "students_manage_own_attempts" ON quiz_attempts
  FOR ALL USING (student_id = auth.uid());
DROP POLICY IF EXISTS "teachers_read_student_attempts" ON quiz_attempts;
CREATE POLICY "teachers_read_student_attempts" ON quiz_attempts
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM class_students cs
    JOIN classes c ON c.id = cs.class_id
    WHERE cs.student_id = quiz_attempts.student_id
    AND c.teacher_id = auth.uid()
  ));
DROP POLICY IF EXISTS "parents_read_child_attempts" ON quiz_attempts;
CREATE POLICY "parents_read_child_attempts" ON quiz_attempts
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM parent_student_links
    WHERE parent_id = auth.uid() AND student_id = quiz_attempts.student_id
  ));

-- QUIZ ATTEMPT ANSWERS
DROP POLICY IF EXISTS "students_read_own_answers" ON quiz_attempt_answers;
CREATE POLICY "students_read_own_answers" ON quiz_attempt_answers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM quiz_attempts WHERE id = quiz_attempt_answers.attempt_id AND student_id = auth.uid()
  ));
DROP POLICY IF EXISTS "students_insert_own_answers" ON quiz_attempt_answers;
CREATE POLICY "students_insert_own_answers" ON quiz_attempt_answers
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM quiz_attempts WHERE id = quiz_attempt_answers.attempt_id AND student_id = auth.uid()
  ));
DROP POLICY IF EXISTS "teachers_read_student_answers" ON quiz_attempt_answers;
CREATE POLICY "teachers_read_student_answers" ON quiz_attempt_answers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM quiz_attempts qa
    JOIN class_students cs ON cs.student_id = qa.student_id
    JOIN classes c ON c.id = cs.class_id
    WHERE qa.id = quiz_attempt_answers.attempt_id
    AND c.teacher_id = auth.uid()
  ));
DROP POLICY IF EXISTS "parents_read_child_answers" ON quiz_attempt_answers;
CREATE POLICY "parents_read_child_answers" ON quiz_attempt_answers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM quiz_attempts qa
    JOIN parent_student_links psl ON psl.student_id = qa.student_id
    WHERE qa.id = quiz_attempt_answers.attempt_id
    AND psl.parent_id = auth.uid()
  ));

-- ═══════════════════════════════════════════════
-- HELPER: Get weak topics for an attempt
-- ═══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION get_weak_topics(p_attempt_id uuid)
RETURNS TABLE (topic_id uuid, topic_name_mm text, wrong_count bigint)
LANGUAGE sql
AS $$
  SELECT
    qq.topic_id,
    t.name_mm,
    COUNT(*) FILTER (WHERE qaa.is_correct = false)::bigint AS wrong_count
  FROM quiz_attempt_answers qaa
  JOIN quiz_questions qq ON qq.id = qaa.question_id
  JOIN topics t ON t.id = qq.topic_id
  WHERE qaa.attempt_id = p_attempt_id
  GROUP BY qq.topic_id, t.name_mm
  HAVING COUNT(*) FILTER (WHERE qaa.is_correct = false) > 0
  ORDER BY wrong_count DESC;
$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_answers_attempt ON quiz_attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_rule_cards_topic ON rule_cards(topic_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_topic ON quiz_questions(topic_id);
