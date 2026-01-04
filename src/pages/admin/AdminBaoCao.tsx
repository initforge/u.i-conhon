import React, { useState } from 'react';

const AdminBaoCao: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'user' | 'thai' | 'ngay'>('user');

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Báo cáo & Thống kê</h1>
                <p className="text-gray-600">Phân tích dữ liệu hệ thống</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b">
                <button
                    onClick={() => setActiveTab('user')}
                    className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'user'
                            ? 'text-red-600 border-b-2 border-red-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    👤 Theo User
                </button>
                <button
                    onClick={() => setActiveTab('thai')}
                    className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'thai'
                            ? 'text-red-600 border-b-2 border-red-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    🏠 Theo Thai
                </button>
                <button
                    onClick={() => setActiveTab('ngay')}
                    className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'ngay'
                            ? 'text-red-600 border-b-2 border-red-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    📅 Theo Ngày
                </button>
            </div>

            {/* Content */}
            {activeTab === 'user' && (
                <div className="space-y-6">
                    {/* Mock Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="font-bold text-gray-800 mb-4">Top 10 User mua nhiều nhất</h2>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <span className="text-4xl block mb-2">📊</span>
                                <span>Biểu đồ cột (Mock)</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="font-bold text-gray-800 mb-4">Phân bố người chơi theo độ tuổi</h2>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <span className="text-4xl block mb-2">🥧</span>
                                <span>Biểu đồ tròn (Mock)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'thai' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-green-50 rounded-xl shadow-md p-6 border-2 border-green-200">
                            <h2 className="font-bold text-green-800 mb-2">🟢 Thai An Nhơn</h2>
                            <p className="text-3xl font-bold text-green-600">5,200,000đ</p>
                            <p className="text-sm text-green-600">173 đơn hàng</p>
                        </div>
                        <div className="bg-yellow-50 rounded-xl shadow-md p-6 border-2 border-yellow-200">
                            <h2 className="font-bold text-yellow-800 mb-2">🟡 Thai Nhơn Phong</h2>
                            <p className="text-3xl font-bold text-yellow-600">3,800,000đ</p>
                            <p className="text-sm text-yellow-600">127 đơn hàng</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl shadow-md p-6 border-2 border-blue-200">
                            <h2 className="font-bold text-blue-800 mb-2">🔵 Thai Hoài Nhơn</h2>
                            <p className="text-3xl font-bold text-blue-600">2,600,000đ</p>
                            <p className="text-sm text-blue-600">87 đơn hàng</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="font-bold text-gray-800 mb-4">So sánh doanh thu theo Thai</h2>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <span className="text-4xl block mb-2">📈</span>
                                <span>Biểu đồ đường (Mock)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ngay' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="font-bold text-gray-800 mb-4">Doanh thu 7 ngày gần nhất</h2>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <span className="text-4xl block mb-2">📊</span>
                                <span>Biểu đồ cột theo ngày (Mock)</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="font-bold text-gray-800 mb-4">Số đơn hàng theo giờ trong ngày</h2>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <span className="text-4xl block mb-2">📉</span>
                                <span>Biểu đồ line (Mock)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBaoCao;
