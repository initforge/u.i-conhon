import React, { useState, useRef } from 'react';
import { mockCauThaiImages, CauThaiImage } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminCard, AdminButton } from '../../components/AdminPageWrapper';
import { getCurrentYear, getAvailableYears } from '../../utils/yearUtils';
import Portal from '../../components/Portal';

const AdminCauThai: React.FC = () => {
  const [cauThaiImages, setCauThaiImages] = useState<CauThaiImage[]>(mockCauThaiImages);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedThai, setSelectedThai] = useState('thai-an-nhon');
  const [editingImage, setEditingImage] = useState<CauThaiImage | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadLunarLabel, setUploadLunarLabel] = useState(''); // Ngày âm lịch
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableYears = getAvailableYears(4);

  const thaiTabs = [
    { id: 'thai-an-nhon', name: 'An Nhơn', color: 'green' },
    { id: 'thai-nhon-phong', name: 'Nhơn Phong', color: 'yellow' },
    { id: 'thai-hoai-nhon', name: 'Hoài Nhơn', color: 'blue' },
  ];

  // Filter images by year and thai
  const filteredImages = cauThaiImages.filter(
    img => img.year === selectedYear && img.thaiId === selectedThai
  );

  // Get active image for current thai
  const activeImage = cauThaiImages.find(
    img => img.thaiId === selectedThai && img.isActive
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
    }
  };

  const handleUpload = () => {
    if (!uploadPreview || !uploadName.trim()) {
      alert('Vui lòng chọn ảnh và nhập tên!');
      return;
    }

    const newImage: CauThaiImage = {
      id: `cti-${Date.now()}`,
      thaiId: selectedThai,
      year: selectedYear,
      name: uploadName.trim(),
      imageUrl: uploadPreview,
      isActive: false,
      uploadedAt: new Date().toISOString(),
    };

    setCauThaiImages([...cauThaiImages, newImage]);
    setShowUploadModal(false);
    setUploadPreview(null);
    setUploadName('');
    setUploadLunarLabel('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa ảnh này?')) {
      setCauThaiImages(cauThaiImages.filter(img => img.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setCauThaiImages(cauThaiImages.map(img => {
      if (img.thaiId === selectedThai) {
        return { ...img, isActive: img.id === id };
      }
      return img;
    }));
  };

  const handleUpdateName = (id: string, newName: string) => {
    setCauThaiImages(cauThaiImages.map(img =>
      img.id === id ? { ...img, name: newName } : img
    ));
    setEditingImage(null);
  };

  const getCurrentThaiColor = () => {
    const thai = thaiTabs.find(t => t.id === selectedThai);
    return thai?.color || 'green';
  };

  return (
    <AdminPageWrapper
      title="Quản lý Câu Thai"
      subtitle="Upload và quản lý ảnh câu thai theo năm và Thai"
      icon="📜"
    >
      {/* Year + Thai Filters */}
      <div className="mb-6 space-y-4">
        {/* Year Selector */}
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-600">📅 Năm:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold cursor-pointer hover:bg-amber-700 transition-colors"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Thai Tabs */}
        <div className="flex gap-2">
          {thaiTabs.map(thai => (
            <button
              key={thai.id}
              onClick={() => setSelectedThai(thai.id)}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${selectedThai === thai.id
                ? thai.color === 'green' ? 'bg-green-600 text-white shadow-md'
                  : thai.color === 'yellow' ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {thai.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Image Indicator */}
      {activeImage && (
        <div className={`mb-6 p-4 rounded-xl border-2 ${getCurrentThaiColor() === 'green' ? 'bg-green-50 border-green-300' :
          getCurrentThaiColor() === 'yellow' ? 'bg-yellow-50 border-yellow-300' :
            'bg-blue-50 border-blue-300'
          }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Ảnh đang hiển thị trên trang chủ:</p>
              <p className="text-sm text-gray-600">{activeImage.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="mb-6">
        <AdminButton
          variant="primary"
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2"
        >
          <span>📤</span> Upload ảnh câu thai mới
        </AdminButton>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-gray-500 text-lg">Chưa có ảnh câu thai nào cho {selectedYear} - {thaiTabs.find(t => t.id === selectedThai)?.name}</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
            >
              + Upload ngay
            </button>
          </div>
        ) : (
          filteredImages.map(img => (
            <AdminCard key={img.id} className="relative overflow-hidden">
              {/* Active Badge */}
              {img.isActive && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg z-10">
                  ✅ HIỂN THỊ
                </div>
              )}

              {/* Image Preview */}
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                {img.imageUrl ? (
                  <img
                    src={img.imageUrl}
                    alt={img.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><rect fill="%23f3f4f6" width="200" height="100"/><text x="100" y="55" text-anchor="middle" fill="%239ca3af" font-size="14">Chưa có ảnh</text></svg>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">🖼️</span>
                  </div>
                )}
              </div>

              {/* Name (Editable) */}
              {editingImage?.id === img.id ? (
                <div className="mb-3">
                  <input
                    type="text"
                    defaultValue={img.name}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-200"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateName(img.id, (e.target as HTMLInputElement).value);
                      }
                      if (e.key === 'Escape') {
                        setEditingImage(null);
                      }
                    }}
                    onBlur={(e) => handleUpdateName(img.id, e.target.value)}
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter để lưu, Esc để hủy</p>
                </div>
              ) : (
                <h4
                  className="font-semibold text-gray-800 mb-1 cursor-pointer hover:text-amber-600 transition"
                  onClick={() => setEditingImage(img)}
                  title="Click để sửa tên"
                >
                  {img.name} ✏️
                </h4>
              )}

              <p className="text-xs text-gray-500 mb-4">
                Upload: {new Date(img.uploadedAt).toLocaleDateString('vi-VN')}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                {!img.isActive && (
                  <button
                    onClick={() => handleToggleActive(img.id)}
                    className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition"
                  >
                    🏠 Hiển thị
                  </button>
                )}
                <button
                  onClick={() => handleDelete(img.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                >
                  🗑️ Xóa
                </button>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 my-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">📤 Upload ảnh câu thai</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadPreview(null);
                    setUploadName('');
                    setUploadLunarLabel('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Info */}
              <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Năm:</strong> {selectedYear} | <strong>Thai:</strong> {thaiTabs.find(t => t.id === selectedThai)?.name}
                </p>
              </div>

              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-4 text-center hover:border-amber-400 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadPreview ? (
                  <img src={uploadPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                ) : (
                  <>
                    <span className="text-4xl mb-2 block">📷</span>
                    <p className="text-gray-500">Click để chọn ảnh hoặc kéo thả vào đây</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB)</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên ảnh câu thai</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="VD: Câu Thai Mùng 9 Tết Ất Tỵ"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
                />
              </div>

              {/* Ngày âm lịch Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Ngày âm lịch <span className="text-gray-400 font-normal">(hiển thị cho người chơi)</span>
                </label>
                <input
                  type="text"
                  value={uploadLunarLabel}
                  onChange={(e) => setUploadLunarLabel(e.target.value)}
                  placeholder="VD: Mùng 9, 30 Tết, 25 tháng Chạp..."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
                  style={{ backgroundColor: '#fffbeb' }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadPreview(null);
                    setUploadName('');
                    setUploadLunarLabel('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadPreview || !uploadName.trim()}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${uploadPreview && uploadName.trim()
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  💾 Lưu ảnh
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </AdminPageWrapper>
  );
};

export default AdminCauThai;

