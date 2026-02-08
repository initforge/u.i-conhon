import React from 'react';

interface AdminPageWrapperProps {
    title: string;
    subtitle?: string;
    icon: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

/**
 * Wrapper component cho các trang Admin
 * Phong cách Cổ Nhơn: Thanh lịch, có điểm nhấn đỏ, interactions mượt mà
 */
const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({
    title,
    subtitle,
    icon,
    children,
    actions
}) => {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm transition-transform hover:scale-105 hover:rotate-3 duration-300 flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #FEF2F2 100%)',
                            border: '1px solid #FECACA',
                            color: '#991b1b'
                        }}
                    >
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <h1
                            className="text-lg sm:text-2xl font-bold tracking-tight truncate"
                            style={{ color: '#3d3428', fontFamily: "'Bungee', sans-serif" }}
                        >
                            {title}
                        </h1>
                        {subtitle && (
                            <p
                                className="text-xs sm:text-sm mt-0.5 font-medium truncate"
                                style={{ color: '#9a8c7a' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                {actions && (
                    <div className="flex items-center space-x-3">
                        {actions}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="animate-fade-in-up delay-100">
                {children}
            </div>
        </div>
    );
};

/**
 * Admin Card - Với hover effect & red accent
 */
export const AdminCard: React.FC<{
    title?: string;
    icon?: string;
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}> = ({ title, icon, children, className = '', noPadding }) => {
    return (
        <div
            className={`rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
            style={{
                border: '1px solid #e8e4df',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
        >
            {title && (
                <div
                    className="px-5 py-4 flex items-center justify-between group"
                    style={{ borderBottom: '1px solid #f0ece6' }}
                >
                    <div className="flex items-center space-x-2.5">
                        {icon && (
                            <span className="text-lg opacity-80 group-hover:scale-110 group-hover:text-red-600 transition-all duration-300">
                                {icon}
                            </span>
                        )}
                        <h2
                            className="text-sm font-bold uppercase tracking-wider group-hover:text-red-800 transition-colors"
                            style={{ color: '#6b5c4c' }}
                        >
                            {title}
                        </h2>
                    </div>
                    {/* Decorative dot */}
                    <div className="w-1.5 h-1.5 rounded-full bg-red-100 group-hover:bg-red-500 transition-colors duration-300"></div>
                </div>
            )}
            <div className={noPadding ? '' : 'p-5'}>
                {children}
            </div>
        </div>
    );
};

/**
 * Admin Table - Hover rows
 */
export const AdminTable: React.FC<{
    headers: string[];
    children: React.ReactNode;
}> = ({ headers, children }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr style={{ backgroundColor: '#faf8f5', borderBottom: '2px solid #e8e4df' }}>
                        {headers.map((header, idx) => (
                            <th
                                key={idx}
                                className="p-4 text-xs font-bold uppercase tracking-wider text-left"
                                style={{ color: '#991b1b' }} // Red headers
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#f0ece6' }}>
                    {children}
                </tbody>
            </table>
        </div>
    );
};

/**
 * Admin Tab Bar - Animated pill
 */
export const AdminTabBar: React.FC<{
    tabs: { id: string; label: string; count?: number }[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div
            className="flex space-x-1 p-1.5 rounded-xl inline-flex"
            style={{ backgroundColor: '#f5f2ed', border: '1px solid #e8e4df' }}
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2
            ${activeTab === tab.id ? 'shadow-sm transform scale-105' : 'hover:bg-white/50'}
          `}
                    style={activeTab === tab.id ? {
                        backgroundColor: 'white',
                        color: '#991b1b', // Red text when active
                        fontWeight: 600
                    } : {
                        color: '#6b5c4c'
                    }}
                >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full transition-colors ${activeTab === tab.id
                                ? 'bg-red-50 text-red-700'
                                : 'bg-gray-200/50 text-gray-500'
                                }`}
                        >
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

/**
 * Status Badge
 */
export const StatusBadge: React.FC<{
    status: 'success' | 'warning' | 'info' | 'error' | 'neutral';
    children: React.ReactNode;
}> = ({ status, children }) => {
    const styles = {
        success: { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
        warning: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
        info: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
        error: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
        neutral: { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' },
    };

    const s = styles[status];

    return (
        <span
            className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center border"
            style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
        >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70`}></span>
            {children}
        </span>
    );
};

/**
 * Stat Card - Red accent hover
 */
export const StatCard: React.FC<{
    label: string;
    value: string | number;
    icon: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}> = ({ label, value, icon, trend, trendValue }) => {
    return (
        <div
            className="p-3 sm:p-5 rounded-xl bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden"
            style={{ border: '1px solid #e8e4df' }}
        >
            {/* Decorative background circle */}
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>

            <div className="relative z-10">
                <p className="text-xs sm:text-sm font-medium truncate" style={{ color: '#9a8c7a' }}>{label}</p>
                <p className="text-xl sm:text-2xl font-bold mt-1 group-hover:text-red-800 transition-colors" style={{ color: '#3d3428' }}>
                    {value}
                </p>
                {trend && trendValue && (
                    <p
                        className="text-xs mt-2 flex items-center space-x-1 font-medium"
                        style={{
                            color: trend === 'up' ? '#166534' : trend === 'down' ? '#991b1b' : '#6b5c4c'
                        }}
                    >
                        <span className="bg-current bg-opacity-10 rounded px-1">
                            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
};

/**
 * Admin Button - Gradient Red for Primary
 */
export const AdminButton: React.FC<{
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit';
    icon?: string;
}> = ({ children, variant = 'primary', onClick, className = '', type = 'button', icon }) => {
    const styles = {
        primary: {
            background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
            color: 'white',
            border: 'none',
            shadow: '0 4px 6px -1px rgba(185, 28, 28, 0.2)'
        },
        secondary: {
            backgroundColor: 'white',
            color: '#6b5c4c',
            border: '1px solid #e8e4df',
            shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        },
        danger: {
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
            shadow: 'none'
        },
        ghost: {
            backgroundColor: 'transparent',
            color: '#6b5c4c',
            border: 'none',
            shadow: 'none'
        }
    };

    const s = styles[variant];

    return (
        <button
            type={type}
            onClick={onClick}
            className={`
        px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
        flex items-center justify-center space-x-2
        hover:opacity-90 active:scale-95
        ${className}
      `}
            style={{
                ...s,
                boxShadow: variant === 'primary' ? '0 4px 12px rgba(153, 27, 27, 0.15)' : 'none'
            }}
        >
            {icon && <span>{icon}</span>}
            <span>{children}</span>
        </button>
    );
};

export default AdminPageWrapper;
