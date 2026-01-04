import React, { useState } from 'react';

interface SocialLink {
    id: string;
    platform: 'facebook' | 'youtube';
    type: 'follow' | 'like' | 'share' | 'subscribe';
    url: string;
    description: string;
    isActive: boolean;
}

const AdminSocialLinks: React.FC = () => {
    const [links, setLinks] = useState<SocialLink[]>([
        {
            id: '1',
            platform: 'facebook',
            type: 'follow',
            url: 'https://facebook.com/conhonannhon',
            description: 'Trang Facebook Cổ Nhơn An Nhơn',
            isActive: true,
        },
        {
            id: '2',
            platform: 'youtube',
            type: 'subscribe',
            url: 'https://youtube.com/@caubahoNguyen',
            description: 'Kênh YouTube Cậu Ba Họ Nguyễn',
            isActive: true,
        },
        {
            id: '3',
            platform: 'facebook',
            type: 'like',
            url: 'https://facebook.com/conhonannhon/posts/123456',
            description: 'Bài viết mới nhất cần Like',
            isActive: true,
        },
        {
            id: '4',
            platform: 'facebook',
            type: 'share',
            url: 'https://facebook.com/conhonannhon/posts/123456',
            description: 'Bài viết mới nhất cần Share',
            isActive: true,
        },
    ]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<SocialLink>>({});

    const handleEdit = (link: SocialLink) => {
        setEditingId(link.id);
        setEditForm(link);
    };

    const handleSave = () => {
        if (editingId) {
            setLinks(links.map(link =>
                link.id === editingId ? { ...link, ...editForm } as SocialLink : link
            ));
            setEditingId(null);
            setEditForm({});
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleToggleActive = (id: string) => {
        setLinks(links.map(link =>
            link.id === id ? { ...link, isActive: !link.isActive } : link
        ));
    };

    const getPlatformIcon = (platform: string) => {
        return platform === 'facebook' ? '📘' : '📺';
    };

    const getTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            follow: 'Theo dõi',
            like: 'Like bài viết',
            share: 'Share bài viết',
            subscribe: 'Đăng ký kênh',
        };
        return labels[type] || type;
    };

    const getTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            follow: 'bg-blue-100 text-blue-800',
            like: 'bg-green-100 text-green-800',
            share: 'bg-purple-100 text-purple-800',
            subscribe: 'bg-red-100 text-red-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Link Mạng xã hội</h1>
                <p className="text-gray-600">
                    Cấu hình các link Facebook/YouTube mà người dùng cần thực hiện để mở khóa tính năng mua hàng
                </p>
            </div>

            {/* Info Banner */}
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="flex items-start space-x-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                        <h3 className="font-bold text-blue-900 mb-2">Cách hoạt động</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• <strong>Follow/Subscribe</strong>: Nhiệm vụ một lần, chỉ cần làm khi đăng ký</li>
                            <li>• <strong>Like/Share</strong>: Nhiệm vụ hàng ngày, phải làm mỗi lần đăng nhập để mua hàng</li>
                            <li>• Cập nhật link bài viết mới nhất tại đây để người dùng Like/Share</li>
                            <li>• Khi click vào link, sẽ mở tab mới để người dùng thực hiện</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Links Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Nền tảng
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Loại
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Mô tả
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Link
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {links.map((link) => (
                                <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl">{getPlatformIcon(link.platform)}</span>
                                            <span className="font-medium text-gray-800 capitalize">{link.platform}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(link.type)}`}>
                                            {getTypeLabel(link.type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === link.id ? (
                                            <input
                                                type="text"
                                                value={editForm.description || ''}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <span className="text-gray-700">{link.description}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === link.id ? (
                                            <input
                                                type="url"
                                                value={editForm.url || ''}
                                                onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                placeholder="https://..."
                                            />
                                        ) : (
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1 max-w-xs truncate"
                                            >
                                                <span className="truncate">{link.url}</span>
                                                <span>↗️</span>
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleActive(link.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${link.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {link.isActive ? '✓ Kích hoạt' : '✕ Tắt'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === link.id ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleSave}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                                                >
                                                    💾 Lưu
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-semibold"
                                                >
                                                    ✕ Hủy
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(link)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                                            >
                                                ✏️ Sửa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <h4 className="font-bold text-yellow-900 mb-2 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>Lưu ý quan trọng</span>
                </h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Cập nhật link bài viết Like/Share mỗi khi có bài viết mới</li>
                    <li>• Link phải là link trực tiếp đến bài viết Facebook, không phải link rút gọn</li>
                    <li>• Người dùng phải Like/Share bài viết mỗi lần đăng nhập mới được mua hàng</li>
                    <li>• Tắt link nào không muốn bắt buộc người dùng thực hiện</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSocialLinks;
