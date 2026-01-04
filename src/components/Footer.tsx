import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="text-white relative mt-auto" style={{ backgroundColor: '#8b1e1e' }}>
      {/* Footer decoration */}
      <img 
        src="/assets/decorations/img-after-footer.png" 
        alt="" 
        className="absolute right-0 top-0 h-full object-contain opacity-60 pointer-events-none"
        style={{ maxHeight: '150px' }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="text-center md:text-left">
            <h3 className="footer-title mb-4" style={{ color: '#333333' }}>Về Cổ Nhơn</h3>
            <p className="text-sm text-red-200">
              Trò chơi dân gian truyền thống của vùng Hoài Nhơn, Bình Định
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="footer-title mb-4" style={{ color: '#333333' }}>Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-red-200 hover:text-white transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/huong-dan" className="text-red-200 hover:text-white transition">
                  Hướng dẫn
                </Link>
              </li>
              <li>
                <Link to="/ket-qua" className="text-red-200 hover:text-white transition">
                  Kết quả
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="text-red-200 hover:text-white transition">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="footer-title mb-4" style={{ color: '#333333' }}>Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <img src="/assets/icons/ico_phone_footer.svg" alt="Phone" className="w-4 h-4" />
                <a 
                  href="tel:0332697909" 
                  className="text-red-200 hover:text-white transition"
                >
                  0332697909
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <img src="/assets/icons/ico_email_footer.svg" alt="Email" className="w-4 h-4" />
                <a 
                  href="https://zalo.me/0332697909" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-200 hover:text-white transition"
                >
                  Zalo: 0332697909
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-left">
            <h3 className="footer-title mb-4" style={{ color: '#333333' }}>Mạng xã hội</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a 
                href="https://facebook.com/conhon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-200 hover:text-white transition"
              >
                <img src="/assets/icons/ico_facebook.svg" alt="Facebook" className="w-6 h-6" />
              </a>
              <a 
                href="https://instagram.com/conhon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-200 hover:text-white transition"
              >
                <img src="/assets/icons/ico_instagram.svg" alt="Instagram" className="w-6 h-6" />
              </a>
              <a 
                href="https://youtube.com/@caubahonguyen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-200 hover:text-white transition"
              >
                <img src="/assets/icons/ico_twitter.svg" alt="YouTube" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-red-700 mt-8 pt-4 text-center text-sm text-red-200">
          <p>&copy; 2026 Cổ Nhơn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

