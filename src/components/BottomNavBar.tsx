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
      icon: '/assets/nav-icons/ketqua.png',
      label: 'KẾT QUẢ',
      sectionId: 'ket-qua',
      link: '/ket-qua'
    },
    {
      icon: '/assets/nav-icons/cauthai.png',
      label: 'CẦU THAI',
      sectionId: 'cau-thai',
      link: '/cau-thai'
    },
    {
      icon: '/assets/nav-icons/ynghia.svg',
      label: 'Ý NGHĨA',
      sectionId: 'y-nghia',
      link: '/#y-nghia'
    },
    {
      icon: '/assets/logo-moi.jpg',
      label: 'CHƠI NGAY',
      link: '/mua-con-vat',
      isLogo: true
    },
    {
      icon: '/assets/nav-icons/video.svg',
      label: 'HÌNH ẢNH',
      sectionId: 'hinh-anh-video',
      link: '/#hinh-anh-video'
    },
    {
      icon: '/assets/nav-icons/huongdan.svg',
      label: 'HƯỚNG DẪN',
      link: '/huong-dan'
    },
    {
      icon: '/assets/nav-icons/hotro.svg',
      label: 'HỖ TRỢ',
      link: '/lien-he'
    },
  ];

  const renderIcon = (item: typeof navItems[0], isActive: boolean) => {
    if (item.isLogo) {
      // Center logo - simple gold border, no background
      return (
        <div className="relative -mt-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              border: '2px solid #fbbf24',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <img
              src={item.icon}
              alt="Cổ Nhơn"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );
    }

    // Regular nav items - custom icons with red background
    return (
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-0.5 transition-all duration-200 overflow-hidden ${isActive
          ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-md scale-105 ring-2 ring-yellow-400'
          : 'bg-gradient-to-br from-red-600/90 to-red-800/90'
          }`}
      >
        <img
          src={item.icon}
          alt={item.label}
          className="w-7 h-7 object-contain"
        />
      </div>
    );
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
        borderTop: '1px solid rgba(185, 28, 28, 0.4)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Decorative top border - red to gold gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #991b1b 15%, #fbbf24 50%, #991b1b 85%, transparent 100%)'
        }}
      />

      <div className="flex justify-around items-end h-16 px-0.5 pb-1">
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
                className="flex flex-col items-center justify-center flex-1 h-full transition-all hover:scale-105 active:scale-95"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={index}
              to={item.link}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all hover:scale-105 active:scale-95"
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
