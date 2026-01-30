import React, { useState } from 'react';
import CartDrawer from '../components/CartDrawer';
import { ANIMALS_AN_NHON } from '../constants/animalData';

// Generate animals từ central data
const generateAnimals = () => {
    return ANIMALS_AN_NHON.map((animal) => ({
        id: `animal-${animal.order}`,
        name: animal.name,
        alias: animal.alias,
        number: animal.order,
        liked: false
    }));
};

interface Animal {
    id: string;
    name: string;
    alias: string;
    number: number;
    liked: boolean;
}

interface CartItem extends Animal {
    amount: number; // Số tiền người chơi muốn mua
}

const thaiOptions = [
    { id: 'an-nhon', name: 'Thai An Nhơn', animals: 40, color: 'green' },
    { id: 'nhon-phong', name: 'Thai Nhơn Phong', animals: 40, color: 'yellow' },
    { id: 'hoai-nhon', name: 'Thai Hoài Nhơn', animals: 36, color: 'blue' },
];

const MuaConVatPage: React.FC = () => {
    const [allAnimals] = useState<Animal[]>(generateAnimals());
    const [selectedThai, setSelectedThai] = useState<string>(''); // Chưa chọn thai
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [hasLikedShared, setHasLikedShared] = useState(true); // Mặc định true cho demo
    const [inputAmounts, setInputAmounts] = useState<{ [key: string]: number }>({});

    // Lọc danh sách con vật dựa theo Thai được chọn
    const currentThaiOption = thaiOptions.find(t => t.id === selectedThai);
    const animals = currentThaiOption
        ? allAnimals.slice(0, currentThaiOption.animals)
        : [];

    const PRICE_STEP = 10000; // 10,000đ mỗi bước
    const MIN_AMOUNT = 10000;

    const handleInputChange = (animalId: string, value: string) => {
        // Cho phép nhập tự do, chỉ lọc số
        const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
        setInputAmounts(prev => ({ ...prev, [animalId]: numValue }));
    };

    const handleInputBlur = (animalId: string) => {
        // Làm tròn về bội số 10,000 khi blur
        const currentAmount = inputAmounts[animalId] || 0;
        const roundedValue = Math.round(currentAmount / PRICE_STEP) * PRICE_STEP;
        setInputAmounts(prev => ({ ...prev, [animalId]: roundedValue }));
    };

    const handleIncrement = (animalId: string) => {
        const currentAmount = inputAmounts[animalId] || 0;
        setInputAmounts(prev => ({ ...prev, [animalId]: currentAmount + PRICE_STEP }));
    };

    const handleDecrement = (animalId: string) => {
        const currentAmount = inputAmounts[animalId] || 0;
        if (currentAmount >= PRICE_STEP) {
            setInputAmounts(prev => ({ ...prev, [animalId]: currentAmount - PRICE_STEP }));
        }
    };

    const handleAddToCart = (animal: Animal) => {
        const amount = inputAmounts[animal.id] || 0;
        if (amount < MIN_AMOUNT) return;

        const existingItem = cart.find(item => item.id === animal.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === animal.id
                    ? { ...item, amount: item.amount + amount }
                    : item
            ));
        } else {
            setCart([...cart, { ...animal, amount }]);
        }
        // Reset input after adding
        setInputAmounts(prev => ({ ...prev, [animal.id]: 0 }));
        setIsCartOpen(true);
    };

    const handleRemoveFromCart = (animalId: string) => {
        setCart(cart.filter(item => item.id !== animalId));
    };

    const handleUpdateCartAmount = (animalId: string, newAmount: number) => {
        if (newAmount <= 0) {
            handleRemoveFromCart(animalId);
        } else {
            setCart(cart.map(item =>
                item.id === animalId
                    ? { ...item, amount: newAmount }
                    : item
            ));
        }
    };

    const handleDoLikeShare = () => {
        window.open('https://facebook.com', '_blank');
        setTimeout(() => {
            setHasLikedShared(true);
        }, 1000);
    };

    const totalItems = cart.length;
    const totalPrice = cart.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="bg-gradient-to-b from-red-50 to-white min-h-screen">
            {/* Page Title + Cart Button */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">🛒 Chọn Con Vật</h1>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-gray-600 hover:text-red-600 bg-gray-100 rounded-full"
                    >
                        🛒
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>

                {/* Thai Selection Tabs */}
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Chọn Thai để xem danh sách con vật:</p>
                        <div className="flex flex-wrap gap-2">
                            {thaiOptions.map((thai) => (
                                <button
                                    key={thai.id}
                                    onClick={() => setSelectedThai(thai.id)}
                                    className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${selectedThai === thai.id
                                        ? thai.color === 'green'
                                            ? 'bg-green-100 border-green-500 text-green-800'
                                            : thai.color === 'yellow'
                                                ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
                                                : 'bg-blue-100 border-blue-500 text-blue-800'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                                        }`}
                                >
                                    <div className="flex flex-col items-center">
                                        <span>{thai.name}</span>
                                        <span className="text-xs opacity-70">({thai.animals} con)</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Like/Share Warning */}
            {!hasLikedShared && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-4">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">⚠️</span>
                            <p className="text-yellow-800 font-medium">
                                Vui lòng tương tác bài viết hôm nay để mở khóa tính năng mua con vật
                            </p>
                        </div>
                        <button
                            onClick={handleDoLikeShare}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center space-x-2"
                        >
                            <span>👍</span>
                            <span>Like & Share ngay</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Animals Grid or Select Thai Message */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {!selectedThai ? (
                    /* Message khi chưa chọn Thai */
                    <div className="text-center py-12">
                        <div className="inline-block p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                            <span className="text-4xl mb-4 block">👆</span>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Vui lòng chọn Thai</h2>
                            <p className="text-gray-600">
                                Bạn cần chọn một Thai ở trên để xem và mua con vật
                            </p>
                            <div className="mt-4 text-sm text-gray-500">
                                <p><strong>Thai An Nhơn / Nhơn Phong:</strong> 40 con vật</p>
                                <p><strong>Thai Hoài Nhơn:</strong> 36 con vật</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Danh sách con vật */
                    <>
                        {/* Thai Info Banner */}
                        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-100 to-red-50 border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-lg font-bold text-red-800">
                                        {currentThaiOption?.name}
                                    </span>
                                    <span className="ml-2 text-red-600">
                                        ({currentThaiOption?.animals} con vật)
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedThai('')}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Đổi Thai
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
                            {animals.map((animal) => {
                                const currentAmount = inputAmounts[animal.id] || 0;
                                return (
                                    <div
                                        key={animal.id}
                                        className={`relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${!hasLikedShared ? 'opacity-60' : ''
                                            }`}
                                    >
                                        {/* Overlay if not liked/shared */}
                                        {!hasLikedShared && (
                                            <div className="absolute inset-0 bg-gray-900/50 z-10 flex items-center justify-center p-2">
                                                <p className="text-white text-xs text-center font-medium">
                                                    Vui lòng Like/Share
                                                </p>
                                            </div>
                                        )}

                                        {/* Animal Card */}
                                        <div className="p-3">
                                            {/* Number Badge */}
                                            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                                {animal.number}
                                            </div>

                                            {/* Animal Image */}
                                            <div className="w-full aspect-square flex items-center justify-center mt-4 overflow-hidden rounded-lg bg-gray-50">
                                                <img
                                                    src={`/assets/conhon/${String(animal.number).padStart(2, '0')}.jpg`}
                                                    alt={animal.name}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            </div>

                                            {/* Name */}
                                            <h3 className="text-sm font-bold text-center text-gray-800 mb-0.5">
                                                {animal.name}
                                            </h3>
                                            <p className="text-xs text-center text-gray-500 mb-2">
                                                {animal.alias}
                                            </p>

                                            {/* Price Input - Cho phép người dùng tự nhập */}
                                            <div className="flex items-center justify-center mb-2 space-x-2">
                                                <button
                                                    onClick={() => handleDecrement(animal.id)}
                                                    disabled={!hasLikedShared || currentAmount < PRICE_STEP}
                                                    className="w-8 h-8 bg-gray-200 rounded-lg text-gray-700 font-bold text-lg hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    value={currentAmount > 0 ? currentAmount.toLocaleString('vi-VN') : ''}
                                                    onChange={(e) => handleInputChange(animal.id, e.target.value)}
                                                    onBlur={() => handleInputBlur(animal.id)}
                                                    placeholder="Nhập tiền"
                                                    disabled={!hasLikedShared}
                                                    className="w-20 text-center text-sm font-semibold border-2 border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                />
                                                <button
                                                    onClick={() => handleIncrement(animal.id)}
                                                    disabled={!hasLikedShared}
                                                    className="w-8 h-8 bg-gray-200 rounded-lg text-gray-700 font-bold text-lg hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-center text-gray-400 mb-1">Bước: 10,000đ</p>

                                            {/* Add Button */}
                                            <button
                                                onClick={() => handleAddToCart(animal)}
                                                disabled={!hasLikedShared || currentAmount < MIN_AMOUNT}
                                                className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${hasLikedShared && currentAmount >= MIN_AMOUNT
                                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                ➕ Thêm
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cart}
                onRemove={handleRemoveFromCart}
                onUpdateAmount={handleUpdateCartAmount}
                totalPrice={totalPrice}
            />
        </div>
    );
};

export default MuaConVatPage;

