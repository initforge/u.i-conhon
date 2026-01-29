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
    { order: 36, name: 'Bà Vãi', alias: 'An-Sĩ' },
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
    { order: 33, name: 'Nhện', alias: 'THANH TUYỀN' },
    { order: 34, name: 'Nai', alias: 'NGUYÊN CÁT' },
    { order: 35, name: 'Dê', alias: 'NHỨT PHẨM' },
    { order: 36, name: 'Bà Vãi', alias: 'AN SĨ' },
];

const AdminBaoCao: React.FC = () => {
    const [selectedThai, setSelectedThai] = useState('an-nhon');
    const [timeFilter, setTimeFilter] = useState('this-tet');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState<null | { order: number; name: string; alias: string }>(null);

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

    // Mock customer details for each animal
    const getMockCustomerDetails = (animalOrder: number) => {
        const mockCustomers: Record<number, Array<{
            id: string;
            name: string;
            phone: string;
            bankAccount: string;
            bankName: string;
            amount: number;
            date: string;
            time: string;
        }>> = {
            1: [
                { id: 'HD001', name: 'Nguyễn Văn A', phone: '0901234567', bankAccount: '1234567890', bankName: 'Vietcombank', amount: 30000, date: '25/01/2026', time: '11:00' },
                { id: 'HD002', name: 'Trần Thị B', phone: '0912345678', bankAccount: '0987654321', bankName: 'BIDV', amount: 30000, date: '25/01/2026', time: '11:15' },
                { id: 'HD003', name: 'Lê Văn C', phone: '0923456789', bankAccount: '1122334455', bankName: 'Techcombank', amount: 30000, date: '25/01/2026', time: '14:20' },
                { id: 'HD004', name: 'Phạm Thị D', phone: '0934567890', bankAccount: '2233445566', bankName: 'ACB', amount: 30000, date: '26/01/2026', time: '09:00' },
                { id: 'HD005', name: 'Hoàng Văn E', phone: '0945678901', bankAccount: '3344556677', bankName: 'MB Bank', amount: 30000, date: '26/01/2026', time: '16:45' },
            ],
            5: [
                { id: 'HD006', name: 'Võ Thị F', phone: '0956789012', bankAccount: '4455667788', bankName: 'Vietinbank', amount: 30000, date: '25/01/2026', time: '12:00' },
                { id: 'HD007', name: 'Đặng Văn G', phone: '0967890123', bankAccount: '5566778899', bankName: 'Sacombank', amount: 30000, date: '26/01/2026', time: '08:30' },
                { id: 'HD008', name: 'Bùi Thị H', phone: '0978901234', bankAccount: '6677889900', bankName: 'VPBank', amount: 30000, date: '26/01/2026', time: '15:10' },
            ],
            6: [
                { id: 'HD009', name: 'Ngô Văn I', phone: '0989012345', bankAccount: '7788990011', bankName: 'OCB', amount: 30000, date: '25/01/2026', time: '13:45' },
                { id: 'HD010', name: 'Dương Thị K', phone: '0990123456', bankAccount: '8899001122', bankName: 'TPBank', amount: 30000, date: '25/01/2026', time: '17:20' },
                { id: 'HD011', name: 'Lý Văn L', phone: '0811234567', bankAccount: '9900112233', bankName: 'HDBank', amount: 30000, date: '26/01/2026', time: '10:00' },
                { id: 'HD012', name: 'Phan Thị M', phone: '0822345678', bankAccount: '0011223344', bankName: 'SHB', amount: 30000, date: '26/01/2026', time: '14:55' },
            ],
            12: [
                { id: 'HD013', name: 'Trương Văn N', phone: '0833456789', bankAccount: '1122334455', bankName: 'Vietcombank', amount: 30000, date: '26/01/2026', time: '09:30' },
                { id: 'HD014', name: 'Hồ Thị O', phone: '0844567890', bankAccount: '2233445566', bankName: 'BIDV', amount: 30000, date: '26/01/2026', time: '11:45' },
            ],
            14: [
                { id: 'HD015', name: 'Mai Văn P', phone: '0855678901', bankAccount: '3344556677', bankName: 'Techcombank', amount: 30000, date: '26/01/2026', time: '16:00' },
            ],
        };
        return mockCustomers[animalOrder] || [];
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
                                                className={`border border-gray-200 p-2 text-center align-top min-w-[80px] ${hasPurchase ? 'bg-green-50 cursor-pointer hover:bg-green-100' : 'bg-white'
                                                    }`}
                                                onClick={() => hasPurchase && setSelectedAnimal(animal)}
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
                                                        <br />
                                                        <span className="text-red-600">{purchaseData.amount.toLocaleString('vi-VN')}đ</span>
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
                                            className={`border border-gray-200 p-3 text-center align-top ${hasPurchase ? 'bg-green-50 cursor-pointer hover:bg-green-100' : 'bg-white'
                                                }`}
                                            style={{ width: '16.66%' }}
                                            onClick={() => hasPurchase && setSelectedAnimal(animal)}
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

            {/* Modal Chi tiết hóa đơn */}
            {selectedAnimal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Chi tiết hóa đơn - {selectedAnimal.name}</h2>
                                <p className="text-red-200 text-sm">"{selectedAnimal.alias}" - #{String(selectedAnimal.order).padStart(2, '0')}</p>
                            </div>
                            <button
                                onClick={() => setSelectedAnimal(null)}
                                className="text-white hover:bg-red-500 p-2 rounded-lg transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Statistics */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">{getMockPurchaseData(selectedAnimal.order).count}</p>
                                <p className="text-sm text-gray-600">Tổng lượt mua</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{getMockPurchaseData(selectedAnimal.order).amount.toLocaleString('vi-VN')}đ</p>
                                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{getMockCustomerDetails(selectedAnimal.order).length}</p>
                                <p className="text-sm text-gray-600">Số khách hàng</p>
                            </div>
                        </div>

                        {/* Customer List */}
                        <div className="p-4 overflow-y-auto max-h-[50vh]">
                            <h3 className="font-bold text-gray-800 mb-4">Danh sách khách hàng mua (để trả thưởng):</h3>
                            <div className="space-y-3">
                                {getMockCustomerDetails(selectedAnimal.order).map((customer) => (
                                    <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{customer.id}</span>
                                                    <span className="text-gray-500 text-xs">{customer.date} - {customer.time}</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Tên khách hàng</p>
                                                        <p className="font-bold text-gray-800">{customer.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Số điện thoại</p>
                                                        <p className="font-bold text-blue-600">{customer.phone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Số tài khoản ({customer.bankName})</p>
                                                        <p className="font-bold text-green-600">{customer.bankAccount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-lg font-bold text-red-600">{customer.amount.toLocaleString('vi-VN')}đ</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setSelectedAnimal(null)}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminPageWrapper>
    );
};

export default AdminBaoCao;
