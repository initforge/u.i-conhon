import React, { useState } from 'react';

// Mock data cho các thai - sử dụng tên Thai thực tế với khung giờ
const mockThais = [
  { id: 'an-nhon', name: 'Thai An Nhơn', times: ['Sáng (11:00)', 'Chiều (17:00)', 'Tối (21:00)'], color: 'green' },
  { id: 'nhon-phong', name: 'Thai Nhơn Phong', times: ['Sáng (11:00)', 'Chiều (17:00)', 'Tối (21:00)'], color: 'yellow' },
  { id: 'hoai-nhon', name: 'Thai Hoài Nhơn', times: ['Trưa (13:00)', 'Chiều (19:00)'], color: 'blue' },
];

const KetQuaPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedThai, setSelectedThai] = useState('all');
  const years = [2025, 2024, 2023, 2022];

  // Results data by year with 3 thais (An Nhơn, Nhơn Phong, Hoài Nhơn) và khung giờ
  const resultsByYear: {
    [key: number]: Array<{
      day: string;
      anNhonSang?: string; anNhonChieu?: string; anNhonToi?: string;
      nhonPhongSang?: string; nhonPhongChieu?: string; nhonPhongToi?: string;
      hoaiNhonTrua?: string; hoaiNhonChieu?: string;
    }>
  } = {
    2025: [
      { day: 'Mùng 1', anNhonSang: 'CON HẠC', anNhonChieu: 'CON CỌP', anNhonToi: 'RỒNG BAY', nhonPhongSang: 'CON YÊU', nhonPhongChieu: 'KỲ LÂN', hoaiNhonTrua: 'CÁ TRẮNG', hoaiNhonChieu: 'CON THỎ' },
      { day: 'Mùng 2', anNhonSang: 'CON CỌP', anNhonChieu: 'CON DÊ', anNhonToi: 'CON MÈO', nhonPhongSang: 'CON NGỖNG', nhonPhongChieu: 'CON RẮN', hoaiNhonTrua: 'KỲ LÂN', hoaiNhonChieu: 'CON ONG' },
      { day: 'Mùng 3', anNhonSang: 'CON DÊ', anNhonChieu: 'CON RÙA', nhonPhongSang: 'CON YÊU', nhonPhongChieu: 'CON VOI', hoaiNhonTrua: 'CON RẮN', hoaiNhonChieu: 'RỒNG NẰM' },
      { day: 'Mùng 4', anNhonSang: 'CON NGỖNG', anNhonChieu: 'CON ỐC', nhonPhongSang: 'CON KHỈ', nhonPhongChieu: 'CON HEO', hoaiNhonTrua: 'CON GÀ', hoaiNhonChieu: 'CON TRÂU' },
      { day: 'Mùng 5', anNhonSang: 'CON ỐC', anNhonChieu: 'RỒNG BAY', nhonPhongSang: 'CON MÈO', nhonPhongChieu: 'CON CHÓ', hoaiNhonTrua: 'CON TRÙN', hoaiNhonChieu: 'CON NGỰA' },
      { day: 'Mùng 6', anNhonSang: 'RỒNG BAY', anNhonChieu: 'CON QUẠ', nhonPhongSang: 'KỲ LÂN', nhonPhongChieu: 'CON ẾCH', hoaiNhonTrua: 'CON BƯỚM', hoaiNhonChieu: 'CÁ ĐỎ' },
      { day: 'Mùng 7', anNhonSang: 'CON QUẠ', anNhonChieu: 'RỒNG NẰM', nhonPhongSang: 'CON NGỖNG', nhonPhongChieu: 'BỒ CÂU', hoaiNhonTrua: 'CON ÉN', hoaiNhonChieu: 'CON NAI' },
      { day: 'Mùng 8', anNhonSang: 'RỒNG NẰM', anNhonChieu: 'CON ỐC', nhonPhongSang: 'CON NHỆN', nhonPhongChieu: 'CON TÔM', hoaiNhonTrua: 'CON CÚ', hoaiNhonChieu: 'HÒN ĐÁ' },
      { day: 'Mùng 9', anNhonSang: 'CON ỐC', anNhonChieu: 'CON NAI', nhonPhongSang: 'CON ẾCH', nhonPhongChieu: 'LƯƠN', hoaiNhonTrua: 'HÒN ĐÁ', hoaiNhonChieu: 'CON VỊT' },
    ],
    2024: [
      { day: '30 Tết', anNhonSang: 'HỔ', anNhonChieu: 'CỌP', nhonPhongSang: 'TÔM', nhonPhongChieu: 'RẮN', hoaiNhonTrua: 'NGỰA', hoaiNhonChieu: 'VOI' },
      { day: 'Mùng 1', anNhonSang: 'ẾCH', anNhonChieu: 'RÙA', anNhonToi: 'GÀ', nhonPhongSang: 'NHỆN', nhonPhongChieu: 'CỌP', hoaiNhonTrua: 'VOI', hoaiNhonChieu: 'CHÓ' },
      { day: 'Mùng 2', anNhonSang: 'RÙA', anNhonChieu: 'NGỰA', nhonPhongSang: 'CỌP', nhonPhongChieu: 'TÔM', hoaiNhonTrua: 'CHÓ', hoaiNhonChieu: 'NGỰA' },
      { day: 'Mùng 3', anNhonSang: 'NGỰA', anNhonChieu: 'ÉN', nhonPhongSang: 'TÔM', nhonPhongChieu: 'HÒN ĐÁ', hoaiNhonTrua: 'HẠC', hoaiNhonChieu: 'ONG' },
      { day: 'Mùng 4', anNhonSang: 'KỲ LÂN', anNhonChieu: 'RẮN', nhonPhongSang: 'HÒN ĐÁ', nhonPhongChieu: 'ỐC', hoaiNhonTrua: 'ONG', hoaiNhonChieu: 'TRÂU' },
      { day: 'Mùng 5', anNhonSang: 'ÉN', anNhonChieu: 'RỒNG BAY', nhonPhongSang: 'ỐC', nhonPhongChieu: 'CÔNG', hoaiNhonTrua: 'TRÂU', hoaiNhonChieu: 'HEO' },
      { day: 'Mùng 6', anNhonSang: 'RẮN', anNhonChieu: 'NGỰA', nhonPhongSang: 'CON CÔNG', nhonPhongChieu: 'TÔM', hoaiNhonTrua: 'HEO', hoaiNhonChieu: 'THỎ' },
      { day: 'Mùng 7', anNhonSang: 'NGỰA', anNhonChieu: 'CÁ TRẮNG', nhonPhongSang: 'TÔM', nhonPhongChieu: 'RẮN', hoaiNhonTrua: 'THỎ', hoaiNhonChieu: 'LƯƠN' },
      { day: 'Mùng 8', anNhonSang: 'RỒNG BAY', anNhonChieu: 'ẾCH', nhonPhongSang: 'RẮN', nhonPhongChieu: 'NHỆN', hoaiNhonTrua: 'LƯƠN', hoaiNhonChieu: 'GÀ' },
    ],
    2023: [
      { day: 'Mùng 1', anNhonSang: 'ÉN', anNhonChieu: 'CHÓ', nhonPhongSang: 'NHỆN', nhonPhongChieu: 'VOI', hoaiNhonTrua: 'NAI', hoaiNhonChieu: 'DÊ' },
      { day: 'Mùng 2', anNhonSang: 'CHÓ', anNhonChieu: 'RÙA', nhonPhongSang: 'VOI', nhonPhongChieu: 'TRÂU', hoaiNhonTrua: 'DÊ', hoaiNhonChieu: 'CÁ ĐỎ' },
      { day: 'Mùng 3', anNhonSang: 'RÙA', anNhonChieu: 'CON CÚ', nhonPhongSang: 'TRÂU', nhonPhongChieu: 'HÒN ĐÁ', hoaiNhonTrua: 'CÁ ĐỎ', hoaiNhonChieu: 'MÈO' },
      { day: 'Mùng 4', anNhonSang: 'CON CÚ', anNhonChieu: 'GÀ', nhonPhongSang: 'HÒN ĐÁ', nhonPhongChieu: 'CỌP', hoaiNhonTrua: 'MÈO', hoaiNhonChieu: 'CHUỘT' },
      { day: 'Mùng 5', anNhonSang: 'CON CÚ', anNhonChieu: 'CON YÊU', nhonPhongSang: 'CỌP', nhonPhongChieu: 'CÁ TRẮNG', hoaiNhonTrua: 'CHUỘT', hoaiNhonChieu: 'BƯỚM' },
      { day: 'Mùng 6', anNhonSang: 'GÀ', anNhonChieu: 'CÁ TRẮNG', nhonPhongSang: 'CÁ TRẮNG', nhonPhongChieu: 'VOI', hoaiNhonTrua: 'BƯỚM', hoaiNhonChieu: 'QUẠ' },
      { day: 'Mùng 7', anNhonSang: 'CON YÊU', anNhonChieu: 'CHÓ', nhonPhongSang: 'VOI', nhonPhongChieu: 'NHỆN', hoaiNhonTrua: 'QUẠ', hoaiNhonChieu: 'ỐC' },
      { day: 'Mùng 8', anNhonSang: 'CÁ TRẮNG', anNhonChieu: 'ẾCH', nhonPhongSang: 'NHỆN', nhonPhongChieu: 'CON CÚ', hoaiNhonTrua: 'ỐC', hoaiNhonChieu: 'ẾCH' },
      { day: 'Mùng 9', anNhonSang: 'CHÓ', anNhonChieu: 'VOI', nhonPhongSang: 'CON CÚ', nhonPhongChieu: 'RÙA', hoaiNhonTrua: 'ẾCH', hoaiNhonChieu: 'NAI' },
    ],
    2022: [
      { day: 'Mùng 1', anNhonSang: 'ÉN', anNhonChieu: 'CHÓ', nhonPhongSang: 'NHỆN', nhonPhongChieu: 'VOI', hoaiNhonTrua: 'RÙA', hoaiNhonChieu: 'CÔNG' },
      { day: 'Mùng 2', anNhonSang: 'CHÓ', anNhonChieu: 'RÙA', nhonPhongSang: 'VOI', nhonPhongChieu: 'TRÂU', hoaiNhonTrua: 'CÔNG', hoaiNhonChieu: 'HẠC' },
      { day: 'Mùng 3', anNhonSang: 'RÙA', anNhonChieu: 'CON CÚ', nhonPhongSang: 'TRÂU', nhonPhongChieu: 'HÒN ĐÁ', hoaiNhonTrua: 'HẠC', hoaiNhonChieu: 'KHỈ' },
      { day: 'Mùng 4', anNhonSang: 'CON CÚ', anNhonChieu: 'GÀ', nhonPhongSang: 'HÒN ĐÁ', nhonPhongChieu: 'CỌP', hoaiNhonTrua: 'KHỈ', hoaiNhonChieu: 'TÔM' },
      { day: 'Mùng 5', anNhonSang: 'CON CÚ', anNhonChieu: 'CON YÊU', nhonPhongSang: 'CỌP', nhonPhongChieu: 'CÁ TRẮNG', hoaiNhonTrua: 'TÔM', hoaiNhonChieu: 'RẮN' },
      { day: 'Mùng 6', anNhonSang: 'GÀ', anNhonChieu: 'CÁ TRẮNG', nhonPhongSang: 'CÁ TRẮNG', nhonPhongChieu: 'VOI', hoaiNhonTrua: 'RẮN', hoaiNhonChieu: 'NAI' },
      { day: 'Mùng 7', anNhonSang: 'CON YÊU', anNhonChieu: 'CHÓ', nhonPhongSang: 'VOI', nhonPhongChieu: 'NHỆN', hoaiNhonTrua: 'NAI', hoaiNhonChieu: 'DÊ' },
      { day: 'Mùng 8', anNhonSang: 'CÁ TRẮNG', anNhonChieu: 'ẾCH', nhonPhongSang: 'NHỆN', nhonPhongChieu: 'CON CÚ', hoaiNhonTrua: 'DÊ', hoaiNhonChieu: 'GÀ' },
      { day: 'Mùng 9', anNhonSang: 'CHÓ', anNhonChieu: 'VOI', nhonPhongSang: 'CON CÚ', nhonPhongChieu: 'RÙA', hoaiNhonTrua: 'GÀ', hoaiNhonChieu: 'LƯƠN' },
    ],
  };

  // Get results for selected year
  const mockResults = resultsByYear[selectedYear] || resultsByYear[2025];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title text-tet-red-800 mb-4">
          KẾT QUẢ XỔ
        </h1>
        <p className="text-gray-600">Xem kết quả theo năm và theo từng Thai</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image */}
        <div className="relative">
          <img
            src="/assets/decorations/form_img.png"
            alt="Kết quả"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right: Results Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">KẾT QUẢ ĐÃ XỔ</h2>

          {/* Year Selection */}
          <div className="flex space-x-4 mb-4">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 font-semibold rounded-lg transition ${selectedYear === year
                  ? 'bg-tet-red-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Thai Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedThai('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${selectedThai === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
            >
              Tất cả
            </button>
            {mockThais.map((thai) => (
              <button
                key={thai.id}
                onClick={() => setSelectedThai(thai.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${selectedThai === thai.id
                  ? thai.color === 'green' ? 'bg-green-600 text-white'
                    : thai.color === 'yellow' ? 'bg-yellow-500 text-white'
                      : 'bg-blue-600 text-white'
                  : thai.color === 'green' ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : thai.color === 'yellow' ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
              >
                {thai.name}
              </button>
            ))}
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-tet-red-800 text-white">
                <tr>
                  <th className="px-3 py-2 text-left font-bold" rowSpan={2}>NGÀY</th>
                  {(selectedThai === 'all' || selectedThai === 'an-nhon') && (
                    <th className="px-3 py-2 text-center font-bold text-green-200 border-l border-white/20" colSpan={3}>
                      AN NHƠN
                    </th>
                  )}
                  {(selectedThai === 'all' || selectedThai === 'nhon-phong') && (
                    <th className="px-3 py-2 text-center font-bold text-yellow-200 border-l border-white/20" colSpan={3}>
                      NHƠN PHONG
                    </th>
                  )}
                  {(selectedThai === 'all' || selectedThai === 'hoai-nhon') && (
                    <th className="px-3 py-2 text-center font-bold text-blue-200 border-l border-white/20" colSpan={2}>
                      HOÀI NHƠN
                    </th>
                  )}
                </tr>
                <tr className="bg-tet-red-700 text-xs">
                  {(selectedThai === 'all' || selectedThai === 'an-nhon') && (
                    <>
                      <th className="px-2 py-1 border-l border-white/20">Sáng<br /><span className="text-green-200">11:00</span></th>
                      <th className="px-2 py-1">Chiều<br /><span className="text-green-200">17:00</span></th>
                      <th className="px-2 py-1">Tối<br /><span className="text-green-200">21:00</span></th>
                    </>
                  )}
                  {(selectedThai === 'all' || selectedThai === 'nhon-phong') && (
                    <>
                      <th className="px-2 py-1 border-l border-white/20">Sáng<br /><span className="text-yellow-200">11:00</span></th>
                      <th className="px-2 py-1">Chiều<br /><span className="text-yellow-200">17:00</span></th>
                      <th className="px-2 py-1">Tối<br /><span className="text-yellow-200">21:00</span></th>
                    </>
                  )}
                  {(selectedThai === 'all' || selectedThai === 'hoai-nhon') && (
                    <>
                      <th className="px-2 py-1 border-l border-white/20">Trưa<br /><span className="text-blue-200">13:00</span></th>
                      <th className="px-2 py-1">Chiều<br /><span className="text-blue-200">19:00</span></th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {mockResults.map((result, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-3 py-2 font-semibold text-gray-800">{result.day}</td>
                    {(selectedThai === 'all' || selectedThai === 'an-nhon') && (
                      <>
                        <td className="px-2 py-2 text-center">
                          {result.anNhonSang && (
                            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
                              {result.anNhonSang}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {result.anNhonChieu && (
                            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
                              {result.anNhonChieu}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {result.anNhonToi && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs font-bold">
                              {result.anNhonToi}
                            </span>
                          )}
                        </td>
                      </>
                    )}
                    {(selectedThai === 'all' || selectedThai === 'nhon-phong') && (
                      <>
                        <td className="px-2 py-2 text-center">
                          {result.nhonPhongSang && (
                            <span className="px-1.5 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">
                              {result.nhonPhongSang}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {result.nhonPhongChieu && (
                            <span className="px-1.5 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">
                              {result.nhonPhongChieu}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {result.nhonPhongToi && (
                            <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">
                              {result.nhonPhongToi}
                            </span>
                          )}
                        </td>
                      </>
                    )}
                    {(selectedThai === 'all' || selectedThai === 'hoai-nhon') && (
                      <>
                        <td className="px-2 py-2 text-center">
                          {result.hoaiNhonTrua && (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              {result.hoaiNhonTrua}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {result.hoaiNhonChieu && (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              {result.hoaiNhonChieu}
                            </span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-100 rounded border border-green-300"></span>
              <span className="text-gray-600">Thai An Nhơn: Sáng (11:00) • Chiều (17:00) • Tối (21:00)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-100 rounded border border-yellow-300"></span>
              <span className="text-gray-600">Thai Nhơn Phong: Sáng (11:00) • Chiều (17:00) • Tối (21:00)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-100 rounded border border-blue-300"></span>
              <span className="text-gray-600">Thai Hoài Nhơn: Trưa (13:00) • Chiều (19:00)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KetQuaPage;
