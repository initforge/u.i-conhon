import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/api';
import SearchableBankDropdown, { BANKS } from '../components/SearchableBankDropdown';

const ThongTinCaNhanPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [bankInfo, setBankInfo] = useState({
        accountNumber: '',
        accountName: '',
        bankCode: '',
    });

    // Load user's bank info when component mounts or user changes
    useEffect(() => {
        if (user) {
            setBankInfo({
                accountNumber: user.bank_account || '',
                accountName: user.bank_holder || user.name || '',
                bankCode: user.bank_code || '',
            });
        }
    }, [user]);

    // Get bank display name
    const getBankDisplayName = (code: string) => {
        if (!code) return 'Chưa cập nhật';
        const bank = BANKS.find(b => b.code === code);
        return bank ? bank.shortName : code;
    };

    const handleSave = async () => {
        if (!bankInfo.bankCode || !bankInfo.accountNumber || !bankInfo.accountName) {
            alert('Vui lòng điền đầy đủ thông tin ngân hàng');
            return;
        }

        try {
            setSaving(true);
            await updateProfile({
                bank_code: bankInfo.bankCode,
                bank_account: bankInfo.accountNumber,
                bank_holder: bankInfo.accountName,
            });

            // Update user data in context
            updateUser({
                bank_code: bankInfo.bankCode,
                bank_account: bankInfo.accountNumber,
                bank_holder: bankInfo.accountName,
            });

            alert('Đã lưu thông tin ngân hàng thành công!');
            setIsEditing(false);
        } catch (err: unknown) {
            console.error('Save error:', err);
            const message = err instanceof Error ? err.message : 'Không thể lưu thông tin';
            alert(`Lỗi: ${message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/user/mua-con-vat" className="text-gray-500 hover:text-red-600 mb-4 inline-block">
                        ← Quay lại
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Thông tin cá nhân</h1>
                    <p className="text-gray-600">Cập nhật thông tin tài khoản ngân hàng để nhận thưởng</p>
                </div>

                {/* Profile Info */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center space-x-2">
                        <span>👤</span>
                        <span>Thông tin tài khoản</span>
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Họ và tên:</span>
                            <span className="font-medium">{user?.name || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Số điện thoại:</span>
                            <span className="font-medium">{user?.phone || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between py-3">
                            <span className="text-gray-600">Zalo:</span>
                            <span className="font-medium">{user?.zalo || 'Chưa cập nhật'}</span>
                        </div>
                    </div>
                </div>

                {/* Bank Info */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-800 text-lg flex items-center space-x-2">
                            <span>🏦</span>
                            <span>Thông tin ngân hàng</span>
                        </h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                            >
                                ✏️ Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Ngân hàng</label>
                                <SearchableBankDropdown
                                    value={bankInfo.bankCode}
                                    onChange={(code) => setBankInfo({ ...bankInfo, bankCode: code })}
                                    placeholder="Chọn ngân hàng..."
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Số tài khoản</label>
                                <input
                                    type="text"
                                    value={bankInfo.accountNumber}
                                    onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Nhập số tài khoản"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Chủ tài khoản</label>
                                <input
                                    type="text"
                                    value={bankInfo.accountName}
                                    onChange={(e) => setBankInfo({ ...bankInfo, accountName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Nhập tên chủ tài khoản"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    disabled={saving}
                                    className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                                >
                                    {saving ? '⏳ Đang lưu...' : '💾 Lưu thông tin'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Ngân hàng:</span>
                                <span className="font-medium">{getBankDisplayName(bankInfo.bankCode)}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Số tài khoản:</span>
                                <span className="font-medium">{bankInfo.accountNumber || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-gray-600">Chủ tài khoản:</span>
                                <span className="font-medium">{bankInfo.accountName || 'Chưa cập nhật'}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <h3 className="font-bold text-yellow-800">Lưu ý quan trọng</h3>
                            <p className="text-yellow-700 text-sm">
                                Vui lòng kiểm tra kỹ thông tin ngân hàng trước khi lưu. Tiền thưởng sẽ được chuyển vào tài khoản này.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThongTinCaNhanPage;
