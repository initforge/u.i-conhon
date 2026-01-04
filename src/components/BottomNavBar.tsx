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
      icon: '/assets/decorations/ket-qua.png',
      label: 'KẾT QUẢ XỔ',
      sectionId: 'ket-qua',
      link: '/ket-qua'
    },
    { 
      icon: '/assets/decorations/cau-thai.png',
      label: 'CẦU THAI MỚI',
      sectionId: 'cau-thai',
      link: '/cau-thai'
    },
    { 
      icon: '/assets/logo-co-nhon.svg',
      label: 'CHƠI NGAY',
      link: '/',
      isLogo: true
    },
    { 
      icon: '/assets/decorations/huong-dan-icon.png',
      label: 'HƯỚNG DẪN',
      link: '/huong-dan'
    },
    { 
      icon: '/assets/decorations/ho-tro.png',
      label: 'HỖ TRỢ ZALO',
      link: '/lien-he'
    },
  ];

  const renderIcon = (item: typeof navItems[0], isActive: boolean) => {
    if (item.isLogo) {
      // Logo button: Yellow square with red circular badge containing text
      return (
        <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-1 shadow-md">
          <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs" style={{ fontSize: '0.6rem', lineHeight: '1' }}>
              CỔ<br />NHƠN
            </span>
          </div>
        </div>
      );
    }
    
    return (
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-1 ${
        isActive ? 'bg-red-600' : 'bg-gray-700'
      }`}>
        <img 
          src={item.icon} 
          alt={item.label}
          className="w-7 h-7 object-contain"
          style={{ 
            // Không dùng filter để giữ màu gốc của icon
            objectFit: 'contain'
          }}
          onError={(e) => {
            // Fallback nếu icon không load được
            console.error('Icon failed to load:', item.icon);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50 md:hidden shadow-lg">
      <div className="flex justify-around items-center h-20 px-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.link || 
            (item.sectionId && location.pathname === '/' && document.getElementById(item.sectionId));
          
          const content = (
            <>
              {renderIcon(item, isActive || false)}
              <span className="text-xs font-bold text-center leading-tight text-white" style={{ fontSize: '0.7rem', lineHeight: '1.1' }}>
                {item.label}
              </span>
            </>
          );
          
          if (item.sectionId) {
            return (
              <button
                key={index}
                onClick={() => handleScrollToSection(item.sectionId!, item.link)}
                className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
              >
                {content}
              </button>
            );
          }
          
          return (
            <Link
              key={index}
              to={item.link}
              className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
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

