import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GAME_CONFIG } from '../constants/gameConfig';

const HomePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedGroup, setSelectedGroup] = useState('tất-cả');
  const [selectedThai, setSelectedThai] = useState('an-nhon');

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
    'tứ-mỹ-nữ': [19, 20, 21, 22], // Bướm, Hòn Đá, Én, Cu
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

  // Get results for selected year
  const mockResults = resultsByYear[selectedYear] || resultsByYear[2025];

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
    { order: 20, name: 'Hòn Đá', alias: 'Trân Châu', theThan: '08' },
    { order: 21, name: 'Én', alias: 'Thượng Chiêu', theThan: '22' },
    { order: 22, name: 'Cú', alias: 'Song Đồng', theThan: '21' },
    { order: 23, name: 'Khỉ', alias: 'Tam Hòe', theThan: '30' },
    { order: 24, name: 'Ếch', alias: 'Hiệp Hải', theThan: '07' },
    { order: 25, name: 'Quạ', alias: 'Cửu Quan', theThan: '35' },
    { order: 26, name: 'Rồng Nằm', alias: 'Thái Bình', theThan: '31' },
    { order: 27, name: 'Rùa', alias: 'Hỏa Diệm', theThan: '19' },
    { order: 28, name: 'Gà', alias: 'Nhựt Thăng', theThan: '29' },
    { order: 29, name: 'Lươn', alias: 'Địa Lương', theThan: '28' },
    { order: 30, name: 'Cá Đỏ', alias: 'Tỉnh Lợi', theThan: '23' },
    { order: 31, name: 'Tôm', alias: 'Trường Thọ', theThan: '26' },
    { order: 32, name: 'Rắn', alias: 'Vạn Kim', theThan: '03' },
    { order: 33, name: 'Nhện', alias: 'Thanh Tiền', theThan: '09' },
    { order: 34, name: 'Nai', alias: 'Nguyên Kiết', theThan: '36' },
    { order: 35, name: 'Dê', alias: 'Nhứt Phẩm', theThan: '25' },
    { order: 36, name: 'Yêu', alias: 'An Sỹ', theThan: '34' },
    // Tứ Thần Linh (37-40)
    { order: 37, name: 'Ông Trời', alias: 'Thiên Quân', theThan: '37' },
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
                CỔ NHƠN ONLINE
              </h1>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              {/* Left: Text */}
              <div className="text-center">
                <h2 className="section-title mb-4 text-xl md:text-2xl" style={{ fontWeight: 400, color: '#b2012f' }}>
                  {GAME_CONFIG.GAME_TITLE}
                </h2>
                <p className="text-lg font-normal mb-4" style={{ color: 'rgb(35, 35, 35)' }}>
                  <strong>Từ <span style={{ color: '#b2012f' }}>{GAME_CONFIG.GAME_START}</span> đến <span style={{ color: '#b2012f' }}>{GAME_CONFIG.GAME_END}</span></strong>
                </p>
                <p className="text-justify mb-4" style={{ color: 'rgb(35, 35, 35)' }}>
                  Cổ Nhơn là trò chơi dân gian độc đáo của Hoài Nhơn, thường được tổ chức vào ngày Tết. Người chơi dựa vào câu thai để suy luận và dự đoán đáp án là 1 trong số 36 con vật. Với yếu tố giải trí, thử thách trí tuệ và cơ hội nhận thưởng hấp dẫn, Cổ Nhơn mang đậm giá trị văn hóa truyền thống, nay được tái hiện trực tuyến tiện lợi, phù hợp cho mọi lứa tuổi.
                </p>
                <p className="font-normal mb-4" style={{ fontSize: '1.1rem', color: '#b2012f' }}>
                  Vui Xuân Cổ Nhơn - Nhận Lộc ngày tết!
                </p>
                <div className="mb-6">
                  <p className="font-bold mb-2" style={{ fontSize: '1.5rem', lineHeight: '0.75', color: '#b2012f' }}>
                    Tỉ lệ thưởng {GAME_CONFIG.PRIZE_RATIO_TEXT}
                  </p>
                  <p className="font-bold" style={{ fontSize: '1.5rem', lineHeight: '0.75', color: '#b2012f' }}>
                    {GAME_CONFIG.SPECIAL_PRIZE_RATIO_TEXT}
                  </p>
                </div>
                <Link
                  to="/chon-thai"
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
                >
                  <span>{GAME_CONFIG.PLAY_BUTTON_TEXT}</span>
                  <img src="/assets/icons/ico_arrow_right.svg" alt="" className="w-5 h-5" />
                </Link>
              </div>

              {/* Right: Image */}
              <div className="relative">
                <div className="bg-gray-200 rounded-lg p-8 h-96 flex items-center justify-center">
                  <p className="text-gray-500">Ảnh minh họa người chơi Cổ Nhơn</p>
                </div>
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
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-red-100 shadow-lg">
                <h3 className="text-2xl font-bold text-tet-red-700 mb-4">
                  Cổ Nhơn - Trò chơi dân gian độc đáo ở Bình Định
                </h3>

                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Cổ Nhơn là một trò chơi trong dịp tết âm lịch của người dân H.Hoài Nhơn và Thị Xã An Nhơn (Bình Định),
                    bắt đầu vào khoảng 25 tháng chạp âm lịch kéo dài đến khoảng chiều mùng 9 tết.
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
                      mà còn nôn nao một tâm trạng khác. Ai cũng háo hức chờ đợi Cổ Nhơn như chờ đợi hội làng dịp tết.
                    </p>
                  </div>

                  <p>
                    Người chơi Cổ Nhơn không phân biệt tầng lớp, tuổi tác, trình độ học vấn... Hình ảnh một cậu bé hăng say lý giải
                    suy đoán của mình và một cụ ông đeo kính ngồi chiêm nghiệm, cân nhắc lựa chọn ấy đã trở nên rất quen thuộc ở nơi đây.
                  </p>
                </div>
              </div>

              {/* Right: More Content */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="text-xl font-bold text-tet-red-700 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📜</span> Đi tìm gốc tích Cổ Nhơn
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Theo nhà nghiên cứu Đặng Quý Địch, trò chơi Cổ Nhơn đã xuất hiện khoảng thời nhà Nguyễn do du nhập từ bên ngoài.
                    Khi về Việt Nam, cụ thể là ở Hoài Nhơn và An Nhơn Bình Định, Cổ Nhơn đã phát triển, biến hóa thành một trò chơi
                    tao nhã trong dịp tết cho mọi tầng lớp người dân.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-tet-red-700 to-tet-red-800 rounded-2xl p-6 text-white shadow-lg">
                  <h4 className="text-xl font-bold mb-4 flex items-center">
                    <span className="text-2xl mr-2">🎯</span> Cách chơi
                  </h4>
                  <ul className="space-y-2 text-red-100">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Mỗi đề là 4 câu thơ lục bát (câu thai)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Người chơi suy luận để đoán 1 trong 40 con vật</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Tỷ lệ thưởng hấp dẫn: 1 chung 30</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Kết quả công bố minh bạch tại cây nêu</span>
                    </li>
                  </ul>
                </div>

                {/* Newspaper Links - Admin managed */}
                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                  <h4 className="text-lg font-bold text-yellow-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📰</span> Bài báo tham khảo
                  </h4>
                  <div className="space-y-3">
                    <a href="#" className="block p-3 bg-white rounded-lg border border-yellow-100 hover:border-yellow-300 transition-colors group">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                          <span>📄</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-tet-red-700 transition-colors">Cổ Nhơn - Nét đẹp văn hóa Tết</p>
                          <p className="text-xs text-gray-500">Báo Bình Định</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="block p-3 bg-white rounded-lg border border-yellow-100 hover:border-yellow-300 transition-colors group">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                          <span>📄</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-tet-red-700 transition-colors">Trò chơi dân gian Hoài Nhơn</p>
                          <p className="text-xs text-gray-500">Thanh Niên Online</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Kết quả */}
      <section id="ket-qua" className="section ket-qua relative" style={{ backgroundColor: 'rgb(243, 239, 236)', paddingTop: '0px', paddingBottom: '0px' }}>
        <div className="section-content relative">
          <div className="container mx-auto px-4 py-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="section-title mb-2 text-4xl md:text-6xl" style={{ fontWeight: 400, color: '#B20801' }}>
                CÂU THAI VÀ KẾT QUẢ XỔ
              </h2>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left: Image - Căn giữa con rồng */}
              <div className="flex items-center justify-center">
                <img
                  src="/assets/decorations/form_img.png"
                  alt="Kết quả"
                  className="mx-auto"
                  style={{ width: '70%', maxWidth: '100%' }}
                />
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
                    <ul className="flex justify-center space-x-4 relative z-10">
                      {[2025, 2024, 2023, 2022].map((year) => {
                        const isSelected = selectedYear === year;
                        const isDisabled = year === 2025;
                        return (
                          <li key={year}>
                            <button
                              onClick={() => !isDisabled && setSelectedYear(year)}
                              className={`px-4 py-2 font-semibold transition rounded`}
                              style={{
                                fontFamily: "'Nunito', sans-serif",
                                ...(isSelected
                                  ? { backgroundColor: 'white', color: '#B20801', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }
                                  : isDisabled
                                    ? { backgroundColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.6)', cursor: 'not-allowed' }
                                    : { backgroundColor: 'white', color: '#B20801' })
                              }}
                            >
                              {year}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
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
            <div className="text-center mb-8">
              <h2 className="section-title text-2xl md:text-3xl" style={{ fontWeight: 400, color: '#b2012f' }}>
                CÂU THAI MỚI NHẤT
              </h2>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 items-center">
              {/* Left: Background Image with Text */}
              <div className="lg:col-span-2 relative text-center">
                <div className="relative mx-auto" style={{ width: '100%', maxWidth: '600px' }}>
                  <img
                    src="/assets/decorations/bg-cau-thai-co-nhon.png"
                    alt="Câu thai"
                    className="w-full h-auto object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8">
                    <div className="text-center w-full">
                      <h6 className="uppercase text-font mb-1 text-sm md:text-base" style={{ color: '#F5E87F', fontFamily: "'Nunito', sans-serif", fontWeight: 400 }}>
                        CHIỀU mùng 9 TẾT ẤT TỴ 2025
                      </h6>
                      <p className="text-base md:text-xl mb-2" style={{ color: '#fff', fontFamily: "'Nunito', sans-serif" }}>06-02-2025</p>
                      <p className="text-sm md:text-xl leading-tight" style={{ color: '#F5E87F', fontFamily: "'Nunito', sans-serif" }}>
                        Trinh Nương nức tiếng trăm miền<br />
                        Tượng binh xuất trận đảo điên quân thù<br />
                        Tùng Sơn nắng quyện mây trời<br />
                        Dấu chân Bà Triệu rạng ngời sử xanh
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Countdown and Info */}
              <div className="text-center">
                <p className="mb-2" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif" }}><strong>Đóng tịch lúc</strong></p>
                <p className="text-font mb-4 text-4xl md:text-6xl" style={{ fontWeight: 500, color: '#B20801', fontFamily: "'Nunito', sans-serif" }}>16h30</p>
                <p className="mb-4" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif" }}>Còn lại: <span className="font-bold" style={{ color: '#B20801', fontFamily: "'Nunito', sans-serif" }}>0 giờ 0 phút 0 giây</span></p>
                <div className="mb-4">
                  <p className="font-bold mb-2" style={{ fontSize: '1.3rem', lineHeight: 1, color: '#b2012f', fontFamily: "'Nunito', sans-serif" }}>
                    <strong>Tỉ lệ thưởng {GAME_CONFIG.PRIZE_RATIO_TEXT}</strong>
                  </p>
                  <p className="font-bold mb-2" style={{ fontSize: '1.3rem', lineHeight: 1, color: '#b2012f', fontFamily: "'Nunito', sans-serif" }}>
                    <strong>{GAME_CONFIG.SPECIAL_PRIZE_RATIO_TEXT}</strong>
                  </p>
                  <p className="font-bold" style={{ fontSize: '1rem', lineHeight: 1, color: '#b2012f', fontFamily: "'Nunito', sans-serif" }}>
                    <strong>{GAME_CONFIG.HOAI_NHON_SPECIAL_TEXT}</strong>
                  </p>
                </div>
                <p className="mb-4" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif" }}>
                  Ví dụ: mua <strong>{GAME_CONFIG.EXAMPLE_BET.toLocaleString('vi-VN')}đ</strong> trúng{' '}
                  <span className="font-bold" style={{ color: '#B20801', fontFamily: "'Nunito', sans-serif" }}>{GAME_CONFIG.getExamplePrize().toLocaleString('vi-VN')}đ</span>
                </p>
                <Link
                  to="/chon-thai"
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

            {/* Animal Grid - Filter by selected group - responsive: 4 cols mobile, 5 cols desktop */}
            <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
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
                        <p className="text-[0.6rem] md:text-xs font-bold" style={{ color: '#B20801', fontFamily: "'Nunito', sans-serif" }}>{animal.order}. {animal.alias}</p>
                      </div>
                      <h4 className="text-sm md:text-lg text-font mb-1 md:mb-2 mt-6 md:mt-8" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif", fontWeight: 400 }}>
                        {animal.name}
                      </h4>
                      {/* Animal Image Placeholder */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2 md:p-4 h-24 md:h-48 flex items-center justify-center mb-1 md:mb-2 mt-2 md:mt-4">
                        <p className="text-tet-red-700 text-[0.6rem] md:text-xs font-medium">Hình {animal.name}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Cloud decoration */}
          <div className="absolute bottom-0 right-0 opacity-60 pointer-events-none" style={{ width: '265px', height: '454px', zIndex: 10 }}>
            <img src="/assets/decorations/cloud-4.png" alt="" className="w-full h-full object-contain" />
          </div>
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

            {/* Animal Meanings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                { name: 'Rồng Bay', alias: 'Giang Từ', meaning: 'Biểu tượng của sự thăng tiến và quyền uy' },
                { name: 'Chó', alias: 'Phước Tôn', meaning: 'Tượng trưng cho lòng trung thành và tình bạn' },
                { name: 'Ngựa', alias: 'Quang Minh', meaning: 'Đại diện cho sự thành công và tiến về phía trước' },
                { name: 'Voi', alias: 'Hữu Tài', meaning: 'Biểu tượng của sức mạnh, trí tuệ và may mắn' },
                { name: 'Mèo', alias: 'Chỉ Đắc', meaning: 'Tượng trưng cho sự tinh tế và khéo léo' },
                { name: 'Chuột', alias: 'Tất Khắc', meaning: 'Đại diện cho sự nhanh nhẹn và tiết kiệm' },
                { name: 'Ong', alias: 'Mậu Lâm', meaning: 'Biểu tượng của sự chăm chỉ và đoàn kết' },
                { name: 'Hạc', alias: 'Trọng Tiên', meaning: 'Tượng trưng cho sự trường thọ và thanh cao' },
                { name: 'Kỳ Lân', alias: 'Thiên Thân', meaning: 'Đại diện cho điềm lành và sự may mắn lớn' },
                { name: 'Bướm', alias: 'Cấn Ngọc', meaning: 'Biểu tượng của sự biến đổi và vẻ đẹp' },
                { name: 'Hòn Đá', alias: 'Trân Châu', meaning: 'Tượng trưng cho sự vững chắc và kiên định' },
                { name: 'Én', alias: 'Thượng Chiêu', meaning: 'Đại diện cho mùa xuân và tin vui' },
                { name: 'Cu', alias: 'Song Đồng', meaning: 'Biểu tượng của sự hòa bình và yên ấm' },
                { name: 'Khỉ', alias: 'Tam Hòe', meaning: 'Tượng trưng cho sự thông minh và nhanh nhẹn' },
                { name: 'Ếch', alias: 'Hiệp Hải', meaning: 'Đại diện cho sự phồn thịnh và sung túc' },
                { name: 'Quạ', alias: 'Cửu Quan', meaning: 'Biểu tượng của trí tuệ và sự tiên tri' },
                { name: 'Rồng Nằm', alias: 'Thái Bình', meaning: 'Tượng trưng cho sự an bình và thịnh vương' },
                { name: 'Rùa', alias: 'Hỏa Diệm', meaning: 'Đại diện cho sự trường thọ và kiên nhẫn' },
                { name: 'Gà', alias: 'Nhựt Thăng', meaning: 'Biểu tượng của bình minh và sự thức tỉnh' },
                { name: 'Lươn', alias: 'Địa Lương', meaning: 'Tượng trưng cho sự linh hoạt và khéo léo' },
                { name: 'Cá Đỏ', alias: 'Tỉnh Lợi', meaning: 'Đại diện cho sự thịnh vượng và may mắn' },
                { name: 'Tôm', alias: 'Trường Thọ', meaning: 'Biểu tượng của sự sống động và phát triển' },
                { name: 'Rắn', alias: 'Vạn Kim', meaning: 'Tượng trưng cho sự tái sinh và trí tuệ' },
                { name: 'Nhện', alias: 'Thanh Tiền', meaning: 'Đại diện cho sự kiên nhẫn và sáng tạo' },
                { name: 'Nai', alias: 'Nguyên Kiết', meaning: 'Biểu tượng của sự nhẹ nhàng và thanh tao' },
                { name: 'Dê', alias: 'Nhứt Phẩm', meaning: 'Tượng trưng cho sự hiền lành và tốt bụng' },
                { name: 'Yêu', alias: 'An Sỹ', meaning: 'Đại diện cho sự bí ẩn và huyền diệu' },
                { name: 'Ông Trời', alias: 'Thiên Quân', meaning: 'Tượng trưng cho quyền năng tối cao và sự che chở' },
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
