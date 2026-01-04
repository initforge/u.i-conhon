import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingIconBar from '../components/FloatingIconBar';
import BottomNavBar from '../components/BottomNavBar';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Decorative elements - outside header, at top corners, fixed at top of page, highest z-index */}
      {/* Mobile: 100px (1/2), Desktop: 200px */}
      <div className="fixed top-0 left-0 opacity-90 pointer-events-none md:h-[200px] h-[100px] w-auto" style={{ zIndex: 9999 }}>
        <img
          src="/assets/decorations/img-before-head.png"
          alt=""
          className="h-full w-auto object-contain"
        />
      </div>
      <div className="fixed top-0 right-0 opacity-90 pointer-events-none md:h-[200px] h-[100px] w-auto" style={{ zIndex: 40 }}>
        <img
          src="/assets/decorations/img-after-head.png"
          alt=""
          className="h-full w-auto object-contain"
        />
      </div>
      {/* Cloud decorations - Đậm ở cạnh bên, mờ ở giữa */}

      {/* Cạnh trái - Đậm và rõ */}
      <img
        src="/assets/decorations/cloud.png"
        alt=""
        className="tet-cloud left-0 top-20 w-40 md:w-56 opacity-60"
        style={{ animationDelay: '0s' }}
      />
      <img
        src="/assets/decorations/cloud-3.png"
        alt=""
        className="tet-cloud left-0 top-1/2 w-36 md:w-48 opacity-50"
        style={{ animationDelay: '3s', transform: 'translateY(-50%)' }}
      />
      <img
        src="/assets/decorations/cloud-4.png"
        alt=""
        className="tet-cloud left-0 bottom-20 w-32 md:w-44 opacity-55"
        style={{ animationDelay: '6s' }}
      />

      {/* Cạnh phải - Đậm và rõ */}
      <img
        src="/assets/decorations/cloud-5.png"
        alt=""
        className="tet-cloud right-0 top-32 w-40 md:w-56 opacity-60"
        style={{ animationDelay: '1.5s' }}
      />
      <img
        src="/assets/decorations/cloud.png"
        alt=""
        className="tet-cloud right-0 top-1/2 w-36 md:w-48 opacity-50"
        style={{ animationDelay: '4.5s', transform: 'translateY(-50%)' }}
      />
      <img
        src="/assets/decorations/cloud-3.png"
        alt=""
        className="tet-cloud right-0 bottom-32 w-32 md:w-44 opacity-55"
        style={{ animationDelay: '7.5s' }}
      />

      {/* Giữa trang - Mờ */}
      <img
        src="/assets/decorations/cloud-4.png"
        alt=""
        className="tet-cloud left-1/2 top-40 w-28 md:w-36 opacity-15"
        style={{ animationDelay: '2s', transform: 'translateX(-50%)' }}
      />
      <img
        src="/assets/decorations/cloud-5.png"
        alt=""
        className="tet-cloud left-1/2 top-1/2 w-24 md:w-32 opacity-12"
        style={{ animationDelay: '5s', transform: 'translate(-50%, -50%)' }}
      />
      <img
        src="/assets/decorations/cloud.png"
        alt=""
        className="tet-cloud left-1/2 bottom-40 w-28 md:w-36 opacity-15"
        style={{ animationDelay: '8s', transform: 'translateX(-50%)' }}
      />

      {/* Thêm mây ở các vị trí khác để trải đều */}
      <img
        src="/assets/decorations/cloud-3.png"
        alt=""
        className="tet-cloud left-1/4 top-60 w-24 md:w-32 opacity-20"
        style={{ animationDelay: '3.5s' }}
      />
      <img
        src="/assets/decorations/cloud-4.png"
        alt=""
        className="tet-cloud right-1/4 top-80 w-24 md:w-32 opacity-20"
        style={{ animationDelay: '6.5s' }}
      />

      <Header />
      <main className="flex-1 relative z-10 pb-16 md:pb-0">
        {children || <Outlet />}
      </main>
      <Footer />
      <FloatingIconBar />
      <BottomNavBar />
    </div>
  );
};

export default MainLayout;

