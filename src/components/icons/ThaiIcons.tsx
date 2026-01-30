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
