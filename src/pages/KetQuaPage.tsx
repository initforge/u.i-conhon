import React, { useState } from 'react';

// Mock data cho các thai
const mockThais = [
  { id: 'thai-1', name: 'Thai Sáng', time: '8h00 - 11h30' },
  { id: 'thai-2', name: 'Thai Trưa', time: '12h00 - 14h30' },
  { id: 'thai-3', name: 'Thai Chiều', time: '15h00 - 16h30' },
];

const KetQuaPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedThai, setSelectedThai] = useState('all');
  const years = [2025, 2024, 2023, 2022];

  // Results data by year with 3 thais per day
  const resultsByYear: { [key: number]: Array<{ day: string; thaiSang: string; thaiTrua: string; thaiChieu: string }> } = {
    2025: [
      { day: 'Mùng 1', thaiSang: 'CON HẠC', thaiTrua: 'CON YÊU', thaiChieu: 'CÁ TRẮNG' },
      { day: 'Mùng 2', thaiSang: 'CON CỌP', thaiTrua: 'CON NGỖNG', thaiChieu: 'KỲ LÂN' },
      { day: 'Mùng 3', thaiSang: 'CON DÊ', thaiTrua: 'CON YÊU', thaiChieu: 'CON RẮN' },
      { day: 'Mùng 4', thaiSang: 'CON NGỖNG', thaiTrua: 'CON KHỈ', thaiChieu: 'CON GÀ' },
      { day: 'Mùng 5', thaiSang: 'CON ỐC', thaiTrua: 'CON MÈO', thaiChieu: 'CON TRÙN' },
      { day: 'Mùng 6', thaiSang: 'RỒNG BAY', thaiTrua: 'KỲ LÂN', thaiChieu: 'CON BƯỚM' },
      { day: 'Mùng 7', thaiSang: 'CON QUẠ', thaiTrua: 'CON NGỖNG', thaiChieu: 'CON ÉN' },
      { day: 'Mùng 8', thaiSang: 'RỒNG NẰM', thaiTrua: 'CON NHỆN', thaiChieu: 'CON CÚ' },
      { day: 'Mùng 9', thaiSang: 'CON ỐC', thaiTrua: 'CON ẾCH', thaiChieu: 'HÒN ĐÁ' },
    ],
    2024: [
      { day: '30 Tết', thaiSang: 'HỔ', thaiTrua: 'TÔM', thaiChieu: 'NGỰA' },
      { day: 'Mùng 1', thaiSang: 'ẾCH', thaiTrua: 'NHỆN', thaiChieu: 'VOI' },
      { day: 'Mùng 2', thaiSang: 'RÙA', thaiTrua: 'CỌP', thaiChieu: 'CHÓ' },
      { day: 'Mùng 3', thaiSang: 'NGỰA', thaiTrua: 'TÔM', thaiChieu: 'HẠC' },
      { day: 'Mùng 4', thaiSang: 'KỲ LÂN', thaiTrua: 'HÒN ĐÁ', thaiChieu: 'ONG' },
      { day: 'Mùng 5', thaiSang: 'ÉN', thaiTrua: 'ỐC', thaiChieu: 'TRÂU' },
      { day: 'Mùng 6', thaiSang: 'RẮN', thaiTrua: 'CON CÔNG', thaiChieu: 'HEO' },
      { day: 'Mùng 7', thaiSang: 'NGỰA', thaiTrua: 'TÔM', thaiChieu: 'THỎ' },
      { day: 'Mùng 8', thaiSang: 'RỒNG BAY', thaiTrua: 'RẮN', thaiChieu: 'LƯƠN' },
    ],
    2023: [
      { day: 'Mùng 1', thaiSang: 'ÉN', thaiTrua: 'NHỆN', thaiChieu: 'NAI' },
      { day: 'Mùng 2', thaiSang: 'CHÓ', thaiTrua: 'VOI', thaiChieu: 'DÊ' },
      { day: 'Mùng 3', thaiSang: 'RÙA', thaiTrua: 'TRÂU', thaiChieu: 'CÁ ĐỎ' },
      { day: 'Mùng 4', thaiSang: 'CON CÚ', thaiTrua: 'HÒN ĐÁ', thaiChieu: 'MÈO' },
      { day: 'Mùng 5', thaiSang: 'CON CÚ', thaiTrua: 'CỌP', thaiChieu: 'CHUỘT' },
      { day: 'Mùng 6', thaiSang: 'GÀ', thaiTrua: 'CÁ TRẮNG', thaiChieu: 'BƯỚM' },
      { day: 'Mùng 7', thaiSang: 'CON YÊU', thaiTrua: 'VOI', thaiChieu: 'QUẠ' },
      { day: 'Mùng 8', thaiSang: 'CÁ TRẮNG', thaiTrua: 'NHỆN', thaiChieu: 'ỐC' },
      { day: 'Mùng 9', thaiSang: 'CHÓ', thaiTrua: 'CON CÚ', thaiChieu: 'ẾCH' },
    ],
    2022: [
      { day: 'Mùng 1', thaiSang: 'ÉN', thaiTrua: 'NHỆN', thaiChieu: 'RÙA' },
      { day: 'Mùng 2', thaiSang: 'CHÓ', thaiTrua: 'VOI', thaiChieu: 'CÔNG' },
      { day: 'Mùng 3', thaiSang: 'RÙA', thaiTrua: 'TRÂU', thaiChieu: 'HẠC' },
      { day: 'Mùng 4', thaiSang: 'CON CÚ', thaiTrua: 'HÒN ĐÁ', thaiChieu: 'KHỈ' },
      { day: 'Mùng 5', thaiSang: 'CON CÚ', thaiTrua: 'CỌP', thaiChieu: 'TÔM' },
      { day: 'Mùng 6', thaiSang: 'GÀ', thaiTrua: 'CÁ TRẮNG', thaiChieu: 'RẮN' },
      { day: 'Mùng 7', thaiSang: 'CON YÊU', thaiTrua: 'VOI', thaiChieu: 'NAI' },
      { day: 'Mùng 8', thaiSang: 'CÁ TRẮNG', thaiTrua: 'NHỆN', thaiChieu: 'DÊ' },
      { day: 'Mùng 9', thaiSang: 'CHÓ', thaiTrua: 'CON CÚ', thaiChieu: 'GÀ' },
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
        <p className="text-gray-600">Xem kết quả theo năm và theo từng thai</p>
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
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
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
                  {(selectedThai === 'all' || selectedThai === 'thai-1') && (
                    <th className="px-4 py-3 text-left font-bold">SÁNG</th>
                  )}
                  {(selectedThai === 'all' || selectedThai === 'thai-2') && (
                    <th className="px-4 py-3 text-left font-bold">TRƯA</th>
                  )}
                  {(selectedThai === 'all' || selectedThai === 'thai-3') && (
                    <th className="px-4 py-3 text-left font-bold">CHIỀU</th>
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
                    {(selectedThai === 'all' || selectedThai === 'thai-1') && (
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-red-50 text-red-700 rounded font-medium text-sm">
                          {result.thaiSang}
                        </span>
                      </td>
                    )}
                    {(selectedThai === 'all' || selectedThai === 'thai-2') && (
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded font-medium text-sm">
                          {result.thaiTrua}
                        </span>
                      </td>
                    )}
                    {(selectedThai === 'all' || selectedThai === 'thai-3') && (
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-medium text-sm">
                          {result.thaiChieu}
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
              <span className="w-4 h-4 bg-red-50 rounded"></span>
              <span className="text-gray-600">Thai Sáng (8h00 - 11h30)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-50 rounded"></span>
              <span className="text-gray-600">Thai Trưa (12h00 - 14h30)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-50 rounded"></span>
              <span className="text-gray-600">Thai Chiều (15h00 - 16h30)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KetQuaPage;
