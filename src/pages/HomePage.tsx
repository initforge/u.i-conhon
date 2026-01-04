import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockAnimals } from '../mock-data/mockData';
import { GAME_CONFIG } from '../constants/gameConfig';

const HomePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedGroup, setSelectedGroup] = useState('tất-cả');

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
  ];

  // Mapping groups to animal orders based on images
  const groupToAnimalOrders: { [key: string]: number[] } = {
    'tất-cả': Array.from({ length: 36 }, (_, i) => i + 1), // All 36 animals
    'tứ-trạng-nguyên': [1, 2, 3, 4], // Cá Trắng, Ốc, Ngỗng, Công
    'ngũ-hổ-tướng': [5, 6, 7, 8, 9], // Trùn, Cọp, Heo, Thỏ, Trâu
    'thất-sinh-lý': [10, 11, 12, 13, 14, 15, 16], // Rồng Bay, Chó, Ngựa, Voi, Mèo, Chuột, Ong
    'nhị-đạo-sĩ': [17, 18], // Hạc, Kỳ Lân
    'tứ-mỹ-nữ': [19, 20, 21, 22], // Bướm, Hòn Đá, Én, Cu
    'tứ-hảo-mạng': [23, 24, 25, 26], // Khỉ, Ếch, Quạ, Rồng Nằm
    'tứ-hòa-thượng': [27, 28, 29, 30], // Rùa, Gà, Lươn, Cá Đỏ
    'ngũ-khất-thực': [31, 32, 33, 34, 35], // Tôm, Rắn, Nhện, Nai, Dê
    'nhất-ni-cô': [36], // Yêu
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
    // Thêm 4 con vật để đủ 40
    { order: 37, name: 'Con Vật 37', alias: 'Alias 37', theThan: '37' },
    { order: 38, name: 'Con Vật 38', alias: 'Alias 38', theThan: '38' },
    { order: 39, name: 'Con Vật 39', alias: 'Alias 39', theThan: '39' },
    { order: 40, name: 'Con Vật 40', alias: 'Alias 40', theThan: '40' },
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
                src="/assets/logo-co-nhon.svg"
                alt="Cổ Nhơn"
                className="mx-auto mb-4 md:mb-6"
                style={{ width: '15%', minWidth: '60px', maxWidth: '120px' }}
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
                  <strong>Từ <span style={{ color: '#b2012f' }}>Mùng 1 tết</span> đến hết ngày <span style={{ color: '#b2012f' }}>Mùng 9 tháng Giêng năm Ất Tỵ</span></strong>
                </p>
                <p className="text-justify mb-4" style={{ color: 'rgb(35, 35, 35)' }}>
                  Cổ Nhơn là trò chơi dân gian độc đáo của Hoài Nhơn, thường được tổ chức vào ngày Tết. Người chơi dựa vào câu thai để suy luận và dự đoán đáp án là 1 trong số 36 con vật. Với yếu tố giải trí, thử thách trí tuệ và cơ hội nhận thưởng hấp dẫn, Cổ Nhơn mang đậm giá trị văn hóa truyền thống, nay được tái hiện trực tuyến tiện lợi, phù hợp cho mọi lứa tuổi.
                </p>
                <p className="font-normal mb-4" style={{ fontSize: '1.1rem', color: '#b2012f' }}>
                  Vui xuân cùng Cổ Nhơn – Suy luận hay, rinh lộc ngay!
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

      {/* Section 2: Kết quả */}
      <section id="ket-qua" className="section ket-qua relative" style={{ backgroundColor: 'rgb(243, 239, 236)', paddingTop: '0px', paddingBottom: '0px' }}>
        <div className="section-content relative">
          <div className="container mx-auto px-4 py-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="section-title mb-2 text-4xl md:text-6xl" style={{ fontWeight: 400, color: '#B20801' }}>
                KẾT QUẢ
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
                <p className="text-font mb-4 text-4xl md:text-6xl" style={{ fontWeight: 500, color: '#B20801', fontFamily: "'Nunito', sans-serif" }}>21:00</p>
                <p className="mb-4" style={{ color: 'rgb(35, 35, 35)', fontFamily: "'Nunito', sans-serif" }}>Còn lại: <span className="font-bold" style={{ color: '#B20801', fontFamily: "'Nunito', sans-serif" }}>0 giờ 0 phút 0 giây</span></p>
                <div className="mb-4">
                  <p className="font-bold mb-2" style={{ fontSize: '1.3rem', lineHeight: 1, color: '#b2012f', fontFamily: "'Nunito', sans-serif" }}>
                    <strong>Tỉ lệ thưởng {GAME_CONFIG.PRIZE_RATIO_TEXT}</strong>
                  </p>
                  <p className="font-bold" style={{ fontSize: '1.3rem', lineHeight: 1, color: '#b2012f', fontFamily: "'Nunito', sans-serif" }}>
                    <strong>{GAME_CONFIG.SPECIAL_PRIZE_RATIO_TEXT}</strong>
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
    </div>
  );
};

export default HomePage;
