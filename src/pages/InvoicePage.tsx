import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockOrders, mockAnimals, mockThais } from '../mock-data/mockData';

const InvoicePage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const order = mockOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Không tìm thấy hóa đơn</h1>
        <Link to="/chon-thai" className="btn-primary mt-4 inline-block">
          Quay lại
        </Link>
      </div>
    );
  }

  const thai = mockThais.find((t) => t.id === order.thaiId);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="max-w-3xl mx-auto card relative overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/decorations/bg-cau-thai-co-nhon.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 bg-white/95 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-tet-red-800 mb-2">HÓA ĐƠN</h1>
            <p className="text-gray-600">Mã đơn: {order.id}</p>
          </div>

          <div className="mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-semibold">{formatDate(order.createdAt)}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Thanh toán lúc:</span>
                <span className="font-semibold">{formatDate(order.paidAt)}</span>
              </div>
            )}
            {thai && (
              <div className="flex justify-between">
                <span className="text-gray-600">Thai:</span>
                <span className="font-semibold">{thai.name}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Danh sách sản phẩm:</h2>
            <div className="space-y-2">
              {order.items.map((item) => {
                const animal = mockAnimals.find((a) => a.id === item.animalId);
                return (
                  <div
                    key={item.animalId}
                    className="flex justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{animal?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">
                        {item.price.toLocaleString('vi-VN')} đ x {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-tet-red-600">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t-2 border-tet-red-300 pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Tổng cộng:</span>
              <span className="text-tet-red-600">
                {order.total.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {order.cauThai && (
            <div className="mb-6 p-4 bg-tet-red-50 border border-tet-red-200 rounded-lg">
              <h3 className="font-bold text-tet-red-800 mb-2">Câu thai:</h3>
              <p className="text-gray-700 italic text-lg">{order.cauThai}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <Link to="/chon-thai" className="flex-1 btn-secondary text-center">
              Về trang Thai
            </Link>
            <Link to="/ket-qua" className="flex-1 btn-primary text-center">
              Xem kết quả
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;

