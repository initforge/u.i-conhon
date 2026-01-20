import React, { useState } from 'react';

// Mock data cho các thai - sử dụng tên Thai thực tế
const mockThais = [
  { id: 'an-nhon', name: 'Thai An Nhơn', time: '11h, 17h (21h từ mùng 1)', color: 'green' },
  { id: 'nhon-phong', name: 'Thai Nhơn Phong', time: '11h, 17h', color: 'yellow' },
  { id: 'hoai-nhon', name: 'Thai Hoài Nhơn', time: '13h, 19h', color: 'blue' },
];

const KetQuaPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedThai, setSelectedThai] = useState('all');
  const years = [2025, 2024, 2023, 2022];

  // Results data by year with 3 thais (An Nhơn, Nhơn Phong, Hoài Nhơn)
  const resultsByYear: { [key: number]: Array<{ day: string; anNhon: string; nhonPhong: string; hoaiNhon: string }> } = {
    2025: [
      { day: 'Mùng 1', anNhon: 'CON HẠC', nhonPhong: 'CON YÊU', hoaiNhon: 'CÁ TRẮNG' },
      { day: 'Mùng 2', anNhon: 'CON CỌP', nhonPhong: 'CON NGỖNG', hoaiNhon: 'KỲ LÂN' },
      { day: 'Mùng 3', anNhon: 'CON DÊ', nhonPhong: 'CON YÊU', hoaiNhon: 'CON RẮN' },
      { day: 'Mùng 4', anNhon: 'CON NGỖNG', nhonPhong: 'CON KHỈ', hoaiNhon: 'CON GÀ' },
      { day: 'Mùng 5', anNhon: 'CON ỐC', nhonPhong: 'CON MÈO', hoaiNhon: 'CON TRÙN' },
      { day: 'Mùng 6', anNhon: 'RỒNG BAY', nhonPhong: 'KỲ LÂN', hoaiNhon: 'CON BƯỚM' },
      { day: 'Mùng 7', anNhon: 'CON QUẠ', nhonPhong: 'CON NGỖNG', hoaiNhon: 'CON ÉN' },
      { day: 'Mùng 8', anNhon: 'RỒNG NẰM', nhonPhong: 'CON NHỆN', hoaiNhon: 'CON CÚ' },
      { day: 'Mùng 9', anNhon: 'CON ỐC', nhonPhong: 'CON ẾCH', hoaiNhon: 'HÒN ĐÁ' },
    ],
    2024: [
      { day: '30 Tết', anNhon: 'HỔ', nhonPhong: 'TÔM', hoaiNhon: 'NGỰA' },
      { day: 'Mùng 1', anNhon: 'ẾCH', nhonPhong: 'NHỆN', hoaiNhon: 'VOI' },
      { day: 'Mùng 2', anNhon: 'RÙA', nhonPhong: 'CỌP', hoaiNhon: 'CHÓ' },
      { day: 'Mùng 3', anNhon: 'NGỰA', nhonPhong: 'TÔM', hoaiNhon: 'HẠC' },
      { day: 'Mùng 4', anNhon: 'KỲ LÂN', nhonPhong: 'HÒN ĐÁ', hoaiNhon: 'ONG' },
      { day: 'Mùng 5', anNhon: 'ÉN', nhonPhong: 'ỐC', hoaiNhon: 'TRÂU' },
      { day: 'Mùng 6', anNhon: 'RẮN', nhonPhong: 'CON CÔNG', hoaiNhon: 'HEO' },
      { day: 'Mùng 7', anNhon: 'NGỰA', nhonPhong: 'TÔM', hoaiNhon: 'THỎ' },
      { day: 'Mùng 8', anNhon: 'RỒNG BAY', nhonPhong: 'RẮN', hoaiNhon: 'LƯƠN' },
    ],
    2023: [
      { day: 'Mùng 1', anNhon: 'ÉN', nhonPhong: 'NHỆN', hoaiNhon: 'NAI' },
      { day: 'Mùng 2', anNhon: 'CHÓ', nhonPhong: 'VOI', hoaiNhon: 'DÊ' },
      { day: 'Mùng 3', anNhon: 'RÙA', nhonPhong: 'TRÂU', hoaiNhon: 'CÁ ĐỎ' },
      { day: 'Mùng 4', anNhon: 'CON CÚ', nhonPhong: 'HÒN ĐÁ', hoaiNhon: 'MÈO' },
      { day: 'Mùng 5', anNhon: 'CON CÚ', nhonPhong: 'CỌP', hoaiNhon: 'CHUỘT' },
      { day: 'Mùng 6', anNhon: 'GÀ', nhonPhong: 'CÁ TRẮNG', hoaiNhon: 'BƯỚM' },
      { day: 'Mùng 7', anNhon: 'CON YÊU', nhonPhong: 'VOI', hoaiNhon: 'QUẠ' },
      { day: 'Mùng 8', anNhon: 'CÁ TRẮNG', nhonPhong: 'NHỆN', hoaiNhon: 'ỐC' },
      { day: 'Mùng 9', anNhon: 'CHÓ', nhonPhong: 'CON CÚ', hoaiNhon: 'ẾCH' },
    ],
    2022: [
      { day: 'Mùng 1', anNhon: 'ÉN', nhonPhong: 'NHỆN', hoaiNhon: 'RÙA' },
      { day: 'Mùng 2', anNhon: 'CHÓ', nhonPhong: 'VOI', hoaiNhon: 'CÔNG' },
      { day: 'Mùng 3', anNhon: 'RÙA', nhonPhong: 'TRÂU', hoaiNhon: 'HẠC' },
      { day: 'Mùng 4', anNhon: 'CON CÚ', nhonPhong: 'HÒN ĐÁ', hoaiNhon: 'KHỈ' },
      { day: 'Mùng 5', anNhon: 'CON CÚ', nhonPhong: 'CỌP', hoaiNhon: 'TÔM' },
      { day: 'Mùng 6', anNhon: 'GÀ', nhonPhong: 'CÁ TRẮNG', hoaiNhon: 'RẮN' },
      { day: 'Mùng 7', anNhon: 'CON YÊU', nhonPhong: 'VOI', hoaiNhon: 'NAI' },
      { day: 'Mùng 8', anNhon: 'CÁ TRẮNG', nhonPhong: 'NHỆN', hoaiNhon: 'DÊ' },
      { day: 'Mùng 9', anNhon: 'CHÓ', nhonPhong: 'CON CÚ', hoaiNhon: 'GÀ' },
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-tet-red-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">NGÀY</th>
                  {(selectedThai === 'all' || selectedThai === 'an-nhon') && (
                    <th className="px-4 py-3 text-left font-bold text-green-200">AN NHƠN</th>
                  )}
                  {(selectedThai === 'all' || selectedThai === 'nhon-phong') && (
                    <th className="px-4 py-3 text-left font-bold text-yellow-200">NHƠN PHONG</th>
                  )}
                  {(selectedThai === 'all' || selectedThai === 'hoai-nhon') && (
                    <th className="px-4 py-3 text-left font-bold text-blue-200">HOÀI NHƠN</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {mockResults.map((result, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800">{result.day}</td>
                    {(selectedThai === 'all' || selectedThai === 'an-nhon') && (
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-medium text-sm">
                          {result.anNhon}
                        </span>
                      </td>
                    )}
                    {(selectedThai === 'all' || selectedThai === 'nhon-phong') && (
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded font-medium text-sm">
                          {result.nhonPhong}
                        </span>
                      </td>
                    )}
                    {(selectedThai === 'all' || selectedThai === 'hoai-nhon') && (
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium text-sm">
                          {result.hoaiNhon}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-100 rounded border border-green-300"></span>
              <span className="text-gray-600">Thai An Nhơn (11h, 17h, 21h)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-100 rounded border border-yellow-300"></span>
              <span className="text-gray-600">Thai Nhơn Phong (11h, 17h)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-100 rounded border border-blue-300"></span>
              <span className="text-gray-600">Thai Hoài Nhơn (13h, 19h)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KetQuaPage;
