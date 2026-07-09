-- =============================================
-- Road Safety App — Full Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =============================================

-- 1. User Progress (topics completed, rules viewed, quiz scores)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  progress JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read/write own progress"
  ON user_progress FOR ALL
  USING (auth.uid() = user_id);


-- 2. Comments (general app feedback, YouTube-style)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT 'User',
  user_avatar TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  USING (true);

-- Only logged-in users can insert their own comments
CREATE POLICY "Users can insert own comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);


-- 3. Comment Likes
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can read like counts
CREATE POLICY "Anyone can read comment likes"
  ON comment_likes FOR SELECT
  USING (true);

-- Users can like/unlike comments
CREATE POLICY "Users can toggle comment likes"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own comment likes"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);


-- 4. Topic Likes
CREATE TABLE IF NOT EXISTS topic_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

ALTER TABLE topic_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can read like counts
CREATE POLICY "Anyone can read topic likes"
  ON topic_likes FOR SELECT
  USING (true);

-- Users can like/unlike topics
CREATE POLICY "Users can toggle topic likes"
  ON topic_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own topic likes"
  ON topic_likes FOR DELETE
  USING (auth.uid() = user_id);


-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user ON comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_likes_topic ON topic_likes(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_likes_user ON topic_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
