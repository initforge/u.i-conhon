import React, { useState, useRef, useEffect } from 'react';
import AdminPageWrapper, { AdminCard, AdminButton } from '../../components/AdminPageWrapper';
import { getCurrentYear, getAvailableYears } from '../../utils/yearUtils';
import Portal from '../../components/Portal';
import { getAdminCauThai, createAdminCauThai, updateAdminCauThai, deleteAdminCauThai, uploadCauThaiImage, AdminCauThai as AdminCauThaiItem } from '../../services/api';

const AdminCauThai: React.FC = () => {
  const [cauThaiImages, setCauThaiImages] = useState<AdminCauThaiItem[]>([]);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [loading, setLoading] = useState(true); // eslint-disable-line @typescript-eslint/no-unused-vars

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAdminCauThai({ year: selectedYear });
        setCauThaiImages(response.cauThaiImages || []);
      } catch (error) {
        console.error('Failed to fetch cau thai:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);
  const [selectedThai, setSelectedThai] = useState('thai-an-nhon');
  const [selectedKhung, setSelectedKhung] = useState('khung-1');
  const [editingImage, setEditingImage] = useState<AdminCauThaiItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadAdminNote, setUploadAdminNote] = useState(''); // Ghi chú cho admin
  const [uploadPlayerNote, setUploadPlayerNote] = useState(''); // Ghi chú cho người chơi
  const [uploadFile, setUploadFile] = useState<File | null>(null); // Actual file for upload
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableYears = getAvailableYears(4);

  const thaiTabs = [
    { id: 'thai-an-nhon', name: 'An Nhơn', color: 'green' },
    { id: 'thai-nhon-phong', name: 'Nhơn Phong', color: 'yellow' },
    { id: 'thai-hoai-nhon', name: 'Hoài Nhơn', color: 'blue' },
  ];

  // Khung giờ cho từng Thai
  const khungOptions: Record<string, { id: string; name: string; time: string }[]> = {
    'thai-an-nhon': [
      { id: 'khung-1', name: 'Khung 1', time: '07:30 - 11:00' },
      { id: 'khung-2', name: 'Khung 2', time: '13:00 - 17:00' },
      { id: 'khung-3', name: 'Khung 3', time: '18:00 - 21:00' }, // Chỉ Mùng 1-3 Tết
    ],
    'thai-nhon-phong': [
      { id: 'khung-1', name: 'Khung 1', time: '07:30 - 11:00' },
      { id: 'khung-2', name: 'Khung 2', time: '13:00 - 17:00' },
    ],
    'thai-hoai-nhon': [
      { id: 'khung-1', name: 'Khung 1', time: '08:00 - 13:00' },
      { id: 'khung-2', name: 'Khung 2', time: '13:00 - 19:00' },
    ],
  };

  const currentKhungOptions = khungOptions[selectedThai] || [];

  // Filter images by thai and khung (year already filtered from API)
  const filteredImages = cauThaiImages.filter(
    img => img.thai_id === selectedThai && (img.khung_id || 'khung-1') === selectedKhung
  );

  // Get active image for current thai + khung
  const activeImage = cauThaiImages.find(
    img => img.thai_id === selectedThai && (img.khung_id || 'khung-1') === selectedKhung && img.is_active
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
      setUploadFile(file); // Store actual file for upload
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      alert('Vui lòng chọn ảnh!');
      return;
    }

    try {
      setUploading(true);

      // Step 1: Upload actual file to server
      const uploadResult = await uploadCauThaiImage(uploadFile);

      // Step 2: Save metadata with real server URL
      const response = await createAdminCauThai({
        thai_id: selectedThai,
        image_url: uploadResult.imageUrl, // Real URL: /uploads/cau-thai/xxx.jpg
        description: uploadPlayerNote.trim() || uploadAdminNote.trim() || `Câu thai ${selectedYear}`,
        khung_id: selectedKhung,
      });

      setCauThaiImages([response.cauThai, ...cauThaiImages]);
      setShowUploadModal(false);
      setUploadPreview(null);
      setUploadFile(null);
      setUploadAdminNote('');
      setUploadPlayerNote('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert('Đã upload câu thai thành công!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Không thể upload câu thai! ' + (error instanceof Error ? error.message : ''));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa ảnh này?')) {
      try {
        await deleteAdminCauThai(id);
        setCauThaiImages(cauThaiImages.filter(img => img.id !== id));
        alert('Đã xóa thành công!');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Không thể xóa!');
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await updateAdminCauThai(id, { is_active: true });
      // Update local state - deactivate others in same thai+khung, activate this one
      setCauThaiImages(cauThaiImages.map(img => {
        if (img.thai_id === selectedThai && (img.khung_id || 'khung-1') === selectedKhung) {
          return { ...img, is_active: img.id === id };
        }
        return img;
      }));
      alert('Đã kích hoạt hiển thị!');
    } catch (error) {
      console.error('Toggle active failed:', error);
      alert('Không thể cập nhật!');
    }
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
        <div className="flex gap-2 flex-wrap">
          {thaiTabs.map(thai => (
            <button
              key={thai.id}
              onClick={() => {
                setSelectedThai(thai.id);
                setSelectedKhung('khung-1'); // Reset khung khi đổi thai
              }}
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

        {/* Khung Tabs */}
        <div className="flex gap-2 flex-wrap">
          <span className="font-medium text-gray-600 self-center mr-2">⏰ Khung:</span>
          {currentKhungOptions.map(khung => (
            <button
              key={khung.id}
              onClick={() => setSelectedKhung(khung.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${selectedKhung === khung.id
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {khung.name} <span className="text-xs opacity-75">({khung.time})</span>
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
              <p className="text-sm text-gray-600">{activeImage.description || 'Chưa đặt tên'}</p>
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
              {img.is_active && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg z-10">
                  ✅ HIỂN THỊ
                </div>
              )}

              {/* Image Preview */}
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                {img.image_url ? (
                  <img
                    src={img.image_url}
                    alt={img.description || 'Câu thai'}
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
                    defaultValue={img.description || ''}
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
                  {img.description || 'Chưa đặt tên'} ✏️
                </h4>
              )}

              <p className="text-xs text-gray-500 mb-4">
                Upload: {img.created_at ? new Date(img.created_at).toLocaleDateString('vi-VN') : 'N/A'}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                {!img.is_active && (
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
                    setUploadFile(null);
                    setUploadAdminNote('');
                    setUploadPlayerNote('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Info - Thai + Năm */}
              <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Năm:</strong> {selectedYear} | <strong>Thai:</strong> {thaiTabs.find(t => t.id === selectedThai)?.name}
                </p>
              </div>

              {/* Khung Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⏰ Khung giờ <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentKhungOptions.map(khung => (
                    <button
                      key={khung.id}
                      onClick={() => setSelectedKhung(khung.id)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${selectedKhung === khung.id
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {khung.name} ({khung.time})
                    </button>
                  ))}
                </div>
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

              {/* Ghi chú cho Admin */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Ghi chú cho Admin <span className="text-gray-400 font-normal">(không hiển thị cho người chơi)</span>
                </label>
                <input
                  type="text"
                  value={uploadAdminNote}
                  onChange={(e) => setUploadAdminNote(e.target.value)}
                  placeholder="VD: Câu thai do anh Tuấn làm, Câu thai backup..."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
                />
              </div>

              {/* Ghi chú cho Người chơi */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💬 Ghi chú cho người chơi <span className="text-gray-400 font-normal">(hiển thị trên trang chủ)</span>
                </label>
                <input
                  type="text"
                  value={uploadPlayerNote}
                  onChange={(e) => setUploadPlayerNote(e.target.value)}
                  placeholder="VD: Mùng 9, 30 Tết, 25 tháng Chạp, Câu thai khung chiều..."
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
                    setUploadFile(null);
                    setUploadAdminNote('');
                    setUploadPlayerNote('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${uploadFile && !uploading
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {uploading ? '⏳ Đang upload...' : '💾 Lưu ảnh'}
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

