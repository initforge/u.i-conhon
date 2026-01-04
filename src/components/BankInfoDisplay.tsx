import React from 'react';

interface BankInfoDisplayProps {
  accountNumber: string;
  accountHolder: string;
  bankName: string;
}

const BankInfoDisplay: React.FC<BankInfoDisplayProps> = ({
  accountNumber,
  accountHolder,
  bankName,
}) => {
  return (
    <div className="card bg-gradient-to-br from-tet-red-50 to-white border-2 border-tet-red-300">
      <h3 className="text-xl font-bold text-tet-red-700 mb-4">
        Thông tin chuyển khoản
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <span className="text-gray-600 font-semibold">Số tài khoản:</span>
          <span className="text-lg font-bold text-tet-red-700 font-mono">
            {accountNumber}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <span className="text-gray-600 font-semibold">Chủ tài khoản:</span>
          <span className="text-lg font-bold text-gray-800">
            {accountHolder}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <span className="text-gray-600 font-semibold">Ngân hàng:</span>
          <span className="text-lg font-bold text-gray-800">
            {bankName}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
        <p className="text-yellow-800 text-sm">
          💡 <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và ghi chú đầy đủ thông tin đơn hàng.
        </p>
      </div>
    </div>
  );
};

export default BankInfoDisplay;

