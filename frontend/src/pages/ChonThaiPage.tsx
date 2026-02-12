import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ChonThaiPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const thaiOptions = [
        {
            id: 'an-nhon',
            name: 'Thai An Nhơn',
            description: 'Xổ lúc 11h, 17h (Tết thêm 21h)',
            color: 'from-green-500 to-green-700',
            icon: '🟢',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            times: ['11h', '17h', '21h'],
        },
        {
            id: 'nhon-phong',
            name: 'Thai Nhơn Phong',
            description: 'Xổ lúc 11h và 17h hàng ngày',
            color: 'from-yellow-500 to-yellow-700',
            icon: '🟡',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-500',
            times: ['11h', '17h'],
        },
        {
            id: 'hoai-nhon',
            name: 'Thai Hoài Nhơn',
            description: 'Xổ lúc 13h và 19h',
            color: 'from-blue-500 to-blue-700',
            icon: '🔵',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500',
            times: ['13h', '19h'],
        },
    ];

    const handleSelectThai = (thaiId: string) => {
        // Store selected thai and go directly to purchase page
        localStorage.setItem('selectedThai', thaiId);
        if (isAuthenticated) {
            navigate('/user/mua-con-vat');
        } else {
            navigate(`/dang-nhap?redirect=/user/mua-con-vat&thai=${thaiId}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link to="/user/ho-tro" className="text-gray-500 hover:text-red-600 inline-block mb-6">
                        ← Quay lại
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Chọn Thai Để Mua</h1>
                    <p className="text-gray-600 text-lg">Mỗi Thai có lịch xổ riêng</p>
                </div>

                {/* Thai Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {thaiOptions.map((thai) => (
                        <div
                            key={thai.id}
                            className={`${thai.bgColor} border-2 ${thai.borderColor} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2`}
                            onClick={() => handleSelectThai(thai.id)}
                        >
                            {/* Icon */}
                            <div className="text-6xl text-center mb-4">{thai.icon}</div>

                            {/* Name */}
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                                {thai.name}
                            </h2>

                            {/* Times */}
                            <div className="flex flex-wrap justify-center gap-2 mb-3">
                                {thai.times.map((time, i) => (
                                    <span key={i} className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                                        {time}
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <p className="text-center text-gray-600 mb-4 text-sm">
                                {thai.description}
                            </p>


                            {/* Button */}
                            <button
                                className={`w-full py-3 bg-gradient-to-r ${thai.color} text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity`}
                            >
                                Mua ngay
                            </button>
                        </div>
                    ))}
                </div>

                {/* Info */}
                <div className="mt-12 text-center bg-white rounded-xl p-6 shadow-md">
                    <h3 className="font-bold text-gray-800 mb-4">📌 Lưu ý quan trọng</h3>
                    <ul className="text-gray-600 text-sm space-y-2 text-left max-w-md mx-auto">
                        <li>• Trúng thưởng sẽ được thông báo ngay sau khi xổ</li>
                        <li>• Thời gian đóng tịch:
                            <ul className="ml-4 mt-1 space-y-1">
                                <li>- Thai An Nhơn: Sáng 10h30 - Chiều 16h30</li>
                                <li>- Thai Nhơn Phong: Sáng 10h30 - Chiều 16h30</li>
                                <li>- Thai Hoài Nhơn: Sáng 12h30 - Chiều 18h30</li>
                            </ul>
                        </li>
                        <li className="text-red-600">- Từ mùng 1 Tết: Tối 20h30 (An Nhơn)</li>
                        <li>• Mỗi đơn hàng, khách hàng có thể mua 3 Thai</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ChonThaiPage;
