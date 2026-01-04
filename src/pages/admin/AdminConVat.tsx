import React, { useState } from 'react';

interface Animal {
    id: number;
    name: string;
    emoji: string;
    price: number;
    isActive: boolean;
    limit: number;
    sold: number;
}

const generateAnimals = (): Animal[] => {
    const names = [
        'Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà',
        'Chó', 'Heo', 'Voi', 'Sư tử', 'Báo', 'Gấu', 'Thỏ', 'Rùa', 'Cá', 'Chim',
        'Công', 'Hạc', 'Phượng', 'Lân', 'Cọp', 'Bò', 'Nai', 'Hươu', 'Sóc', 'Nhím',
        'Cáo', 'Sói', 'Đại bàng', 'Quạ', 'Thiên nga', 'Vịt', 'Ngỗng', 'Ong', 'Bướm', 'Tôm'
    ];
    const emojis = [
        '🐭', '🐃', '🐅', '🐱', '🐉', '🐍', '🐴', '🐐', '🐵', '🐔',
        '🐕', '🐷', '🐘', '🦁', '🐆', '🐻', '🐰', '🐢', '🐟', '🐦',
        '🦚', '🦢', '🦅', '🦄', '🐯', '🐂', '🦌', '🦌', '🐿️', '🦔',
        '🦊', '🐺', '🦅', '🐦', '🦢', '🦆', '🦆', '🐝', '🦋', '🦐'
    ];

    return names.map((name, idx) => ({
        id: idx + 1,
        name,
        emoji: emojis[idx],
        price: 30000,
        isActive: true,
        limit: 100,
        sold: Math.floor(Math.random() * 50)
    }));
};

const AdminConVat: React.FC = () => {
    const [animals, setAnimals] = useState<Animal[]>(generateAnimals());
    const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
    const [editPrice, setEditPrice] = useState<number>(0);

    const handleToggle = (id: number) => {
        setAnimals(animals.map(a =>
            a.id === id ? { ...a, isActive: !a.isActive } : a
        ));
    };

    const handleEditPrice = (animal: Animal) => {
        setEditingAnimal(animal);
        setEditPrice(animal.price);
    };

    const handleSavePrice = () => {
        if (editingAnimal) {
            setAnimals(animals.map(a =>
                a.id === editingAnimal.id ? { ...a, price: editPrice } : a
            ));
            setEditingAnimal(null);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Con vật</h1>
                <p className="text-gray-600">Quản lý 40 con vật trong hệ thống</p>
            </div>

            {/* Animals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
                {animals.map((animal) => (
                    <div
                        key={animal.id}
                        className={`bg-white rounded-xl shadow-md p-4 transition-all ${!animal.isActive ? 'opacity-50' : ''
                            }`}
                    >
                        {/* Number */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                {animal.id}
                            </span>
                            <button
                                onClick={() => handleToggle(animal.id)}
                                className={`w-10 h-5 rounded-full relative transition-colors ${animal.isActive ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform ${animal.isActive ? 'translate-x-5' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>

                        {/* Emoji */}
                        <div className="text-4xl text-center mb-2">{animal.emoji}</div>

                        {/* Name */}
                        <h3 className="text-sm font-bold text-center text-gray-800 mb-1">{animal.name}</h3>

                        {/* Price */}
                        <p className="text-xs text-center text-red-600 font-semibold mb-2">
                            {animal.price.toLocaleString()}đ
                        </p>

                        {/* Stats */}
                        <div className="text-xs text-center text-gray-500 mb-2">
                            Đã bán: {animal.sold}/{animal.limit}
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => handleEditPrice(animal)}
                            className="w-full py-1 text-xs bg-blue-100 text-blue-700 rounded font-semibold hover:bg-blue-200"
                        >
                            ✏️ Sửa giá
                        </button>
                    </div>
                ))}
            </div>

            {/* Edit Price Modal */}
            {editingAnimal && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setEditingAnimal(null)}
                    />
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-sm p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                            {editingAnimal.emoji} Sửa giá {editingAnimal.name}
                        </h2>
                        <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-center text-xl font-bold"
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setEditingAnimal(null)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSavePrice}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminConVat;
