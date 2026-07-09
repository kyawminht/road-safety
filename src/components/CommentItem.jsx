import { motion } from 'framer-motion';
import LikeButton from './LikeButton.jsx';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'အခု';
  if (mins < 60) return `${mins} မိနစ်`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} နာရီ`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ရက်`;
  const months = Math.floor(days / 30);
  return `${months} လ`;
}

export default function CommentItem({ comment, currentUserId, onLike }) {
  const isOwner = comment.user_id === currentUserId;
  const liked = comment.user_liked || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 px-5 py-3"
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
        {comment.user_avatar ? (
          <img src={comment.user_avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          (comment.user_name || 'U').charAt(0).toUpperCase()
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-white/90 text-sm font-semibold truncate">
            {comment.user_name || 'User'}
          </span>
          {isOwner && (
            <span className="text-teal-400 text-[10px] font-medium bg-teal-400/10 px-1.5 py-0.5 rounded">
              You
            </span>
          )}
          <span className="text-white/30 text-[11px]">
            {timeAgo(comment.created_at)}
          </span>
        </div>
        <p className="text-white/70 text-sm leading-relaxed break-words">
          {comment.text}
        </p>
        <div className="mt-1.5">
          <LikeButton
            liked={liked}
            count={comment.like_count || 0}
            onToggle={() => onLike(comment.id, liked)}
            size="sm"
          />
        </div>
      </div>
    </motion.div>
  );
}
