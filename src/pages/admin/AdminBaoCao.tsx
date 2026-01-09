import React, { useState } from 'react';
import AdminPageWrapper from '../../components/AdminPageWrapper';

// Animal data for An Nhơn / Nhơn Phong (40 animals - 3 column layout)
const animalsAnNhon = {
    benTrai: [
        { order: 39, name: 'Thần tài', alias: 'thượng' },
        { order: 26, name: 'Rồng nằm', alias: 'lỗ tai' },
        { order: 34, name: 'Nai', alias: 'bả vai' },
        { order: 23, name: 'Khỉ', alias: 'dấu vai' },
        { order: 33, name: 'Nhện', alias: 'chổ tay' },
        { order: 17, name: 'Hạc', alias: 'cùi tay' },
        { order: 32, name: 'Rắn', alias: 'nách' },
        { order: 21, name: 'Én', alias: 'vú' },
        { order: 11, name: 'Chó', alias: 'hông' },
        { order: 18, name: 'Kỳ lân', alias: 'đùi' },
        { order: 1, name: 'Cá trắng', alias: 'vế đùi' },
        { order: 16, name: 'Ong', alias: 'đầu gối' },
        { order: 24, name: 'Ếch', alias: 'bụng chân' },
        { order: 15, name: 'Chuột', alias: 'bàn chân' },
        { order: 40, name: 'Ông táo', alias: 'hạ' },
    ],
    oGiua: [
        { order: 5, name: 'Trùn', alias: 'đầu' },
        { order: 12, name: 'Ngựa', alias: 'trán' },
        { order: 14, name: 'Mèo', alias: 'miệng' },
        { order: 28, name: 'Gà', alias: 'cổ họng' },
        { order: 6, name: 'Cọp', alias: 'tim' },
        { order: 7, name: 'Heo', alias: 'bụng' },
        { order: 8, name: 'Thỏ', alias: 'rún' },
        { order: 35, name: 'Dê', alias: 'hậu môn' },
        { order: 31, name: 'Tôm', alias: 'sinh dục' },
    ],
    benPhai: [
        { order: 37, name: 'Ông trời', alias: 'thượng' },
        { order: 19, name: 'Bướm', alias: 'lỗ tai' },
        { order: 36, name: 'Bà vải', alias: 'bả vai' },
        { order: 3, name: 'Ngỗng', alias: 'đầu vai' },
        { order: 2, name: 'Ốc', alias: 'chổ tay' },
        { order: 10, name: 'Rồng bay', alias: 'cùi tay' },
        { order: 27, name: 'Rùa', alias: 'nách' },
        { order: 4, name: 'Công', alias: 'vú' },
        { order: 13, name: 'Voi', alias: 'hông' },
        { order: 25, name: 'Quạ', alias: 'đùi' },
        { order: 9, name: 'Trâu', alias: 'vế đùi' },
        { order: 20, name: 'Núi', alias: 'đầu gối' },
        { order: 22, name: 'Bồ câu', alias: 'bụng chân' },
        { order: 29, name: 'Lươn', alias: 'bàn chân' },
        { order: 38, name: 'Ông địa', alias: 'hạ' },
        { order: 30, name: 'Cá đỏ', alias: 'lá cờ' },
    ],
};

// Animal data for Hoài Nhơn (36 animals - grid layout)
const animalsHoaiNhon = [
    { order: 1, name: 'Cá Trắng', alias: 'Chiếm Khôi' },
    { order: 2, name: 'Ốc', alias: 'Bản Quế' },
    { order: 3, name: 'Ngỗng', alias: 'Vinh Sanh' },
    { order: 4, name: 'Công', alias: 'Phùng Xuân' },
    { order: 5, name: 'Trùn', alias: 'Chí Cao' },
    { order: 6, name: 'Cọp', alias: 'Khôn Sơn' },
    { order: 7, name: 'Heo', alias: 'Chánh Thuận' },
    { order: 8, name: 'Thỏ', alias: 'Nguyệt Bửu' },
    { order: 9, name: 'Trâu', alias: 'Hớn Vân' },
    { order: 10, name: 'Rồng Bay', alias: 'Giang Từ' },
    { order: 11, name: 'Chó', alias: 'Phước Tôn' },
    { order: 12, name: 'Ngựa', alias: 'Quang Minh' },
    { order: 13, name: 'Voi', alias: 'Hữu Tài' },
    { order: 14, name: 'Mèo', alias: 'Chỉ Đắc' },
    { order: 15, name: 'Chuột', alias: 'Tất Khắc' },
    { order: 16, name: 'Ong', alias: 'Mậu Lâm' },
    { order: 17, name: 'Hạc', alias: 'Trọng Tiên' },
    { order: 18, name: 'Kỳ Lân', alias: 'Thiên Thân' },
    { order: 19, name: 'Bướm', alias: 'Cấn Ngọc' },
    { order: 20, name: 'Hòn Núi', alias: 'Trân Châu' },
    { order: 21, name: 'Én', alias: 'Thượng Chiêu' },
    { order: 22, name: 'Bồ Câu', alias: 'Song Đồng' },
    { order: 23, name: 'Khỉ', alias: 'Tam Hòe' },
    { order: 24, name: 'Ếch', alias: 'Hiệp Hải' },
    { order: 25, name: 'Quạ', alias: 'Cửu Quan' },
    { order: 26, name: 'Rồng Nằm', alias: 'Thái Bình' },
    { order: 27, name: 'Rùa', alias: 'Hỏa Diệm' },
    { order: 28, name: 'Gà', alias: 'Nhựt Thăng' },
    { order: 29, name: 'Lươn', alias: 'Địa Lương' },
    { order: 30, name: 'Cá Đỏ', alias: 'Tỉnh Lợi' },
    { order: 31, name: 'Tôm', alias: 'Trường Thọ' },
    { order: 32, name: 'Rắn', alias: 'Vạn Kim' },
    { order: 33, name: 'Nhện', alias: 'Thanh Tiền' },
    { order: 34, name: 'Nai', alias: 'Nguyên Kiết' },
    { order: 35, name: 'Dê', alias: 'Nhứt Phẩm' },
    { order: 36, name: 'Bà Vải', alias: 'An Sỹ' },
];

const AdminBaoCao: React.FC = () => {
    const [selectedThai, setSelectedThai] = useState('an-nhon');
    const [timeFilter, setTimeFilter] = useState('this-tet');
    const [selectedDate, setSelectedDate] = useState('');

    const thaiTabs = [
        { id: 'an-nhon', name: 'An Nhơn', animals: 40 },
        { id: 'nhon-phong', name: 'Nhơn Phong', animals: 40 },
        { id: 'hoai-nhon', name: 'Hoài Nhơn', animals: 36 },
    ];

    // Mock purchase data
    const getMockPurchaseData = (animalOrder: number) => {
        const mockData: Record<number, { count: number; amount: number }> = {
            1: { count: 5, amount: 150000 },
            5: { count: 3, amount: 90000 },
            12: { count: 2, amount: 60000 },
            6: { count: 4, amount: 120000 },
            14: { count: 1, amount: 30000 },
        };
        return mockData[animalOrder] || { count: 0, amount: 0 };
    };

    const renderAnimalCell = (animal: { order: number; name: string; alias: string }) => {
        const purchaseData = getMockPurchaseData(animal.order);
        return (
            <div
                key={animal.order}
                className={`p-2 border border-gray-200 rounded-lg text-center ${purchaseData.count > 0 ? 'bg-green-50 border-green-300' : 'bg-white'
                    }`}
            >
                <div className="font-bold text-sm" style={{ color: '#991b1b' }}>{animal.order}. {animal.name}</div>
                <div className="text-xs text-gray-500">{animal.alias}</div>
                {purchaseData.count > 0 && (
                    <div className="mt-1 text-xs font-semibold text-green-600">
                        {purchaseData.count} lượt - {purchaseData.amount.toLocaleString('vi-VN')}đ
                    </div>
                )}
            </div>
        );
    };

    const renderAnNhonLayout = () => (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-center text-lg font-bold mb-4" style={{ color: '#991b1b' }}>
                THEO ĐỒ HÌNH NHƠN
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {/* BÊN TRÁI */}
                <div>
                    <h4 className="text-center font-bold mb-2 py-2 bg-gray-100 rounded-lg">BÊN TRÁI</h4>
                    <div className="space-y-2">
                        {animalsAnNhon.benTrai.map((animal) => renderAnimalCell(animal))}
                    </div>
                </div>

                {/* Ở GIỮA */}
                <div>
                    <h4 className="text-center font-bold mb-2 py-2 bg-gray-100 rounded-lg">Ở GIỮA</h4>
                    <div className="space-y-2">
                        {animalsAnNhon.oGiua.map((animal) => renderAnimalCell(animal))}
                    </div>
                </div>

                {/* BÊN PHẢI */}
                <div>
                    <h4 className="text-center font-bold mb-2 py-2 bg-gray-100 rounded-lg">BÊN PHẢI</h4>
                    <div className="space-y-2">
                        {animalsAnNhon.benPhai.map((animal) => renderAnimalCell(animal))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHoaiNhonLayout = () => (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-center text-lg font-bold mb-4" style={{ color: '#991b1b' }}>
                BẢNG 36 CON VẬT - HOÀI NHƠN
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {animalsHoaiNhon.map((animal) => {
                    const purchaseData = getMockPurchaseData(animal.order);
                    return (
                        <div
                            key={animal.order}
                            className={`p-3 border rounded-lg text-center transition-all hover:shadow-md ${purchaseData.count > 0 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <div className="font-bold text-lg" style={{ color: '#991b1b' }}>{animal.order}</div>
                            <div className="font-medium text-sm text-gray-800">{animal.name}</div>
                            <div className="text-xs text-gray-500">{animal.alias}</div>
                            {purchaseData.count > 0 && (
                                <div className="mt-1 text-xs font-bold text-green-600">
                                    {purchaseData.count} ({purchaseData.amount.toLocaleString('vi-VN')}đ)
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // Calculate summary stats
    const totalCount = selectedThai === 'hoai-nhon'
        ? animalsHoaiNhon.reduce((sum, a) => sum + getMockPurchaseData(a.order).count, 0)
        : [...animalsAnNhon.benTrai, ...animalsAnNhon.oGiua, ...animalsAnNhon.benPhai]
            .reduce((sum, a) => sum + getMockPurchaseData(a.order).count, 0);

    const totalAmount = selectedThai === 'hoai-nhon'
        ? animalsHoaiNhon.reduce((sum, a) => sum + getMockPurchaseData(a.order).amount, 0)
        : [...animalsAnNhon.benTrai, ...animalsAnNhon.oGiua, ...animalsAnNhon.benPhai]
            .reduce((sum, a) => sum + getMockPurchaseData(a.order).amount, 0);

    return (
        <AdminPageWrapper
            title="Báo cáo thống kê"
            subtitle="Thống kê doanh thu và lượt mua theo Thai"
            icon="📊"
        >
            {/* Thai Tabs */}
            <div className="mb-6">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                    {thaiTabs.map((thai) => (
                        <button
                            key={thai.id}
                            onClick={() => setSelectedThai(thai.id)}
                            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${selectedThai === thai.id
                                ? 'bg-white shadow-md text-amber-700'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {thai.name}
                            <span className="ml-1 text-xs text-gray-400">({thai.animals} con)</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Filter */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => { setTimeFilter('this-tet'); setSelectedDate(''); }}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${timeFilter === 'this-tet'
                            ? 'bg-white shadow-md text-amber-700'
                            : 'text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Dịp Tết
                    </button>
                    <button
                        onClick={() => setTimeFilter('by-date')}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${timeFilter === 'by-date'
                            ? 'bg-white shadow-md text-amber-700'
                            : 'text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Theo ngày
                    </button>
                    <button
                        onClick={() => { setTimeFilter('all'); setSelectedDate(''); }}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${timeFilter === 'all'
                            ? 'bg-white shadow-md text-amber-700'
                            : 'text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Tất cả
                    </button>
                </div>

                {timeFilter === 'by-date' && (
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Tổng lượt mua</p>
                    <p className="text-2xl font-bold" style={{ color: '#991b1b' }}>{totalCount}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Tổng doanh thu</p>
                    <p className="text-2xl font-bold" style={{ color: '#991b1b' }}>{totalAmount.toLocaleString('vi-VN')}đ</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Số con đã mua</p>
                    <p className="text-2xl font-bold" style={{ color: '#991b1b' }}>
                        {selectedThai === 'hoai-nhon'
                            ? animalsHoaiNhon.filter(a => getMockPurchaseData(a.order).count > 0).length
                            : [...animalsAnNhon.benTrai, ...animalsAnNhon.oGiua, ...animalsAnNhon.benPhai]
                                .filter(a => getMockPurchaseData(a.order).count > 0).length
                        }/{thaiTabs.find(t => t.id === selectedThai)?.animals}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Thai đang xem</p>
                    <p className="text-2xl font-bold" style={{ color: '#991b1b' }}>
                        {thaiTabs.find(t => t.id === selectedThai)?.name}
                    </p>
                </div>
            </div>

            {/* Animal Layout based on Thai type */}
            {selectedThai === 'hoai-nhon' ? renderHoaiNhonLayout() : renderAnNhonLayout()}
        </AdminPageWrapper>
    );
};

export default AdminBaoCao;
