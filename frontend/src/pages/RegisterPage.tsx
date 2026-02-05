import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FloatingZaloButton from '../components/FloatingZaloButton';
import SearchableBankDropdown from '../components/SearchableBankDropdown';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        zaloName: '',
        bankCode: 'VCB',
        bankAccount: '',
        bankAccountName: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name.trim()) {
            setError('Vui lòng nhập họ và tên');
            return;
        }
        if (!validatePhone(formData.phone)) {
            setError('Số điện thoại không hợp lệ (VD: 0901234567)');
            return;
        }
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }
        if (!formData.zaloName.trim()) {
            setError('Vui lòng nhập tên Zalo');
            return;
        }
        if (!formData.bankAccount.trim()) {
            setError('Vui lòng nhập số tài khoản ngân hàng');
            return;
        }
        if (!formData.bankAccountName.trim()) {
            setError('Vui lòng nhập tên chủ tài khoản');
            return;
        }

        setLoading(true);

        try {
            const result = await register({
                phone: formData.phone,
                password: formData.password,
                name: formData.name,
                zalo: formData.zaloName,
            });

            if (result.success) {
                navigate('/user/mua-con-vat');
            } else {
                setError(result.error || 'Đăng ký thất bại');
            }
        } catch {
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50 py-8 px-4">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full mb-4 shadow-lg">
                        <span className="text-3xl">🎲</span>
                    </div>
                    <h1 className="text-3xl font-bold text-red-700">Đăng ký tài khoản</h1>
                    <p className="text-gray-600 mt-2">Tham gia Cổ Nhơn ngay hôm nay!</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Thông tin tài khoản */}
                    <div className="border-b pb-4">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-xl">👤</span> Thông tin tài khoản
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="0901234567"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    📌 SĐT là duy nhất, không thể tự đổi sau khi đăng ký
                                </p>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    SĐT Zalo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="zaloName"
                                    value={formData.zaloName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="0901234567"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    📱 Số điện thoại đăng ký Zalo để liên hệ
                                </p>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Ít nhất 6 ký tự"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Nhập lại mật khẩu"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Thông tin ngân hàng */}
                    <div>
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-xl">🏦</span> Thông tin ngân hàng
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Để nhận tiền thưởng khi trúng
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Ngân hàng <span className="text-red-500">*</span>
                                </label>
                                <SearchableBankDropdown
                                    value={formData.bankCode}
                                    onChange={(code) => setFormData({ ...formData, bankCode: code })}
                                    placeholder="Chọn ngân hàng..."
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Số tài khoản <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="bankAccount"
                                    value={formData.bankAccount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Nhập số tài khoản"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Chủ tài khoản <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="bankAccountName"
                                    value={formData.bankAccountName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent uppercase"
                                    placeholder="NGUYEN VAN A"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    ✍️ Viết IN HOA không dấu, đúng với tên trên thẻ ngân hàng
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <h3 className="font-bold text-yellow-800 text-sm">Lưu ý quan trọng</h3>
                                <p className="text-yellow-700 text-xs">
                                    Vui lòng kiểm tra kỹ thông tin ngân hàng. Tiền thưởng sẽ được chuyển vào tài khoản này.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
                    >
                        {loading ? '⏳ Đang xử lý...' : '🎉 Đăng ký ngay'}
                    </button>

                    {/* Login link */}
                    <p className="text-center text-gray-600">
                        Đã có tài khoản?{' '}
                        <Link to="/dang-nhap" className="text-red-600 font-semibold hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </div>
            <FloatingZaloButton />
        </div>
    );
};

export default RegisterPage;
