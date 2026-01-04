import React, { useState } from 'react';
import { mockThais, mockCauThais } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminCard, AdminButton } from '../../components/AdminPageWrapper';

const AdminCauThai: React.FC = () => {
  const [cauThais, setCauThais] = useState(mockCauThais);
  const [formData, setFormData] = useState({
    thaiId: mockThais[0]?.id || '',
    content: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCauThai = {
      id: `cau-thai-${Date.now()}`,
      ...formData,
    };
    setCauThais([...cauThais, newCauThai]);
    setFormData({
      thaiId: mockThais[0]?.id || '',
      content: '',
      imageUrl: '',
      date: new Date().toISOString().split('T')[0],
    });
    alert('Đã thêm câu thai!');
  };

  return (
    <AdminPageWrapper
      title="Quản lý câu thai"
      subtitle="Thêm và quản lý câu thai cho các phiên chơi"
      icon="📝"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <AdminCard title="Thêm câu thai mới" icon="✍️">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>
                Chọn Thai
              </label>
              <select
                value={formData.thaiId}
                onChange={(e) => setFormData({ ...formData, thaiId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                style={{ border: '1px solid #e8e4df' }}
                required
              >
                {mockThais.map((thai) => (
                  <option key={thai.id} value={thai.id}>{thai.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>
                Ngày
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                style={{ border: '1px solid #e8e4df' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>
                Nội dung câu thai
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                style={{ border: '1px solid #e8e4df' }}
                rows={4}
                placeholder="Nhập nội dung câu thai..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>
                Upload ảnh
              </label>
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
              💾 Lưu câu thai
            </AdminButton>
          </form>
        </AdminCard>

        {/* History */}
        <AdminCard title="Lịch sử câu thai" icon="📚">
          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {cauThais.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-3xl mb-3 block">📭</span>
                <p className="text-sm" style={{ color: '#9a8c7a' }}>Chưa có câu thai nào</p>
              </div>
            ) : (
              cauThais.map((cauThai) => {
                const thai = mockThais.find((t) => t.id === cauThai.thaiId);
                return (
                  <div
                    key={cauThai.id}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: '#faf8f5', border: '1px solid #f0ece6' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#f5f2ed', color: '#6b5c4c' }}
                      >
                        {thai?.name}
                      </span>
                      <span className="text-xs" style={{ color: '#9a8c7a' }}>
                        {new Date(cauThai.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {cauThai.content && (
                      <p className="text-sm italic leading-relaxed" style={{ color: '#6b5c4c' }}>
                        "{cauThai.content}"
                      </p>
                    )}
                    {cauThai.imageUrl && (
                      <img src={cauThai.imageUrl} alt="Câu thai" className="w-full rounded-lg mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </AdminCard>
      </div>
    </AdminPageWrapper>
  );
};

export default AdminCauThai;
