import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header className="relative z-50 w-full">
      {/* Red Banner Header - Màu đỏ đô */}
      <div className="relative w-full overflow-hidden" style={{ backgroundColor: '#7f1d1d' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        <div className="container mx-auto px-4 py-3 relative z-10 max-w-full">
          <div className="flex items-center justify-end">
            {/* Right: Icons */}
            <div className="flex items-center space-x-4 z-10">
              {/* User Icon */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-1 text-white hover:text-yellow-200 transition"
                  >
                    <img
                      src="/assets/icons/ico_user.svg"
                      alt="User"
                      className="w-6 h-6"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                    <img
                      src="/assets/icons/ico_arrow_down.svg"
                      alt="Dropdown"
                      className="w-4 h-4"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-[9999]">
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-red-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/tai-khoan"
                        className="block px-4 py-2 text-gray-700 hover:bg-red-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Tài khoản
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/dang-nhap"
                  className="text-white hover:text-yellow-200 transition flex items-center space-x-1"
                >
                  <img
                    src="/assets/icons/ico_user.svg"
                    alt="Login"
                    className="w-6 h-6"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </Link>
              )}

              {/* Cart Icon */}
              {isAuthenticated && (
                <Link to="/gio-hang" className="relative text-white hover:text-yellow-200 transition">
                  <img
                    src="/assets/icons/ico_cart.svg"
                    alt="Cart"
                    className="w-6 h-6"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-tet-red-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden text-white"
              >
                <img
                  src="/assets/icons/ico_menu.svg"
                  alt="Menu"
                  className="w-6 h-6"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;

