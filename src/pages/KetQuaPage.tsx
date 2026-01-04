import React, { useState } from 'react';

const KetQuaPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const years = [2025, 2024, 2023, 2022];

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title text-tet-red-800 mb-4">
          KẾT QUẢ
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image */}
        <div className="relative">
          <img
            src="/assets/decorations/form_img.png"
            alt="Kết quả"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Right: Results Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">KẾT QUẢ ĐÃ XỔ</h2>
          
          {/* Year Selection */}
          <div className="flex space-x-4 mb-6">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 font-semibold transition ${
                  selectedYear === year
                    ? 'text-tet-red-800 font-bold text-lg'
                    : 'text-gray-600 hover:text-tet-red-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-tet-red-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">NGÀY</th>
                  <th className="px-4 py-3 text-left font-bold">SÁNG</th>
                  <th className="px-4 py-3 text-left font-bold">CHIỀU</th>
                </tr>
              </thead>
              <tbody>
                {mockResults.map((result, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-3 font-semibold">{result.day}</td>
                    <td className="px-4 py-3">{result.morning}</td>
                    <td className="px-4 py-3">{result.afternoon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KetQuaPage;

