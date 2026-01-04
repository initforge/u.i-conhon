import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { mockAnimals } from '../mock-data/mockData';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h1>
          <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link to="/chon-thai" className="btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const animal = mockAnimals.find((a) => a.id === item.animalId);
            if (!animal) return null;

            return (
              <div key={item.animalId} className="card flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-20 h-20 bg-tet-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-tet-red-300">
                      {animal.order}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{animal.name}</h3>
                    <p className="text-gray-600">
                      {item.price.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.animalId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.animalId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="w-32 text-right">
                    <p className="font-bold text-tet-red-600">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.animalId)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold">
                  {total.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-semibold">0 đ</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-lg font-bold">Tổng cộng:</span>
                <span className="text-lg font-bold text-tet-red-600">
                  {total.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/thanh-toan')}
                className="w-full btn-primary"
              >
                Thanh toán
              </button>
              <Link
                to="/chon-thai"
                className="w-full btn-secondary text-center block"
              >
                Mua thêm
              </Link>
              <button
                onClick={clearCart}
                className="w-full text-gray-600 hover:text-red-600 text-sm"
              >
                Xóa giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

