import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThaiIcon } from '../components/icons/ThaiIcons';

interface Comment {
    id: string;
    author: string;
    content: string;
    time: string;
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

// Mock data theo 3 Thai
const mockPosts: Post[] = [
    // Thai An Nhơn
    {
        id: '1',
        author: 'Cổ Nhơn An Nhơn Bình Định',
        avatar: '🎯',
        time: '2 giờ trước',
        content: '🎉 Chúc mừng các bạn đã trúng thưởng hôm nay! Kết quả: Con Rồng 🐉',
        likes: 156,
        type: 'video',
        thaiId: 'an-nhon',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoTitle: 'Kết quả xổ ngày 30/01/2026',
        comments: [
            { id: 'c1', author: 'Nguyễn Văn A', content: 'Tôi trúng rồiiiii 🎉', time: '1 giờ trước' },
            { id: 'c2', author: 'Trần Thị B', content: 'Chúc mừng nha!', time: '30 phút trước' },
        ]
    },
    {
        id: '2',
        author: 'Cổ Nhơn An Nhơn Bình Định',
        avatar: '📺',
        time: '5 giờ trước',
        content: '📝 Hướng dẫn cách chơi Cổ Nhơn cho người mới!',
        likes: 89,
        type: 'video',
        thaiId: 'an-nhon',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoTitle: 'Hướng dẫn chơi',
        comments: [
            { id: 'c3', author: 'Lê Văn C', content: 'Hữu ích quá!', time: '4 giờ trước' },
        ]
    },
    // Thai Nhơn Phong
    {
        id: '3',
        author: 'Cổ Nhơn An Nhơn Bình Định',
        avatar: '🏆',
        time: '3 giờ trước',
        content: '🔥 Kết quả chiều nay - Thai Nhơn Phong: Con Hổ 🐅',
        likes: 124,
        type: 'video',
        thaiId: 'nhon-phong',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoTitle: 'Kết quả Thai Nhơn Phong',
        comments: [
            { id: 'c4', author: 'Hoàng Thị E', content: 'Trúng rồi!', time: '2 giờ trước' },
        ]
    },
    // Thai Hoài Nhơn
    {
        id: '4',
        author: 'Cổ Nhơn An Nhơn Bình Định',
        avatar: '🎲',
        time: '4 giờ trước',
        content: '📣 Thai Hoài Nhơn - Kết quả buổi chiều: Con Rắn 🐍',
        likes: 98,
        type: 'video',
        thaiId: 'hoai-nhon',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoTitle: 'Kết quả Thai Hoài Nhơn',
        comments: [
            { id: 'c5', author: 'Đỗ Thị G', content: 'Chúc mọi người may mắn!', time: '3 giờ trước' },
        ]
    },
    {
        id: '5',
        author: 'Cổ Nhơn An Nhơn Bình Định',
        avatar: '📢',
        time: '1 ngày trước',
        content: '🎊 Thông báo lịch xổ Thai Hoài Nhơn dịp Tết!',
        likes: 67,
        type: 'text',
        thaiId: 'hoai-nhon',
        comments: [
            { id: 'c6', author: 'Lý Văn H', content: 'Cảm ơn thông báo!', time: '20 giờ trước' },
        ]
    }
];

const thaiConfig = {
    'an-nhon': { name: 'An Nhơn', icon: '🎯', color: 'red' },
    'nhon-phong': { name: 'Nhơn Phong', icon: '🏆', color: 'blue' },
    'hoai-nhon': { name: 'Hoài Nhơn', icon: '🎲', color: 'green' }
};

const CongDongPage: React.FC = () => {
    const [posts] = useState<Post[]>(mockPosts);
    const [activeTab, setActiveTab] = useState<'video' | 'binh-luan'>('video');
    const [selectedThai, setSelectedThai] = useState<'an-nhon' | 'nhon-phong' | 'hoai-nhon'>('an-nhon');
    const [selectedPost, setSelectedPost] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

    // Filter posts by selected Thai
    const filteredPosts = posts.filter(p => p.thaiId === selectedThai);
    const totalComments = filteredPosts.reduce((sum, post) => sum + post.comments.length, 0);
    const currentThaiConfig = thaiConfig[selectedThai];

    // Handle like toggle
    const handleLike = (postId: string) => {
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
        // TODO: API call to save like
    };

    // Handle add comment
    const handleAddComment = (postId: string) => {
        if (!newComment.trim()) return;
        console.log('Comment for post:', postId, newComment);
        alert(`Đã gửi bình luận: "${newComment}" (Sẽ hiển thị sau khi admin duyệt)`);
        setNewComment('');
        // TODO: API call to save comment
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
                {/* Thai Selector - 3 Mini Cards giống Admin */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <p className="text-sm text-gray-500 mb-3">Chọn Thai để xem:</p>
                    <div className="grid grid-cols-3 gap-3">
                        {(['an-nhon', 'nhon-phong', 'hoai-nhon'] as const).map(thaiId => {
                            const config = thaiConfig[thaiId];
                            const isSelected = selectedThai === thaiId;
                            const thaiPosts = posts.filter(p => p.thaiId === thaiId);
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



                {/* Main Content with Tabs */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Tab Header với tên Thai */}
                    <div className="border-b bg-gray-50 px-4 py-2">
                        <span className="text-xl font-bold">{currentThaiConfig.icon} {currentThaiConfig.name}</span>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b flex">
                        <button
                            onClick={() => setActiveTab('video')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'video'
                                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            📺 Video ({filteredPosts.filter(p => p.type === 'video').length})
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

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'video' ? (
                            // Video Tab
                            <div className="space-y-6">
                                {filteredPosts
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
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                    {post.comments.length} bình luận
                                                </span>
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

                                            {/* Stats Bar - Interactive */}
                                            <div className="px-4 py-3 bg-white border-t flex items-center justify-between">
                                                <div className="flex items-center space-x-6">
                                                    <button
                                                        onClick={() => handleLike(post.id)}
                                                        className={`flex items-center space-x-2 transition-all ${likedPosts.has(post.id)
                                                            ? 'text-red-500 scale-110'
                                                            : 'text-gray-500 hover:text-red-400'}`}
                                                    >
                                                        <span className="text-xl">{likedPosts.has(post.id) ? '❤️' : '🤍'}</span>
                                                        <span className="font-medium">{post.likes + (likedPosts.has(post.id) ? 1 : 0)} thích</span>
                                                    </button>
                                                    <span className="flex items-center space-x-2 text-gray-500">
                                                        <span>💬</span>
                                                        <span>{post.comments.length} bình luận</span>
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
                                                    <h4 className="font-bold text-gray-700 mb-4">📝 Bình luận ({post.comments.length})</h4>

                                                    {/* Add Comment Form - User can comment */}
                                                    <div className="flex space-x-2 mb-4 pb-4 border-b">
                                                        <input
                                                            type="text"
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                            placeholder="Viết bình luận của bạn..."
                                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                        />
                                                        <button
                                                            onClick={() => handleAddComment(post.id)}
                                                            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                                                        >
                                                            Gửi
                                                        </button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {post.comments.map((comment) => (
                                                            <div
                                                                key={comment.id}
                                                                className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-gray-200"
                                                            >
                                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                                                    👤
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="font-semibold text-gray-800">{comment.author}</span>
                                                                    <p className="text-sm text-gray-600">{comment.content}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">{comment.time}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {post.comments.length === 0 && (
                                                            <p className="text-center text-gray-500 py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                {filteredPosts.filter(p => p.type === 'video').length === 0 && (
                                    <div className="text-center py-12">
                                        <span className="text-6xl">📭</span>
                                        <p className="text-gray-500 mt-4">Chưa có video nào cho {currentThaiConfig.name}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // All Comments Tab
                            <div className="space-y-3">
                                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                    <p className="text-gray-600">Tất cả bình luận từ các video và bài viết</p>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">Thai:</span>
                                        <select
                                            value={selectedThai}
                                            onChange={(e) => setSelectedThai(e.target.value as 'an-nhon' | 'nhon-phong' | 'hoai-nhon')}
                                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium"
                                        >
                                            <option value="an-nhon">🎯 An Nhơn</option>
                                            <option value="nhon-phong">🏆 Nhơn Phong</option>
                                            <option value="hoai-nhon">🎲 Hoài Nhơn</option>
                                        </select>
                                    </div>
                                </div>
                                {filteredPosts.flatMap(post =>
                                    post.comments.map(comment => (
                                        <div
                                            key={comment.id}
                                            className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 border border-gray-200"
                                        >
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                                👤
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="font-semibold text-gray-800">{comment.author}</span>
                                                <p className="text-sm text-gray-600">{comment.content}</p>
                                                <p className="text-xs text-gray-400 mt-1">{comment.time}</p>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {totalComments === 0 && (
                                    <div className="text-center py-12">
                                        <span className="text-6xl">💬</span>
                                        <p className="text-gray-500 mt-4">Chưa có bình luận nào cho {currentThaiConfig.name}</p>
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
