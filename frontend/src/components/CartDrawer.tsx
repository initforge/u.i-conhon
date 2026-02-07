import React from 'react';

interface CartItem {
    id: string;
    name: string;
    alias: string;
    number: number;
    amount: number;
    thaiId?: string;
    thaiName?: string;
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (id: string) => void;
    onUpdateAmount: (id: string, newAmount: number) => void;
    totalPrice: number;
    onCheckout: () => void;
    isCheckingOut?: boolean;
}

const PRICE_STEP = 10000;

// Mapping Thai colors
const thaiColors: { [key: string]: { bg: string; border: string; text: string } } = {
    'thai-an-nhon': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    'thai-nhon-phong': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    'thai-hoai-nhon': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
};

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateAmount, totalPrice, onCheckout, isCheckingOut }) => {
    if (!isOpen) return null;

    // Nhóm items theo Thai
    const groupByThai = () => {
        const groups: { [key: string]: { thaiName: string; items: CartItem[] } } = {};
        items.forEach((item) => {
            const thaiId = item.thaiId || 'unknown';
            const thaiName = item.thaiName || 'Chưa xác định Thai';
            if (!groups[thaiId]) {
                groups[thaiId] = { thaiName, items: [] };
            }
            groups[thaiId].items.push(item);
        });
        return groups;
    };

    const thaiGroups = groupByThai();
    const thaiGroupsArray = Object.entries(thaiGroups);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">🛒 Giỏ hàng</h2>
                        {thaiGroupsArray.length > 1 && (
                            <p className="text-xs text-green-600">✅ Đang mua {thaiGroupsArray.length} Thai cùng lúc</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        ✕
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="text-6xl block mb-4">🛒</span>
                            <p className="text-gray-500">Giỏ hàng trống</p>
                            <p className="text-sm text-gray-400 mt-2">Bạn có thể mua con vật từ cả 3 Thai cùng lúc!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {thaiGroupsArray.map(([thaiId, group]) => {
                                const colors = thaiColors[thaiId] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
                                return (
                                    <div key={thaiId} className={`rounded-lg border ${colors.border} overflow-hidden`}>
                                        {/* Thai Header */}
                                        <div className={`px-3 py-2 ${colors.bg} ${colors.text} font-semibold text-sm flex items-center gap-2`}>
                                            <span>🏛️</span>
                                            <span>{group.thaiName}</span>
                                            <span className="ml-auto text-xs font-normal">({group.items.length} con)</span>
                                        </div>
                                        {/* Items in this Thai */}
                                        <div className="divide-y divide-gray-100">
                                            {group.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center space-x-3 p-3 bg-white"
                                                >
                                                    {/* Animal Image */}
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={`/assets/conhon/${String(item.number).padStart(2, '0')}.jpg`}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.parentElement!.innerHTML = `<span class="text-lg flex items-center justify-center w-full h-full bg-red-100">${item.number}</span>`;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-800 text-sm truncate">{item.number}. {item.name}</h3>
                                                        <p className="text-xs text-gray-500 truncate">{item.alias}</p>
                                                    </div>
                                                    {/* Amount with +/- */}
                                                    <div className="flex items-center space-x-1">
                                                        <button
                                                            onClick={() => onUpdateAmount(`${item.id}-${item.thaiId}`, item.amount - PRICE_STEP)}
                                                            className="w-6 h-6 bg-gray-200 rounded text-gray-700 font-bold text-sm hover:bg-gray-300"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="text-sm font-bold text-red-600 w-14 text-center">
                                                            {item.amount.toLocaleString()}đ
                                                        </span>
                                                        <button
                                                            onClick={() => onUpdateAmount(`${item.id}-${item.thaiId}`, item.amount + PRICE_STEP)}
                                                            className="w-6 h-6 bg-gray-200 rounded text-gray-700 font-bold text-sm hover:bg-gray-300"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => onRemove(`${item.id}-${item.thaiId}`)}
                                                        className="p-1 text-gray-400 hover:text-red-600"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t p-4 space-y-4">
                    {/* Total */}
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-600">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-red-600">
                            {totalPrice.toLocaleString()}đ
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                        >
                            Mua thêm
                        </button>
                        <button
                            onClick={onCheckout}
                            disabled={isCheckingOut || items.length === 0}
                            className={`flex-1 py-3 text-white text-center rounded-lg font-semibold transition-all ${isCheckingOut || items.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {isCheckingOut ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    Đang xử lý...
                                </span>
                            ) : (
                                'Thanh toán'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
