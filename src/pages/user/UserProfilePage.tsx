import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        accountNumber: user?.bankAccount?.accountNumber || '',
        accountHolder: user?.bankAccount?.accountHolder || '',
        bankName: user?.bankAccount?.bankName || '',
    });
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSave = () => {
        // TODO: In Phase 2, this will call API to update user profile
        console.log('Saving bank account info:', formData);
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleCancel = () => {
        setFormData({
            accountNumber: user?.bankAccount?.accountNumber || '',
            accountHolder: user?.bankAccount?.accountHolder || '',
            bankName: user?.bankAccount?.bankName || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Thông tin khách hàng</h1>
                <p className="text-gray-600">Quản lý thông tin tài khoản và ngân hàng của bạn</p>
            </div>

            {/* Success Message */}
            {saveSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                    <span className="text-2xl">✅</span>
                    <div>
                        <p className="font-semibold text-green-800">Cập nhật thành công!</p>
                        <p className="text-sm text-green-600">Thông tin của bạn đã được lưu.</p>
                    </div>
                </div>
            )}

            {/* User Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-md"
                        style={{
                            background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
                            color: 'white'
                        }}
                    >
                        {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-sm text-gray-500">{user?.phone}</p>
                        <p className="text-sm text-red-600 font-medium">Người chơi</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                        <p className="font-semibold text-gray-800">{user?.phone}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Tên Zalo</p>
                        <p className="font-semibold text-gray-800">{user?.zaloName || 'Chưa cập nhật'}</p>
                    </div>
                </div>
            </div>

            {/* Bank Account Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">🏦</span>
                        <h2 className="text-xl font-bold text-gray-800">Thông tin ngân hàng</h2>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                        >
                            <span>✏️</span>
                            <span>Chỉnh sửa</span>
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số tài khoản <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Nhập số tài khoản"
                            />
                        ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                <p className="font-semibold text-gray-800">
                                    {formData.accountNumber || 'Chưa cập nhật'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Account Holder */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chủ tài khoản <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.accountHolder}
                                onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all uppercase"
                                placeholder="NGUYEN VAN A"
                            />
                        ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                <p className="font-semibold text-gray-800">
                                    {formData.accountHolder || 'Chưa cập nhật'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Bank Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên ngân hàng <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                            <select
                                value={formData.bankName}
                                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            >
                                <option value="">Chọn ngân hàng</option>
                                <option value="Vietcombank">Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam</option>
                                <option value="Techcombank">Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam</option>
                                <option value="BIDV">BIDV - Ngân hàng TMCP Đầu tư và Phát triển Việt Nam</option>
                                <option value="VietinBank">VietinBank - Ngân hàng TMCP Công thương Việt Nam</option>
                                <option value="Agribank">Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn</option>
                                <option value="ACB">ACB - Ngân hàng TMCP Á Châu</option>
                                <option value="MB">MB - Ngân hàng TMCP Quân đội</option>
                                <option value="VPBank">VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng</option>
                                <option value="TPBank">TPBank - Ngân hàng TMCP Tiên Phong</option>
                                <option value="Sacombank">Sacombank - Ngân hàng TMCP Sài Gòn Thương Tín</option>
                                <option value="HDBank">HDBank - Ngân hàng TMCP Phát triển TP.HCM</option>
                                <option value="VIB">VIB - Ngân hàng TMCP Quốc tế Việt Nam</option>
                                <option value="SHB">SHB - Ngân hàng TMCP Sài Gòn - Hà Nội</option>
                                <option value="OCB">OCB - Ngân hàng TMCP Phương Đông</option>
                                <option value="MSB">MSB - Ngân hàng TMCP Hàng Hải</option>
                            </select>
                        ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                <p className="font-semibold text-gray-800">
                                    {formData.bankName || 'Chưa cập nhật'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex space-x-3 mt-6">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
                        >
                            💾 Lưu thay đổi
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
                        >
                            ❌ Hủy
                        </button>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center space-x-2">
                        <span>ℹ️</span>
                        <span>Lưu ý quan trọng</span>
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Thông tin ngân hàng được sử dụng để nhận tiền thưởng khi trúng giải</li>
                        <li>• Vui lòng kiểm tra kỹ thông tin trước khi lưu</li>
                        <li>• Tên chủ tài khoản phải viết HOA, không dấu</li>
                        <li>• Số tài khoản phải chính xác để tránh sai sót khi chuyển tiền</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
