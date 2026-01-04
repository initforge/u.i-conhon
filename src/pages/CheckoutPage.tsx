import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import BankInfoDisplay from '../components/BankInfoDisplay';
import NotificationBanner from '../components/NotificationBanner';
import { mockOrders } from '../mock-data/mockData';

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Giỏ hàng trống</h1>
          <button onClick={() => navigate('/chon-thai')} className="btn-primary">
            Quay lại mua sắm
          </button>
        </div>
      </div>
    );
  }

  const bankInfo = {
    accountNumber: '1234567890',
    accountHolder: 'CO NHON AN NHON',
    bankName: 'Techcombank',
  };

  const handleConfirmPayment = () => {
    // Mock: Create order
    const newOrder = {
      id: `order-${Date.now()}`,
      userId: user?.id || 'user-1',
      thaiId: 'thai-an-nhon', // Mock
      items,
      total,
      status: 'paid' as const,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };
    
    // In Phase 2, this will call API
    mockOrders.push(newOrder);
    setPaid(true);
    clearCart();
    
    setTimeout(() => {
      navigate(`/hoa-don/${newOrder.id}`);
    }, 2000);
  };

  if (paid) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-tet-red-700 mb-4">
            Đã xác nhận thanh toán!
          </h1>
          <p className="text-gray-600">Đang chuyển đến hóa đơn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Thanh toán</h1>

      <div className="max-w-4xl mx-auto">
        <NotificationBanner
          message="Nhớ chụp ảnh hóa đơn sau khi chuyển khoản và gửi qua Zalo: 0332697909"
          type="warning"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bank Info */}
          <BankInfoDisplay
            accountNumber={bankInfo.accountNumber}
            accountHolder={bankInfo.accountHolder}
            bankName={bankInfo.bankName}
          />

          {/* Order Summary */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượng sản phẩm:</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-bold text-tet-red-600 text-lg">
                  {total.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
            <button
              onClick={handleConfirmPayment}
              className="w-full btn-primary"
            >
              Tôi đã chuyển khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

