import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GAME_CONFIG } from '../constants/gameConfig';
import { getCurrentYear, getAvailableYears } from '../utils/yearUtils';

const HomePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedGroup, setSelectedGroup] = useState('tất-cả');
  const [selectedThai, setSelectedThai] = useState('an-nhon');
  const [currentCauThaiIndex, setCurrentCauThaiIndex] = useState(0);

  // Mock data câu thai - sắp xếp mới nhất trước
  const cauThaiData = [
    {
      id: 1,
      session: 'CHIỀU mùng 9 TẾT ẤT TỴ 2025',
      date: '06-02-2025',
      lines: [
        'Trinh Nương nức tiếng trăm miền',
        'Tượng binh xuất trận đảo điên quân thù',
        'Tùng Sơn nắng quyện mây trời',
        'Dấu chân Bà Triệu rạng ngời sử xanh'
      ],
      result: 'Voi (13)'
    },
    {
      id: 2,
      session: 'SÁNG mùng 9 TẾT ẤT TỴ 2025',
      date: '06-02-2025',
      lines: [
        'Xuân về hoa nở đầy vườn',
        'Con ong chăm chỉ bay vòng hút mật',
        'Bốn mùa không nghỉ không ngơi',
        'Ấm no làng xóm vui tươi tháng năm'
      ],
      result: 'Ong (16)'
    },
    {
      id: 3,
      session: 'CHIỀU mùng 8 TẾT ẤT TỴ 2025',
      date: '05-02-2025',
      lines: [
        'Rồng bay phượng múa trời xanh',
        'Vua Hùng dựng nước đất lành muôn phương',
        'Lạc Long Quân với Âu Cơ',
        'Trăm con về biển về rừng chia ly'
      ],
      result: 'Rồng Bay (10)'
    },
    {
      id: 4,
      session: 'SÁNG mùng 8 TẾT ẤT TỴ 2025',
      date: '05-02-2025',
      lines: [
        'Trăng tròn soi sáng đêm trường',
        'Thỏ ngọc giã thuốc mười phương vọng về',
        'Nhân gian nhàn hạ êm đềm',
        'Cầu cho mưa thuận gió hòa tốt tươi'
      ],
      result: 'Thỏ (8)'
    }
  ];

  // Filter câu thai theo năm
  const selectedCauThaiYear = selectedYear;
  const filteredCauThaiData = cauThaiData.filter(cau => cau.date.includes(selectedCauThaiYear.toString()));
  const currentCauThai = filteredCauThaiData[currentCauThaiIndex] || null;
  const canGoPrev = currentCauThaiIndex > 0;
  const canGoNext = currentCauThaiIndex < filteredCauThaiData.length - 1;

  // Animal groups from HTML
  const animalGroups = [
    { id: 'tất-cả', name: 'Tất cả' },
    { id: 'tứ-trạng-nguyên', name: 'Tứ trạng nguyên' },
    { id: 'ngũ-hổ-tướng', name: 'Ngũ hổ tướng' },
    { id: 'thất-sinh-lý', name: 'Thất sinh lý' },
    { id: 'nhị-đạo-sĩ', name: 'Nhị đạo sĩ' },
    { id: 'tứ-mỹ-nữ', name: 'Tứ mỹ nữ' },
    { id: 'tứ-hảo-mạng', name: 'Tứ hảo mạng' },
    { id: 'tứ-hòa-thượng', name: 'Tứ hòa thượng' },
    { id: 'ngũ-khất-thực', name: 'Ngũ khất thực' },
    { id: 'nhất-ni-cô', name: 'Nhất ni cô' },
    { id: 'tứ-thần-linh', name: 'Tứ thần linh' },
  ];

  // Mapping groups to animal orders based on images
  const groupToAnimalOrders: { [key: string]: number[] } = {
    'tất-cả': Array.from({ length: 40 }, (_, i) => i + 1), // All 40 animals
    'tứ-trạng-nguyên': [1, 2, 3, 4], // Cá Trắng, Ốc, Ngỗng, Công
    'ngũ-hổ-tướng': [5, 6, 7, 8, 9], // Trùn, Cọp, Heo, Thỏ, Trâu
    'thất-sinh-lý': [10, 11, 12, 13, 14, 15, 16], // Rồng Bay, Chó, Ngựa, Voi, Mèo, Chuột, Ong
    'nhị-đạo-sĩ': [17, 18], // Hạc, Kỳ Lân
    'tứ-mỹ-nữ': [19, 20, 21, 22], // Bướm, Hòn Núi, Én, Bồ Câu
    'tứ-hảo-mạng': [23, 24, 25, 26], // Khỉ, Ếch, Quạ, Rồng Nằm
    'tứ-hòa-thượng': [27, 28, 29, 30], // Rùa, Gà, Lươn, Cá Đỏ
    'ngũ-khất-thực': [31, 32, 33, 34, 35], // Tôm, Rắn, Nhện, Nai, Dê
    'nhất-ni-cô': [36], // Yêu
    'tứ-thần-linh': [37, 38, 39, 40], // Ông Trời, Ông Địa, Thần Tài, Ông Táo
  };

  // Results data by year
  const resultsByYear: { [key: number]: Array<{ day: string; morning: string; afternoon: string }> } = {
    2025: [
      { day: 'Mùng 1', morning: 'CON HẠC', afternoon: 'CON YÊU' },
      { day: 'Mùng 2', morning: 'CON CỌP', afternoon: 'CON NGỖNG' },
      { day: 'Mùng 3', morning: 'CON DÊ', afternoon: 'CON YÊU' },
      { day: 'Mùng 4', morning: 'CON NGỖNG', afternoon: 'CON KHỈ' },
      { day: 'Mùng 5', morning: 'CON ỐC', afternoon: 'CON MÈO' },
      { day: 'Mùng 6', morning: 'RỒNG BAY', afternoon: 'KỲ LÂN' },
      { day: 'Mùng 7', morning: 'CON QUẠ', afternoon: 'CON NGỖNG' },
      { day: 'Mùng 8', morning: 'RỒNG NẰM', afternoon: 'CON NHỆN' },
      { day: 'Mùng 9', morning: 'CON ỐC', afternoon: 'CON ẾCH' },
    ],
    2024: [
      { day: '30 Tết', morning: 'HỔ', afternoon: 'TÔM' },
      { day: 'Mùng 1', morning: 'ẾCH', afternoon: 'NHỆN' },
      { day: 'Mùng 2', morning: 'RÙA', afternoon: 'CỌP' },
      { day: 'Mùng 3', morning: 'NGỰA', afternoon: 'TÔM' },
      { day: 'Mùng 4', morning: 'KỲ LÂN', afternoon: 'HÒN ĐÁ' },
      { day: 'Mùng 5', morning: 'ÉN', afternoon: 'ỐC' },
      { day: 'Mùng 6', morning: 'RẮN', afternoon: 'CON CÔNG' },
      { day: 'Mùng 7', morning: 'NGỰA', afternoon: 'TÔM' },
      { day: 'Mùng 8', morning: 'RỒNG BAY', afternoon: 'RẮN' },
    ],
    2023: [
      { day: 'Mùng 1', morning: 'ÉN', afternoon: 'NHỆN' },
      { day: 'Mùng 2', morning: 'CHÓ', afternoon: 'VOI' },
      { day: 'Mùng 3', morning: 'RÙA', afternoon: 'TRÂU' },
      { day: 'Mùng 4', morning: 'CON CU', afternoon: 'HÒN ĐÁ' },
      { day: 'Mùng 5', morning: 'CON CU', afternoon: 'CỌP' },
      { day: 'Mùng 6', morning: 'GÀ', afternoon: 'CÁ TRẮNG' },
      { day: 'Mùng 7', morning: 'CON YÊU', afternoon: 'VOI' },
      { day: 'Mùng 8', morning: 'CÁ TRẮNG', afternoon: 'NHỆN' },
      { day: 'Mùng 9', morning: 'CHÓ', afternoon: 'CON CU' },
    ],
    2022: [
      { day: 'Mùng 1', morning: 'ÉN', afternoon: 'NHỆN' },
      { day: 'Mùng 2', morning: 'CHÓ', afternoon: 'VOI' },
      { day: 'Mùng 3', morning: 'RÙA', afternoon: 'TRÂU' },
      { day: 'Mùng 4', morning: 'CON CU', afternoon: 'HÒN ĐÁ' },
      { day: 'Mùng 5', morning: 'CON CU', afternoon: 'CỌP' },
      { day: 'Mùng 6', morning: 'GÀ', afternoon: 'CÁ TRẮNG' },
      { day: 'Mùng 7', morning: 'CON YÊU', afternoon: 'VOI' },
      { day: 'Mùng 8', morning: 'CÁ TRẮNG', afternoon: 'NHỆN' },
      { day: 'Mùng 9', morning: 'CHÓ', afternoon: 'CON CU' },
    ],
  };

  // Get results for selected year - fallback to current year or most recent available
  const mockResults = resultsByYear[selectedYear] || resultsByYear[getCurrentYear()] || resultsByYear[2025];

  // Animal names with their order and "thế thân" numbers from HTML
  const animalData = [
    { order: 1, name: 'Cá Trắng', alias: 'Chiếm Khôi', theThan: '05' },
    { order: 2, name: 'Ốc', alias: 'Bản Quế', theThan: '16' },
    { order: 3, name: 'Ngỗng', alias: 'Vinh Sanh', theThan: '32' },
    { order: 4, name: 'Công', alias: 'Phùng Xuân', theThan: '12' },
    { order: 5, name: 'Trùn', alias: 'Chí Cao', theThan: '01' },
    { order: 6, name: 'Cọp', alias: 'Khôn Sơn', theThan: '17' },
    { order: 7, name: 'Heo', alias: 'Chánh Thuận', theThan: '24' },
    { order: 8, name: 'Thỏ', alias: 'Nguyệt Bửu', theThan: '20' },
    { order: 9, name: 'Trâu', alias: 'Hớn Vân', theThan: '33' },
    { order: 10, name: 'Rồng Bay', alias: 'Giang Từ', theThan: '18' },
    { order: 11, name: 'Chó', alias: 'Phước Tôn', theThan: '15' },
    { order: 12, name: 'Ngựa', alias: 'Quang Minh', theThan: '04' },
    { order: 13, name: 'Voi', alias: 'Hữu Tài', theThan: '14' },
    { order: 14, name: 'Mèo', alias: 'Chỉ Đắc', theThan: '13' },
    { order: 15, name: 'Chuột', alias: 'Tất Khắc', theThan: '11' },
    { order: 16, name: 'Ong', alias: 'Mậu Lâm', theThan: '02' },
    { order: 17, name: 'Hạc', alias: 'Trọng Tiên', theThan: '06' },
    { order: 18, name: 'Kỳ Lân', alias: 'Thiên Thân', theThan: '10' },
    { order: 19, name: 'Bướm', alias: 'Cấn Ngọc', theThan: '27' },
    { order: 20, name: 'Hòn Núi', alias: 'Trân Châu', theThan: '08' },
    { order: 21, name: 'Én', alias: 'Thượng Chiêu', theThan: '22' },
    { order: 22, name: 'Bồ Câu', alias: 'Song Đồng', theThan: '21' },
    { order: 23, name: 'Khỉ', alias: 'Tam Hòe', theThan: '30' },
    { order: 24, name: 'Ếch', alias: 'Hiệp Hải', theThan: '07' },
    { order: 25, name: 'Quạ', alias: 'Cửu Quan', theThan: '35' },
    { order: 26, name: 'Rồng Nằm', alias: 'Thái Bình', theThan: '31' },
    { order: 27, name: 'Rùa', alias: 'Hỏa Diệm', theThan: '19' },
    { order: 28, name: 'Gà', alias: 'Nhựt Thăng', theThan: '29' },
    { order: 29, name: 'Lươn', alias: 'Địa Lươn', theThan: '28' },
    { order: 30, name: 'Cá Đỏ', alias: 'Tỉnh Lợi', theThan: '23' },
    { order: 31, name: 'Tôm', alias: 'Trường Thọ', theThan: '26' },
    { order: 32, name: 'Rắn', alias: 'Vạn Kim', theThan: '03' },
    { order: 33, name: 'Nhện', alias: 'Thanh Tuyền', theThan: '09' },
    { order: 34, name: 'Nai', alias: 'Nguyên Cát', theThan: '36' },
    { order: 35, name: 'Dê', alias: 'Nhứt Phẩm', theThan: '25' },
    { order: 36, name: 'Bà Vãi', alias: 'An Sĩ', theThan: '34' },
    // Tứ Thần Linh (37-40)
    { order: 37, name: 'Ông Trời', alias: 'Thiên Quan', theThan: '37' },
    { order: 38, name: 'Ông Địa', alias: 'Địa Chủ', theThan: '38' },
    { order: 39, name: 'Thần Tài', alias: 'Tài Thần', theThan: '39' },
    { order: 40, name: 'Ông Táo', alias: 'Táo Quân', theThan: '40' },
  ];

  return (
    <div className="relative">
      {/* Section 1: Giới thiệu */}
      <section className="section gioi-thieu relative" style={{ backgroundColor: 'rgb(243, 239, 236)', paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="section-content relative">
          <div className="container mx-auto px-4">
            {/* Logo and Title */}
            <div className="text-center mb-8 md:mb-12">
              <img
                src="/assets/logo-moi.jpg"
                alt="Cổ Nhơn"
                className="mx-auto mb-4 md:mb-6 rounded-lg"
                style={{ width: '15%', minWidth: '60px', maxWidth: '150px' }}
              />
              <h1 className="section-title mb-4 text-xl md:text-2xl" style={{ fontWeight: 400, color: '#B20801' }}>
                CỔ NHƠN AN NHƠN BÌNH ĐỊNH ONLINE
              </h1>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              {/* Left: Text */}
              <div className="text-center">
                <div className="mb-6">
                  <p className="font-bold mb-2" style={{ fontSize: '1.5rem', lineHeight: '1.2', color: '#b2012f' }}>
                    Tỉ lệ thưởng {GAME_CONFIG.PRIZE_RATIO_TEXT}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: '#b91c1c' }}>
                    Riêng thai Hoài Nhơn: Chí Cao (Con Trùn) chung 70
                  </p>
                </div>
                <Link
                  to="/dang-nhap"
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
                >
                  <span>{GAME_CONFIG.PLAY_BUTTON_TEXT}</span>
                  <img src="/assets/icons/ico_arrow_right.svg" alt="" className="w-5 h-5" />
                </Link>
              </div>

              {/* Right: Image */}
              <div className="relative">
                <img
                  src="/assets/player-illustration.png"
                  alt="Người chơi Cổ Nhơn vui vẻ trong dịp Tết"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Cloud decorations */}
          <div className="absolute top-0 left-0 opacity-60 pointer-events-none" style={{ width: '304px', height: '452px', zIndex: 10 }}>
            <img src="/assets/decorations/cloud.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute bottom-0 right-0 opacity-60 pointer-events-none" style={{ width: '242px', height: '454px', zIndex: 10 }}>
            <img src="/assets/decorations/cloud-5.png" alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Section Giới Thiệu */}
      <section id="gioi-thieu" className="section gioi-thieu-detail relative" style={{ backgroundColor: '#fff', paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="section-content relative">
          <div className="container mx-auto px-4">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="section-title text-3xl md:text-4xl mb-4" style={{ fontWeight: 600, color: '#B20801' }}>
                GIỚI THIỆU
              </h2>
              <div className="w-24 h-1 bg-tet-red-600 mx-auto rounded"></div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: Main Content */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-red-100 shadow-lg">
                  <h3 className="text-2xl font-bold text-tet-red-700 mb-4">
                    Cổ Nhơn - Trò chơi dân gian độc đáo ở Bình Định
                  </h3>

                  <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
                    <p>
                      Cổ Nhơn là một trò chơi trong dịp tết âm lịch của người dân Thị Xã Hoài Nhơn và Thị Xã An Nhơn (Bình Định),
                      bắt đầu vào khoảng 25 tháng chạp âm lịch kéo dài đến khoảng chiều mùng 5 tết.
                    </p>

                    <p>
                      Đến nay chưa có một tài liệu chính thống nào nói rõ nguồn gốc xuất xứ của Cổ Nhơn, chỉ biết nó đã có từ rất lâu đời,
                      được nhiều thế hệ truyền nhau. Giờ đây, Cổ Nhơn gần như đã trở thành một "món ăn" ngày tết cổ truyền đặc sắc,
                      hấp dẫn, khó có thể thiếu của người dân ở mảnh đất Hoài Nhơn và An Nhơn. 😊
                    </p>

                    <div className="bg-white rounded-lg p-4 border-l-4 border-tet-red-500">
                      <h4 className="font-bold text-tet-red-700 mb-2">🎊 Háo hức chờ... Cổ Nhơn</h4>
                      <p className="text-sm">
                        Về Hoài Nhơn và An Nhơn chừng 25 tết trở đi, mọi người không chỉ bắt đầu tất bật dọn dẹp, trang hoàng nhà cửa
                        mà còn nôn nao một tâm trạng khác. Thanh niên lập nghiệp ở tỉnh xa về quê đón tết, sau phần tay bắt mặt mừng
                        bà con hàng xóm là những cái vỗ vai "chuẩn bị Cổ Nhơn nào…". Ai cũng háo hức chờ đợi Cổ Nhơn như chờ đợi hội làng dịp tết.
                      </p>
                    </div>

                    <p>
                      Người chơi Cổ Nhơn không phân biệt tầng lớp, tuổi tác, trình độ học vấn... Hình ảnh một cậu bé hăng say lý giải
                      suy đoán của mình và một cụ ông đeo kính ngồi chiêm nghiệm, cân nhắc lựa chọn ấy đã trở nên rất quen thuộc ở nơi đây.
                      Mọi người lắng nghe, tranh luận và ghi nhận ý kiến lẫn nhau để giải đáp được trò chơi.
                    </p>

                    <p className="italic text-gray-600 text-sm">
                      Nói về lý do Cổ Nhơn thu hút đông đảo người chơi trong dịp tết, nhà nghiên cứu Lộc Xuyên Đặng Quý Địch cho biết:
                      "Giới doanh nhân thì muốn thử vận may đầu năm mới, giới trí thức thì muốn thử khả năng bàn luận, suy đoán của mình,
                      trẻ em thì xem đây là một trò chơi đông vui trong dịp đầu xuân".
                    </p>

                    <p className="text-sm">
                      Không chỉ tại những điểm chơi Cổ Nhơn mà khi đến nhà chúc tết, đi chơi, họp lớp, thậm chí ngồi vào bàn nhậu cũng bàn luận,
                      hỏi nhau í ơi về Cổ Nhơn. "Có Cổ Nhơn ngày tết rạo rực hẳn lên, không có buồn lắm mà mình cũng chẳng biết làm gì, đi đâu",
                      anh Nguyễn Ngọc Tuân 37 tuổi ở An Nhơn, bày tỏ.
                    </p>
                  </div>
                </div>

                {/* Newspaper Links */}
                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                  <h4 className="text-lg font-bold text-yellow-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📰</span> Bài báo tham khảo
                  </h4>
                  <div className="space-y-3">
                    <a href="https://baogialai.com.vn/xo-co-nhon-net-van-hoa-dan-gian-doc-dao-moi-dip-tet-den-post338363.html" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white rounded-lg border border-yellow-100 hover:border-yellow-300 transition-colors group">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                          <span>🏆</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-tet-red-700 transition-colors text-sm">Xổ Cổ Nhơn - Nét văn hóa dân gian độc đáo mỗi dịp Tết đến</p>
                          <p className="text-xs text-gray-500">Báo Gia Lai ⭐</p>
                        </div>
                      </div>
                    </a>
                    <a href="https://baogialai.com.vn/an-nhon-vui-tro-co-nhon-ngay-xuan-post430263.amp" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white rounded-lg border border-yellow-100 hover:border-yellow-300 transition-colors group">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                          <span>📄</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-tet-red-700 transition-colors text-sm">An Nhơn vui trò Cổ Nhơn ngày xuân</p>
                          <p className="text-xs text-gray-500">Báo Gia Lai</p>
                        </div>
                      </div>
                    </a>
                    <a href="https://amp.vtcnews.vn/tro-choi-dan-gian-co-nhon-mien-ky-uc-kho-quen-cua-nguoi-binh-dinh-xa-xu-ar736410.html" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white rounded-lg border border-yellow-100 hover:border-yellow-300 transition-colors group">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                          <span>📺</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-tet-red-700 transition-colors text-sm">Trò chơi dân gian Cổ Nhơn - Miền ký ức khó quên</p>
                          <p className="text-xs text-gray-500">VTC News</p>
                        </div>
                      </div>
                    </a>
                    <a href="https://thanhnien.vn/co-nhon-tro-choi-dan-gian-doc-dao-o-binh-dinh-18538143.htm" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white rounded-lg border border-yellow-100 hover:border-yellow-300 transition-colors group">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                          <span>📰</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-tet-red-700 transition-colors text-sm">Cổ Nhơn - Trò chơi dân gian độc đáo ở Bình Định</p>
                          <p className="text-xs text-gray-500">Thanh Niên</p>
                        </div>
                      </div>
                    </a>
                    <a href="https://nld.com.vn/van-hoa-choi-co-nhon-tro-choi-dan-gian-cua-nguoi-binh-dinh-196240212203658004.htm" target="_blank" rel="noopener noreferrer" className="block p-3 bg-white rounded-lg border border-yellow-100 hover:border-yellow-300 transition-colors group">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors">
                          <span>📋</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-tet-red-700 transition-colors text-sm">Chơi Cổ Nhơn - Trò chơi dân gian của người Bình Định</p>
                          <p className="text-xs text-gray-500">Người Lao Động</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: More Content */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="text-xl font-bold text-tet-red-700 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📜</span> Đi tìm gốc tích Cổ Nhơn
                  </h4>
                  <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                    <p>
                      Theo nhà nghiên cứu Đặng Quý Địch, trò chơi Cổ Nhơn đã xuất hiện khoảng thời nhà Nguyễn do du nhập từ bên ngoài.
                      Khi về Việt Nam, cụ thể là ở Hoài Nhơn và An Nhơn Bình Định, Cổ Nhơn đã phát triển, biến hóa thành một trò chơi
                      tao nhã trong dịp tết cho mọi tầng lớp người dân.
                    </p>

                    <p>
                      Tính đến nay, Cổ Nhơn Hoài Nhơn và An Nhơn tỉnh Bình Định đã truyền qua nhiều đời hội chủ,
                      nhưng chỉ khoảng 20 năm trở lại đây mới thật sự phát triển rộng rãi, lan tỏa đến từng ngóc ngách ở thôn quê.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="text-xl font-bold text-tet-red-700 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🎯</span> Tịch và con vật
                  </h4>
                  <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                    <p>
                      Tịch của trò chơi này ở Hoài Nhơn gồm có 36 con vật và ở An Nhơn gồm có 36 con vật và 4 ông thần, dùng để ghi số tiền mà người chơi mua.
                    </p>
                    <p>
                      Ở Hoài Nhơn 36 con trong bảng Cổ Nhơn được chia thành 9 nhóm: <strong>Tứ trạng nguyên:</strong> cá trắng, ốc, ngỗng, công;
                      <strong> Ngũ hổ tướng:</strong> trùn, cọp, heo, thỏ, trâu; <strong>Thất sinh lý:</strong> rồng bay, chó, ngựa, voi, mèo, chuột, ong;
                      <strong> Nhị đạo sĩ:</strong> hạc, kỳ lân; <strong>Tứ mỹ nữ:</strong> bướm, hòn đá, én, cu; <strong>Tứ hảo mạng:</strong> khỉ, ếch, quạ, rồng nằm;
                      <strong> Tứ Hòa Thượng:</strong> rùa, gà, lươn, cá đỏ; <strong>Ngũ khất thực:</strong> tôm, rắn, nhện, nai, dê; <strong>Nhất ni cô:</strong> con yêu.
                    </p>
                    <p>
                      Ở An Nhơn thêm 4 ông thần gọi là tứ thần linh gồm ông táo, ông địa, ông thần tài và ông trời.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-tet-red-700 to-tet-red-800 rounded-2xl p-6 text-white shadow-lg">
                  <h4 className="text-xl font-bold mb-4 flex items-center">
                    <span className="text-2xl mr-2">🎲</span> Cách chơi Cổ Nhơn
                  </h4>
                  <div className="space-y-3 text-red-100 text-sm">
                    <p>
                      Cứ một ngày hai lần, 6 giờ sáng và 13 giờ chiều, hội chủ sẽ chọn một trong 36 con (ở Hoài Nhơn), và 40 con (ở An Nhơn)
                      cho vào một chiếc hộp gỗ có khóa, niêm phong, rồi mang đến nơi treo đề. Hộp gỗ sẽ được treo trên ngọn cây tre (cây nêu)
                      trước sự chứng kiến của đại diện chính quyền địa phương, các cổ đông trong hội và người dân.
                    </p>
                    <p>
                      Riêng ở Thị xã An Nhơn thì đặc biệt hơn vào mồng 1, mồng 2 và mồng 3 tết thì một ngày là 3 lần hội sẽ xổ vào 11h trưa, 17h chiều và 21h tối. 😊
                    </p>
                    <p>
                      Cây nêu này cao hơn 5m thường được đặt trước sân của trụ sở chính quyền. Dưới sân lúc nào cũng có dân quân trực canh gác.
                      Đến 11 giờ trưa và 17 giờ tối, đại diện hội sẽ có người kéo hộp gỗ xuống, mở và công bố đáp án.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="text-xl font-bold text-tet-red-700 mb-4 flex items-center">
                    <span className="text-2xl mr-2">�</span> Câu thai và cách luận
                  </h4>
                  <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                    <p>
                      Mỗi đề của trò chơi này là 2 hoặc 4 câu thơ lục bát (còn gọi là câu thai). Người chơi dựa vào ý nghĩa của những câu thai đó mà luận ra đáp án.
                      Đây chính là phần sôi nổi nhất.
                    </p>
                    <p>
                      Nội dung của câu thai thường về danh lam, thắng cảnh, các chiến thắng lịch sử, câu chuyện văn học, cuộc sống đời thường,...
                      Đáp án cũng bám vào những ý đó, tuy nhiên không phải ai cũng là người chiến thắng.
                    </p>
                    <p className="italic">
                      Chưa chắc người luận hay đã thắng, cũng chưa hẳn người chọn bừa sẽ thua. Đây giống với câu nói vui, đúng nhưng không trúng.
                      Vì đã là thơ thì luận kiểu nào cũng có lý, cũng đúng nhưng để trúng (trùng) với lựa chọn của ban tổ chức thì không hề đơn giản.
                    </p>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 mt-3">
                      <p className="font-medium text-tet-red-700 mb-1">Ví dụ câu thai:</p>
                      <p className="italic text-gray-600">
                        "Thương Kiều ở chốn lầu xanh/ Yêu chàng Kim Trọng hóa thành mộng mơ/
                        Thương anh Từ Hải đợi chờ/ Trai tài gái sắc trong thơ đoạn trường."
                      </p>
                      <p className="text-sm mt-2"><strong>Đáp án:</strong> Con ngựa (Quang Minh)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <h4 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">✨</span> Sức hút văn hóa
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Người chơi Cổ Nhơn đông không phải vì tính thắng thua mà chính vì cái tao nhã, bình dị của nó, phấn khởi, rồi tiếc nuối
                    là những cảm xúc rất hay trong ngày tết. Chính sức hút của trò chơi này đã trở thành một nét văn hóa mà bất kỳ du khách nào
                    cũng phải tò mò và thích thú khi ghé đến Hoài Nhơn và An Nhơn những ngày tết.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Kết quả - Nền xanh mint nhẹ hài hòa */}
      <section id="ket-qua" className="section ket-qua relative" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)', paddingTop: '20px', paddingBottom: '20px' }}>
        {/* Lồng đèn trang trí góc trái */}
        <div className="absolute top-0 left-4 pointer-events-none" style={{ width: '60px' }}>
          <svg viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="30" y1="0" x2="30" y2="20" stroke="#b91c1c" strokeWidth="2" />
            <ellipse cx="30" cy="50" rx="25" ry="35" fill="url(#lantern1)" />
            <rect x="15" y="12" width="30" height="8" rx="2" fill="#fbbf24" />
            <rect x="15" y="80" width="30" height="8" rx="2" fill="#fbbf24" />
            <path d="M20 88 L20 100 M30 88 L30 105 M40 88 L40 100" stroke="#b91c1c" strokeWidth="2" />
            <defs>
              <linearGradient id="lantern1" x1="30" y1="15" x2="30" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Lồng đèn trang trí góc phải */}
        <div className="absolute top-0 right-4 pointer-events-none" style={{ width: '60px' }}>
          <svg viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="30" y1="0" x2="30" y2="20" stroke="#b91c1c" strokeWidth="2" />
            <ellipse cx="30" cy="50" rx="25" ry="35" fill="url(#lantern2)" />
            <rect x="15" y="12" width="30" height="8" rx="2" fill="#fbbf24" />
            <rect x="15" y="80" width="30" height="8" rx="2" fill="#fbbf24" />
            <path d="M20 88 L20 100 M30 88 L30 105 M40 88 L40 100" stroke="#b91c1c" strokeWidth="2" />
            <defs>
              <linearGradient id="lantern2" x1="30" y1="15" x2="30" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Hoa đào nhỏ rải rác */}
        <div className="absolute top-20 left-16 pointer-events-none opacity-60">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="15" r="6" fill="#fda4af" />
            <circle cx="14" cy="20" r="6" fill="#fda4af" />
            <circle cx="26" cy="20" r="6" fill="#fda4af" />
            <circle cx="16" cy="28" r="6" fill="#fda4af" />
            <circle cx="24" cy="28" r="6" fill="#fda4af" />
            <circle cx="20" cy="22" r="4" fill="#fde047" />
          </svg>
        </div>
        <div className="absolute top-32 right-20 pointer-events-none opacity-50">
          <svg width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="11" r="5" fill="#f9a8d4" />
            <circle cx="10" cy="15" r="5" fill="#f9a8d4" />
            <circle cx="20" cy="15" r="5" fill="#f9a8d4" />
            <circle cx="12" cy="21" r="5" fill="#f9a8d4" />
            <circle cx="18" cy="21" r="5" fill="#f9a8d4" />
            <circle cx="15" cy="16" r="3" fill="#fde047" />
          </svg>
        </div>

        <div className="section-content relative">
          <div className="container mx-auto px-4 py-8">
            {/* Title - Màu đỏ Tết */}
            <div className="text-center mb-8">
              <h2 className="section-title mb-2 text-4xl md:text-6xl" style={{ fontWeight: 400, color: '#b91c1c' }}>
                CÂU THAI MỚI NHẤT
              </h2>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left: Cuốn giấy đỏ phong cách Tết */}
              <div className="flex items-center justify-center">
                {/* Cuốn giấy với thanh vàng 2 đầu */}
                <div className="relative" style={{ maxWidth: '400px', width: '100%' }}>
                  {/* Thanh vàng trên */}
                  <div className="flex items-center justify-between absolute -top-4 left-0 right-0 z-10">
                    <div className="w-6 h-6 rounded-full" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}></div>
                    <div className="flex-1 h-3 mx-1" style={{ background: 'linear-gradient(180deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}></div>
                  </div>

                  {/* Nội dung cuốn giấy */}
                  <div className="relative px-6 py-8 text-center" style={{
                    background: 'linear-gradient(180deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
                    borderRadius: '4px',
                    boxShadow: '0 8px 24px rgba(153, 27, 27, 0.4), inset 0 2px 8px rgba(255,255,255,0.1)',
                    minHeight: '200px',
                  }}>
                    {/* Viền trang trí vàng */}
                    <div className="absolute inset-2 border-2 border-yellow-400/40 rounded pointer-events-none"></div>

                    <div className="relative z-10">
                      <p className="text-yellow-300 text-sm font-medium mb-2 tracking-wider">ĐANG CHỜ CẬP NHẬT</p>
                      <div className="w-16 h-0.5 bg-yellow-400/50 mx-auto mb-4"></div>
                      <p className="text-white/90 text-sm leading-relaxed mb-4" style={{ fontFamily: 'serif' }}>
                        Câu thai sẽ được admin cập nhật<br />
                        trước mỗi lần xổ
                      </p>

                      {/* Thai tabs */}
                      <div className="flex justify-center gap-2 flex-wrap">
                        {[
                          { name: 'An Nhơn', color: 'bg-green-500' },
                          { name: 'Nhơn Phong', color: 'bg-yellow-500' },
                          { name: 'Hoài Nhơn', color: 'bg-blue-500' },
                        ].map(thai => (
                          <span key={thai.name} className={`${thai.color} text-white px-3 py-1 text-xs font-medium rounded-full shadow`}>
                            {thai.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Thanh vàng dưới */}
                  <div className="flex items-center justify-between absolute -bottom-4 left-0 right-0 z-10">
                    <div className="w-6 h-6 rounded-full" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}></div>
                    <div className="flex-1 h-3 mx-1" style={{ background: 'linear-gradient(180deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}></div>
                  </div>
                </div>
              </div>

              {/* Right: Results Table */}
              <div>
                <div className="tabbed-content sec-list-tich">
                  <h4 className="section-title text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: 400, color: '#B20801' }}>Kết quả đã xổ</h4>

                  {/* Thai Tabs */}
                  <div className="flex justify-center mb-4">
                    <div className="inline-flex bg-gray-100 rounded-lg p-1">
                      {[
                        { id: 'an-nhon', name: 'Thai An Nhơn' },
                        { id: 'nhon-phong', name: 'Thai Nhơn Phong' },
                        { id: 'hoai-nhon', name: 'Thai Hoài Nhơn' },
                      ].map((thai) => (
                        <button
                          key={thai.id}
                          onClick={() => setSelectedThai(thai.id)}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedThai === thai.id
                            ? 'bg-tet-red-700 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          {thai.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year Tabs - Bọc khung đỏ với pattern - Màu giống button MUA 1 TRÚNG 30 */}
                  <div className="rounded-lg p-4 mb-6 relative overflow-hidden border-3" style={{
                    backgroundColor: '#991b1b', // Màu đỏ giống btn-primary (tet-red-800)
                    borderColor: '#b91c1c',
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    backgroundImage: `
                      radial-gradient(circle at 3px 3px, rgba(255,255,255,0.25) 1.5px, transparent 0),
                      radial-gradient(circle at 15px 15px, rgba(255,255,255,0.15) 1px, transparent 0),
                      linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.08) 75%),
                      linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%)
                    `,
                    backgroundSize: '20px 20px, 30px 30px, 12px 12px, 12px 12px',
                    backgroundPosition: '0 0, 10px 10px, 0 0, 6px 6px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.2)'
                  }}>
                    {/* Decorative lines - bất quy tắc, nhiều hơn và rõ hơn */}
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
                      <svg className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
                        <line x1="8%" y1="18%" x2="14%" y2="28%" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                        <line x1="86%" y1="23%" x2="92%" y2="33%" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                        <line x1="18%" y1="72%" x2="24%" y2="82%" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                        <line x1="76%" y1="67%" x2="82%" y2="77%" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                        <line x1="4%" y1="48%" x2="11%" y2="53%" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                        <line x1="89%" y1="52%" x2="96%" y2="57%" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                        <line x1="28%" y1="14%" x2="34%" y2="19%" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                        <line x1="66%" y1="81%" x2="72%" y2="86%" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                        <line x1="12%" y1="45%" x2="18%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                        <line x1="82%" y1="55%" x2="88%" y2="60%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                      </svg>
                    </div>
                    <div className="flex justify-center items-center gap-3 relative z-10">
                      <span className="text-white font-medium">📅 Năm:</span>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-4 py-2 bg-white text-red-700 rounded-lg font-bold cursor-pointer hover:bg-gray-100 transition-colors shadow-md"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                      >
                        {getAvailableYears(4).map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Results Table */}
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-tet-red-700">
                    <table className="w-full">
                      <thead className="bg-tet-red-900 text-white">
                        <tr>
                          <th className="px-4 py-3 text-center font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>NGÀY</th>
                          <th className="px-4 py-3 text-center font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>SÁNG</th>
                          <th className="px-4 py-3 text-center font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>CHIỀU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockResults.map((result, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}
                          >
                            <td className="px-4 py-3 text-center font-semibold" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif" }}>{result.day}</td>
                            <td className="px-4 py-3 text-center" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif" }}>{result.morning}</td>
                            <td className="px-4 py-3 text-center" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif" }}>{result.afternoon}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bambo background - removed gray placeholder */}
        </div>
      </section>

      {/* Section 3: Câu thai */}
      <section id="cau-thai" className="section cau-thai-sec relative" style={{ backgroundColor: 'rgb(243, 239, 236)', paddingTop: '30px', paddingBottom: '30px' }}>
        <div className="section-content relative">
          <div className="container mx-auto px-4">
            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="section-title text-2xl md:text-3xl" style={{ fontWeight: 400, color: '#b2012f' }}>
                CÂU THAI MỚI NHẤT
              </h2>
            </div>

            {/* Year Selector */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center bg-white rounded-lg shadow-md px-4 py-2">
                <span className="text-gray-600 font-medium mr-3">📅 Năm:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(Number(e.target.value));
                    setCurrentCauThaiIndex(0); // Reset index khi đổi năm
                  }}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg font-bold cursor-pointer hover:bg-red-800 transition-colors"
                >
                  {getAvailableYears().map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Thai Tabs for Cau Thai */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'an-nhon', name: 'Thai An Nhơn' },
                  { id: 'nhon-phong', name: 'Thai Nhơn Phong' },
                  { id: 'hoai-nhon', name: 'Thai Hoài Nhơn' },
                ].map((thai) => (
                  <button
                    key={thai.id}
                    onClick={() => setSelectedThai(thai.id)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedThai === thai.id
                      ? 'bg-tet-red-700 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {thai.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 items-center">
              {/* Left: Background Image with Text + Navigation Buttons */}
              <div className="lg:col-span-2 relative text-center">
                <div className="relative mx-auto" style={{ width: '100%', maxWidth: '600px' }}>
                  {/* Navigation Buttons */}
                  <button
                    onClick={() => setCurrentCauThaiIndex(prev => prev - 1)}
                    disabled={!canGoPrev}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all ${canGoPrev
                      ? 'bg-white/90 text-red-700 shadow-lg hover:bg-white hover:scale-110'
                      : 'bg-gray-300/50 text-gray-400 cursor-not-allowed'
                      }`}
                    style={{ left: '-15px' }}
                    title="Câu thai mới hơn"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentCauThaiIndex(prev => prev + 1)}
                    disabled={!canGoNext}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all ${canGoNext
                      ? 'bg-white/90 text-red-700 shadow-lg hover:bg-white hover:scale-110'
                      : 'bg-gray-300/50 text-gray-400 cursor-not-allowed'
                      }`}
                    style={{ right: '-15px' }}
                    title="Câu thai cũ hơn"
                  >
                    ›
                  </button>

                  <img
                    src="/assets/decorations/bg-cau-thai-co-nhon.png"
                    alt="Câu thai"
                    className="w-full h-auto object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8">
                    {currentCauThai ? (
                      <div className="text-center w-full">
                        <h6 className="uppercase text-font mb-1 text-sm md:text-base" style={{ color: '#F5E87F', fontFamily: "'Nunito', sans-serif", fontWeight: 400 }}>
                          {currentCauThai.session}
                        </h6>
                        <p className="text-base md:text-xl mb-2" style={{ color: '#fff', fontFamily: "'Nunito', sans-serif" }}>{currentCauThai.date}</p>
                        <p className="text-sm md:text-xl leading-tight" style={{ color: '#F5E87F', fontFamily: "'Nunito', sans-serif" }}>
                          {currentCauThai.lines.map((line, idx) => (
                            <React.Fragment key={idx}>
                              {line}
                              {idx < currentCauThai.lines.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </p>
                        {/* Hiển thị kết quả cho câu thai cũ */}
                        {currentCauThaiIndex > 0 && (
                          <p className="mt-2 text-sm font-bold" style={{ color: '#fef08a' }}>
                            ✅ Kết quả: {currentCauThai.result}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center w-full">
                        <p className="text-yellow-300 text-lg font-medium mb-2">📭 Chưa có câu thai</p>
                        <p className="text-white/80 text-sm">Năm {selectedYear} chưa có dữ liệu câu thai</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Indicator dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {filteredCauThaiData.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentCauThaiIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentCauThaiIndex
                        ? 'bg-red-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Countdown and Info */}
              <div className="text-center">
                <p className="mb-2" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif" }}><strong>Đóng tịch lúc</strong></p>
                <p className="text-font mb-4 text-4xl md:text-6xl" style={{ fontWeight: 500, color: '#B20801', fontFamily: "'Nunito', sans-serif" }}>17h</p>
                <p className="mb-4" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif" }}>Còn lại: <span className="font-bold" style={{ color: '#B20801', fontFamily: "'Nunito', sans-serif" }}>0 giờ 0 phút 0 giây</span></p>
                <div className="mb-4">
                  <p className="font-bold mb-1" style={{ fontSize: '1.3rem', lineHeight: 1, color: '#b2012f', fontFamily: "'Nunito', sans-serif" }}>
                    <strong>Tỉ lệ thưởng {GAME_CONFIG.PRIZE_RATIO_TEXT}</strong>
                  </p>
                  <p className="text-xs font-semibold" style={{ color: '#b91c1c', fontFamily: "'Nunito', sans-serif" }}>
                    Riêng thai Hoài Nhơn: Chí Cao (Con Trùn) chung 70
                  </p>
                </div>
                <p className="mb-4" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif" }}>
                  Ví dụ: mua <strong>{GAME_CONFIG.EXAMPLE_BET.toLocaleString('vi-VN')}đ</strong> trúng{' '}
                  <span className="font-bold" style={{ color: '#B20801', fontFamily: "'Nunito', sans-serif" }}>{GAME_CONFIG.getExamplePrize().toLocaleString('vi-VN')}đ</span>
                </p>
                <Link
                  to="/dang-nhap"
                  className="btn-primary"
                >
                  Đặt tịch
                </Link>
              </div>
            </div>
          </div>

          {/* Cloud decoration - Responsive */}
          <div className="absolute bottom-0 left-0 opacity-60 pointer-events-none hidden md:block" style={{ width: '303px', height: '591px', zIndex: 10 }}>
            <img src="/assets/decorations/cloud-3.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute bottom-0 left-0 opacity-60 pointer-events-none md:hidden" style={{ width: '150px', height: '295px', zIndex: 10 }}>
            <img src="/assets/decorations/cloud-3.png" alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Section 4: 40 Con vật */}
      <section className="section sec-tich relative" style={{ backgroundColor: 'rgb(243, 239, 236)', paddingTop: '30px', paddingBottom: '30px' }}>
        <div className="section-content relative">
          <div className="container mx-auto px-4">
            {/* Tabs - Header màu đỏ, bọc lại với pattern - Màu giống button MUA 1 TRÚNG 30 */}
            <div className="tabbed-content tab-tich mb-8">
              <div className="rounded-lg p-4 relative overflow-hidden border-3" style={{
                backgroundColor: '#991b1b', // Màu đỏ giống btn-primary (tet-red-800)
                borderColor: '#b91c1c',
                borderWidth: '3px',
                borderStyle: 'solid',
                backgroundImage: `
                  url(/assets/decorations/nav-tich.png),
                  radial-gradient(circle at 3px 3px, rgba(255,255,255,0.25) 1.5px, transparent 0),
                  radial-gradient(circle at 15px 15px, rgba(255,255,255,0.15) 1px, transparent 0),
                  linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.08) 75%),
                  linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%)
                `,
                backgroundSize: 'cover, 20px 20px, 30px 30px, 12px 12px, 12px 12px',
                backgroundPosition: 'center, 0 0, 10px 10px, 0 0, 6px 6px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.2)'
              }}>
                {/* Decorative lines - bất quy tắc, nhiều hơn và rõ hơn */}
                <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
                  <svg className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
                    <line x1="8%" y1="18%" x2="14%" y2="28%" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                    <line x1="86%" y1="23%" x2="92%" y2="33%" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                    <line x1="18%" y1="72%" x2="24%" y2="82%" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                    <line x1="76%" y1="67%" x2="82%" y2="77%" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                    <line x1="4%" y1="48%" x2="11%" y2="53%" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                    <line x1="89%" y1="52%" x2="96%" y2="57%" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                    <line x1="28%" y1="14%" x2="34%" y2="19%" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <line x1="66%" y1="81%" x2="72%" y2="86%" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <line x1="12%" y1="45%" x2="18%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <line x1="82%" y1="55%" x2="88%" y2="60%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  </svg>
                </div>
                <ul className="flex flex-wrap justify-center gap-2 relative z-10">
                  {animalGroups.map((group) => (
                    <li key={group.id}>
                      <button
                        onClick={() => setSelectedGroup(group.id)}
                        className={`px-4 py-2 transition rounded ${selectedGroup === group.id
                          ? 'bg-yellow-300 text-gray-800 shadow-md'
                          : 'text-white hover:bg-yellow-200 hover:text-gray-800'
                          }`}
                        style={{
                          fontFamily: "'Bungee', 'Black Ops One', 'Arial Black', sans-serif",
                          fontSize: '0.9rem',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          fontWeight: 400
                        }}
                      >
                        {group.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Animal Grid - Filter by selected group - responsive: 2 cols mobile, 4 cols tablet, 5 cols desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {animalData
                .filter((animal) => {
                  if (selectedGroup === 'tất-cả') return true;
                  const orders = groupToAnimalOrders[selectedGroup] || [];
                  return orders.includes(animal.order);
                })
                .map((animal) => {
                  return (
                    <div key={animal.order} className="bg-white border-2 border-tet-red-800 p-2 md:p-4 text-center relative rounded-lg shadow-md">
                      <div className="absolute top-1 left-1 md:top-2 md:left-2">
                        <p className="text-sm md:text-base font-bold" style={{ color: '#B20801', fontFamily: "'Nunito', sans-serif" }}>{animal.order}. {animal.name}</p>
                      </div>
                      {/* Alias prominently displayed */}
                      <h4 className="text-sm md:text-lg font-bold mt-6 md:mt-8" style={{ color: '#2563EB', fontFamily: "'Nunito', sans-serif" }}>
                        {animal.alias}
                      </h4>
                      {/* Animal Image */}
                      <div className="w-full aspect-square flex items-center justify-center mb-1 md:mb-2 mt-2 md:mt-4 overflow-hidden rounded-lg bg-gray-50">
                        <img
                          src={`/assets/conhon/${String(animal.order).padStart(2, '0')}.jpg`}
                          alt={animal.name}
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `<p class="text-tet-red-700 text-[0.6rem] md:text-xs font-medium">Hình ${animal.name}</p>`;
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Cloud decoration removed - was covering animal images */}
        </div>
      </section>

      {/* Section 5: Ý nghĩa các danh vật */}
      <section id="y-nghia" className="section y-nghia-sec relative" style={{ backgroundColor: '#fff', paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="section-content relative">
          <div className="container mx-auto px-4">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="section-title text-3xl md:text-4xl mb-4" style={{ fontWeight: 600, color: '#B20801' }}>
                Ý NGHĨA CÁC DANH VẬT
              </h2>
              <div className="w-24 h-1 bg-tet-red-600 mx-auto rounded"></div>
              <p className="mt-4 text-gray-600">40 con vật trong bảng Cổ Nhơn với ý nghĩa và biểu tượng đặc trưng</p>
            </div>

            {/* Animal Meanings Grid - ĐƯA LÊN ĐẦU */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {[
                { name: 'Cá Trắng', alias: 'Chiếm Khôi', meaning: 'Tượng trưng cho sự trong sáng, thuần khiết và may mắn' },
                { name: 'Ốc', alias: 'Bản Quế', meaning: 'Biểu tượng của sự kiên nhẫn và bền bỉ' },
                { name: 'Ngỗng', alias: 'Vinh Sanh', meaning: 'Đại diện cho sự thủy chung và tình yêu đôi lứa' },
                { name: 'Công', alias: 'Phùng Xuân', meaning: 'Biểu tượng của vẻ đẹp, sự sang trọng và quyền quý' },
                { name: 'Trùn', alias: 'Chí Cao', meaning: 'Tượng trưng cho sự khiêm nhường nhưng có giá trị lớn' },
                { name: 'Cọp', alias: 'Khôn Sơn', meaning: 'Đại diện cho sức mạnh, quyền lực và sự dũng mãnh' },
                { name: 'Heo', alias: 'Chánh Thuận', meaning: 'Biểu tượng của sự sung túc và no đủ' },
                { name: 'Thỏ', alias: 'Nguyệt Bửu', meaning: 'Tượng trưng cho sự nhanh nhẹn và tinh thông' },
                { name: 'Trâu', alias: 'Hớn Vân', meaning: 'Đại diện cho sự cần cù, chăm chỉ và bền bỉ' },
                { name: 'Rồng Bay', alias: 'Giang Tứ', meaning: 'Biểu tượng của sự thăng tiến và quyền uy' },
                { name: 'Chó', alias: 'Phước Tôn', meaning: 'Tượng trưng cho lòng trung thành và tình bạn' },
                { name: 'Ngựa', alias: 'Quang Minh', meaning: 'Đại diện cho sự thành công và tiến về phía trước' },
                { name: 'Voi', alias: 'Hữu Tài', meaning: 'Biểu tượng của sức mạnh, trí tuệ và may mắn' },
                { name: 'Mèo', alias: 'Chỉ Đắc', meaning: 'Tượng trưng cho sự tinh tế và khéo léo' },
                { name: 'Chuột', alias: 'Tất Khắc', meaning: 'Đại diện cho sự nhanh nhẹn và tiết kiệm' },
                { name: 'Ong', alias: 'Mậu Lâm', meaning: 'Biểu tượng của sự chăm chỉ và đoàn kết' },
                { name: 'Hạc', alias: 'Trọng Tiên', meaning: 'Tượng trưng cho sự trường thọ và thanh cao' },
                { name: 'Kỳ Lân', alias: 'Thiên Thần', meaning: 'Đại diện cho điềm lành và sự may mắn lớn' },
                { name: 'Bướm', alias: 'Cấn Ngọc', meaning: 'Biểu tượng của sự biến đổi và vẻ đẹp' },
                { name: 'Hòn Núi', alias: 'Trân Châu', meaning: 'Tượng trưng cho sự vững chắc và kiên định' },
                { name: 'Én', alias: 'Thượng Chiêu', meaning: 'Đại diện cho mùa xuân và tin vui' },
                { name: 'Bồ Câu', alias: 'Song Đồng', meaning: 'Biểu tượng của sự hòa bình và yên ấm' },
                { name: 'Khỉ', alias: 'Tam Hòe', meaning: 'Tượng trưng cho sự thông minh và nhanh nhẹn' },
                { name: 'Ếch', alias: 'Hiệp Hải', meaning: 'Đại diện cho sự phồn thịnh và sung túc' },
                { name: 'Quạ', alias: 'Cửu Quan', meaning: 'Biểu tượng của trí tuệ và sự tiên tri' },
                { name: 'Rồng Nằm', alias: 'Thái Bình', meaning: 'Tượng trưng cho sự an bình và thịnh vượng' },
                { name: 'Rùa', alias: 'Hỏa Diệm', meaning: 'Đại diện cho sự trường thọ và kiên nhẫn' },
                { name: 'Gà', alias: 'Nhựt Thăng', meaning: 'Biểu tượng của bình minh và sự thức tỉnh' },
                { name: 'Lươn', alias: 'Địa Lươn', meaning: 'Tượng trưng cho sự linh hoạt và khéo léo' },
                { name: 'Cá Đỏ', alias: 'Tỉnh Lợi', meaning: 'Đại diện cho sự thịnh vượng và may mắn' },
                { name: 'Tôm', alias: 'Trường Thọ', meaning: 'Biểu tượng của sự sống động và phát triển' },
                { name: 'Rắn', alias: 'Vạn Kim', meaning: 'Tượng trưng cho sự tái sinh và trí tuệ' },
                { name: 'Nhện', alias: 'Thanh Tuyền', meaning: 'Đại diện cho sự kiên nhẫn và sáng tạo' },
                { name: 'Nai', alias: 'Nguyên Cát', meaning: 'Biểu tượng của sự nhẹ nhàng và thanh tao' },
                { name: 'Dê', alias: 'Nhứt Phẩm', meaning: 'Tượng trưng cho sự hiền lành và tốt bụng' },
                { name: 'Bà Vãi', alias: 'An Sĩ', meaning: 'Đại diện cho sự bí ẩn và huyền diệu' },
                { name: 'Ông Trời', alias: 'Thiên Quan', meaning: 'Tượng trưng cho quyền năng tối cao và sự che chở' },
                { name: 'Ông Địa', alias: 'Địa Chủ', meaning: 'Biểu tượng của sự phì nhiêu và thịnh vượng' },
                { name: 'Thần Tài', alias: 'Tài Thần', meaning: 'Đại diện cho tài lộc và sự giàu có' },
                { name: 'Ông Táo', alias: 'Táo Quân', meaning: 'Biểu tượng của gia đình và sự bảo hộ' },
              ].map((animal, index) => (
                <div key={index} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-2">
                    <span className="w-8 h-8 bg-tet-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-tet-red-800">{animal.name}</h4>
                      <p className="text-xs text-gray-500">{animal.alias}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{animal.meaning}</p>
                </div>
              ))}
            </div>

            {/* Bảng Thế Thân */}
            <div className="mb-12">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold" style={{ color: '#B20801' }}>BẢNG THẾ THÂN CỦA 40 DANH VẬT</h3>
                <p className="mt-2 text-gray-600">Mỗi danh vật đều có một danh vật thế thân tương ứng</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border-2 border-tet-red-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-tet-red-800 text-white">
                      <tr>
                        <th className="px-3 py-2 text-center font-bold border-r border-tet-red-700">Danh Vật</th>
                        <th className="px-3 py-2 text-center font-bold border-r border-tet-red-700">Thế Thân</th>
                        <th className="px-3 py-2 text-center font-bold border-r border-tet-red-700">Danh Vật</th>
                        <th className="px-3 py-2 text-center font-bold">Thế Thân</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [{ num: '01', name: 'Cá Trắng', than: '05. Trùn' }, { num: '21', name: 'Én', than: '22. Bồ Câu' }],
                        [{ num: '02', name: 'Ốc', than: '16. Ong' }, { num: '22', name: 'Bồ Câu', than: '21. Én' }],
                        [{ num: '03', name: 'Ngỗng', than: '32. Rắn' }, { num: '23', name: 'Khỉ', than: '30. Cá Đỏ' }],
                        [{ num: '04', name: 'Công', than: '12. Ngựa' }, { num: '24', name: 'Ếch', than: '07. Heo' }],
                        [{ num: '05', name: 'Trùn', than: '01. Cá Trắng' }, { num: '25', name: 'Quạ', than: '35. Dê' }],
                        [{ num: '06', name: 'Cọp', than: '17. Hạc' }, { num: '26', name: 'Rồng Nằm', than: '31. Tôm' }],
                        [{ num: '07', name: 'Heo', than: '24. Ếch' }, { num: '27', name: 'Rùa', than: '19. Bướm' }],
                        [{ num: '08', name: 'Thỏ', than: '20. Núi' }, { num: '28', name: 'Gà', than: '29. Lươn' }],
                        [{ num: '09', name: 'Trâu', than: '33. Nhện' }, { num: '29', name: 'Lươn', than: '28. Gà' }],
                        [{ num: '10', name: 'Rồng Bay', than: '18. Kỳ Lân' }, { num: '30', name: 'Cá Đỏ', than: '23. Khỉ' }],
                        [{ num: '11', name: 'Chó', than: '15. Chuột' }, { num: '31', name: 'Tôm', than: '26. Rồng Nằm' }],
                        [{ num: '12', name: 'Ngựa', than: '04. Công' }, { num: '32', name: 'Rắn', than: '03. Ngỗng' }],
                        [{ num: '13', name: 'Voi', than: '14. Mèo' }, { num: '33', name: 'Nhện', than: '09. Trâu' }],
                        [{ num: '14', name: 'Mèo', than: '13. Voi' }, { num: '34', name: 'Nai', than: '36. Bà Vãi' }],
                        [{ num: '15', name: 'Chuột', than: '11. Chó' }, { num: '35', name: 'Dê', than: '25. Quạ' }],
                        [{ num: '16', name: 'Ong', than: '02. Ốc' }, { num: '36', name: 'Bà Vãi', than: '34. Nai' }],
                        [{ num: '17', name: 'Hạc', than: '06. Cọp' }, { num: '37', name: 'Ông Trời', than: '40. Ông Táo' }],
                        [{ num: '18', name: 'Kỳ Lân', than: '10. Rồng Bay' }, { num: '38', name: 'Ông Địa', than: '39. Thần Tài' }],
                        [{ num: '19', name: 'Bướm', than: '27. Rùa' }, { num: '39', name: 'Thần Tài', than: '38. Ông Địa' }],
                        [{ num: '20', name: 'Núi', than: '08. Thỏ' }, { num: '40', name: 'Ông Táo', than: '37. Ông Trời' }],
                      ].map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                          <td className="px-3 py-2 border-r border-gray-200">
                            <span className="font-bold text-tet-red-700">{row[0].num}. {row[0].name}</span>
                          </td>
                          <td className="px-3 py-2 border-r border-gray-200 text-gray-700">{row[0].than}</td>
                          <td className="px-3 py-2 border-r border-gray-200">
                            <span className="font-bold text-tet-red-700">{row[1].num}. {row[1].name}</span>
                          </td>
                          <td className="px-3 py-2 text-gray-700">{row[1].than}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bảng Sơ Đồ Hình Nhơn */}
            <div className="mb-12">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold" style={{ color: '#B20801' }}>SƠ ĐỒ HÌNH NHƠN</h3>
                <p className="mt-2 text-gray-600">Vị trí của 40 danh vật theo sơ đồ hình nhơn</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border-2 border-tet-red-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-tet-red-800 text-white">
                      <tr>
                        <th className="px-3 py-2 text-center font-bold border-r border-tet-red-700">BÊN TRÁI</th>
                        <th className="px-3 py-2 text-center font-bold border-r border-tet-red-700">Ở GIỮA</th>
                        <th className="px-3 py-2 text-center font-bold">BÊN PHẢI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { vi_tri_trai: 'thượng', trai: '39. Thần Tài', vi_tri_giua: 'đầu', giua: '05. Trùn', vi_tri_phai: 'thượng', phai: '37. Ông Trời' },
                        { vi_tri_trai: 'lỗ tai', trai: '26. Rồng Nằm', vi_tri_giua: 'trán', giua: '12. Ngựa', vi_tri_phai: 'lỗ tai', phai: '19. Bướm' },
                        { vi_tri_trai: 'bả vai', trai: '34. Nai', vi_tri_giua: 'miệng', giua: '14. Mèo', vi_tri_phai: 'bả vai', phai: '36. Bà Vãi' },
                        { vi_tri_trai: 'đầu vai', trai: '23. Khỉ', vi_tri_giua: 'cổ họng', giua: '28. Gà', vi_tri_phai: 'đầu vai', phai: '03. Ngỗng' },
                        { vi_tri_trai: 'chỏ tay', trai: '33. Nhện', vi_tri_giua: 'tim', giua: '06. Cọp', vi_tri_phai: 'chỏ tay', phai: '02. Ốc' },
                        { vi_tri_trai: 'cùi tay', trai: '17. Hạc', vi_tri_giua: 'bụng', giua: '07. Heo', vi_tri_phai: 'cùi tay', phai: '10. Rồng Bay' },
                        { vi_tri_trai: 'nách', trai: '32. Rắn', vi_tri_giua: 'rún', giua: '08. Thỏ', vi_tri_phai: 'nách', phai: '27. Rùa' },
                        { vi_tri_trai: 'vú', trai: '21. Én', vi_tri_giua: 'hậu môn', giua: '35. Dê', vi_tri_phai: 'vú', phai: '04. Công' },
                        { vi_tri_trai: 'hông', trai: '11. Chó', vi_tri_giua: 'sinh dục', giua: '31. Tôm', vi_tri_phai: 'hông', phai: '13. Voi' },
                        { vi_tri_trai: 'đùi', trai: '18. Kỳ Lân', vi_tri_giua: '', giua: '', vi_tri_phai: 'đùi', phai: '25. Quạ' },
                        { vi_tri_trai: 'vế đùi', trai: '01. Cá Trắng', vi_tri_giua: '', giua: '', vi_tri_phai: 'vế đùi', phai: '09. Trâu' },
                        { vi_tri_trai: 'đầu gối', trai: '16. Ong', vi_tri_giua: '', giua: '', vi_tri_phai: 'đầu gối', phai: '20. Núi' },
                        { vi_tri_trai: 'bụng chân', trai: '24. Ếch', vi_tri_giua: '', giua: '', vi_tri_phai: 'bụng chân', phai: '22. Bồ Câu' },
                        { vi_tri_trai: 'bàn chân', trai: '15. Chuột', vi_tri_giua: '', giua: '', vi_tri_phai: 'bàn chân', phai: '29. Lươn' },
                        { vi_tri_trai: 'hạ', trai: '40. Ông Táo', vi_tri_giua: '', giua: '', vi_tri_phai: 'hạ', phai: '38. Ông Địa' },
                        { vi_tri_trai: '', trai: '', vi_tri_giua: '', giua: '', vi_tri_phai: 'lá cờ', phai: '30. Cá Đỏ' },
                      ].map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                          <td className="px-3 py-2 border-r border-gray-200">
                            {row.trai ? (
                              <div>
                                <span className="font-bold text-tet-red-700">{row.trai}</span>
                                <div className="text-xs text-gray-500">{row.vi_tri_trai}</div>
                              </div>
                            ) : row.vi_tri_trai ? (
                              <div className="text-xs text-gray-400 italic">{row.vi_tri_trai}</div>
                            ) : null}
                          </td>
                          <td className="px-3 py-2 border-r border-gray-200 text-center">
                            {row.giua ? (
                              <div>
                                <span className="font-bold text-tet-red-700">{row.giua}</span>
                                <div className="text-xs text-gray-500">{row.vi_tri_giua}</div>
                              </div>
                            ) : null}
                          </td>
                          <td className="px-3 py-2">
                            {row.phai ? (
                              <div>
                                <span className="font-bold text-tet-red-700">{row.phai}</span>
                                <div className="text-xs text-gray-500">{row.vi_tri_phai}</div>
                              </div>
                            ) : row.vi_tri_phai ? (
                              <div className="text-xs text-gray-400 italic">{row.vi_tri_phai}</div>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
