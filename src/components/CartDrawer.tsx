import React from 'react';
import { Link } from 'react-router-dom';

interface CartItem {
    id: string;
    name: string;
    alias: string;
    number: number;
    amount: number;
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (id: string) => void;
    onUpdateAmount: (id: string, newAmount: number) => void;
    totalPrice: number;
}

const PRICE_STEP = 10000;

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateAmount, totalPrice }) => {
    if (!isOpen) return null;

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
                    <h2 className="text-xl font-bold text-gray-800">🛒 Giỏ hàng</h2>
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
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
                                >
                                    {/* Animal Image */}
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={`/assets/conhon/${String(item.number).padStart(2, '0')}.jpg`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.parentElement!.innerHTML = `<span class="text-2xl flex items-center justify-center w-full h-full bg-red-100">${item.number}</span>`;
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-sm">{item.number}. {item.name}</h3>
                                        <p className="text-xs text-gray-500">{item.alias}</p>
                                    </div>
                                    {/* Amount with +/- */}
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => onUpdateAmount(item.id, item.amount - PRICE_STEP)}
                                            className="w-6 h-6 bg-gray-200 rounded text-gray-700 font-bold text-sm hover:bg-gray-300"
                                        >
                                            −
                                        </button>
                                        <span className="text-sm font-bold text-red-600 w-16 text-center">
                                            {item.amount.toLocaleString()}đ
                                        </span>
                                        <button
                                            onClick={() => onUpdateAmount(item.id, item.amount + PRICE_STEP)}
                                            className="w-6 h-6 bg-gray-200 rounded text-gray-700 font-bold text-sm hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="p-1 text-gray-400 hover:text-red-600"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
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
                        <Link
                            to="/user/thanh-toan"
                            className="flex-1 py-3 bg-red-600 text-white text-center rounded-lg font-semibold hover:bg-red-700"
                        >
                            Thanh toán
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
