import React from 'react';

const GioiThieuPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-tet-red-700 mb-8">
          Giới thiệu
        </h1>
        
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Về Cổ Nhơn</h2>
          <p className="text-gray-700 mb-4">
            Cổ Nhơn là trò chơi dân gian truyền thống của vùng Hoài Nhơn, Bình Định.
            Trò chơi này đã được lưu truyền qua nhiều thế hệ và là một phần quan trọng
            của văn hóa địa phương.
          </p>
          <p className="text-gray-700">
            (Nội dung chi tiết sẽ được cập nhật sau)
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Lịch sử</h2>
          <p className="text-gray-700">
            (Nội dung lịch sử sẽ được cập nhật sau)
          </p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Quy tắc chơi</h2>
          <p className="text-gray-700">
            (Nội dung quy tắc sẽ được cập nhật sau)
          </p>
        </div>
      </div>
    </div>
  );
};

export default GioiThieuPage;

