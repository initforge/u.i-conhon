import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartDrawer from '../components/CartDrawer';
import { ANIMALS_AN_NHON, ANIMALS_HOAI_NHON } from '../constants/animalData';
import { useSocialTasks } from '../contexts/SocialTaskContext';
import { useThaiConfig } from '../contexts/ThaiConfigContext';
import { useSystemConfig } from '../contexts/SystemConfigContext';
import { useAuth } from '../contexts/AuthContext';
import { getSessionStatus } from '../constants/drawTimes';
import { getCurrentSession, getSessionAnimals, createOrder } from '../services/api';

// Generate Animal objects from central data for a given Thai
const toAnimals = (list: typeof ANIMALS_AN_NHON): Animal[] =>
    list.map(a => ({ id: `animal-${a.order}`, name: a.name, alias: a.alias, number: a.order, liked: false }));

interface Animal {
    id: string;
    name: string;
    alias: string;
    number: number;
    liked: boolean;
}

interface CartItem extends Animal {
    amount: number; // Số tiền người chơi muốn mua
    thaiId: string;
    thaiName: string;
}

const thaiOptions = [
    { id: 'an-nhon', name: 'Thai An Nhơn', animals: 40, color: 'green' },
    { id: 'nhon-phong', name: 'Thai Nhơn Phong', animals: 40, color: 'yellow' },
    { id: 'hoai-nhon', name: 'Thai Hoài Nhơn', animals: 36, color: 'blue' },
];

const MuaConVatPage: React.FC = () => {
    const [selectedThai, setSelectedThai] = useState<string>(''); // Chưa chọn thai
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [inputAmounts, setInputAmounts] = useState<{ [key: string]: number }>({});
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    // Track sold out animals (animal_order -> remaining <= 0)
    const [soldOutAnimals, setSoldOutAnimals] = useState<Set<number>>(new Set());

    // System switches (Master OFF / Thai OFF) - SSE updates automatically in SystemConfigContext
    const { isSystemActive, isThaiOpen } = useSystemConfig();
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Auto logout when Master Switch is OFF
    useEffect(() => {
        if (!isSystemActive) {
            logout();
            navigate('/dang-nhap');
        }
    }, [isSystemActive, logout, navigate]);

    // LỖI 6 FIX: Time tick every 30s to auto-refresh session status
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 30_000);
        return () => clearInterval(timer);
    }, []);

    // Sử dụng SocialTaskContext để kiểm tra nhiệm vụ
    const { tasks, completeTask, allTasksCompleted } = useSocialTasks();
    const hasLikedShared = allTasksCompleted;

    // Countdown state for each task (10s countdown visible to user)
    const [taskCountdowns, setTaskCountdowns] = useState<{ [taskId: string]: number }>({});

    // ThaiConfigContext to get session status
    const { thais } = useThaiConfig();

    // Current session status for selected Thai
    const currentSessionInfo = useMemo(() => {
        if (!selectedThai) return null;

        const thaiId = `thai-${selectedThai}`;
        const thaiConfig = thais.find(t => t.id === thaiId);
        if (!thaiConfig) return null;

        return getSessionStatus(thaiId, thaiConfig.timeSlots, thaiConfig.isTetMode, thaiConfig.tetTimeSlot);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedThai, thais, now]); // 'now' triggers re-evaluation every 30s

    // Check if session is open for adding to cart
    const isSessionOpen = currentSessionInfo?.isOpen ?? false;

    // Banned animals: animal_order -> ban_reason
    const [bannedAnimals, setBannedAnimals] = useState<Map<number, string | null>>(new Map());

    // Fetch session animals to check sold out + banned status (with 15s polling, only when session is open)
    useEffect(() => {
        if (!selectedThai || !isSessionOpen) {
            setSoldOutAnimals(new Set());
            setBannedAnimals(new Map());
            return;
        }

        const fetchSessionAnimals = async () => {
            try {
                const { session } = await getCurrentSession(selectedThai);
                if (session?.id) {
                    const { animals } = await getSessionAnimals(session.id);
                    const soldOut = new Set<number>();
                    const banned = new Map<number, string | null>();
                    animals.forEach(a => {
                        if (a.is_banned) {
                            soldOut.add(a.animal_order);
                            banned.set(a.animal_order, a.ban_reason || null);
                        } else if (a.remaining <= 0) {
                            soldOut.add(a.animal_order);
                        }
                    });
                    setSoldOutAnimals(soldOut);
                    setBannedAnimals(banned);
                }
            } catch (error) {
                // Session may not exist yet, that's ok
                console.log('No active session for limit check');
                setSoldOutAnimals(new Set());
                setBannedAnimals(new Map());
            }
        };

        fetchSessionAnimals(); // Initial fetch

        // Poll every 15 seconds for near-realtime updates
        const interval = setInterval(fetchSessionAnimals, 15000);
        return () => clearInterval(interval);
    }, [selectedThai, isSessionOpen]);


    // Lọc danh sách con vật dựa theo Thai được chọn
    const currentThaiOption = thaiOptions.find(t => t.id === selectedThai);
    const animals = useMemo(() => {
        if (!selectedThai) return [];
        const source = selectedThai === 'hoai-nhon' ? ANIMALS_HOAI_NHON : ANIMALS_AN_NHON;
        return toAnimals(source);
    }, [selectedThai]);

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
        if (!currentThaiOption) return; // Cần chọn Thai trước
        if (!isSessionOpen) return; // Session phải đang mở
        if (!isThaiOpen(selectedThai!)) return; // Thai switch phải đang bật
        if (soldOutAnimals.has(animal.number)) return; // Hết hạng mức hoặc bị cấm

        const thaiId = `thai-${selectedThai}`;
        const thaiName = currentThaiOption.name;

        // Block multi-Thai: nếu cart có items từ Thai khác → clear
        const existingThaiInCart = cart.length > 0 ? cart[0].thaiId : null;
        let currentCart = cart;
        if (existingThaiInCart && existingThaiInCart !== thaiId) {
            currentCart = [];
        }

        // Unique key = animalId + thaiId
        const cartItemKey = `${animal.id}-${thaiId}`;
        const existingItem = currentCart.find(item => `${item.id}-${item.thaiId}` === cartItemKey);

        if (existingItem) {
            setCart(currentCart.map(item =>
                `${item.id}-${item.thaiId}` === cartItemKey
                    ? { ...item, amount: item.amount + amount }
                    : item
            ));
        } else {
            setCart([...currentCart, { ...animal, amount, thaiId, thaiName }]);
        }
        // Reset input after adding
        setInputAmounts(prev => ({ ...prev, [animal.id]: 0 }));
        setIsCartOpen(true);
    };

    const handleRemoveFromCart = (cartItemKey: string) => {
        setCart(cart.filter(item => `${item.id}-${item.thaiId}` !== cartItemKey));
    };

    const handleUpdateCartAmount = (cartItemKey: string, newAmount: number) => {
        if (newAmount <= 0) {
            handleRemoveFromCart(cartItemKey);
        } else {
            setCart(cart.map(item =>
                `${item.id}-${item.thaiId}` === cartItemKey
                    ? { ...item, amount: newAmount }
                    : item
            ));
        }
    };

    // ========== CHECKOUT ==========
    const handleCheckout = async () => {
        if (cart.length === 0 || isCheckingOut) return;

        // Re-validate switches at checkout time (defense-in-depth)
        if (!isSessionOpen || (selectedThai && !isThaiOpen(selectedThai))) {
            alert('Thai này đã đóng. Không thể đặt hàng.');
            return;
        }

        setIsCheckingOut(true);
        setCheckoutError(null);

        try {
            // All cart items belong to same Thai (enforced by handleAddToCart)
            const thaiId = cart[0].thaiId || 'unknown';

            // Get current session for this Thai
            const sessionData = await getCurrentSession(thaiId);
            if (!sessionData?.session?.id) {
                throw new Error('Không tìm thấy phiên đang mở cho Thai này. Vui lòng thử lại.');
            }

            const sessionId = sessionData.session.id;

            // Build order items
            const orderItems = cart.map(item => ({
                animal_order: item.number,
                quantity: 1,
                unit_price: item.amount,
            }));

            // Create order via API
            const result = await createOrder({
                session_id: sessionId,
                items: orderItems,
            });

            // Redirect to intermediate payment page
            if (result?.order?.id) {
                setCart([]);
                setIsCartOpen(false);
                navigate(`/user/thanh-toan/${result.order.id}`);
            } else {
                setCart([]);
                setIsCartOpen(false);
                alert('Đơn hàng đã được tạo! Vui lòng kiểm tra lịch sử đơn hàng.');
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể tạo đơn hàng. Vui lòng thử lại.';
            setCheckoutError(message);
            alert(message);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleDoLikeShare = (taskId: string, url: string) => {
        // Prevent starting if already counting
        if (taskCountdowns[taskId] !== undefined) return;

        window.open(url, '_blank');

        // Start visible 10s countdown
        setTaskCountdowns(prev => ({ ...prev, [taskId]: 10 }));

        const interval = setInterval(() => {
            setTaskCountdowns(prev => {
                const current = prev[taskId];
                if (current === undefined || current <= 1) {
                    clearInterval(interval);
                    completeTask(taskId);
                    // Remove from countdowns after completion
                    const { [taskId]: _, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [taskId]: current - 1 };
            });
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
                            {thaiOptions.map((thai) => {
                                // Check if this Thai is open from SystemConfig
                                const thaiIsOpen = isThaiOpen(thai.id);
                                return (
                                    <button
                                        key={thai.id}
                                        onClick={() => thaiIsOpen && setSelectedThai(thai.id)}
                                        disabled={!thaiIsOpen}
                                        className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${!thaiIsOpen
                                            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                                            : selectedThai === thai.id
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
                                            {thaiIsOpen ? (
                                                <span className="text-xs opacity-70">({thai.animals} con)</span>
                                            ) : (
                                                <span className="text-xs text-red-500 font-bold">✗ Đã đóng</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Task Modal - Fullscreen blocking modal for new users */}
            {
                !hasLikedShared && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                                <div className="flex items-center space-x-3">
                                    <span className="text-4xl">🔒</span>
                                    <div>
                                        <h2 className="text-xl font-bold">Hoàn thành nhiệm vụ</h2>
                                        <p className="text-sm opacity-90">Để mở khóa tính năng mua hàng</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Bạn cần hoàn thành các nhiệm vụ dưới đây để được mua hàng.
                                </p>
                                <div className="space-y-3 mb-6">
                                    {tasks.filter(t => t.required).map((task) => (
                                        <div
                                            key={task.id}
                                            className={`p-4 rounded-xl border-2 transition-all ${task.isCompleted
                                                ? 'border-green-300 bg-green-50'
                                                : 'border-gray-200 bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">
                                                        {task.isCompleted ? '✅' : task.type === 'like' ? '👍' : '🔗'}
                                                    </span>
                                                    <div>
                                                        <p className={`font-semibold ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                            {task.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                {!task.isCompleted && (
                                                    <button
                                                        onClick={() => handleDoLikeShare(task.id, task.url)}
                                                        disabled={taskCountdowns[task.id] !== undefined}
                                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${taskCountdowns[task.id] !== undefined
                                                            ? 'bg-yellow-500 text-white cursor-wait animate-pulse'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                                            }`}
                                                    >
                                                        {taskCountdowns[task.id] !== undefined
                                                            ? '⏳ Đang xác nhận...'
                                                            : 'Thực hiện ↗'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Cảnh báo Zalo nổi bật */}
                                <div className="p-4 bg-red-100 border-2 border-red-400 rounded-xl">
                                    <div className="flex items-start space-x-3">
                                        <span className="text-2xl">⚠️</span>
                                        <div>
                                            <p className="font-bold text-red-700 text-base mb-1">
                                                LƯU Ý QUAN TRỌNG VỀ ZALO
                                            </p>
                                            <p className="text-sm text-red-600">
                                                Vui lòng <strong>TẮT CHẾ ĐỘ RIÊNG TƯ</strong> trên Zalo để chúng tôi có thể liên hệ trả thưởng cho bạn!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Animals Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {selectedThai ? (
                    /* Check if selected Thai is open */
                    isThaiOpen(selectedThai) ? (
                        <>
                            {/* Thai Info Banner with Session Status */}
                            <div className="mb-6 rounded-xl overflow-hidden border border-red-200">
                                <div className="p-4 bg-gradient-to-r from-red-100 to-red-50">
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

                                {/* Session Status Bar */}
                                {currentSessionInfo && (
                                    <div className={`px-4 py-3 ${currentSessionInfo.isOpen
                                        ? 'bg-green-50 border-t border-green-200'
                                        : 'bg-amber-50 border-t border-amber-200'
                                        }`}>
                                        {currentSessionInfo.isOpen ? (
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="animate-pulse text-green-500">●</span>
                                                    <span className="font-semibold text-green-700">
                                                        {currentSessionInfo.khungLabel} đang mở
                                                    </span>
                                                    <span className="text-sm text-green-600">
                                                        (đóng tịch lúc {currentSessionInfo.closeTime})
                                                    </span>
                                                </div>
                                                <div className="text-sm text-green-700 font-medium">
                                                    🎯 Xổ lúc {currentSessionInfo.drawTime}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-amber-500">⏸️</span>
                                                    <span className="font-semibold text-amber-700">
                                                        Đang đóng cửa
                                                    </span>
                                                </div>
                                                {currentSessionInfo.nextOpenTime && (
                                                    <div className="text-sm text-amber-700">
                                                        Mở lại lúc <strong>{currentSessionInfo.nextOpenTime}</strong>
                                                        {currentSessionInfo.nextKhungLabel && (
                                                            <span className="ml-1">({currentSessionInfo.nextKhungLabel})</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
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
                                            {/* Overlay if not liked/shared OR session is closed OR sold out */}
                                            {(!hasLikedShared || !isSessionOpen || soldOutAnimals.has(animal.number)) && (
                                                <div className="absolute inset-0 bg-gray-900/50 z-10 flex items-center justify-center p-2">
                                                    <p className="text-white text-xs text-center font-medium">
                                                        {bannedAnimals.has(animal.number)
                                                            ? `🚫 Đã bị cấm${bannedAnimals.get(animal.number) ? `: ${bannedAnimals.get(animal.number)}` : ''}`
                                                            : soldOutAnimals.has(animal.number)
                                                                ? 'Đã hết lượt mua'
                                                                : !hasLikedShared
                                                                    ? 'Vui lòng Like/Share'
                                                                    : 'Đang đóng cửa'}
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
                                                        disabled={!hasLikedShared || !isSessionOpen || soldOutAnimals.has(animal.number) || currentAmount < PRICE_STEP}
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
                                                        disabled={!hasLikedShared || !isSessionOpen || soldOutAnimals.has(animal.number)}
                                                        className="w-20 text-center text-sm font-semibold border-2 border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                    />
                                                    <button
                                                        onClick={() => handleIncrement(animal.id)}
                                                        disabled={!hasLikedShared || !isSessionOpen || soldOutAnimals.has(animal.number)}
                                                        className="w-8 h-8 bg-gray-200 rounded-lg text-gray-700 font-bold text-lg hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-center text-gray-400 mb-1">Bước: 10,000đ</p>

                                                {/* Add Button */}
                                                <button
                                                    onClick={() => handleAddToCart(animal)}
                                                    disabled={!hasLikedShared || !isSessionOpen || soldOutAnimals.has(animal.number) || currentAmount < MIN_AMOUNT}
                                                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${hasLikedShared && isSessionOpen && !soldOutAnimals.has(animal.number) && currentAmount >= MIN_AMOUNT
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
                    ) : (
                        /* Thai is OFF - show closed message */
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                                <span className="text-5xl">🚫</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">
                                Thai {currentThaiOption?.name} đang tắt
                            </h3>
                            <p className="text-gray-500 text-center max-w-md mb-6">
                                Thai này hiện không hoạt động. Vui lòng chọn Thai khác hoặc quay lại sau.
                            </p>
                            <button
                                onClick={() => setSelectedThai('')}
                                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                            >
                                ← Chọn Thai khác
                            </button>
                        </div>
                    )
                ) : (
                    /* No Thai selected */
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-gray-500">
                        <span className="text-6xl mb-4">👆</span>
                        <p className="text-lg">Vui lòng chọn Thai ở trên để xem danh sách con vật</p>
                    </div>
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
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
            />
        </div >
    );
};

export default MuaConVatPage;

