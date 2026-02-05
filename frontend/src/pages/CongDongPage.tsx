import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThaiIcon, CoNhonBrandIcon, WarningIcon, LoadingIcon, HeartIcon, CommentIcon, EmptyIcon } from '../components/icons/ThaiIcons';
import { getCommunityPosts, likePost, addComment, CommunityPost } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CommentData {
    id: string;
    user_name: string;
    content: string;
    created_at: string;
}

interface PostWithComments extends CommunityPost {
    comments?: CommentData[];
}

const thaiConfig = {
    'an-nhon': { name: 'An Nhơn', icon: '🎯', color: 'red' },
    'nhon-phong': { name: 'Nhơn Phong', icon: '🏆', color: 'blue' },
    'hoai-nhon': { name: 'Hoài Nhơn', icon: '🎲', color: 'green' }
};

const CongDongPage: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<PostWithComments[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedThai, setSelectedThai] = useState<'an-nhon' | 'nhon-phong' | 'hoai-nhon'>('an-nhon');
    const [selectedPost, setSelectedPost] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [likedPosts, setLikedPosts] = useState<Set<string>>(() => {
        // Load liked posts from localStorage
        const saved = localStorage.getItem('conhon_liked_posts');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [commentLoading, setCommentLoading] = useState(false);

    // Fetch posts from API when Thai changes
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await getCommunityPosts({ thaiId: selectedThai });
                setPosts(response.posts || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Không thể tải bài viết');
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [selectedThai]);

    // Save liked posts to localStorage
    useEffect(() => {
        localStorage.setItem('conhon_liked_posts', JSON.stringify([...likedPosts]));
    }, [likedPosts]);

    // Get videos count
    const videoPosts = posts.filter(p => p.youtube_id);
    const currentThaiConfig = thaiConfig[selectedThai];

    // Handle like toggle
    const handleLike = async (postId: string) => {
        if (!user) {
            alert('Vui lòng đăng nhập để thích bài viết');
            return;
        }

        try {
            const response = await likePost(postId);

            setLikedPosts(prev => {
                const newSet = new Set(prev);
                if (response.liked) {
                    newSet.add(postId);
                } else {
                    newSet.delete(postId);
                }
                return newSet;
            });

            // Update post like count
            setPosts(prev => prev.map(p =>
                p.id === postId
                    ? { ...p, like_count: p.like_count + (response.liked ? 1 : -1) }
                    : p
            ));
        } catch (err) {
            console.error('Like error:', err);
            alert('Không thể thực hiện thao tác');
        }
    };

    // Handle add comment
    const handleAddComment = async (postId: string) => {
        if (!newComment.trim()) return;

        if (!user) {
            alert('Vui lòng đăng nhập để bình luận');
            return;
        }

        try {
            setCommentLoading(true);
            const response = await addComment(postId, newComment.trim());

            // Add new comment to post
            setPosts(prev => prev.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        comments: [...(p.comments || []), {
                            id: response.comment.id,
                            user_name: response.comment.user_name,
                            content: response.comment.content,
                            created_at: response.comment.created_at
                        }]
                    }
                    : p
            ));

            setNewComment('');
            alert('Bình luận đã được gửi!');
        } catch (err: unknown) {
            console.error('Comment error:', err);
            const message = err instanceof Error ? err.message : 'Không thể gửi bình luận';
            alert(message);
        } finally {
            setCommentLoading(false);
        }
    };

    // Format time
    const formatTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diff = now.getTime() - date.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));

            if (hours < 1) return 'Vừa xong';
            if (hours < 24) return `${hours} giờ trước`;
            const days = Math.floor(hours / 24);
            if (days < 7) return `${days} ngày trước`;
            return date.toLocaleDateString('vi-VN');
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-gray-500 hover:text-red-600">
                            ← Trang chủ
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">🎉 Cộng đồng</h1>
                        <div className="w-16"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                {/* Thai Selector - 3 Mini Cards */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <p className="text-sm text-gray-500 mb-3">Chọn Thai để xem:</p>
                    <div className="grid grid-cols-3 gap-3">
                        {(['an-nhon', 'nhon-phong', 'hoai-nhon'] as const).map(thaiId => {
                            const config = thaiConfig[thaiId];
                            const isSelected = selectedThai === thaiId;
                            return (
                                <button
                                    key={thaiId}
                                    onClick={() => setSelectedThai(thaiId)}
                                    className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                        ? `border-${config.color}-500 bg-${config.color}-50 shadow-lg`
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                >
                                    <div className="mb-2 flex justify-center">
                                        <ThaiIcon thaiId={thaiId} size={40} />
                                    </div>
                                    <p className={`font-bold ${isSelected ? `text-${config.color}-700` : 'text-gray-800'}`}>
                                        {config.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {posts.filter(p => p.thai_id === thaiId).length} bài viết
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content with Tabs */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Tab Header với tên Thai */}
                    <div className="border-b bg-gray-50 px-4 py-2">
                        <span className="text-xl font-bold">{currentThaiConfig.icon} {currentThaiConfig.name}</span>
                    </div>

                    {/* Tab Navigation - Only Video for users */}
                    <div className="border-b flex">
                        <button
                            className="flex-1 px-6 py-4 font-semibold text-red-600 border-b-2 border-red-600 bg-red-50"
                        >
                            📺 Video ({videoPosts.length})
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Loading */}
                        {loading && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <LoadingIcon size={48} />
                                </div>
                                <p className="text-gray-500">Đang tải...</p>
                            </div>
                        )}

                        {/* Error */}
                        {error && !loading && (
                            <div className="text-center py-12">
                                <WarningIcon size={48} />
                                <p className="text-red-500 mt-4">{error}</p>
                            </div>
                        )}

                        {/* Video Tab */}
                        {!loading && !error && (
                            <div className="space-y-6">
                                {videoPosts.map((post) => (
                                    <div key={post.id} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                        {/* Post Header */}
                                        <div className="p-4 flex items-center justify-between border-b bg-white">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 flex items-center justify-center">
                                                    <CoNhonBrandIcon size={40} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800">Cổ Nhơn {currentThaiConfig.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(post.created_at).toLocaleDateString('vi-VN')} · {formatTime(post.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                {post.comments?.length || 0} bình luận
                                            </span>
                                        </div>

                                        {/* Post Content */}
                                        <div className="p-4 bg-white">
                                            <p className="text-gray-700 whitespace-pre-line mb-3">{post.content || post.title}</p>
                                        </div>

                                        {/* YouTube Video */}
                                        {post.youtube_id && (
                                            <div className="aspect-video">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${post.youtube_id}`}
                                                    title={post.title}
                                                    className="w-full h-full"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}

                                        {/* Stats Bar - Interactive */}
                                        <div className="px-4 py-3 bg-white border-t flex items-center justify-between">
                                            <div className="flex items-center space-x-6">
                                                <button
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center space-x-2 transition-all ${likedPosts.has(post.id)
                                                        ? 'text-red-500 scale-110'
                                                        : 'text-gray-500 hover:text-red-400'}`}
                                                >
                                                    <HeartIcon size={20} filled={likedPosts.has(post.id)} />
                                                    <span className="font-medium">{post.like_count} thích</span>
                                                </button>
                                                <span className="flex items-center space-x-2 text-gray-500">
                                                    <CommentIcon size={18} />
                                                    <span>{post.comments?.length || 0} bình luận</span>
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                                            >
                                                {selectedPost === post.id ? '🔼 Ẩn bình luận' : '🔽 Xem & Bình luận'}
                                            </button>
                                        </div>

                                        {/* Comments Section - Expandable */}
                                        {selectedPost === post.id && (
                                            <div className="p-4 bg-gray-50 border-t">
                                                <h4 className="font-bold text-gray-700 mb-4">📝 Bình luận ({post.comments?.length || 0})</h4>

                                                {/* Add Comment Form */}
                                                {user && (
                                                    <div className="flex space-x-2 mb-4 pb-4 border-b">
                                                        <input
                                                            type="text"
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                            placeholder="Viết bình luận của bạn..."
                                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                            disabled={commentLoading}
                                                        />
                                                        <button
                                                            onClick={() => handleAddComment(post.id)}
                                                            disabled={commentLoading}
                                                            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                                                        >
                                                            {commentLoading ? '...' : 'Gửi'}
                                                        </button>
                                                    </div>
                                                )}

                                                {!user && (
                                                    <div className="mb-4 pb-4 border-b">
                                                        <Link to="/dang-nhap" className="text-red-600 hover:underline">
                                                            Đăng nhập để bình luận
                                                        </Link>
                                                    </div>
                                                )}

                                                <div className="space-y-3">
                                                    {post.comments?.map((comment) => (
                                                        <div
                                                            key={comment.id}
                                                            className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-gray-200"
                                                        >
                                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                                                👤
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <span className="font-semibold text-gray-800">{comment.user_name}</span>
                                                                <p className="text-sm text-gray-600">{comment.content}</p>
                                                                <p className="text-xs text-gray-400 mt-1">{formatTime(comment.created_at)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(!post.comments || post.comments.length === 0) && (
                                                        <p className="text-center text-gray-500 py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {videoPosts.length === 0 && (
                                    <div className="text-center py-12">
                                        <EmptyIcon size={64} />
                                        <p className="text-gray-500 mt-4">Chưa có video nào cho {currentThaiConfig.name}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CongDongPage;
