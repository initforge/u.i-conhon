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
    'an-nhon': { name: 'An Nhơn', icon: '🎯', bgColor: 'bg-red-50', borderColor: 'border-red-200', headerBg: 'bg-red-600' },
    'nhon-phong': { name: 'Nhơn Phong', icon: '🏆', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', headerBg: 'bg-blue-600' },
    'hoai-nhon': { name: 'Hoài Nhơn', icon: '🎲', bgColor: 'bg-green-50', borderColor: 'border-green-200', headerBg: 'bg-green-600' }
};

const CongDongPage: React.FC = () => {
    const [newComment, setNewComment] = useState('');

    const handleAddComment = (postId: string) => {
        if (!newComment.trim()) return;
        alert(`Bình luận: "${newComment}" cho bài ${postId} (Mock)`);
        setNewComment('');
    };

    // Render Thai Column
    const renderThaiColumn = (thaiId: 'an-nhon' | 'nhon-phong' | 'hoai-nhon') => {
        const config = thaiConfig[thaiId];
        const thaiPosts = mockPosts.filter(p => p.thaiId === thaiId);

        return (
            <div className={`${config.bgColor} rounded-2xl border-2 ${config.borderColor} overflow-hidden`}>
                {/* Header */}
                <div className={`${config.headerBg} text-white p-4 text-center`}>
                    <div className="flex items-center justify-center gap-2">
                        <ThaiIcon thaiId={thaiId} size={28} />
                        <h3 className="font-bold text-lg">{config.name}</h3>
                    </div>
                    <p className="text-sm opacity-90">{thaiPosts.length} bài viết</p>
                </div>

                {/* Posts */}
                <div className="p-3 space-y-4 max-h-[600px] overflow-y-auto">
                    {thaiPosts.map(post => (
                        <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {/* Post Header */}
                            <div className="p-3 flex items-center space-x-2 border-b">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    {post.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{post.author}</p>
                                    <p className="text-xs text-gray-500">{post.time}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-3">
                                <p className="text-sm text-gray-700 line-clamp-3">{post.content}</p>
                            </div>

                            {/* Video Placeholder */}
                            {post.videoUrl && (
                                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <span className="text-4xl block mb-1">▶️</span>
                                        <span className="text-xs">{post.videoTitle}</span>
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="px-3 py-2 border-t flex items-center justify-between text-sm text-gray-500">
                                <div className="flex space-x-4">
                                    <button className="flex items-center space-x-1 hover:text-red-600">
                                        <span>❤️</span>
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center space-x-1 hover:text-blue-600">
                                        <span>💬</span>
                                        <span>{post.comments.length}</span>
                                    </button>
                                </div>
                                <button className="hover:text-green-600">🔗 Chia sẻ</button>
                            </div>

                            {/* Comments Preview */}
                            {post.comments.length > 0 && (
                                <div className="px-3 pb-3 border-t pt-2">
                                    {post.comments.slice(0, 2).map(comment => (
                                        <div key={comment.id} className="flex space-x-2 mb-2">
                                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">👤</div>
                                            <div className="flex-1 bg-gray-100 rounded-lg p-2">
                                                <p className="font-semibold text-xs">{comment.author}</p>
                                                <p className="text-xs text-gray-600">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Comment */}
                                    <div className="flex space-x-2 mt-2">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Bình luận..."
                                            className="flex-1 px-3 py-1.5 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                        <button
                                            onClick={() => handleAddComment(post.id)}
                                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-full hover:bg-red-700"
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {thaiPosts.length === 0 && (
                        <p className="text-center text-gray-500 py-8">Chưa có bài viết</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-gray-500 hover:text-red-600">
                            ← Trang chủ
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">🎉 Cộng đồng</h1>
                        <div className="w-16"></div>
                    </div>
                </div>
            </div>

            {/* Content - Grid 3 Thai */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderThaiColumn('an-nhon')}
                    {renderThaiColumn('nhon-phong')}
                    {renderThaiColumn('hoai-nhon')}
                </div>
            </div>
        </div>
    );
};

export default CongDongPage;
