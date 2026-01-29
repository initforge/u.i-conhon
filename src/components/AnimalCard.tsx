import React from 'react';
import { Link } from 'react-router-dom';
import { Animal } from '../mock-data/mockData';
import { useCart } from '../contexts/CartContext';
import { useSocialTasks } from '../contexts/SocialTaskContext';

interface AnimalCardProps {
  animal: Animal;
  onAddToCart?: () => void;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onAddToCart }) => {
  const { addItem } = useCart();
  const { allTasksCompleted } = useSocialTasks();

  const handleAddToCart = () => {
    if (allTasksCompleted && animal.isEnabled && !animal.isBanned && animal.remainingLimit > 0) {
      addItem(animal, 1);
      onAddToCart?.();
    }
  };

  const isDisabled = !allTasksCompleted || !animal.isEnabled || animal.isBanned || animal.remainingLimit <= 0;

  // Mock "Thế thân" values - in real app this would come from animal data
  const theThanValues: { [key: number]: number } = {
    1: 5, 2: 16, 3: 32, 4: 12, 5: 1, 6: 17, 7: 24, 8: 20, 9: 33, 10: 18,
    11: 15, 12: 4, 13: 14, 14: 13, 15: 11, 16: 2, 17: 6, 18: 10, 19: 27, 20: 88,
    21: 22, 22: 21, 23: 30, 24: 87, 25: 35, 26: 31, 27: 19, 28: 29, 29: 28, 30: 23,
    31: 26, 32: 83, 33: 89, 34: 36, 35: 25, 36: 34
  };

  return (
    <div className="card hover:scale-105 transition-transform relative border-2 border-gray-200">
      {/* Top left: Order and name */}
      <div className="absolute top-2 left-2 text-sm font-semibold text-gray-700">
        {animal.order}. {animal.name}
      </div>

      {/* Placeholder image */}
      <div className="w-full h-48 bg-red-50 rounded-lg flex items-center justify-center mb-4 mt-8">
        <span className="text-4xl font-bold text-tet-red-300 uppercase">
          {animal.name}
        </span>
      </div>

      {/* Bottom right: Thế thân */}
      <div className="absolute bottom-2 right-2 text-sm font-semibold text-gray-600">
        Thế thân {theThanValues[animal.order] || animal.order}
      </div>

      <div className="space-y-2 mb-4 mt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Giá:</span>
          <span className="font-bold text-tet-red-700">
            {animal.price.toLocaleString('vi-VN')} đ
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Còn lại:</span>
          <span className={`font-semibold ${animal.remainingLimit <= 0 ? 'text-red-600' : ''}`}>
            {animal.remainingLimit <= 0 ? 'Hết hạn mức' : `${animal.remainingLimit.toLocaleString('vi-VN')} đ`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Trạng thái:</span>
          <span className={`font-semibold ${animal.isBanned ? 'text-red-600' :
              !animal.isEnabled ? 'text-yellow-600' :
                'text-green-600'
            }`}>
            {animal.isBanned ? 'Bị cấm' :
              !animal.isEnabled ? 'Tạm tắt' :
                'Đang bán'}
          </span>
        </div>
        {/* Hiển thị thông báo hạn mức */}
        {animal.remainingLimit <= 0 && !animal.isBanned && (
          <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700 font-medium text-center">
              ⚠️ Quý khách đã mua quá số tiền cho phép
            </p>
          </div>
        )}
        {/* Hiển thị lý do cấm từ admin */}
        {animal.isBanned && animal.banReason && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">
              🚫 Lý do: {animal.banReason}
            </p>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Link
          to={`/con-vat/${animal.id}`}
          className="flex-1 btn-secondary text-center text-sm py-2"
        >
          Chi tiết
        </Link>
        <button
          onClick={handleAddToCart}
          disabled={isDisabled}
          className={`flex-1 btn-primary text-sm py-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Thêm giỏ
        </button>
      </div>
    </div>
  );
};

export default AnimalCard;

