import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HuongDanPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'intro' | 'rules'>('intro');

  // Scroll to top khi vào trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {!showDetails ? (
          /* Initial View - Concept như ảnh 5 */
          <div className="text-center">
            <div className="bg-gradient-to-br from-tet-red-50 to-red-100 rounded-2xl p-12 mb-8 shadow-lg">
              <h1 className="section-title text-tet-red-800 mb-6">
                Hướng dẫn
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Khám phá cách chơi trò chơi dân gian Cổ Nhơn truyền thống
              </p>
              <button
                onClick={() => setShowDetails(true)}
                className="btn-primary text-lg px-8 py-4"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ) : (
          /* Detailed View - Tabbed Interface */
          <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-4 border-b-2 border-tet-red-200">
              <button
                onClick={() => setActiveTab('intro')}
                className={`px-6 py-3 font-bold text-lg transition-all ${activeTab === 'intro'
                  ? 'text-tet-red-700 border-b-4 border-tet-red-700 -mb-0.5'
                  : 'text-gray-500 hover:text-tet-red-600'
                  }`}
              >
                Giới thiệu & Hướng dẫn
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-6 py-3 font-bold text-lg transition-all ${activeTab === 'rules'
                  ? 'text-tet-red-700 border-b-4 border-tet-red-700 -mb-0.5'
                  : 'text-gray-500 hover:text-tet-red-600'
                  }`}
              >
                Luật chơi
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'intro' ? (
              <div className="space-y-12">
                {/* Phần 1: Giới thiệu & hướng dẫn chơi Cổ Nhơn Online */}
                <section className="card">
                  <h2 className="section-title text-tet-red-800 mb-6 text-3xl">
                    Giới thiệu & hướng dẫn chơi Cổ Nhơn Online
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      <strong>Cổ Nhơn</strong> là trò chơi dân gian độc đáo của thị xã Hoài Nhơn và An Nhơn, thường tổ chức vào dịp Tết Nguyên đán.
                      Người chơi suy luận từ 4 câu thơ lục bát (câu thai) để đoán đáp án.
                      <strong>Thai Hoài Nhơn có 36 con vật</strong>, trong khi <strong>Thai An Nhơn và Nhơn Phong có 40 con vật</strong>.
                      Hộp gỗ chứa đáp án được treo trên cây nêu cao hơn 5m, tạo không khí hồi hộp và thú vị.
                    </p>
                    <p>
                      Trò chơi kết hợp trí tuệ và giải trí, với phần thưởng hấp dẫn tỷ lệ 1 đổi 30, mang lại niềm vui và ý nghĩa trong những ngày đầu xuân,
                      đồng thời giữ gìn bản sắc văn hóa truyền thống.
                    </p>
                  </div>
                </section>

                {/* Hướng dẫn tham gia online */}
                <section className="card">
                  <h2 className="section-title text-tet-red-800 mb-6 text-3xl">
                    Hướng dẫn tham gia online
                  </h2>

                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-tet-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                        1
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Đăng nhập</h3>
                        <p className="text-gray-700 mb-4">
                          Đăng nhập vào hệ thống bằng số điện thoại và mật khẩu của bạn.
                          Nếu chưa có tài khoản, bạn có thể đăng ký mới.
                        </p>
                        <Link to="/dang-nhap" className="text-tet-red-600 hover:underline">
                          Đi đến trang đăng nhập →
                        </Link>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-tet-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                        2
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Hoàn thành nhiệm vụ mạng xã hội</h3>
                        <p className="text-gray-700 mb-4">
                          Để có thể mua con vật, bạn cần hoàn thành các nhiệm vụ bắt buộc:
                        </p>
                        <ul className="space-y-3 text-gray-700 mb-4">
                          <li>
                            <a
                              href="https://www.facebook.com/profile.php?id=100064448272306"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              📘 Theo dõi Fanpage Cổ Nhơn An Nhơn Bình Định
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.facebook.com/groups/conhonannhon"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              👥 Tham gia nhóm Cổ Nhơn An Nhơn Bình Định
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://zalo.me/0332697909"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              💬 Kết bạn Cậu Ba Họ Nguyễn (Zalo)
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.youtube.com/@cau3honguyen"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:underline"
                            >
                              ▶️ Đăng ký YouTube Cậu 3 Họ Nguyễn
                            </a>
                          </li>
                        </ul>
                        <p className="text-sm text-gray-600 italic">
                          Chỉ khi hoàn thành tất cả nhiệm vụ, bạn mới có thể mua con vật.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-tet-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                        3
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Chọn Thai</h3>
                        <p className="text-gray-700 mb-4">
                          Chọn một trong 3 Thai để tham gia:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                          <li><strong>Thai An Nhơn:</strong> Đóng tịch 10:30, 16:30 (Tết thêm 20:30)</li>
                          <li><strong>Thai Nhơn Phong:</strong> Đóng tịch 10:30, 16:30 (Tết thêm 20:30)</li>
                          <li><strong>Thai Hoài Nhơn:</strong> Đóng tịch 12:30, 18:30 (không có tối)</li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-tet-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                        4
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Chọn con vật và thanh toán</h3>
                        <p className="text-gray-700 mb-4">
                          Sau khi chọn Thai, bạn có thể:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                          <li><strong>Thai An Nhơn:</strong> Xem danh sách 40 con vật</li>
                          <li><strong>Thai Nhơn Phong:</strong> Xem danh sách 40 con vật</li>
                          <li><strong>Thai Hoài Nhơn:</strong> Xem danh sách 36 con vật</li>
                          <li>Thêm con vật vào giỏ hàng</li>
                          <li>Kiểm tra giỏ hàng và thanh toán</li>
                          <li>Nhận hóa đơn với câu thai tương ứng</li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-tet-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                        5
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Chụp ảnh chuyển khoản và hóa đơn mua hàng</h3>
                        <p className="text-gray-700 mb-4">
                          Sau khi có kết quả xổ, vui lòng:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                          <li>Chụp ảnh chuyển khoản</li>
                          <li>Chụp hóa đơn mua hàng</li>
                          <li>Gửi ảnh chuyển khoản và hóa đơn mua hàng qua Zalo: <strong className="text-tet-red-700">0332697909</strong></li>
                          <li>Chờ xác nhận và nhận thưởng</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              /* Tab 2: Luật chơi với golden frame design */
              <div className="space-y-8">
                {/* Golden Frame Section */}
                <div className="relative p-8">
                  {/* Outer decorative border */}
                  <div className="absolute inset-0 border-2 border-red-200 rounded-lg"></div>

                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-24 h-24" style={{
                    backgroundImage: 'url(/assets/decorations/factory_bg_1.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top left',
                  }}></div>
                  <div className="absolute top-0 right-0 w-24 h-24" style={{
                    backgroundImage: 'url(/assets/decorations/factory_bg_1.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top right',
                    transform: 'scaleX(-1)',
                  }}></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24" style={{
                    backgroundImage: 'url(/assets/decorations/factory_bg_1.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom left',
                    transform: 'scaleY(-1)',
                  }}></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24" style={{
                    backgroundImage: 'url(/assets/decorations/factory_bg_1.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom right',
                    transform: 'scale(-1)',
                  }}></div>

                  {/* Inner content with soft red background */}
                  <div className="relative bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-lg p-8 mx-8 my-8">
                    <h2 className="section-title text-tet-red-800 mb-8 text-3xl text-center">
                      Luật chơi và cách tham gia
                    </h2>

                    <div className="space-y-6 text-gray-800">
                      {/* Câu thai */}
                      <div>
                        <h3 className="text-xl font-bold text-tet-red-700 mb-3">
                          Câu thai (đề đố):
                        </h3>
                        <p className="leading-relaxed">
                          Câu thai gồm 4 câu thơ lục bát, được sáng tác dựa trên các chủ đề như lịch sử, văn hóa, danh lam thắng cảnh, con người, hoặc thiên nhiên.
                          Nội dung câu thơ chứa các manh mối để người chơi suy luận và tìm ra con vật chính xác.
                        </p>
                      </div>

                      {/* Quy trình chơi */}
                      <div>
                        <h3 className="text-xl font-bold text-tet-red-700 mb-4">
                          Quy trình chơi:
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-tet-red-600 text-white rounded-full flex items-center justify-center font-bold">
                              1
                            </div>
                            <div>
                              <p className="font-semibold mb-1">Ra đề:</p>
                              <p>
                                Ban tổ chức công bố câu thai và treo hộp gỗ chứa đáp án lên cây nêu tại quảng trường trung tâm thị xã.
                                Ban tổ chức đã công bố bộ đề 40 câu thai Cổ Nhơn xuân Ất Tỵ 2025
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-tet-red-600 text-white rounded-full flex items-center justify-center font-bold">
                              2
                            </div>
                            <div>
                              <p className="font-semibold mb-1">Suy luận:</p>
                              <p>
                                Người chơi dựa vào nội dung câu thai để tìm đáp án.
                                <strong> Thai Hoài Nhơn: 36 con vật. Thai An Nhơn và Nhơn Phong: 40 con vật.</strong>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-tet-red-600 text-white rounded-full flex items-center justify-center font-bold">
                              3
                            </div>
                            <div>
                              <p className="font-semibold mb-1">Đặt cược:</p>
                              <p>
                                Người chơi lựa chọn đáp án và đặt cược. Mức cược tùy thuộc vào từng người chơi, có thể từ vài nghìn đồng đến hàng triệu đồng.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-tet-red-600 text-white rounded-full flex items-center justify-center font-bold">
                              4
                            </div>
                            <div>
                              <p className="font-semibold mb-1">Công bố kết quả:</p>
                              <p>
                                Cuối mỗi lượt chơi (vào buổi sáng và buổi chiều), Ban tổ chức mở hộp gỗ, công bố đáp án.
                                Người chơi trả lời đúng sẽ nhận được phần thưởng theo tỷ lệ 1 đồng đổi 30 đồng.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => setShowDetails(false)}
                className="btn-secondary"
              >
                Thu gọn
              </button>
              {isAuthenticated ? (
                <Link to="/chon-thai" className="btn-primary text-lg px-8 py-4">
                  Bắt đầu chơi ngay
                </Link>
              ) : (
                <Link to="/dang-nhap" className="btn-primary text-lg px-8 py-4">
                  Đăng nhập để chơi
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HuongDanPage;
