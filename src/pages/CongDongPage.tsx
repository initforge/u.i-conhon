import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
}

interface Comment {
    id: string;
    author: string;
    content: string;
    time: string;
}

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
        content: '📝 Hướng dẫn cách chơi Cổ Nhơn cho người mới bắt đầu! Xem ngay video bên dưới nhé các bạn.',
        likes: 89,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        comments: [
            { id: 'c3', author: 'Lê Văn C', content: 'Hữu ích quá!', time: '4 giờ trước' },
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
            { id: 'c4', author: 'Phạm Thị D', content: 'Hay quá! Chơi ngay!', time: '20 giờ trước' },
            { id: 'c5', author: 'Hoàng Văn E', content: 'Chúc mọi người may mắn!', time: '18 giờ trước' },
        ]
    }
];

const CongDongPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'video' | 'binh-luan'>('video');
    const [newComment, setNewComment] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleAddComment = (_postId: string) => {
        if (!newComment.trim()) return;
        // Mock add comment
        alert(`Bình luận: "${newComment}" (Mock)`);
        setNewComment('');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link to="/" className="text-gray-500 hover:text-red-600">
                            ← Trang chủ
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Cộng đồng</h1>
                        <div className="w-16"></div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 border-b">
                        <button
                            onClick={() => setActiveTab('video')}
                            className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'video'
                                ? 'text-red-600 border-b-2 border-red-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            📺 Video
                        </button>
                        <button
                            onClick={() => setActiveTab('binh-luan')}
                            className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'binh-luan'
                                ? 'text-red-600 border-b-2 border-red-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            💬 Bình luận
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-6">
                {/* Posts Feed */}
                <div className="space-y-6">
                    {mockPosts
                        .filter(post => activeTab === 'video' ? post.type === 'video' : true)
                        .map((post) => (
                            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                {/* Post Header */}
                                <div className="p-4 flex items-center space-x-3 border-b">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl">
                                        {post.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{post.author}</h3>
                                        <p className="text-sm text-gray-500">{post.time}</p>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="p-4">
                                    <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                                </div>

                                {/* Video (if any) */}
                                {post.videoUrl && (
                                    <div className="aspect-video bg-gray-900">
                                        <div className="w-full h-full flex items-center justify-center text-white">
                                            <div className="text-center">
                                                <span className="text-6xl block mb-2">▶️</span>
                                                <span className="text-sm">Video Player (Mock)</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Likes */}
                                <div className="px-4 py-3 border-t border-b flex items-center space-x-6">
                                    <button className="flex items-center space-x-2 text-gray-500 hover:text-red-600">
                                        <span>❤️</span>
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
                                        <span>💬</span>
                                        <span>{post.comments.length}</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600">
                                        <span>🔗</span>
                                        <span>Chia sẻ</span>
                                    </button>
                                </div>

                                {/* Comments */}
                                <div className="p-4">
                                    {post.comments.map((comment) => (
                                        <div key={comment.id} className="flex space-x-3 mb-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                                                👤
                                            </div>
                                            <div className="flex-1 bg-gray-100 rounded-lg p-2">
                                                <p className="font-semibold text-sm text-gray-800">{comment.author}</p>
                                                <p className="text-sm text-gray-600">{comment.content}</p>
                                                <p className="text-xs text-gray-400 mt-1">{comment.time}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Comment */}
                                    <div className="flex space-x-2 mt-4">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Viết bình luận..."
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                        <button
                                            onClick={() => handleAddComment(post.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default CongDongPage;
