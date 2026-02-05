import React, { useState } from 'react';
import AdminPageWrapper, { AdminCard, AdminButton } from '../../components/AdminPageWrapper';

interface ContentItem {
  id: string;
  type: 'banner' | 'news' | 'announcement';
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

const AdminContent: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [formData, setFormData] = useState({
    type: 'banner' as ContentItem['type'],
    title: '',
    content: '',
    imageUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ContentItem = {
      id: `content-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    setItems([...items, newItem]);
    setFormData({ type: 'banner', title: '', content: '', imageUrl: '' });
    alert('Đã thêm nội dung!');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const typeLabels = { banner: 'Banner', news: 'Tin tức', announcement: 'Thông báo' };

  return (
    <AdminPageWrapper
      title="Nội dung trang chủ"
      subtitle="Quản lý banner, tin tức và thông báo"
      icon="📄"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Thêm nội dung mới" icon="➕">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>Loại</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentItem['type'] })}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none"
                style={{ border: '1px solid #e8e4df' }}
              >
                <option value="banner">Banner</option>
                <option value="news">Tin tức</option>
                <option value="announcement">Thông báo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>Tiêu đề</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề..."
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none"
                style={{ border: '1px solid #e8e4df' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>Nội dung</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nhập nội dung..."
                className="w-full px-4 py-3 rounded-lg focus:outline-none"
                style={{ border: '1px solid #e8e4df' }}
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>Upload ảnh</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormData({ ...formData, imageUrl: URL.createObjectURL(e.target.files[0]) });
                  }
                }}
                className="w-full px-4 py-2.5 rounded-lg"
                style={{ border: '1px dashed #e8e4df', backgroundColor: '#faf8f5' }}
              />
            </div>

            <AdminButton variant="primary" type="submit" className="w-full">
              ➕ Thêm nội dung
            </AdminButton>
          </form>
        </AdminCard>

        <AdminCard title="Danh sách nội dung" icon="📋">
          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-3xl mb-3 block">📭</span>
                <p className="text-sm" style={{ color: '#9a8c7a' }}>Chưa có nội dung nào</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="p-4 rounded-lg" style={{ backgroundColor: '#faf8f5' }}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ backgroundColor: '#f5f2ed', color: '#6b5c4c' }}
                      >
                        {typeLabels[item.type]}
                      </span>
                      <span className="text-sm font-medium" style={{ color: '#3d3428' }}>{item.title}</span>
                    </div>
                    <button onClick={() => deleteItem(item.id)} className="text-sm" style={{ color: '#b8856c' }}>✕</button>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#6b5c4c' }}>{item.content}</p>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full rounded-lg" />}
                  <p className="text-xs mt-2" style={{ color: '#9a8c7a' }}>
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ))
            )}
          </div>
        </AdminCard>
      </div>
    </AdminPageWrapper>
  );
};

export default AdminContent;
