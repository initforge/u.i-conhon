import React, { useState, useEffect, useCallback } from 'react';
import { getSessionResults, SessionResult } from '../services/api';
import { getCurrentYear, getAvailableYears } from '../utils/yearUtils';
import { getAnimalName } from '../types';

// Thai configuration
const THAIS = [
  { id: 'an-nhon', name: 'An Nhơn', drawTimes: ['11:00', '17:00', '21:00'], slots: ['morning', 'afternoon', 'evening'], slotLabels: ['Sáng', 'Chiều', 'Tối'], color: 'green' },
  { id: 'nhon-phong', name: 'Nhơn Phong', drawTimes: ['11:00', '17:00'], slots: ['morning', 'afternoon'], slotLabels: ['Sáng', 'Chiều'], color: 'yellow' },
  { id: 'hoai-nhon', name: 'Hoài Nhơn', drawTimes: ['13:00', '19:00'], slots: ['morning', 'afternoon'], slotLabels: ['Sáng', 'Chiều'], color: 'blue' },
];

// Helper to normalize thai_id from API (thai-an-nhon -> an-nhon)
const normalizThaiId = (thaiId: string) => thaiId.replace(/^thai-/, '');

// --- Types ---
interface SlotData {
  animal: number | null;
  pending?: boolean;   // admin entered result but draw_time not passed
  drawTime?: string;   // e.g. '2026-02-07 17:00:00'
}

interface SingleThaiRow {
  day: string;
  sessionDate: string;
  results: Record<string, SlotData>; // session_type -> SlotData
}

interface AllThaiRow {
  day: string;
  sessionDate: string;
  // thai_id -> session_type -> SlotData
  thaiResults: Record<string, Record<string, SlotData>>;
}

// Normalize date to YYYY-MM-DD format (handles both '2026-02-07' and '2026-02-07T00:00:00.000Z')
const normalizeDate = (d: string) => d.split('T')[0];

// --- Process results for single Thai view ---
const processResultsSingle = (results: SessionResult[]): SingleThaiRow[] => {
  const byDate: Record<string, { lunarLabel?: string; results: Record<string, SlotData> }> = {};

  results.forEach(r => {
    const dateKey = normalizeDate(r.session_date);
    if (!byDate[dateKey]) byDate[dateKey] = { results: {} };
    if (r.lunar_label) byDate[dateKey].lunarLabel = r.lunar_label;
    byDate[dateKey].results[r.session_type] = {
      animal: r.winning_animal,
      pending: r.pending || false,
      drawTime: r.draw_time,
    };
  });


  return Object.entries(byDate)
    .map(([date, data]) => ({
      day: data.lunarLabel || new Date(date + 'T00:00:00').toLocaleDateString('vi-VN'),
      sessionDate: date,
      results: data.results,
    }))
    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
};

// --- Process results for All Thai view ---
const processResultsAll = (results: SessionResult[]): AllThaiRow[] => {
  const byDate: Record<string, { lunarLabel?: string; thaiResults: Record<string, Record<string, SlotData>> }> = {};

  results.forEach(r => {
    const dateKey = normalizeDate(r.session_date);
    const thaiId = normalizThaiId(r.thai_id);
    if (!byDate[dateKey]) byDate[dateKey] = { thaiResults: {} };
    if (r.lunar_label) byDate[dateKey].lunarLabel = r.lunar_label;
    if (!byDate[dateKey].thaiResults[thaiId]) byDate[dateKey].thaiResults[thaiId] = {};
    byDate[dateKey].thaiResults[thaiId][r.session_type] = {
      animal: r.winning_animal,
      pending: r.pending || false,
      drawTime: r.draw_time,
    };
  });


  return Object.entries(byDate)
    .map(([date, data]) => ({
      day: data.lunarLabel || new Date(date + 'T00:00:00').toLocaleDateString('vi-VN'),
      sessionDate: date,
      thaiResults: data.thaiResults,
    }))
    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
};

// Countdown helper — uses draw_time from DB (e.g. '2026-02-07 17:00:00')
const formatCountdown = (drawTimeStr: string, now: Date): string | null => {
  // Extract HH:MM from draw_time (format: 'YYYY-MM-DD HH:MM:SS' or 'YYYY-MM-DDTHH:MM:SS...')
  const timePart = drawTimeStr.includes('T') ? drawTimeStr.split('T')[1] : drawTimeStr.split(' ')[1];
  if (!timePart) return null;
  const [h, m] = timePart.split(':').map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) return null;
  const diff = target.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const KetQuaPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedThai, setSelectedThai] = useState('all');
  const [singleResults, setSingleResults] = useState<SingleThaiRow[]>([]);
  const [allResults, setAllResults] = useState<AllThaiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const years = getAvailableYears(4);
  // Use local date (not UTC) — toISOString() returns UTC which can be wrong timezone
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Tick every second for countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch results from API
  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      if (selectedThai === 'all') {
        const data = await getSessionResults({ year: selectedYear, limit: 100 });
        setAllResults(processResultsAll(data.results || []));
        return data.results || [];
      } else {
        const data = await getSessionResults({ thaiId: selectedThai, year: selectedYear, limit: 50 });
        setSingleResults(processResultsSingle(data.results || []));
        return data.results || [];
      }
    } catch (err) {
      console.error('Failed to fetch results:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [selectedThai, selectedYear]);

  // Initial fetch + auto-refetch when pending draw_time passes
  useEffect(() => {
    let refetchTimer: ReturnType<typeof setTimeout> | null = null;

    const fetchAndSchedule = async () => {
      const results = await fetchResults();

      // Find the nearest pending draw_time in the future
      const pendingDrawTimes = results
        .filter((r: SessionResult) => r.pending && r.draw_time)
        .map((r: SessionResult) => {
          // draw_time format: '2026-02-07 19:00:00' or '2026-02-07T19:00:00...'
          const timePart = r.draw_time!.includes('T') ? r.draw_time!.split('T')[1] : r.draw_time!.split(' ')[1];
          const [h, m] = timePart.split(':').map(Number);
          const target = new Date();
          target.setHours(h, m, 0, 0);
          return target.getTime();
        })
        .filter((t: number) => t > Date.now());

      if (pendingDrawTimes.length > 0) {
        const nearest = Math.min(...pendingDrawTimes);
        const delay = nearest - Date.now() + 2000; // +2s buffer for server-side time
        refetchTimer = setTimeout(fetchAndSchedule, delay);
      }
    };

    fetchAndSchedule();

    return () => {
      if (refetchTimer) clearTimeout(refetchTimer);
    };
  }, [fetchResults]);

  // The current Thai config (for single-thai view)
  const currentThaiConfig = THAIS.find(t => t.id === selectedThai);

  // Render a cell for single-thai view
  const renderCell = (row: SingleThaiRow, slotType: string) => {
    const slot = row.results[slotType];
    if (slot) {
      if (slot.animal != null) {
        return <span className="font-semibold text-gray-800">{getAnimalName(slot.animal).toUpperCase()}</span>;
      }
      if (slot.pending && slot.drawTime) {
        const cd = formatCountdown(slot.drawTime, now);
        if (cd) return <span className="text-xs font-mono text-orange-600 animate-pulse">⏳ {cd}</span>;
      }
      // Holiday: slot exists (session resulted) but no animal and not pending
      return <span className="text-xs text-red-500 font-medium">🚫 Nghỉ xổ</span>;
    }
    // No result entered for this slot
    if (row.sessionDate === todayStr) {
      return <span className="text-xs text-gray-400">Chưa có kết quả</span>;
    }
    return <span className="text-gray-300">-</span>;
  };

  // Render a cell for all-thai view
  const renderAllCell = (row: AllThaiRow, thaiId: string, slotType: string, bgClass: string, textClass: string) => {
    const slot = row.thaiResults[thaiId]?.[slotType];
    if (slot) {
      if (slot.animal != null) {
        return (
          <span className={`px-1.5 py-0.5 ${bgClass} ${textClass} rounded text-xs font-medium`}>
            {getAnimalName(slot.animal).toUpperCase()}
          </span>
        );
      }
      if (slot.pending && slot.drawTime) {
        const cd = formatCountdown(slot.drawTime, now);
        if (cd) return <span className="text-[10px] font-mono text-orange-500">⏳{cd}</span>;
      }
      // Holiday: slot exists (session resulted) but no animal and not pending
      return <span className="text-[10px] text-red-500 font-medium">🚫 Nghỉ xổ</span>;
    }
    // No result for this slot
    if (row.sessionDate === todayStr) {
      return <span className="text-[10px] text-gray-400">Chưa có KQ</span>;
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title text-tet-red-800 mb-4">KẾT QUẢ XỔ</h1>
        <p className="text-gray-600">Xem kết quả theo năm và theo từng Thai</p>
      </div>

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
              ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
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
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
            >
              {thai.name}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tet-red-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && ((selectedThai === 'all' && allResults.length === 0) || (selectedThai !== 'all' && singleResults.length === 0)) && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có kết quả</h3>
            <p className="text-gray-600">Chưa có kết quả xổ nào được ghi nhận</p>
          </div>
        )}

        {/* Single Thai Table */}
        {!loading && selectedThai !== 'all' && currentThaiConfig && singleResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-tet-red-800 text-white">
                <tr>
                  <th className="px-3 py-2 text-left font-bold">NGÀY</th>
                  {currentThaiConfig.slotLabels.map((label, i) => (
                    <th key={i} className="px-3 py-2 text-center font-bold">
                      {label}<br />
                      <span className="text-xs opacity-80">{currentThaiConfig.drawTimes[i]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {singleResults.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 font-semibold text-gray-800">{row.day}</td>
                    {currentThaiConfig.slots.map((slot) => (
                      <td key={slot} className="px-2 py-2 text-center">
                        {renderCell(row, slot)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* All Thai Table */}
        {!loading && selectedThai === 'all' && allResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-tet-red-800 text-white">
                <tr>
                  <th className="px-3 py-2 text-left font-bold" rowSpan={2}>NGÀY</th>
                  <th className="px-3 py-2 text-center font-bold text-green-200 border-l border-white/20" colSpan={3}>AN NHƠN</th>
                  <th className="px-3 py-2 text-center font-bold text-yellow-200 border-l border-white/20" colSpan={2}>NHƠN PHONG</th>
                  <th className="px-3 py-2 text-center font-bold text-blue-200 border-l border-white/20" colSpan={2}>HOÀI NHƠN</th>
                </tr>
                <tr className="bg-tet-red-700 text-xs">
                  <th className="px-2 py-1 border-l border-white/20">Sáng<br /><span className="text-green-200">11:00</span></th>
                  <th className="px-2 py-1">Chiều<br /><span className="text-green-200">17:00</span></th>
                  <th className="px-2 py-1">Tối<br /><span className="text-green-200">21:00</span></th>
                  <th className="px-2 py-1 border-l border-white/20">Sáng<br /><span className="text-yellow-200">11:00</span></th>
                  <th className="px-2 py-1">Chiều<br /><span className="text-yellow-200">17:00</span></th>
                  <th className="px-2 py-1 border-l border-white/20">Sáng<br /><span className="text-blue-200">13:00</span></th>
                  <th className="px-2 py-1">Chiều<br /><span className="text-blue-200">19:00</span></th>
                </tr>
              </thead>
              <tbody>
                {allResults.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 font-semibold text-gray-800">{row.day}</td>
                    {/* An Nhon */}
                    <td className="px-2 py-2 text-center border-l border-gray-100">{renderAllCell(row, 'an-nhon', 'morning', 'bg-green-50', 'text-green-700')}</td>
                    <td className="px-2 py-2 text-center">{renderAllCell(row, 'an-nhon', 'afternoon', 'bg-green-50', 'text-green-700')}</td>
                    <td className="px-2 py-2 text-center">{renderAllCell(row, 'an-nhon', 'evening', 'bg-green-100', 'text-green-800')}</td>
                    {/* Nhon Phong */}
                    <td className="px-2 py-2 text-center border-l border-gray-100">{renderAllCell(row, 'nhon-phong', 'morning', 'bg-yellow-50', 'text-yellow-700')}</td>
                    <td className="px-2 py-2 text-center">{renderAllCell(row, 'nhon-phong', 'afternoon', 'bg-yellow-50', 'text-yellow-700')}</td>
                    {/* Hoai Nhon */}
                    <td className="px-2 py-2 text-center border-l border-gray-100">{renderAllCell(row, 'hoai-nhon', 'morning', 'bg-blue-50', 'text-blue-700')}</td>
                    <td className="px-2 py-2 text-center">{renderAllCell(row, 'hoai-nhon', 'afternoon', 'bg-blue-50', 'text-blue-700')}</td>
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
  );
};

export default KetQuaPage;
