import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ChonThaiPage: React.FC = () => {
    const navigate = useNavigate();

    const thaiOptions = [
        {
            id: 'an-nhon',
            name: 'Thai An Nhơn',
            description: 'Khu vực truyền thống với nhiều người chơi',
            color: 'from-green-500 to-green-700',
            icon: '🟢',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
        },
        {
            id: 'nhon-phong',
            name: 'Thai Nhơn Phong',
            description: 'Tỉ lệ thưởng hấp dẫn cho người mới',
            color: 'from-yellow-500 to-yellow-700',
            icon: '🟡',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-500',
        },
        {
            id: 'hoai-nhon',
            name: 'Thai Hoài Nhơn',
            description: 'Điểm đến của những cao thủ',
            color: 'from-blue-500 to-blue-700',
            icon: '🔵',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500',
        },
    ];

    const handleSelectThai = (thaiId: string) => {
        navigate(`/dang-nhap?thai=${thaiId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link to="/" className="text-gray-500 hover:text-red-600 inline-block mb-6">
                        ← Về trang chủ
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Chọn Khu Vực Thai</h1>
                    <p className="text-gray-600 text-lg">Chọn khu vực bạn muốn tham gia chơi Cổ Nhơn</p>
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
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
                                {thai.name}
                            </h2>

                            {/* Description */}
                            <p className="text-center text-gray-600 mb-6">
                                {thai.description}
                            </p>

                            {/* Button */}
                            <button
                                className={`w-full py-3 bg-gradient-to-r ${thai.color} text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity`}
                            >
                                Chọn khu vực này
                            </button>
                        </div>
                    ))}
                </div>

                {/* Info */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500">
                        Bạn có thể đổi khu vực bất cứ lúc nào sau khi đăng nhập
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChonThaiPage;
