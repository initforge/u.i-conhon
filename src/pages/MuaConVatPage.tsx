import React, { useState } from 'react';
import CartDrawer from '../components/CartDrawer';

// Mock data for 40 animals - Đúng thứ tự từ Cá Trắng (1) đến Ông Táo (40)
const generateAnimals = () => {
    const animalData = [
        { name: 'Cá Trắng', alias: 'Chiếm Khôi' },
        { name: 'Ốc', alias: 'Bản Quế' },
        { name: 'Ngỗng', alias: 'Vinh Sanh' },
        { name: 'Công', alias: 'Phùng Xuân' },
        { name: 'Trùn', alias: 'Chí Cao' },
        { name: 'Cọp', alias: 'Khôn Sơn' },
        { name: 'Heo', alias: 'Chánh Thuận' },
        { name: 'Thỏ', alias: 'Nguyệt Bửu' },
        { name: 'Trâu', alias: 'Hớn Vân' },
        { name: 'Rồng Bay', alias: 'Giang Từ' },
        { name: 'Chó', alias: 'Phước Tôn' },
        { name: 'Ngựa', alias: 'Quang Minh' },
        { name: 'Voi', alias: 'Hữu Tài' },
        { name: 'Mèo', alias: 'Chỉ Đắc' },
        { name: 'Chuột', alias: 'Tất Khắc' },
        { name: 'Ong', alias: 'Mậu Lâm' },
        { name: 'Hạc', alias: 'Trọng Tiên' },
        { name: 'Kỳ Lân', alias: 'Thiên Thân' },
        { name: 'Bướm', alias: 'Cấn Ngọc' },
        { name: 'Hòn Đá', alias: 'Trân Châu' },
        { name: 'Én', alias: 'Thượng Chiêu' },
        { name: 'Cú', alias: 'Song Đồng' },
        { name: 'Khỉ', alias: 'Tam Hòe' },
        { name: 'Ếch', alias: 'Hiệp Hải' },
        { name: 'Quạ', alias: 'Cửu Quan' },
        { name: 'Rồng Nằm', alias: 'Thái Bình' },
        { name: 'Rùa', alias: 'Hỏa Diệm' },
        { name: 'Gà', alias: 'Nhựt Thăng' },
        { name: 'Lươn', alias: 'Địa Lương' },
        { name: 'Cá Đỏ', alias: 'Tỉnh Lợi' },
        { name: 'Tôm', alias: 'Trường Thọ' },
        { name: 'Rắn', alias: 'Vạn Kim' },
        { name: 'Nhện', alias: 'Thanh Tiền' },
        { name: 'Nai', alias: 'Nguyên Kiết' },
        { name: 'Dê', alias: 'Nhứt Phẩm' },
        { name: 'Yêu', alias: 'An Sỹ' },
        { name: 'Ông Trời', alias: 'Thiên Quân' },
        { name: 'Ông Địa', alias: 'Địa Chủ' },
        { name: 'Thần Tài', alias: 'Tài Thần' },
        { name: 'Ông Táo', alias: 'Táo Quân' },
    ];

    return animalData.map((animal, index) => ({
        id: `animal-${index + 1}`,
        name: animal.name,
        alias: animal.alias,
        number: index + 1,
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

const MuaConVatPage: React.FC = () => {
    const [animals] = useState<Animal[]>(generateAnimals());
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [hasLikedShared, setHasLikedShared] = useState(true); // Mặc định true cho demo
    const [inputAmounts, setInputAmounts] = useState<{ [key: string]: number }>({});

    const PRICE_STEP = 10000; // 10,000đ mỗi bước
    const MIN_AMOUNT = 10000;

    const handleInputChange = (animalId: string, value: string) => {
        const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
        // Round to nearest 10000
        const roundedValue = Math.round(numValue / PRICE_STEP) * PRICE_STEP;
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

            {/* Animals Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
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
                                    <div className="w-full h-16 md:h-20 flex items-center justify-center mb-2 mt-4 overflow-hidden rounded-lg">
                                        <img
                                            src={`/assets/conhon/${String(animal.number).padStart(2, '0')}.jpg`}
                                            alt={animal.name}
                                            className="w-full h-full object-cover"
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
                                    <div className="flex items-center justify-center mb-2 space-x-1">
                                        <button
                                            onClick={() => handleDecrement(animal.id)}
                                            disabled={!hasLikedShared || currentAmount < PRICE_STEP}
                                            className="w-6 h-6 bg-gray-200 rounded text-gray-700 font-bold text-sm hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="text"
                                            value={currentAmount > 0 ? currentAmount.toLocaleString() : ''}
                                            onChange={(e) => handleInputChange(animal.id, e.target.value)}
                                            placeholder="0"
                                            disabled={!hasLikedShared}
                                            className="w-16 text-center text-xs font-semibold border border-gray-300 rounded px-1 py-1 focus:outline-none focus:border-red-500"
                                        />
                                        <button
                                            onClick={() => handleIncrement(animal.id)}
                                            disabled={!hasLikedShared}
                                            className="w-6 h-6 bg-gray-200 rounded text-gray-700 font-bold text-sm hover:bg-gray-300 disabled:opacity-50"
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
