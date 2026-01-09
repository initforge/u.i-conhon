import React, { useState } from 'react';
import CartDrawer from '../components/CartDrawer';

// Mock data for 40 animals
const generateAnimals = () => {
    const animalNames = [
        'Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà',
        'Chó', 'Heo', 'Voi', 'Sư tử', 'Báo', 'Gấu', 'Thỏ', 'Rùa', 'Cá', 'Chim',
        'Công', 'Hạc', 'Phượng', 'Lân', 'Cọp', 'Bò', 'Nai', 'Hươu', 'Sóc', 'Nhím',
        'Cáo', 'Sói', 'Đại bàng', 'Quạ', 'Thiên nga', 'Vịt', 'Ngỗng', 'Ong', 'Bướm', 'Tôm'
    ];

    const emojis = [
        '🐭', '🐃', '🐅', '🐱', '🐉', '🐍', '🐴', '🐐', '🐵', '🐔',
        '🐕', '🐷', '🐘', '🦁', '🐆', '🐻', '🐰', '🐢', '🐟', '🐦',
        '🦚', '🦢', '🦅', '🦄', '🐯', '🐂', '🦌', '🦌', '🐿️', '🦔',
        '🦊', '🐺', '🦅', '🐦‍⬛', '🦢', '🦆', '🦆', '🐝', '🦋', '🦐'
    ];

    return animalNames.map((name, index) => ({
        id: `animal-${index + 1}`,
        name,
        emoji: emojis[index],
        price: 30000,
        number: index + 1,
        liked: false
    }));
};

interface Animal {
    id: string;
    name: string;
    emoji: string;
    price: number;
    number: number;
    liked: boolean;
}

interface CartItem extends Animal {
    quantity: number;
}

const MuaConVatPage: React.FC = () => {
    const [animals] = useState<Animal[]>(generateAnimals());
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [hasLikedShared, setHasLikedShared] = useState(false);

    const handleAddToCart = (animal: Animal) => {
        if (!hasLikedShared) return;

        const existingItem = cart.find(item => item.id === animal.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === animal.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...animal, quantity: 1 }]);
        }
        setIsCartOpen(true);
    };

    const handleRemoveFromCart = (animalId: string) => {
        setCart(cart.filter(item => item.id !== animalId));
    };

    const handleDoLikeShare = () => {
        // Mock: Open Facebook in new tab
        window.open('https://facebook.com', '_blank');
        // After 1 second, mark as done (mock)
        setTimeout(() => {
            setHasLikedShared(true);
        }, 1000);
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
                    {animals.map((animal) => (
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

                                {/* Emoji */}
                                <div className="text-4xl text-center mb-2 mt-4">
                                    {animal.emoji}
                                </div>

                                {/* Name */}
                                <h3 className="text-sm font-bold text-center text-gray-800 mb-1">
                                    {animal.name}
                                </h3>

                                {/* Price */}
                                <p className="text-xs text-center text-red-600 font-semibold mb-2">
                                    {animal.price.toLocaleString()}đ
                                </p>

                                {/* Add Button */}
                                <button
                                    onClick={() => handleAddToCart(animal)}
                                    disabled={!hasLikedShared}
                                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${hasLikedShared
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    ➕ Thêm
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cart}
                onRemove={handleRemoveFromCart}
                totalPrice={totalPrice}
            />
        </div>
    );
};

export default MuaConVatPage;
