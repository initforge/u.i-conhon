import React, { useState, useEffect } from 'react';
import { getSessionResults, SessionResult } from '../services/api';
import { getCurrentYear, getAvailableYears } from '../utils/yearUtils';
import { getAnimalName } from '../types';

// Thai configuration - static since these are fixed locations
const THAIS = [
  { id: 'an-nhon', name: 'An Nhơn', times: ['Sáng (11:00)', 'Chiều (17:00)', 'Tối (21:00)'], color: 'green' },
  { id: 'nhon-phong', name: 'Nhơn Phong', times: ['Sáng (11:00)', 'Chiều (17:00)'], color: 'yellow' },
  { id: 'hoai-nhon', name: 'Hoài Nhơn', times: ['Sáng (13:00)', 'Chiều (19:00)'], color: 'blue' },
];

// Map session results to display format grouped by date
const processResults = (results: SessionResult[]) => {
  const byDate: Record<string, {
    day: string;
    anNhonSang?: string; anNhonChieu?: string; anNhonToi?: string;
    nhonPhongSang?: string; nhonPhongChieu?: string;
    hoaiNhonTrua?: string; hoaiNhonChieu?: string;
  }> = {};

  results.forEach(r => {
    const dateKey = r.session_date;
    if (!byDate[dateKey]) {
      byDate[dateKey] = { day: new Date(r.session_date).toLocaleDateString('vi-VN') };
    }

    const animalName = r.winning_animal ? getAnimalName(r.winning_animal).toUpperCase() : '';

    // Map by thai_id and session_type
    if (r.thai_id === 'an-nhon') {
      if (r.session_type === 'morning') byDate[dateKey].anNhonSang = animalName;
      else if (r.session_type === 'afternoon') byDate[dateKey].anNhonChieu = animalName;
      else if (r.session_type === 'evening') byDate[dateKey].anNhonToi = animalName;
    } else if (r.thai_id === 'nhon-phong') {
      if (r.session_type === 'morning') byDate[dateKey].nhonPhongSang = animalName;
      else if (r.session_type === 'afternoon') byDate[dateKey].nhonPhongChieu = animalName;
    } else if (r.thai_id === 'hoai-nhon') {
      if (r.session_type === 'morning') byDate[dateKey].hoaiNhonTrua = animalName;
      else if (r.session_type === 'afternoon') byDate[dateKey].hoaiNhonChieu = animalName;
    }
  });

  return Object.values(byDate).sort((a, b) => {
    // Sort by date descending (most recent first)
    return new Date(b.day).getTime() - new Date(a.day).getTime();
  });
};

const KetQuaPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedThai, setSelectedThai] = useState('all');
  const [results, setResults] = useState<ReturnType<typeof processResults>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const years = getAvailableYears(4);

  // Fetch results from API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSessionResults({
          thaiId: selectedThai !== 'all' ? selectedThai : undefined,
          limit: 50
        });
        const processed = processResults(data.results || []);
        setResults(processed);
      } catch (err) {
        console.error('Failed to fetch results:', err);
        setError('Không thể tải kết quả xổ');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [selectedThai, selectedYear]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title text-tet-red-800 mb-4">
          KẾT QUẢ XỔ
        </h1>
        <p className="text-gray-600">Xem kết quả theo năm và theo từng Thai</p>
      </div>

      <div>
        {/* Results Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">KẾT QUẢ ĐÃ XỔ</h2>

          {/* Year Selection */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-600 font-medium">📅 Năm:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 bg-tet-red-800 text-white rounded-lg font-bold cursor-pointer hover:bg-tet-red-900 transition-colors"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
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
            {THAIS.map((thai) => (
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tet-red-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && results.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có kết quả</h3>
              <p className="text-gray-600">
                Chưa có kết quả xổ nào được ghi nhận {selectedThai !== 'all' && `cho ${THAIS.find(t => t.id === selectedThai)?.name}`}
              </p>
            </div>
          )}

          {/* Results Table */}
          {!loading && !error && results.length > 0 && (
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
                      <th className="px-3 py-2 text-center font-bold text-yellow-200 border-l border-white/20" colSpan={2}>
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
                      </>
                    )}
                    {(selectedThai === 'all' || selectedThai === 'hoai-nhon') && (
                      <>
                        <th className="px-2 py-1 border-l border-white/20">Sáng<br /><span className="text-blue-200">13:00</span></th>
                        <th className="px-2 py-1">Chiều<br /><span className="text-blue-200">19:00</span></th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
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
          )}

          {/* Legend */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-100 rounded border border-green-300"></span>
              <span className="text-gray-600">Thai An Nhơn: Sáng (11:00) • Chiều (17:00) • Tối (21:00)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-100 rounded border border-yellow-300"></span>
              <span className="text-gray-600">Thai Nhơn Phong: Sáng (11:00) • Chiều (17:00)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-100 rounded border border-blue-300"></span>
              <span className="text-gray-600">Thai Hoài Nhơn: Sáng (13:00) • Chiều (19:00)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KetQuaPage;
