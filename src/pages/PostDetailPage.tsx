import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockPosts, mockUsers } from '../mock-data/mockData';
import { useAuth } from '../contexts/AuthContext';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const post = mockPosts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Không tìm thấy bài viết</h1>
        <Link to="/cong-dong" className="btn-primary mt-4 inline-block">
          Quay lại
        </Link>
      </div>
    );
  }

  const postUser = mockUsers.find((u) => u.id === post.userId);
  const initialLikes = post.likes;
  const currentLikes = likes || initialLikes;

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? currentLikes - 1 : currentLikes + 1);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: Add comment
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
              className={`flex items-center space-x-2 ${
                liked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <img src="/assets/icons/heart.svg" alt="Like" className="w-6 h-6" />
              <span>{currentLikes}</span>
            </button>
            <span className="text-gray-500">
              👤 {postUser?.zaloName || postUser?.name}
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
            {post.comments.map((comment) => {
              const commentUser = mockUsers.find((u) => u.id === comment.userId);
              return (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg ${
                    comment.isPinned ? 'bg-tet-red-50 border-2 border-tet-red-300' : 'bg-gray-50'
                  }`}
                >
                  {comment.isPinned && (
                    <span className="text-xs text-tet-red-600 font-semibold">📌 Đã ghim</span>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      {commentUser?.zaloName || commentUser?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button className="text-gray-500 hover:text-red-500 flex items-center space-x-1">
                      <img src="/assets/icons/heart.svg" alt="Like" className="w-4 h-4" />
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;

