import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post, Comment as CommentType } from '../types';
import { useAuth } from '../contexts/AuthContext';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    // TODO: Fetch post from API GET /community/posts/:id
    // For now, show not found
    setLoading(false);
    setPost(null);
  }, [postId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-tet-red-600 border-t-transparent mx-auto"></div>
        <p className="text-gray-600 mt-4">Đang tải...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Không tìm thấy bài viết</h1>
        <p className="text-gray-600 mt-2">Mã bài viết: {postId}</p>
        <Link to="/cong-dong" className="btn-primary mt-4 inline-block">
          Quay lại
        </Link>
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to add comment
    setComment('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/cong-dong" className="text-tet-red-600 hover:underline mb-4 inline-block">
        ← Quay lại
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="card mb-6">
          {post.isPinned && (
            <div className="bg-tet-red-600 text-white px-3 py-1 rounded-full inline-block mb-4 text-sm font-semibold">
              📌 Đã ghim
            </div>
          )}
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-4">{post.content}</p>
          {post.videoUrl && (
            <div className="mb-4">
              <iframe
                src={post.videoUrl}
                className="w-full h-96 rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${liked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <img src="/assets/icons/heart.svg" alt="Like" className="w-6 h-6" />
              <span>{likeCount || post.likes}</span>
            </button>
            <span className="text-gray-500">
              👤 {post.userId}
            </span>
            <span className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Comments */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Bình luận</h2>

          {/* Comment Form */}
          {user && (
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-field mb-2"
                rows={3}
                placeholder="Viết bình luận..."
              />
              <button type="submit" className="btn-primary">
                Gửi bình luận
              </button>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {(post.comments || []).map((cmt: CommentType) => (
              <div
                key={cmt.id}
                className={`p-4 rounded-lg ${cmt.isPinned ? 'bg-tet-red-50 border-2 border-tet-red-300' : 'bg-gray-50'}`}
              >
                {cmt.isPinned && (
                  <span className="text-xs text-tet-red-600 font-semibold">📌 Đã ghim</span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{cmt.userId}</span>
                  <span className="text-sm text-gray-500">
                    {cmt.createdAt ? new Date(cmt.createdAt).toLocaleDateString('vi-VN') : ''}
                  </span>
                </div>
                <p className="text-gray-700">{cmt.content}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button className="text-gray-500 hover:text-red-500 flex items-center space-x-1">
                    <img src="/assets/icons/heart.svg" alt="Like" className="w-4 h-4" />
                    <span className="text-sm">{cmt.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
