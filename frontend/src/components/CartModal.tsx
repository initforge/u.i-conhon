import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onContinueShopping }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/thanh-toan');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Đã thêm vào giỏ hàng!
        </h3>
        <p className="text-gray-600 mb-6">
          Bạn muốn làm gì tiếp theo?
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              onContinueShopping();
              onClose();
            }}
            className="flex-1 btn-secondary"
          >
            Mua thêm
          </button>
          <button
            onClick={handleCheckout}
            className="flex-1 btn-primary"
          >
            Thanh toán
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default CartModal;

