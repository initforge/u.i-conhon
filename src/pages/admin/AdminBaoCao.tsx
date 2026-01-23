import React, { useState } from 'react';
import AdminPageWrapper from '../../components/AdminPageWrapper';

// Data bộ phận cơ thể cho An Nhơn / Nhơn Phong (40 con - theo đồ hình nhơn)
const animalsAnNhon40 = [
    { order: 1, name: 'Cá Trắng', alias: 'Chiếm-Khởi' },
    { order: 2, name: 'Ốc', alias: 'Bản-Quế' },
    { order: 3, name: 'Ngỗng', alias: 'Vinh-Sanh' },
    { order: 4, name: 'Công', alias: 'Phùng-Xuân' },
    { order: 5, name: 'Trùn', alias: 'Chí-Cao' },
    { order: 6, name: 'Cọp', alias: 'Khôn-Sơn' },
    { order: 7, name: 'Heo', alias: 'Chánh-Thuận' },
    { order: 8, name: 'Thỏ', alias: 'Nguyệt-Bửu' },
    { order: 9, name: 'Trâu', alias: 'Hớn-Vân' },
    { order: 10, name: 'Rồng Bay', alias: 'Giang-Tứ' },
    { order: 11, name: 'Chó', alias: 'Phước-Tôn' },
    { order: 12, name: 'Ngựa', alias: 'Quang-Minh' },
    { order: 13, name: 'Voi', alias: 'Hữu-Tài' },
    { order: 14, name: 'Mèo', alias: 'Chỉ-Đắc' },
    { order: 15, name: 'Chuột', alias: 'Tất-Khắc' },
    { order: 16, name: 'Ong', alias: 'Mậu-Lâm' },
    { order: 17, name: 'Hạc', alias: 'Trọng-Tiên' },
    { order: 18, name: 'Kỳ Lân', alias: 'Thiên-Thần' },
    { order: 19, name: 'Bướm', alias: 'Cấn-Ngọc' },
    { order: 20, name: 'Hòn Núi', alias: 'Trân-Châu' },
    { order: 21, name: 'Én', alias: 'Thượng-Chiêu' },
    { order: 22, name: 'Bồ Câu', alias: 'Song-Đồng' },
    { order: 23, name: 'Khỉ', alias: 'Tam-Quẻ' },
    { order: 24, name: 'Ếch', alias: 'Hiệp-Hải' },
    { order: 25, name: 'Qua', alias: 'Cửu-Quan' },
    { order: 26, name: 'Rồng Nằm', alias: 'Thái-Bình' },
    { order: 27, name: 'Rùa', alias: 'Hỏa-Diệm' },
    { order: 28, name: 'Gà', alias: 'Nhựt-Thăng' },
    { order: 29, name: 'Lươn', alias: 'Địa-Lương' },
    { order: 30, name: 'Cá Đỏ', alias: 'Tỉnh-Lợi' },
    { order: 31, name: 'Tôm', alias: 'Trường-Thọ' },
    { order: 32, name: 'Rắn', alias: 'Vạn-Kim' },
    { order: 33, name: 'Nhện', alias: 'Thanh-Tuyền' },
    { order: 34, name: 'Nai', alias: 'Nguyên-Cát' },
    { order: 35, name: 'Dê', alias: 'Nhứt-Phẩm' },
    { order: 36, name: 'Bà Vải', alias: 'An-Sĩ' },
    { order: 37, name: 'Ông Trời', alias: 'Thiên-Quan' },
    { order: 38, name: 'Ông Địa', alias: 'Địa-Chủ' },
    { order: 39, name: 'Thần Tài', alias: 'Tài-Thần' },
    { order: 40, name: 'Ông Táo', alias: 'Táo-Quân' },
];

// Data cho Hoài Nhơn (36 con - theo Hội vui xuân Giáp Ngọ)
const animalsHoaiNhon36 = [
    { order: 1, name: 'Cá Trắng', alias: 'CHIẾM KHỞI' },
    { order: 2, name: 'Ốc', alias: 'BẢN QUẾ' },
    { order: 3, name: 'Ngỗng', alias: 'VINH SANH' },
    { order: 4, name: 'Công', alias: 'PHÙNG XUÂN' },
    { order: 5, name: 'Trùn', alias: 'CHÍ CAO' },
    { order: 6, name: 'Cọp', alias: 'KHÔN SƠN' },
    { order: 7, name: 'Heo', alias: 'CHÁNH THUẬN' },
    { order: 8, name: 'Thỏ', alias: 'NGUYỆT BỬU' },
    { order: 9, name: 'Trâu', alias: 'HỚN VÂN' },
    { order: 10, name: 'Rồng Bay', alias: 'GIANG TỨ' },
    { order: 11, name: 'Chó', alias: 'PHƯỚC TÔN' },
    { order: 12, name: 'Ngựa', alias: 'QUANG MINH' },
    { order: 13, name: 'Voi', alias: 'HỮU TÀI' },
    { order: 14, name: 'Mèo', alias: 'CHỈ ĐẮC' },
    { order: 15, name: 'Chuột', alias: 'TẤT KHẮC' },
    { order: 16, name: 'Ong', alias: 'MẬU LÂM' },
    { order: 17, name: 'Hạc', alias: 'TRỌNG TIÊN' },
    { order: 18, name: 'Kỳ Lân', alias: 'THIÊN THẦN' },
    { order: 19, name: 'Bướm', alias: 'CẤN NGỌC' },
    { order: 20, name: 'Hòn Núi', alias: 'TRÂN CHÂU' },
    { order: 21, name: 'Én', alias: 'THƯỢNG CHIÊU' },
    { order: 22, name: 'Bồ Câu', alias: 'SONG ĐỒNG' },
    { order: 23, name: 'Khỉ', alias: 'TAM HÒE' },
    { order: 24, name: 'Ếch', alias: 'HIỆP HẢI' },
    { order: 25, name: 'Qua', alias: 'CỬU QUAN' },
    { order: 26, name: 'Rồng Nằm', alias: 'THÁI BÌNH' },
    { order: 27, name: 'Rùa', alias: 'HỎA DIỆM' },
    { order: 28, name: 'Gà', alias: 'NHỰT THĂNG' },
    { order: 29, name: 'Lươn', alias: 'ĐỊA LƯƠNG' },
    { order: 30, name: 'Cá Đỏ', alias: 'TỈNH LỢI' },
    { order: 31, name: 'Tôm', alias: 'TRƯỜNG THỌ' },
    { order: 32, name: 'Rắn', alias: 'VẠN KIM' },
    { order: 33, name: 'Nhện', alias: 'THANH TIỀN' },
    { order: 34, name: 'Nai', alias: 'NGUYÊN KIẾT' },
    { order: 35, name: 'Dê', alias: 'NHỨT PHẨM' },
    { order: 36, name: 'Bà Vải', alias: 'AN SỸ' },
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

    // Tính tổng cho mỗi hàng (An Nhơn / Nhơn Phong)
    const getRowTotal = (startOrder: number, endOrder: number) => {
        let totalCount = 0;
        let totalAmount = 0;
        for (let i = startOrder; i <= endOrder; i++) {
            const data = getMockPurchaseData(i);
            totalCount += data.count;
            totalAmount += data.amount;
        }
        return { totalCount, totalAmount };
    };

    // Render bảng An Nhơn / Nhơn Phong (4 hàng x 10 cột + cột Tổng Cộng)
    const renderAnNhonLayout = () => {
        const rows = [
            animalsAnNhon40.slice(0, 10),   // 01-10
            animalsAnNhon40.slice(10, 20),  // 11-20
            animalsAnNhon40.slice(20, 30),  // 21-30
            animalsAnNhon40.slice(30, 40),  // 31-40
        ];

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full border-collapse">
                    <tbody>
                        {rows.map((row, rowIndex) => {
                            const startOrder = rowIndex * 10 + 1;
                            const endOrder = (rowIndex + 1) * 10;
                            const rowTotal = getRowTotal(startOrder, endOrder);

                            return (
                                <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                                    {row.map((animal) => {
                                        const purchaseData = getMockPurchaseData(animal.order);
                                        const hasPurchase = purchaseData.count > 0;
                                        return (
                                            <td
                                                key={animal.order}
                                                className={`border border-gray-200 p-2 text-center align-top min-w-[80px] ${hasPurchase ? 'bg-green-50' : 'bg-white'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span
                                                        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold border"
                                                        style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                                                    >
                                                        {String(animal.order).padStart(2, '0')}
                                                    </span>
                                                    <div className="font-bold text-xs" style={{ color: '#1e3a8a' }}>
                                                        {animal.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        "{animal.alias}"
                                                    </div>
                                                </div>
                                                {hasPurchase && (
                                                    <div className="mt-1 text-xs font-bold text-green-600">
                                                        {purchaseData.count} lượt
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                    {/* Cột Tổng Cộng */}
                                    <td className="border border-gray-200 p-2 text-center align-middle min-w-[80px]" style={{ backgroundColor: '#eff6ff' }}>
                                        <div className="font-bold text-sm" style={{ color: '#1e3a8a' }}>
                                            Tổng Cộng
                                        </div>
                                        {rowTotal.totalCount > 0 && (
                                            <div className="text-xs text-green-600 font-semibold mt-1">
                                                {rowTotal.totalCount} lượt
                                                <br />
                                                {rowTotal.totalAmount.toLocaleString('vi-VN')}đ
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    // Render bảng Hoài Nhơn (6 hàng x 6 cột)
    const renderHoaiNhonLayout = () => {
        const rows = [];
        for (let i = 0; i < 6; i++) {
            rows.push(animalsHoaiNhon36.slice(i * 6, (i + 1) * 6));
        }

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full border-collapse">
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                                {row.map((animal) => {
                                    const purchaseData = getMockPurchaseData(animal.order);
                                    const hasPurchase = purchaseData.count > 0;
                                    return (
                                        <td
                                            key={animal.order}
                                            className={`border border-gray-200 p-3 text-center align-top ${hasPurchase ? 'bg-green-50' : 'bg-white'
                                                }`}
                                            style={{ width: '16.66%' }}
                                        >
                                            <div className="flex items-start gap-1">
                                                <span
                                                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border-2"
                                                    style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                                                >
                                                    {String(animal.order).padStart(2, '0')}
                                                </span>
                                                <div className="flex-1 text-left">
                                                    <div className="font-bold text-sm" style={{ color: '#1e3a8a' }}>
                                                        {animal.alias}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        (Con {animal.name})
                                                    </div>
                                                </div>
                                            </div>
                                            {hasPurchase && (
                                                <div className="mt-1 text-xs font-bold text-green-600 text-right">
                                                    {purchaseData.count} lượt - {purchaseData.amount.toLocaleString('vi-VN')}đ
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Calculate summary stats
    const animals = selectedThai === 'hoai-nhon' ? animalsHoaiNhon36 : animalsAnNhon40;
    const totalCount = animals.reduce((sum, a) => sum + getMockPurchaseData(a.order).count, 0);
    const totalAmount = animals.reduce((sum, a) => sum + getMockPurchaseData(a.order).amount, 0);
    const purchasedAnimals = animals.filter(a => getMockPurchaseData(a.order).count > 0).length;

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
                        {purchasedAnimals}/{thaiTabs.find(t => t.id === selectedThai)?.animals}
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
            <div className="overflow-x-auto mb-6">
                {selectedThai === 'hoai-nhon' ? renderHoaiNhonLayout() : renderAnNhonLayout()}
            </div>

            {/* Top 5 / Bottom 5 Animals Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top 5 Most Purchased (Green) */}
                <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
                    <div className="px-4 py-3 bg-green-50 border-b border-green-200">
                        <h3 className="font-bold text-green-800 flex items-center gap-2">
                            <span>🔥</span>
                            <span>Top 5 con được mua nhiều nhất</span>
                        </h3>
                    </div>
                    <div className="p-4 space-y-2">
                        {(() => {
                            const animalsWithPurchase = animals
                                .map(a => ({ ...a, ...getMockPurchaseData(a.order) }))
                                .filter(a => a.count > 0)
                                .sort((a, b) => b.count - a.count)
                                .slice(0, 5);

                            if (animalsWithPurchase.length === 0) {
                                return <p className="text-gray-500 text-center py-4">Chưa có dữ liệu mua</p>;
                            }

                            return animalsWithPurchase.map((animal, index) => (
                                <div
                                    key={animal.order}
                                    className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <span className="font-bold text-green-800">#{animal.order} {animal.name}</span>
                                            <span className="text-xs text-gray-500 ml-2">"{animal.alias}"</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-700">{animal.count} lượt</p>
                                        <p className="text-xs text-green-600">{animal.amount.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                {/* Bottom 5 Least Purchased (Red) */}
                <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                    <div className="px-4 py-3 bg-red-50 border-b border-red-200">
                        <h3 className="font-bold text-red-800 flex items-center gap-2">
                            <span>❄️</span>
                            <span>Top 5 con được mua ít nhất</span>
                        </h3>
                    </div>
                    <div className="p-4 space-y-2">
                        {(() => {
                            const animalsWithPurchase = animals
                                .map(a => ({ ...a, ...getMockPurchaseData(a.order) }))
                                .sort((a, b) => a.count - b.count)
                                .slice(0, 5);

                            return animalsWithPurchase.map((animal, index) => (
                                <div
                                    key={animal.order}
                                    className={`flex items-center justify-between p-3 rounded-lg ${animal.count === 0 ? 'bg-red-50 border border-red-100' : 'bg-orange-50 border border-orange-100'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${animal.count === 0 ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'}`}>
                                            {index + 1}
                                        </span>
                                        <div>
                                            <span className={animal.count === 0 ? 'font-bold text-red-800' : 'font-bold text-orange-800'}>
                                                #{animal.order} {animal.name}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-2">"{animal.alias}"</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={animal.count === 0 ? 'font-bold text-red-700' : 'font-bold text-orange-700'}>
                                            {animal.count === 0 ? 'Chưa mua' : `${animal.count} lượt`}
                                        </p>
                                        {animal.count > 0 && (
                                            <p className="text-xs text-orange-600">{animal.amount.toLocaleString('vi-VN')}đ</p>
                                        )}
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>
        </AdminPageWrapper>
    );
};

export default AdminBaoCao;
