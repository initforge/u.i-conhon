import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <>
      {/* HÌNH ẢNH VÀ VIDEO THAM KHẢO Section */}
      <section id="hinh-anh-video" className="bg-gradient-to-r from-tet-red-800 to-tet-red-900 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              HÌNH ẢNH VÀ VIDEO THAM KHẢO
            </h3>
            <div className="w-20 h-1 bg-yellow-400 mx-auto rounded"></div>
            <p className="text-red-200 mt-3 text-sm">Khám phá thêm về trò chơi Cổ Nhơn qua hình ảnh và video</p>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div className="flex gap-4 animate-scroll-left">
              {/* Media Items - Real Images */}
              {[
                { img: '/assets/gallery/1_hoi_tu.png', title: 'Hội tụ ngày Tết', desc: 'Người dân quây quần dịp lễ hội' },
                { img: '/assets/gallery/2_cau_thai.png', title: 'Đọc Câu Thai', desc: 'Nghệ nhân giải thích câu thai' },
                { img: '/assets/gallery/3_cay_neu.png', title: 'Cây Nêu Cổ Nhơn', desc: 'Hộp bí mật treo trên cây nêu' },
                { img: '/assets/gallery/4_mua_tich.png', title: 'Mua Tịch', desc: 'Người chơi đặt cược tại quầy' },
                { img: '/assets/gallery/5_con_vat.png', title: '36 Con Đề', desc: 'Bảng danh vật truyền thống' },
                { img: '/assets/gallery/6_xo_thuong.png', title: 'Giây Phút Xổ Thưởng', desc: 'Niềm vui chiến thắng' },
              ].map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-64 md:w-80">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                { img: '/assets/gallery/1_hoi_tu.png', title: 'Hội tụ ngày Tết', desc: 'Người dân quây quần dịp lễ hội' },
                { img: '/assets/gallery/2_cau_thai.png', title: 'Đọc Câu Thai', desc: 'Nghệ nhân giải thích câu thai' },
                { img: '/assets/gallery/3_cay_neu.png', title: 'Cây Nêu Cổ Nhơn', desc: 'Hộp bí mật treo trên cây nêu' },
                { img: '/assets/gallery/4_mua_tich.png', title: 'Mua Tịch', desc: 'Người chơi đặt cược tại quầy' },
                { img: '/assets/gallery/5_con_vat.png', title: '36 Con Đề', desc: 'Bảng danh vật truyền thống' },
                { img: '/assets/gallery/6_xo_thuong.png', title: 'Giây Phút Xổ Thưởng', desc: 'Niềm vui chiến thắng' },
              ].map((item, idx) => (
                <div key={`dup-${idx}`} className="flex-shrink-0 w-64 md:w-80">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                Trò chơi dân gian truyền thống của vùng Hoài Nhơn An Nhơn, Bình Định
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
              <div className="flex flex-col space-y-2">
                <a
                  href="https://www.facebook.com/profile.php?id=100063753948498"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-200 hover:text-white transition flex items-center space-x-2"
                >
                  <img src="/assets/icons/ico_facebook.svg" alt="Facebook" className="w-5 h-5" />
                  <span className="text-sm">Trang Cổ Nhơn An Nhơn Bình Định</span>
                </a>
                <a
                  href="https://www.facebook.com/groups/1579571855393409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-200 hover:text-white transition flex items-center space-x-2"
                >
                  <img src="/assets/icons/ico_facebook.svg" alt="Facebook" className="w-5 h-5" />
                  <span className="text-sm">Nhóm Cổ Nhơn An Nhơn Bình Định</span>
                </a>
                <a
                  href="https://www.facebook.com/ngoctuan.nguyen.5209/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-200 hover:text-white transition flex items-center space-x-2"
                >
                  <img src="/assets/icons/ico_facebook.svg" alt="Facebook" className="w-5 h-5" />
                  <span className="text-sm">Cậu Ba Họ Nguyễn</span>
                </a>
                <a
                  href="https://www.youtube.com/@caubahonguyenxunau3140"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-200 hover:text-white transition flex items-center space-x-2"
                >
                  <img src="/assets/icons/ico_twitter.svg" alt="YouTube" className="w-5 h-5" />
                  <span className="text-sm">YouTube Cậu Ba Họ Nguyễn Xứ Nẫu</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-red-700 mt-8 pt-4 text-center text-sm text-red-200">
            <p>&copy; 2026 Cổ Nhơn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
