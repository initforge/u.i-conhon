import React from 'react';
import { Link } from 'react-router-dom';

const HoTroPage: React.FC = () => {
    const supportInfo = [
        { icon: '📞', label: 'Hotline', value: '0332 697 909', action: 'tel:0332697909' },
        { icon: '💬', label: 'Zalo', value: '0332 697 909', action: 'https://zalo.me/0332697909' },
        { icon: '📧', label: 'Email', value: 'nguyenngoctuan211189@gmail.com', action: 'mailto:nguyenngoctuan211189@gmail.com' },
        { icon: '🌐', label: 'Facebook', value: 'Cậu Ba Họ Nguyễn', action: 'https://www.facebook.com/ngoctuan.nguyen.5209' },
    ];

    const faqs = [
        { q: 'Làm sao để chơi Cổ Nhơn?', a: 'Đăng ký → Like/Share bài viết → Chọn Thai → Chọn con vật → Thanh toán → Chờ kết quả' },
        { q: 'Khi nào công bố kết quả?', a: 'Thai An Nhơn: 11h, 17h. Thai Nhơn Phong: 11h, 17h. Thai Hoài Nhơn: 13h, 19h' },
        { q: 'Tiền thưởng được chuyển khi nào?', a: 'Tiền thưởng sẽ được chuyển vào tài khoản ngân hàng của bạn trong vòng 1-2 giờ sau khi xổ.' },
        { q: 'Tỉ lệ thưởng là bao nhiêu?', a: 'Tỉ lệ thưởng 1 chung 30. Riêng thai Hoài Nhơn: Chí Cao (Con Trùn) chung 70. Ví dụ: Mua 30.000đ trúng 900.000đ.' },
        { q: 'Đơn hàng được xác nhận như thế nào?', a: 'Tự động xác nhận đơn hàng khi KH ck thành công. KH chỉ cần chụp lại đơn hàng.' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/mua-con-vat" className="text-gray-500 hover:text-red-600 mb-4 inline-block">
                        ← Quay lại
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Hỗ trợ</h1>
                    <p className="text-gray-600">Liên hệ chúng tôi nếu bạn cần giúp đỡ</p>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="font-bold text-gray-800 text-lg mb-4">📞 Liên hệ</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {supportInfo.map((info) => (
                            <a
                                key={info.label}
                                href={info.action}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors h-full"
                            >
                                <span className="text-2xl flex-shrink-0 mt-1">{info.icon}</span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-500">{info.label}</p>
                                    <p className={`font-semibold text-gray-800 break-all ${info.label === 'Email' ? 'text-xs' : 'text-sm'}`}>{info.value}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="font-bold text-gray-800 text-lg mb-4">❓ Câu hỏi thường gặp</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                                <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
                                <p className="text-gray-600 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
                    <h2 className="font-bold text-lg mb-4">🚀 Bắt đầu chơi ngay</h2>
                    <p className="mb-4 opacity-90">Tham gia Cổ Nhơn và rinh lộc Tết về nhà!</p>
                    <Link
                        to="/chon-thai"
                        className="inline-block px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100"
                    >
                        Chơi ngay →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HoTroPage;
