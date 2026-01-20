import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollToSection = (sectionId: string, path: string) => {
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const navItems = [
    {
      icon: '🏆',
      label: 'KẾT QUẢ',
      sectionId: 'ket-qua',
      link: '/ket-qua'
    },
    {
      icon: '📜',
      label: 'CẦU THAI',
      sectionId: 'cau-thai',
      link: '/cau-thai'
    },
    {
      icon: '🎴',
      label: 'Ý NGHĨA',
      sectionId: 'y-nghia',
      link: '/#y-nghia'
    },
    {
      icon: '/assets/logo-moi.jpg',
      label: 'CHƠI NGAY',
      link: '/chon-thai',
      isLogo: true
    },
    {
      icon: '📺',
      label: 'VIDEO',
      sectionId: 'hinh-anh-video',
      link: '/#hinh-anh-video'
    },
    {
      icon: '📖',
      label: 'HƯỚNG DẪN',
      link: '/huong-dan'
    },
    {
      icon: '💬',
      label: 'HỖ TRỢ',
      link: '/lien-he'
    },
  ];

  const renderIcon = (item: typeof navItems[0], isActive: boolean) => {
    if (item.isLogo) {
      // Center logo - premium gold ring design
      return (
        <div className="relative -mt-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)',
              padding: '3px'
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <img
                src={item.icon as string}
                alt="Cổ Nhơn"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)'
            }}
          />
        </div>
      );
    }

    // Regular nav items - red theme
    return (
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-0.5 transition-all duration-200 ${isActive
            ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-md scale-105'
            : 'bg-gradient-to-br from-red-600/80 to-red-800/80'
          }`}
      >
        <span className="text-lg">{item.icon}</span>
      </div>
    );
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'linear-gradient(180deg, #1f1f1f 0%, #0f0f0f 100%)',
        borderTop: '1px solid rgba(185, 28, 28, 0.5)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #991b1b 20%, #fbbf24 50%, #991b1b 80%, transparent 100%)'
        }}
      />

      <div className="flex justify-around items-end h-16 px-1 pb-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.link ||
            Boolean(item.sectionId && location.pathname === '/' && document.getElementById(item.sectionId));

          const content = (
            <div className={`flex flex-col items-center ${item.isLogo ? 'justify-start' : 'justify-center'}`}>
              {renderIcon(item, isActive)}
              <span
                className={`font-semibold text-center leading-none transition-colors ${isActive ? 'text-yellow-400' : 'text-gray-300'
                  } ${item.isLogo ? 'mt-0.5' : ''}`}
                style={{ fontSize: '0.5rem' }}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.sectionId) {
            return (
              <button
                key={index}
                onClick={() => handleScrollToSection(item.sectionId!, item.link)}
                className="flex flex-col items-center justify-center flex-1 h-full transition-all hover:scale-105"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={index}
              to={item.link}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all hover:scale-105"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
