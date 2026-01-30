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
    videoUrl?: string;
    videoTitle?: string;
}

// Mock data với số điện thoại
const mockPosts: Post[] = [
    {
        id: '1',
        author: 'Cổ Nhơn An Nhơn Bình Định',
        avatar: '🎯',
        time: '2 giờ trước',
        content: '🎉 Chúc mừng các bạn đã trúng thưởng hôm nay! Kết quả: Con Rồng 🐉',
        likes: 156,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoTitle: 'Kết quả xổ ngày 23/01/2025',
        comments: [
            { id: 'c1', author: 'Nguyễn Văn A', phone: '0901234567', content: 'Tôi trúng rồiiiii 🎉', time: '1 giờ trước', isBanned: false },
            { id: 'c2', author: 'Trần Thị B', phone: '0912345678', content: 'Chúc mừng nha!', time: '30 phút trước', isBanned: false },
            { id: 'c3', author: 'Lê Văn C', phone: '0898765432', content: 'Hay quá admin ơi!', time: '15 phút trước', isBanned: false },
        ]
    },
    {
        id: '2',
        author: 'Cổ Nhơn An Nhơn Bình Định',
        avatar: '📺',
        time: '5 giờ trước',
        content: '📝 Hướng dẫn cách chơi Cổ Nhơn cho người mới bắt đầu! Xem ngay video bên dưới nhé các bạn.',
        likes: 89,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoTitle: 'Hướng dẫn chơi Cổ Nhơn',
        comments: [
            { id: 'c4', author: 'Phạm Văn D', phone: '0976543210', content: 'Hữu ích quá!', time: '4 giờ trước', isBanned: false },
            { id: 'c5', author: 'Hoàng Thị E', phone: '0865432109', content: 'Cảm ơn admin!', time: '3 giờ trước', isBanned: true },
        ]
    },
    {
        id: '3',
        author: 'Cổ Nhơn An Nhơn Bình Định',
        avatar: '🎯',
        time: '1 ngày trước',
        content: '🔥 THÔNG BÁO: Tết Ất Tỵ 2025 - Chương trình khuyến mãi đặc biệt!\n\nTỉ lệ thưởng 1 chung 30\nChí Cao (Con Trùn) chung 70\n\nChơi ngay hôm nay!',
        likes: 234,
        type: 'text',
        comments: [
            { id: 'c6', author: 'Vũ Văn F', phone: '0754321098', content: 'Hay quá! Chơi ngay!', time: '20 giờ trước', isBanned: false },
            { id: 'c7', author: 'Đỗ Thị G', phone: '0843210987', content: 'Chúc mọi người may mắn!', time: '18 giờ trước', isBanned: false },
        ]
    }
];

const AdminCMS: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [activeTab, setActiveTab] = useState<'video' | 'binh-luan'>('video');
    const [selectedPost, setSelectedPost] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<{ postId: string; commentId: string } | null>(null);

    // Xóa bình luận
    const handleDeleteComment = (postId: string, commentId: string) => {
        setCommentToDelete({ postId, commentId });
        setShowDeleteModal(true);
    };

    const confirmDeleteComment = () => {
        if (commentToDelete) {
            setPosts(posts.map(post => {
                if (post.id === commentToDelete.postId) {
                    return {
                        ...post,
                        comments: post.comments.filter(c => c.id !== commentToDelete.commentId)
                    };
                }
                return post;
            }));
            setShowDeleteModal(false);
            setCommentToDelete(null);
        }
    };

    // Toggle cấm/bỏ cấm bình luận
    const handleToggleBan = (postId: string, commentId: string) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.map(c => {
                        if (c.id === commentId) {
                            return { ...c, isBanned: !c.isBanned };
                        }
                        return c;
                    })
                };
            }
            return post;
        }));
    };

    // Đếm tổng bình luận và bình luận bị cấm
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
    const bannedComments = posts.reduce((sum, post) => sum + post.comments.filter(c => c.isBanned).length, 0);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý cộng đồng</h1>
                <p className="text-gray-600">Quản lý video, bình luận và nội dung cộng đồng</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">📺</div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{posts.filter(p => p.type === 'video').length}</p>
                            <p className="text-sm text-gray-500">Video</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">💬</div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{totalComments}</p>
                            <p className="text-sm text-gray-500">Bình luận</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">🚫</div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{bannedComments}</p>
                            <p className="text-sm text-gray-500">Đang cấm</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">❤️</div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{posts.reduce((sum, p) => sum + p.likes, 0)}</p>
                            <p className="text-sm text-gray-500">Lượt thích</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-b">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('video')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'video'
                                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            📺 Video ({posts.filter(p => p.type === 'video').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('binh-luan')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'binh-luan'
                                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            💬 Tất cả bình luận ({totalComments})
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'video' ? (
                        // Video Tab - Giống CongDongPage
                        <div className="space-y-6">
                            {posts
                                .filter(post => post.type === 'video')
                                .map((post) => (
                                    <div key={post.id} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                        {/* Post Header */}
                                        <div className="p-4 flex items-center justify-between border-b bg-white">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl">
                                                    {post.avatar}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800">{post.author}</h3>
                                                    <p className="text-sm text-gray-500">{post.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                    {post.comments.length} bình luận
                                                </span>
                                            </div>
                                        </div>

                                        {/* Post Content */}
                                        <div className="p-4 bg-white">
                                            <p className="text-gray-700 whitespace-pre-line mb-3">{post.content}</p>
                                            {post.videoTitle && (
                                                <p className="text-sm text-gray-500 mb-2">📹 {post.videoTitle}</p>
                                            )}
                                        </div>

                                        {/* Video Placeholder */}
                                        {post.videoUrl && (
                                            <div className="aspect-video bg-gray-900 flex items-center justify-center">
                                                <div className="text-center text-white">
                                                    <span className="text-6xl block mb-2">▶️</span>
                                                    <span className="text-sm">Video Player</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Stats Bar */}
                                        <div className="px-4 py-3 bg-white border-t flex items-center justify-between">
                                            <div className="flex items-center space-x-6">
                                                <span className="flex items-center space-x-2 text-gray-500">
                                                    <span>❤️</span>
                                                    <span>{post.likes} thích</span>
                                                </span>
                                                <span className="flex items-center space-x-2 text-gray-500">
                                                    <span>💬</span>
                                                    <span>{post.comments.length} bình luận</span>
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
                                                <h4 className="font-bold text-gray-700 mb-4">📝 Danh sách bình luận ({post.comments.length})</h4>
                                                <div className="space-y-3">
                                                    {post.comments.map((comment) => (
                                                        <div
                                                            key={comment.id}
                                                            className={`flex items-start space-x-3 p-3 rounded-lg ${comment.isBanned ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-200'
                                                                }`}
                                                        >
                                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                                                👤
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <span className="font-semibold text-gray-800">{comment.author}</span>
                                                                    <span className="text-blue-600 text-sm font-medium">📞 {comment.phone}</span>
                                                                    {comment.isBanned && (
                                                                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">Đã cấm</span>
                                                                    )}
                                                                </div>
                                                                <p className={`text-sm ${comment.isBanned ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                                                                    {comment.content}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">{comment.time}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleToggleBan(post.id, comment.id)}
                                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${comment.isBanned
                                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                                        }`}
                                                                    title={comment.isBanned ? 'Bỏ cấm bình luận' : 'Cấm bình luận'}
                                                                >
                                                                    {comment.isBanned ? '✅ Bỏ cấm' : '🚫 Cấm'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                                                                    title="Xóa bình luận"
                                                                >
                                                                    🗑️ Xóa
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {post.comments.length === 0 && (
                                                        <p className="text-center text-gray-500 py-4">Chưa có bình luận nào</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    ) : (
                        // All Comments Tab
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-gray-600">Tất cả bình luận từ các video và bài viết</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">Lọc:</span>
                                    <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                                        <option>Tất cả</option>
                                        <option>Đang hoạt động</option>
                                        <option>Đã cấm</option>
                                    </select>
                                </div>
                            </div>
                            {posts.flatMap(post =>
                                post.comments.map(comment => (
                                    <div
                                        key={comment.id}
                                        className={`flex items-start space-x-3 p-4 rounded-lg ${comment.isBanned ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'
                                            }`}
                                    >
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                            👤
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                                <span className="font-semibold text-gray-800">{comment.author}</span>
                                                <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-0.5 rounded">📞 {comment.phone}</span>
                                                {comment.isBanned && (
                                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">Đã cấm</span>
                                                )}
                                            </div>
                                            <p className={`text-sm ${comment.isBanned ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                                                {comment.content}
                                            </p>
                                            <div className="flex items-center space-x-3 mt-2">
                                                <p className="text-xs text-gray-400">{comment.time}</p>
                                                <span className="text-xs text-gray-400">•</span>
                                                <p className="text-xs text-gray-500">
                                                    Video: {posts.find(p => p.comments.some(c => c.id === comment.id))?.videoTitle || 'Bài viết'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                            <button
                                                onClick={() => {
                                                    const postId = posts.find(p => p.comments.some(c => c.id === comment.id))?.id;
                                                    if (postId) handleToggleBan(postId, comment.id);
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${comment.isBanned
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    }`}
                                            >
                                                {comment.isBanned ? '✅ Bỏ cấm' : '🚫 Cấm'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const postId = posts.find(p => p.comments.some(c => c.id === comment.id))?.id;
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
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
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
            )}
        </div>
    );
};

export default AdminCMS;
