import React from 'react';

interface ThaiIconProps {
    size?: number;
    className?: string;
}

// Custom SVG cho Thai An Nhơn - chủ đề Rồng (màu đỏ)
export const AnNhonIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="anNhonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="url(#anNhonGradient)" />
        <circle cx="24" cy="24" r="20" fill="none" stroke="#fecaca" strokeWidth="1.5" />
        {/* Rồng stylized */}
        <path d="M16 28c0-6 4-12 8-12s8 6 8 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="18" cy="20" r="2" fill="#fff" />
        <circle cx="30" cy="20" r="2" fill="#fff" />
        <path d="M12 16c2-2 4-3 6-2" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 16c-2-2-4-3-6-2" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        {/* Crown hints */}
        <path d="M20 12l4-4 4 4" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Custom SVG cho Thai Nhơn Phong - chủ đề Phượng (màu xanh dương)
export const NhonPhongIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="nhonPhongGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="url(#nhonPhongGradient)" />
        <circle cx="24" cy="24" r="20" fill="none" stroke="#bfdbfe" strokeWidth="1.5" />
        {/* Phượng/Trophy stylized */}
        <path d="M24 10v6M24 32v6" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 24h4M30 24h4" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="24" r="8" fill="none" stroke="#fff" strokeWidth="2.5" />
        <path d="M20 24l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Wings hint */}
        <path d="M8 20c4-2 8-1 10 2" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M40 20c-4-2-8-1-10 2" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Custom SVG cho Thai Hoài Nhơn - chủ đề Cây Tre/Lá (màu xanh lá)
export const HoaiNhonIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="hoaiNhonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="url(#hoaiNhonGradient)" />
        <circle cx="24" cy="24" r="20" fill="none" stroke="#bbf7d0" strokeWidth="1.5" />
        {/* Tre/Bamboo stylized */}
        <rect x="22" y="12" width="4" height="24" rx="2" fill="#fff" />
        <path d="M22 18h4M22 24h4M22 30h4" stroke="url(#hoaiNhonGradient)" strokeWidth="1" />
        {/* Leaves */}
        <path d="M26 16c4-2 8 0 10 4" stroke="#dcfce7" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 22c-4-2-6 1-7 5" stroke="#dcfce7" strokeWidth="2" strokeLinecap="round" />
        <circle cx="36" cy="20" r="2" fill="#fcd34d" />
    </svg>
);

// Icon được dùng chung cho Cổ Nhơn Brand
export const CoNhonBrandIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="url(#brandGradient)" />
        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        {/* CN stylized */}
        <text x="24" y="30" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="serif">C</text>
        {/* Star accent */}
        <path d="M35 12l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5z" fill="#fcd34d" />
    </svg>
);

// ================== UI ICONS (Thay cho emoji) ==================

// 💬 Comment Icon - Bình luận
export const CommentIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

// ❤️ Heart Icon - Tim/Like
export const HeartIcon: React.FC<ThaiIconProps & { filled?: boolean }> = ({ size = 24, className = '', filled = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// 📭 Empty/No Content Icon - Hộp rỗng
export const EmptyIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#6b7280" />
            </linearGradient>
        </defs>
        <rect x="8" y="16" width="32" height="24" rx="3" stroke="url(#emptyGradient)" strokeWidth="2.5" fill="none" />
        <path d="M8 22l8-6h16l8 6" stroke="url(#emptyGradient)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
        <line x1="24" y1="28" x2="24" y2="34" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="37" r="1.5" fill="#9ca3af" />
    </svg>
);

// ⚠️ Warning Icon - Cảnh báo
export const WarningIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
        </defs>
        <path d="M24 4L4 42h40L24 4z" fill="url(#warningGradient)" stroke="#fcd34d" strokeWidth="2" />
        <line x1="24" y1="18" x2="24" y2="28" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="34" r="2" fill="#fff" />
    </svg>
);

// 🎋 Tet Mode Icon - Chế độ Tết (Mai vàng)
export const TetModeIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="tetBranchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>
        </defs>
        {/* Cành mai */}
        <path d="M24 44V20M24 20C20 16 16 14 12 16M24 20C28 16 32 14 36 16" stroke="url(#tetBranchGradient)" strokeWidth="3" strokeLinecap="round" />
        {/* Hoa mai vàng */}
        <circle cx="12" cy="12" r="6" fill="#fcd34d" />
        <circle cx="12" cy="12" r="3" fill="#f59e0b" />
        <circle cx="28" cy="8" r="5" fill="#fcd34d" />
        <circle cx="28" cy="8" r="2.5" fill="#f59e0b" />
        <circle cx="38" cy="16" r="4" fill="#fcd34d" />
        <circle cx="38" cy="16" r="2" fill="#f59e0b" />
        <circle cx="18" cy="24" r="3" fill="#fcd34d" />
        <circle cx="18" cy="24" r="1.5" fill="#f59e0b" />
    </svg>
);

// 💡 Lightbulb Icon - Gợi ý/Tip
export const LightbulbIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="bulbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
        </defs>
        <circle cx="24" cy="18" r="12" fill="url(#bulbGradient)" />
        <path d="M18 30v4a6 6 0 0012 0v-4" stroke="#9ca3af" strokeWidth="2.5" />
        <path d="M18 30h12" stroke="#9ca3af" strokeWidth="2" />
        <path d="M20 36h8" stroke="#9ca3af" strokeWidth="2" />
        {/* Rays */}
        <line x1="24" y1="2" x2="24" y2="6" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="18" x2="42" y2="18" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="18" x2="10" y2="18" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        <line x1="35" y1="7" x2="38" y2="4" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="4" x2="13" y2="7" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// 🔄 Loading Icon - Đang tải
export const LoadingIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`animate-spin ${className}`}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// 📺 Video Icon - Video
export const VideoIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
        <polygon points="10,8 16,12 10,16" fill="currentColor" />
    </svg>
);

// 🚫 Ban/Block Icon - Cấm
export const BanIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" />
    </svg>
);

// 👤 User Icon - Người dùng
export const UserIcon: React.FC<ThaiIconProps> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Helper component để chọn icon theo thaiId
interface ThaiIconSelectorProps extends ThaiIconProps {
    thaiId: 'an-nhon' | 'nhon-phong' | 'hoai-nhon' | string;
}

export const ThaiIcon: React.FC<ThaiIconSelectorProps> = ({ thaiId, ...props }) => {
    switch (thaiId) {
        case 'an-nhon':
        case 'thai-an-nhon':
            return <AnNhonIcon {...props} />;
        case 'nhon-phong':
        case 'thai-nhon-phong':
            return <NhonPhongIcon {...props} />;
        case 'hoai-nhon':
        case 'thai-hoai-nhon':
            return <HoaiNhonIcon {...props} />;
        default:
            return <CoNhonBrandIcon {...props} />;
    }
};

export default ThaiIcon;

