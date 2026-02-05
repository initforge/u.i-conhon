import React, { useState, useEffect } from 'react';
import AdminPageWrapper from '../../components/AdminPageWrapper';
import { ANIMALS_AN_NHON, ANIMALS_HOAI_NHON } from '../../constants/animalData';
import { getAdminStats, AdminStats } from '../../services/api';
import Portal from '../../components/Portal';

// Sử dụng dữ liệu từ central file
const animalsAnNhon40 = ANIMALS_AN_NHON;
const animalsHoaiNhon36 = ANIMALS_HOAI_NHON;

// Convert API top/bottom animals to a lookup map
const createPurchaseMap = (stats: AdminStats | null) => {
    const map: Record<number, { count: number; amount: number }> = {};
    if (!stats) return map;

    [...(stats.top_animals || []), ...(stats.bottom_animals || [])].forEach(a => {
        if (a.animal_order && !map[a.animal_order]) {
            map[a.animal_order] = {
                count: Number(a.total_qty) || 0,
                amount: Number(a.total_amount) || 0
            };
        }
    });
    return map;
};

const AdminBaoCao: React.FC = () => {
    const [selectedThai, setSelectedThai] = useState('an-nhon');
    const [timeFilter, setTimeFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSession, setSelectedSession] = useState('all');
    const [selectedAnimal, setSelectedAnimal] = useState<null | { order: number; name: string; alias: string }>(null);

    // API state
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const thaiTabs = [
        { id: 'an-nhon', name: 'An Nhơn', animals: 40, hasEvening: true },
        { id: 'nhon-phong', name: 'Nhơn Phong', animals: 40, hasEvening: false },
        { id: 'hoai-nhon', name: 'Hoài Nhơn', animals: 36, hasEvening: false },
    ];

    // Fetch stats from API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAdminStats(selectedThai);
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
                setError('Không thể tải dữ liệu thống kê');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [selectedThai, selectedSession, selectedDate]);

    // Get purchase data from API stats
    const purchaseMap = createPurchaseMap(stats);
    const getPurchaseData = (animalOrder: number) => {
        return purchaseMap[animalOrder] || { count: 0, amount: 0 };
    };

    // Tính tổng cho mỗi hàng (An Nhơn / Nhơn Phong)
    const getRowTotal = (startOrder: number, endOrder: number) => {
        let totalCount = 0;
        let totalAmount = 0;
        for (let i = startOrder; i <= endOrder; i++) {
            const data = getPurchaseData(i);
            totalCount += data.count;
            totalAmount += data.amount;
        }
        return { totalCount, totalAmount };
    };

    // Render bảng An Nhơn / Nhơn Phong (4 hàng x 10 cột + cột Tổng Cộng)
    const renderAnNhonLayout = () => {
        const rows = [
            animalsAnNhon40.slice(0, 10),
            animalsAnNhon40.slice(10, 20),
            animalsAnNhon40.slice(20, 30),
            animalsAnNhon40.slice(30, 40),
        ];

        return (
            <div className="relative">
                <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-500 mb-2 py-2 bg-blue-50 rounded-lg">
                    <span>←</span>
                    <span>Vuốt ngang để xem thêm</span>
                    <span>→</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="border-collapse" style={{ minWidth: '900px' }}>
                        <tbody>
                            {rows.map((row, rowIndex) => {
                                const startOrder = rowIndex * 10 + 1;
                                const endOrder = (rowIndex + 1) * 10;
                                const rowTotal = getRowTotal(startOrder, endOrder);

                                return (
                                    <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                                        {row.map((animal) => {
                                            const purchaseData = getPurchaseData(animal.order);
                                            const hasPurchase = purchaseData.count > 0;
                                            return (
                                                <td
                                                    key={animal.order}
                                                    className={`border border-gray-200 p-2 text-center align-top min-w-[80px] ${hasPurchase ? 'bg-green-50 cursor-pointer hover:bg-green-100' : 'bg-white'}`}
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
                                        <td className="border border-gray-200 p-2 text-center align-middle min-w-[80px] sticky right-0" style={{ backgroundColor: '#eff6ff' }}>
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
            <div className="relative">
                <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-500 mb-2 py-2 bg-blue-50 rounded-lg">
                    <span>←</span>
                    <span>Vuốt ngang để xem thêm</span>
                    <span>→</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="border-collapse" style={{ minWidth: '700px' }}>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                                    {row.map((animal) => {
                                        const purchaseData = getPurchaseData(animal.order);
                                        const hasPurchase = purchaseData.count > 0;
                                        return (
                                            <td
                                                key={animal.order}
                                                className={`border border-gray-200 p-3 text-center align-top ${hasPurchase ? 'bg-green-50 cursor-pointer hover:bg-green-100' : 'bg-white'}`}
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
            </div>
        );
    };

    // Calculate summary stats from API
    const animals = selectedThai === 'hoai-nhon' ? animalsHoaiNhon36 : animalsAnNhon40;
    const totalCount = animals.reduce((sum, a) => sum + getPurchaseData(a.order).count, 0);
    const totalAmount = animals.reduce((sum, a) => sum + getPurchaseData(a.order).amount, 0);
    const purchasedAnimals = animals.filter(a => getPurchaseData(a.order).count > 0).length;

    // Top 5 animals with purchase data
    const getTopAnimals = () => {
        return animals
            .map(a => ({ ...a, ...getPurchaseData(a.order) }))
            .filter(a => a.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    };

    // Bottom 5 animals
    const getBottomAnimals = () => {
        return animals
            .map(a => ({ ...a, ...getPurchaseData(a.order) }))
            .sort((a, b) => a.count - b.count)
            .slice(0, 5);
    };

    return (
        <AdminPageWrapper
            title="Báo cáo thống kê"
            subtitle="Thống kê doanh thu và lượt mua theo Thai"
            icon="📊"
        >
            {/* Thai Tabs */}
            <div className="mb-6 overflow-x-auto">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl min-w-max">
                    {thaiTabs.map((thai) => (
                        <button
                            key={thai.id}
                            onClick={() => setSelectedThai(thai.id)}
                            className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${selectedThai === thai.id
                                ? 'bg-white shadow-md text-amber-700'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {thai.name}
                            <span className="ml-1 text-xs text-gray-400">({thai.animals})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Filter */}
            <div className="mb-6 overflow-x-auto">
                <div className="flex flex-wrap items-center gap-4 min-w-max">
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                        <button
                            onClick={() => setTimeFilter('by-date')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${timeFilter === 'by-date'
                                ? 'bg-white shadow-md text-amber-700'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Theo ngày
                        </button>
                        <button
                            onClick={() => { setTimeFilter('all'); setSelectedDate(''); }}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${timeFilter === 'all'
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

                    {/* Session Filter */}
                    <div className="flex gap-2 p-1 bg-purple-50 rounded-xl">
                        <button
                            onClick={() => setSelectedSession('all')}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'all'
                                ? 'bg-white shadow-md text-purple-700'
                                : 'text-purple-600 hover:bg-purple-100'
                                }`}
                        >
                            Tất cả buổi
                        </button>
                        <button
                            onClick={() => setSelectedSession('sang')}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'sang'
                                ? 'bg-white shadow-md text-purple-700'
                                : 'text-purple-600 hover:bg-purple-100'
                                }`}
                        >
                            ☀️ Sáng
                        </button>
                        <button
                            onClick={() => setSelectedSession('chieu')}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'chieu'
                                ? 'bg-white shadow-md text-purple-700'
                                : 'text-purple-600 hover:bg-purple-100'
                                }`}
                        >
                            🌤️ Chiều
                        </button>
                        {thaiTabs.find(t => t.id === selectedThai)?.hasEvening && (
                            <button
                                onClick={() => setSelectedSession('toi')}
                                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'toi'
                                    ? 'bg-white shadow-md text-purple-700'
                                    : 'text-purple-600 hover:bg-purple-100'
                                    }`}
                            >
                                🌙 Tối
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {!loading && !error && (
                <>
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
                        {/* Top 5 Most Purchased */}
                        <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
                            <div className="px-4 py-3 bg-green-50 border-b border-green-200">
                                <h3 className="font-bold text-green-800 flex items-center gap-2">
                                    <span>🔥</span>
                                    <span>Top 5 con được mua nhiều nhất</span>
                                </h3>
                            </div>
                            <div className="p-4 space-y-2">
                                {getTopAnimals().length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">Chưa có dữ liệu mua</p>
                                ) : (
                                    getTopAnimals().map((animal, index) => (
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
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Bottom 5 Least Purchased */}
                        <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                            <div className="px-4 py-3 bg-red-50 border-b border-red-200">
                                <h3 className="font-bold text-red-800 flex items-center gap-2">
                                    <span>❄️</span>
                                    <span>Top 5 con được mua ít nhất</span>
                                </h3>
                            </div>
                            <div className="p-4 space-y-2">
                                {getBottomAnimals().map((animal, index) => (
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
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal Chi tiết - Note: This now shows limited info since detailed customer data requires additional API */}
            {selectedAnimal && (
                <Portal>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-auto">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Chi tiết - {selectedAnimal.name}</h2>
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
                            <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-600">{getPurchaseData(selectedAnimal.order).count}</p>
                                    <p className="text-sm text-gray-600">Tổng lượt mua</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{getPurchaseData(selectedAnimal.order).amount.toLocaleString('vi-VN')}đ</p>
                                    <p className="text-sm text-gray-600">Tổng doanh thu</p>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="text-center py-8 text-gray-500">
                                    <p className="mb-2">📋 Để xem chi tiết khách hàng, vui lòng vào trang <strong>Đơn hàng</strong></p>
                                    <p className="text-sm">và lọc theo con vật này.</p>
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
                </Portal>
            )}
        </AdminPageWrapper>
    );
};

export default AdminBaoCao;
