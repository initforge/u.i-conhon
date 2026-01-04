import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountHolder: '',
    bankName: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.bankAccount) {
      setFormData({
        accountNumber: user.bankAccount.accountNumber,
        accountHolder: user.bankAccount.accountHolder,
        bankName: user.bankAccount.bankName,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save - in Phase 2 this will call API
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="text-2xl font-bold mb-6 text-tet-red-700">
        Thông tin tài khoản ngân hàng
      </h2>

      {saved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg text-green-700">
          Đã lưu thành công!
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Số tài khoản
        </label>
        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Chủ tài khoản
        </label>
        <input
          type="text"
          name="accountHolder"
          value={formData.accountHolder}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Tên ngân hàng
        </label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-600">
        <p className="font-semibold mb-1">Lưu ý:</p>
        <p>• Tên Zalo của bạn sẽ được hiển thị công khai</p>
        <p>• Số điện thoại chỉ Admin mới thấy được</p>
      </div>

      <button type="submit" className="btn-primary w-full">
        Lưu thông tin
      </button>
    </form>
  );
};

export default ProfileForm;

