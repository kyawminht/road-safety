import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.jsx';
import CommentItem from '../components/CommentItem.jsx';
import CommentInput from '../components/CommentInput.jsx';
import AuthPrompt from '../components/AuthPrompt.jsx';
import CreatorSection from '../components/CreatorSection.jsx';

const PAGE_SIZE = 20;

export default function CommentsPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const { data, error: fetchErr } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE);

    if (fetchErr) {
      setError('Comments ဖတ်ရှု၍ မရပါ');
      setLoading(false);
      return;
    }

    // If user is logged in, check which comments they've liked
    let likedIds = new Set();
    if (user?.id && data?.length) {
      const commentIds = data.map((c) => c.id);
      const { data: likes } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', user.id)
        .in('comment_id', commentIds);

      likedIds = new Set(likes?.map((l) => l.comment_id) || []);
    }

    const enriched = (data || []).map((c) => ({
      ...c,
      user_liked: likedIds.has(c.id),
    }));

    setComments(enriched);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Post a comment
  const handlePost = useCallback(async (text) => {
    if (!user?.id) {
      setShowAuthPrompt(true);
      return;
    }
    if (!isSupabaseConfigured()) return;

    setPosting(true);
    const { data, error: postErr } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        user_avatar: user.user_metadata?.avatar_url || null,
        text,
      })
      .select()
      .single();

    if (!postErr && data) {
      setComments((prev) => [{ ...data, user_liked: false, like_count: 0 }, ...prev]);
    }
    setPosting(false);
  }, [user]);

  // Toggle like on a comment
  const handleLike = useCallback(async (commentId, alreadyLiked) => {
    if (!user?.id) {
      setShowAuthPrompt(true);
      return;
    }
    if (!isSupabaseConfigured()) return;

    if (alreadyLiked) {
      // Unlike
      await supabase
        .from('comment_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('comment_id', commentId);

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, user_liked: false, like_count: Math.max(0, (c.like_count || 1) - 1) }
            : c,
        ),
      );
    } else {
      // Like
      await supabase
        .from('comment_likes')
        .insert({ user_id: user.id, comment_id: commentId });

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, user_liked: true, like_count: (c.like_count || 0) + 1 }
            : c,
        ),
      );
    }
  }, [user]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#0F1A2E]">
      {/* Header */}
      <div className="relative bg-[#0D9488] overflow-hidden px-6 py-5 shrink-0">
        <div className="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-12 bottom-2 w-6 h-6 rounded-full bg-white/6 pointer-events-none" />
        <div className="relative z-10 text-center">
          <h1 className="text-lg font-extrabold text-white leading-snug">
            💬 မှတ်ချက်များ
          </h1>
          <p className="text-white/70 text-xs font-medium mt-1">
            Creator နဲ့ အခြား user တွေကို ဘာပြောချင်လဲ
          </p>
        </div>
      </div>

      {/* Comment input */}
      <div className="shrink-0">
        <CommentInput onSubmit={handlePost} disabled={posting} />
      </div>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 px-8">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => { setError(null); fetchComments(); }}
              className="mt-3 text-teal-400 text-sm underline"
            >
              ထပ်ကြိုးစားပါ
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="text-5xl mb-4 block"
            >
              💭
            </motion.span>
            <p className="text-white/40 text-sm mb-1">မှတ်ချက်မရှိသေးပါ</p>
            <p className="text-white/25 text-xs">ပထမဆုံး မှတ်ချက်ရေးပါ!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.id}
                  onLike={handleLike}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Creator section at bottom */}
        <CreatorSection />
      </div>

      {/* Auth prompt */}
      <AuthPrompt open={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} />
    </div>
  );
}
