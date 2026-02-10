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

