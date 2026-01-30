import React, { useState } from 'react';

interface Comment {
    id: string;
    author: string;
    phone: string;
    content: string;
    time: string;
    isBanned: boolean;
}

interface Post {
    id: string;
    author: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
    comments: Comment[];
    type: 'video' | 'text';
    thaiId: 'an-nhon' | 'nhon-phong' | 'hoai-nhon';
    videoUrl?: string;
    videoTitle?: string;
}

// Mock data với thaiId cho 3 Thai
const mockPosts: Post[] = [
    // Thai An Nhơn
    {
        id: '1',
        author: 'Cổ Nhơn An Nhơn',
        avatar: '🎯',
        time: '2 giờ trước',
        content: '🎉 Chúc mừng các bạn đã trúng thưởng hôm nay! Kết quả: Con Rồng 🐉',
        likes: 156,
        type: 'video',
        thaiId: 'an-nhon',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoTitle: 'Kết quả xổ ngày 30/01/2026',
        comments: [
            { id: 'c1', author: 'Nguyễn Văn A', phone: '0901234567', content: 'Tôi trúng rồiiiii 🎉', time: '1 giờ trước', isBanned: false },
            { id: 'c2', author: 'Trần Thị B', phone: '0912345678', content: 'Chúc mừng nha!', time: '30 phút trước', isBanned: false },
        ]
    },
    {
        id: '2',
        author: 'Cổ Nhơn An Nhơn',
        avatar: '📺',
        time: '5 giờ trước',
        content: '📝 Hướng dẫn cách chơi Cổ Nhơn cho người mới!',
        likes: 89,
        type: 'video',
        thaiId: 'an-nhon',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoTitle: 'Hướng dẫn chơi Cổ Nhơn',
        comments: [
            { id: 'c4', author: 'Phạm Văn D', phone: '0976543210', content: 'Hữu ích quá!', time: '4 giờ trước', isBanned: false },
        ]
    },
    // Thai Nhơn Phong
    {
        id: '3',
        author: 'Cổ Nhơn Nhơn Phong',
        avatar: '🏆',
        time: '3 giờ trước',
        content: '🔥 Kết quả chiều nay - Thai Nhơn Phong: Con Hổ 🐅',
        likes: 124,
        type: 'video',
        thaiId: 'nhon-phong',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoTitle: 'Kết quả Thai Nhơn Phong',
        comments: [
            { id: 'c5', author: 'Hoàng Thị E', phone: '0865432109', content: 'Trúng rồi!', time: '2 giờ trước', isBanned: false },
            { id: 'c6', author: 'Vũ Văn F', phone: '0754321098', content: 'Hay quá!', time: '1 giờ trước', isBanned: true },
        ]
    },
    // Thai Hoài Nhơn
    {
        id: '4',
        author: 'Cổ Nhơn Hoài Nhơn',
        avatar: '🎲',
        time: '4 giờ trước',
        content: '📣 Thai Hoài Nhơn - Kết quả buổi chiều: Con Rắn 🐍',
        likes: 98,
        type: 'video',
        thaiId: 'hoai-nhon',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoTitle: 'Kết quả Thai Hoài Nhơn',
        comments: [
            { id: 'c7', author: 'Đỗ Thị G', phone: '0843210987', content: 'Chúc mọi người may mắn!', time: '3 giờ trước', isBanned: false },
        ]
    },
    {
        id: '5',
        author: 'Cổ Nhơn Hoài Nhơn',
        avatar: '📢',
        time: '1 ngày trước',
        content: '🎊 Thông báo lịch xổ Thai Hoài Nhơn dịp Tết!',
        likes: 67,
        type: 'text',
        thaiId: 'hoai-nhon',
        comments: [
            { id: 'c8', author: 'Lý Văn H', phone: '0932109876', content: 'Cảm ơn thông báo!', time: '20 giờ trước', isBanned: false },
        ]
    }
];

const thaiConfig = {
    'an-nhon': { name: 'An Nhơn', icon: '🎯', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-800' },
    'nhon-phong': { name: 'Nhơn Phong', icon: '🏆', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800' },
    'hoai-nhon': { name: 'Hoài Nhơn', icon: '🎲', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' }
};

const AdminCMS: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [activeTab, setActiveTab] = useState<'video' | 'binh-luan'>('video');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<{ postId: string; commentId: string } | null>(null);

    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
    const bannedComments = posts.reduce((sum, post) => sum + post.comments.filter(c => c.isBanned).length, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);

    const handleDeleteComment = (postId: string, commentId: string) => {
        setCommentToDelete({ postId, commentId });
        setShowDeleteModal(true);
    };

    const confirmDeleteComment = () => {
        if (commentToDelete) {
            setPosts(posts.map(post => {
                if (post.id === commentToDelete.postId) {
                    return { ...post, comments: post.comments.filter(c => c.id !== commentToDelete.commentId) };
                }
                return post;
            }));
            setShowDeleteModal(false);
            setCommentToDelete(null);
        }
    };

    const handleToggleBan = (postId: string, commentId: string) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.map(c => c.id === commentId ? { ...c, isBanned: !c.isBanned } : c)
                };
            }
            return post;
        }));
    };

    // Render Thai Column cho Video tab
    const renderThaiVideoColumn = (thaiId: 'an-nhon' | 'nhon-phong' | 'hoai-nhon') => {
        const config = thaiConfig[thaiId];
        const thaiPosts = posts.filter(p => p.type === 'video' && p.thaiId === thaiId);

        return (
            <div className={`${config.bgColor} rounded-xl p-4 border-2 ${config.borderColor}`}>
                <h3 className={`font-bold ${config.textColor} mb-4 text-center text-lg`}>
                    {config.icon} {config.name}
                </h3>
                <div className="space-y-3">
                    {thaiPosts.map(post => (
                        <div key={post.id} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xl">{post.avatar}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{post.author}</p>
                                    <p className="text-xs text-gray-500">{post.time}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.content}</p>
                            {post.videoTitle && (
                                <p className="text-xs text-blue-600 mb-2">📹 {post.videoTitle}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>❤️ {post.likes}</span>
                                <span>💬 {post.comments.length}</span>
                            </div>
                        </div>
                    ))}
                    {thaiPosts.length === 0 && (
                        <p className="text-center text-gray-500 py-8 text-sm">Chưa có video</p>
                    )}
                </div>
            </div>
        );
    };

    // Render Thai Column cho Bình luận tab
    const renderThaiCommentsColumn = (thaiId: 'an-nhon' | 'nhon-phong' | 'hoai-nhon') => {
        const config = thaiConfig[thaiId];
        const thaiComments = posts
            .filter(p => p.thaiId === thaiId)
            .flatMap(p => p.comments.map(c => ({ ...c, postId: p.id, postTitle: p.content.slice(0, 30) })));

        return (
            <div className={`${config.bgColor} rounded-xl p-4 border-2 ${config.borderColor}`}>
                <h3 className={`font-bold ${config.textColor} mb-4 text-center text-lg`}>
                    {config.icon} {config.name}
                    <span className="ml-2 text-sm font-normal">({thaiComments.length})</span>
                </h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {thaiComments.map(comment => (
                        <div
                            key={comment.id}
                            className={`bg-white rounded-lg p-3 shadow-sm ${comment.isBanned ? 'border-2 border-red-300 bg-red-50' : ''}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm">{comment.author}</span>
                                {comment.isBanned && (
                                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">Đã cấm</span>
                                )}
                            </div>
                            <p className="text-xs text-blue-600 mb-1">📞 {comment.phone}</p>
                            <p className={`text-sm ${comment.isBanned ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                {comment.content}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">{comment.time}</span>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => handleToggleBan(comment.postId, comment.id)}
                                        className={`px-2 py-1 rounded text-xs font-medium ${comment.isBanned
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            }`}
                                    >
                                        {comment.isBanned ? '✅ Bỏ cấm' : '🚫 Cấm'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteComment(comment.postId, comment.id)}
                                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {thaiComments.length === 0 && (
                        <p className="text-center text-gray-500 py-8 text-sm">Chưa có bình luận</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-2">📺 Quản lý cộng đồng</h1>
                <p className="text-red-100">Quản lý video, bình luận theo từng Thai</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🎬</div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{posts.filter(p => p.type === 'video').length}</p>
                        <p className="text-sm text-gray-500">Video</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">💬</div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{totalComments}</p>
                        <p className="text-sm text-gray-500">Bình luận</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">🚫</div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{bannedComments}</p>
                        <p className="text-sm text-gray-500">Đang cấm</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center space-x-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-2xl">❤️</div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{totalLikes}</p>
                        <p className="text-sm text-gray-500">Lượt thích</p>
                    </div>
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Tab Headers */}
                <div className="border-b flex">
                    <button
                        onClick={() => setActiveTab('video')}
                        className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'video'
                            ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        🎬 Video ({posts.filter(p => p.type === 'video').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('binh-luan')}
                        className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'binh-luan'
                            ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        💬 Bình luận ({totalComments})
                    </button>
                </div>

                {/* Tab Content - Grid 3 Cột */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {activeTab === 'video' ? (
                            <>
                                {renderThaiVideoColumn('an-nhon')}
                                {renderThaiVideoColumn('nhon-phong')}
                                {renderThaiVideoColumn('hoai-nhon')}
                            </>
                        ) : (
                            <>
                                {renderThaiCommentsColumn('an-nhon')}
                                {renderThaiCommentsColumn('nhon-phong')}
                                {renderThaiCommentsColumn('hoai-nhon')}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ Xác nhận xóa</h3>
                        <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa bình luận này?</p>
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
                                🗑️ Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCMS;
