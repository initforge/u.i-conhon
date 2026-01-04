import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const FloatingIconBar: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updatePosition = () => {
      // Fixed at right side, vertically centered in viewport
      const viewportHeight = window.innerHeight;
      const centerY = viewportHeight / 2;
      const rightMargin = 20; // 20px from right edge
      const barWidth = 80; // Approximate width of the bar
      const x = window.innerWidth - barWidth - rightMargin;
      
      setPosition({
        x: x,
        y: centerY - 100, // -100 to center the bar vertically (bar height ~200px)
      });
    };

    const handleResize = () => {
      updatePosition();
    };

    // Initialize position
    updatePosition();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Nếu đang ở trang chủ, scroll đến section
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Nếu không ở trang chủ, navigate về trang chủ rồi scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const icons = [
    { 
      src: '/assets/decorations/ket-qua.png', 
      alt: 'Kết quả', 
      sectionId: 'ket-qua',
      label: 'KẾT QUẢ XỔ'
    },
    { 
      src: '/assets/decorations/cau-thai.png', 
      alt: 'Câu thai', 
      sectionId: 'cau-thai',
      label: 'CẦU THAI MỚI'
    },
    { 
      src: '/assets/decorations/huong-dan-icon.png', 
      alt: 'Hướng dẫn', 
      link: '/huong-dan',
      label: 'HƯỚNG DẪN'
    },
    { 
      src: '/assets/decorations/ho-tro.png', 
      alt: 'Hỗ trợ', 
      link: '/lien-he',
      label: 'HỖ TRỢ ZALO'
    },
  ];

  return (
    <div
      className="hidden md:block fixed z-50 pointer-events-auto"
      style={{
        right: '20px',
        top: `${position.y}px`,
        transform: 'translateY(-50%)',
        transition: 'top 0.2s ease-out',
      }}
    >
      <div className="bg-white rounded-lg shadow-xl border-2 border-tet-red-400 p-2 flex flex-col space-y-2">
        {icons.map((icon, index) => {
          if (icon.sectionId) {
            return (
              <button
                key={index}
                onClick={() => scrollToSection(icon.sectionId!)}
                className="flex items-center space-x-2 px-2 py-2 hover:bg-red-50 rounded transition group relative"
                title={icon.label}
              >
                <img
                  src={icon.src}
                  alt={icon.alt}
                  className="w-10 h-10 object-contain"
                />
                <span 
                  className="text-xs font-extrabold whitespace-nowrap opacity-100 transition-all duration-200 ml-1 px-2 py-1 rounded"
                  style={{ 
                    color: '#7f1d1d',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(127, 29, 29, 0.2)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                  }}
                >
                  {icon.label}
                </span>
              </button>
            );
          }
          return (
            <Link
              key={index}
              to={icon.link!}
              className="flex items-center space-x-2 px-2 py-2 hover:bg-red-50 rounded transition group relative"
              title={icon.label}
            >
              <img
                src={icon.src}
                alt={icon.alt}
                className="w-10 h-10 object-contain"
              />
              <span 
                className="text-xs font-extrabold whitespace-nowrap opacity-100 transition-all duration-200 ml-1 px-2 py-1 rounded"
                style={{ 
                  color: '#7f1d1d',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(127, 29, 29, 0.2)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
              >
                {icon.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingIconBar;

