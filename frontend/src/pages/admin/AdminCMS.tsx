import React, { useState, useEffect, useCallback } from 'react';
import { ThaiIcon, CoNhonBrandIcon, VideoIcon, CommentIcon, BanIcon, HeartIcon, EmptyIcon } from '../../components/icons/ThaiIcons';
import Portal from '../../components/Portal';
import {
    getAdminCMSPosts,
    getAdminCMSStats,
    createAdminPost,
    deleteAdminPost as apiDeletePost,
    toggleBanComment,
    deleteAdminComment,
    AdminCMSPost,
    AdminCMSStats
} from '../../services/api';

const thaiConfig = {
    'all': { name: 'Tất cả', icon: '📋', color: 'gray' },
    'an-nhon': { name: 'An Nhơn', icon: '🎯', color: 'red' },
    'nhon-phong': { name: 'Nhơn Phong', icon: '🏆', color: 'blue' },
    'hoai-nhon': { name: 'Hoài Nhơn', icon: '🎲', color: 'green' }
};

const AdminCMS: React.FC = () => {
    const [posts, setPosts] = useState<AdminCMSPost[]>([]);
    const [stats, setStats] = useState<AdminCMSStats>({ videos: 0, likes: 0, comments: 0, bannedComments: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'video' | 'binh-luan'>('video');
    const [selectedThai, setSelectedThai] = useState<'all' | 'an-nhon' | 'nhon-phong' | 'hoai-nhon'>('all');
    const [selectedPost, setSelectedPost] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<{ postId: string; commentId: string } | null>(null);
    const [showVideoForm, setShowVideoForm] = useState(false);
    const [newVideo, setNewVideo] = useState({ title: '', content: '', videoUrl: '' });

    // Fetch data from API
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const thaiParam = selectedThai === 'all' ? undefined : selectedThai;
            const [postsRes, statsRes] = await Promise.all([
                getAdminCMSPosts(thaiParam),
                getAdminCMSStats(thaiParam)
            ]);
            // Safe assignment with fallback to empty array/defaults
            setPosts(postsRes?.posts || []);
            setStats(statsRes || { videos: 0, likes: 0, comments: 0, bannedComments: 0 });
        } catch (error) {
            console.error('Failed to fetch CMS data:', error);
            // Set empty defaults on error
            setPosts([]);
            setStats({ videos: 0, likes: 0, comments: 0, bannedComments: 0 });
        } finally {
            setLoading(false);
        }
    }, [selectedThai]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Computed values
    const filteredPosts = posts;
    const totalComments = stats.comments;
    const bannedComments = stats.bannedComments;
    const totalLikes = stats.likes;
    const currentThaiConfig = thaiConfig[selectedThai];

    const handleAddVideo = async () => {
        if (!newVideo.title.trim() || !newVideo.videoUrl.trim()) return;
        try {
            await createAdminPost({
                thai_id: selectedThai,
                youtube_url: newVideo.videoUrl,
                title: newVideo.title,
                content: newVideo.content || undefined
            });
            setNewVideo({ title: '', content: '', videoUrl: '' });
            setShowVideoForm(false);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to add video:', error);
        }
    };

    const handleDeleteComment = (postId: string, commentId: string) => {
        setCommentToDelete({ postId, commentId });
        setShowDeleteModal(true);
    };

    const confirmDeleteComment = async () => {
        if (commentToDelete) {
            try {
                await deleteAdminComment(commentToDelete.commentId);
                fetchData(); // Refresh data
            } catch (error) {
                console.error('Failed to delete comment:', error);
            }
            setShowDeleteModal(false);
            setCommentToDelete(null);
        }
    };

    const handleToggleBan = async (postId: string, commentId: string) => {
        try {
            await toggleBanComment(commentId);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to toggle ban:', error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await apiDeletePost(postId);
            fetchData();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-2">📺 Quản lý cộng đồng</h1>
                <p className="text-red-100">Quản lý video, bình luận và nội dung cộng đồng</p>
            </div>

            {/* Thai Selector - 3 Mini Tabs */}
            <div className="bg-white rounded-xl shadow-md p-4">
                <p className="text-sm text-gray-500 mb-3">Chọn Thai để quản lý:</p>
                <div className="grid grid-cols-3 gap-3">
                    {(['an-nhon', 'nhon-phong', 'hoai-nhon'] as const).map(thaiId => {
                        const config = thaiConfig[thaiId];
                        const isSelected = selectedThai === thaiId;
                        const thaiPosts = posts.filter(p => p.thai_id === thaiId);
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
                                <p className="text-sm text-gray-500">{thaiPosts.length} bài viết</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stats cho Thai đang chọn */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <VideoIcon size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{filteredPosts.filter(p => p.youtube_id).length}</p>
                        <p className="text-sm text-gray-500">Video</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <CommentIcon size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{totalComments}</p>
                        <p className="text-sm text-gray-500">Bình luận</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                        <BanIcon size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{bannedComments}</p>
                        <p className="text-sm text-gray-500">Đang cấm</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center space-x-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
                        <HeartIcon size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{totalLikes}</p>
                        <p className="text-sm text-gray-500">Lượt thích</p>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Tab Header với tên Thai */}
                <div className="border-b bg-gray-50 px-4 py-2">
                    <span className="text-xl font-bold">{currentThaiConfig.icon} {currentThaiConfig.name}</span>
                </div>

                {/* Tab Navigation */}
                <div className="border-b overflow-x-auto">
                    <div className="flex min-w-max">
                        <button
                            onClick={() => setActiveTab('video')}
                            className={`px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'video'
                                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            📺 Video ({filteredPosts.filter(p => p.youtube_id).length})
                        </button>
                        <button
                            onClick={() => setActiveTab('binh-luan')}
                            className={`px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'binh-luan'
                                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            💬 Bình luận ({totalComments})
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'video' ? (
                        // Video Tab - Full Layout như cũ
                        <div className="space-y-6">
                            {/* Nút Up Video */}
                            <button
                                onClick={() => setShowVideoForm(!showVideoForm)}
                                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-orange-600 transition-all shadow-lg"
                            >
                                {showVideoForm ? '❌ Đóng Form' : '➕ UP VIDEO MỚI'}
                            </button>

                            {/* Form Up Video */}
                            {showVideoForm && (
                                <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4">🎬 Thêm Video Mới - {currentThaiConfig.name}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề video *</label>
                                            <input
                                                type="text"
                                                value={newVideo.title}
                                                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                                placeholder="VD: Kết quả xổ ngày 30/01/2026"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Video (YouTube/TikTok) *</label>
                                            <input
                                                type="text"
                                                value={newVideo.videoUrl}
                                                onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung mô tả (tùy chọn)</label>
                                            <textarea
                                                value={newVideo.content}
                                                onChange={(e) => setNewVideo({ ...newVideo, content: e.target.value })}
                                                placeholder="Mô tả thêm về video..."
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            />
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleAddVideo}
                                                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                                            >
                                                ✅ ĐĂNG VIDEO
                                            </button>
                                            <button
                                                onClick={() => setShowVideoForm(false)}
                                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {filteredPosts
                                .filter(post => post.youtube_id)
                                .map((post) => (
                                    <div key={post.id} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                        {/* Post Header */}
                                        <div className="p-4 flex items-center justify-between border-b bg-white">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 flex items-center justify-center">
                                                    <CoNhonBrandIcon size={40} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800">Cổ Nhơn {currentThaiConfig.name}</h3>
                                                    <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                    {(post.comments || []).length} bình luận
                                                </span>
                                            </div>
                                        </div>

                                        {/* Post Content */}
                                        <div className="p-4 bg-white">
                                            <p className="text-gray-700 whitespace-pre-line mb-3">{post.content}</p>
                                            {post.title && (
                                                <p className="text-sm text-gray-500 mb-2">📹 {post.title}</p>
                                            )}
                                        </div>

                                        {/* YouTube Video - Real Player */}
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

                                        {/* Stats Bar */}
                                        <div className="px-4 py-3 bg-white border-t flex items-center justify-between">
                                            <div className="flex items-center space-x-6">
                                                <span className="flex items-center space-x-2 text-gray-500">
                                                    <HeartIcon size={18} />
                                                    <span>{post.like_count} thích</span>
                                                </span>
                                                <span className="flex items-center space-x-2 text-gray-500">
                                                    <CommentIcon size={18} />
                                                    <span>{(post.comments || []).length} bình luận</span>
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                                            >
                                                {selectedPost === post.id ? '🔼 Ẩn bình luận' : '🔽 Xem bình luận'}
                                            </button>
                                        </div>

                                        {/* Comments Section - Expandable */}
                                        {selectedPost === post.id && (
                                            <div className="p-4 bg-gray-50 border-t">
                                                <h4 className="font-bold text-gray-700 mb-4">🔍 Danh sách bình luận ({(post.comments || []).length})</h4>
                                                <div className="space-y-3">
                                                    {(post.comments || []).map((comment) => (
                                                        <div
                                                            key={comment.id}
                                                            className={`flex items-start space-x-3 p-3 rounded-lg ${comment.is_banned ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-200'
                                                                }`}
                                                        >
                                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                                                👤
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                                                    <span className="font-semibold text-gray-800">{comment.user_name}</span>
                                                                    <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-0.5 rounded">📞 {comment.user_phone}</span>
                                                                    {comment.is_banned && (
                                                                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">Đã cấm</span>
                                                                    )}
                                                                </div>
                                                                <p className={`text-sm ${comment.is_banned ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                                                                    {comment.content}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">{comment.created_at}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleToggleBan(post.id, comment.id)}
                                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${comment.is_banned
                                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                                        }`}
                                                                >
                                                                    {comment.is_banned ? '✅ Bỏ cấm' : '🚫 Cấm'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                                                                >
                                                                    🗑️ Xóa
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(post.comments || []).length === 0 && (
                                                        <p className="text-center text-gray-500 py-4">Chưa có bình luận nào</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                            {filteredPosts.filter(p => p.youtube_id).length === 0 && (
                                <div className="text-center py-12">
                                    <EmptyIcon size={64} />
                                    <p className="text-gray-500 mt-4">Chưa có video nào cho {currentThaiConfig.name}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // All Comments Tab
                        <div className="space-y-3">
                            <div className="mb-4">
                                <p className="text-gray-600 text-sm">Bình luận từ {currentThaiConfig.name}</p>
                            </div>
                            {filteredPosts.flatMap(post =>
                                (post.comments || []).map(comment => (
                                    <div
                                        key={comment.id}
                                        className={`flex items-start space-x-3 p-4 rounded-lg ${comment.is_banned ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'
                                            }`}
                                    >
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                            👤
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                                <span className="font-semibold text-gray-800">{comment.user_name}</span>
                                                <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-0.5 rounded">📞 {comment.user_phone}</span>
                                                {comment.is_banned && (
                                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">Đã cấm</span>
                                                )}
                                            </div>
                                            <p className={`text-sm ${comment.is_banned ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                                                {comment.content}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">{comment.created_at}</p>
                                        </div>
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                            <button
                                                onClick={() => {
                                                    const postId = posts.find(p => (p.comments || []).some(c => c.id === comment.id))?.id;
                                                    if (postId) handleToggleBan(postId, comment.id);
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${comment.is_banned
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    }`}
                                            >
                                                {comment.is_banned ? '✅ Bỏ cấm' : '🚫 Cấm'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const postId = posts.find(p => (p.comments || []).some(c => c.id === comment.id))?.id;
                                                    if (postId) handleDeleteComment(postId, comment.id);
                                                }}
                                                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                                            >
                                                🗑️ Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}

                            {totalComments === 0 && (
                                <div className="text-center py-12">
                                    <CommentIcon size={64} className="text-gray-400 mx-auto" />
                                    <p className="text-gray-500 mt-4">Chưa có bình luận nào cho {currentThaiConfig.name}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {
                showDeleteModal && (
                    <Portal>
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
                            <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full shadow-2xl my-auto">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ Xác nhận xóa</h3>
                                <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.</p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={confirmDeleteComment}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                    >
                                        🗑️ Xóa bình luận
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Portal>
                )
            }
        </div>
    );
};

export default AdminCMS;
