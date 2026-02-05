import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ANIMALS } from '../types';
import { useCart } from '../contexts/CartContext';
import { useSocialTasks } from '../contexts/SocialTaskContext';
import CartModal from '../components/CartModal';

const AnimalDetailPage: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { allTasksCompleted } = useSocialTasks();
  const [showCartModal, setShowCartModal] = useState(false);
  const [liked, setLiked] = useState(false);

  const animal = ANIMALS.find((a) => a.id === animalId);

  if (!animal) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Không tìm thấy con vật</h1>
        <button onClick={() => navigate('/chon-thai')} className="btn-primary mt-4">
          Quay lại
        </button>
      </div>
    );
  }

  const isDisabled = !allTasksCompleted || !animal.isEnabled || animal.isBanned || animal.remainingLimit <= 0;

  const handleAddToCart = () => {
    if (!isDisabled) {
      addItem(animal, 1);
      setShowCartModal(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to={`/thai/${animal.thaiId}`}
          className="text-tet-red-600 hover:underline mb-4 inline-block"
        >
          ← Quay lại
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="card">
            <div className="w-full h-96 bg-tet-red-100 rounded-lg flex items-center justify-center">
              <span className="text-9xl font-bold text-tet-red-300">
                {animal.order}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{animal.name}</h1>
              <button
                onClick={() => setLiked(!liked)}
                className={`p-2 rounded-full ${liked ? 'text-red-500' : 'text-gray-400'
                  } hover:bg-gray-100`}
              >
                <img
                  src="/assets/icons/heart.svg"
                  alt="Like"
                  className="w-6 h-6"
                />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-600 mb-2">Mô tả:</p>
                <p className="text-gray-700">
                  Con vật số {animal.order} trong danh sách 40 con vật của Cổ Nhơn.
                  (Mô tả chi tiết sẽ được cập nhật sau)
                </p>
              </div>

              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-semibold">Giá:</span>
                <span className="text-2xl font-bold text-tet-red-600">
                  {animal.price.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-semibold">Hạn mức còn lại:</span>
                <span className="text-lg font-bold">
                  {animal.remainingLimit.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-semibold">Trạng thái:</span>
                <span className={`font-semibold ${animal.isBanned ? 'text-red-600' :
                    !animal.isEnabled ? 'text-yellow-600' :
                      'text-green-600'
                  }`}>
                  {animal.isBanned ? 'Bị cấm' :
                    !animal.isEnabled ? 'Tạm tắt' :
                      'Đang bán'}
                </span>
              </div>

              {animal.banReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 italic">{animal.banReason}</p>
                </div>
              )}

              {!allTasksCompleted && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700">
                    ⚠ Vui lòng hoàn thành tất cả nhiệm vụ mạng xã hội để mua con vật.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isDisabled}
              className={`w-full btn-primary ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onContinueShopping={() => navigate(`/thai/${animal.thaiId}`)}
      />
    </div>
  );
};

export default AnimalDetailPage;

