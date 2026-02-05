import React, { useState, useEffect } from 'react';
import { THAIS, CauThai } from '../types';
import { getTodayCauThai, CauThaiItem } from '../services/api';

const CauThaiPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(THAIS[0]?.id || '');
  const [cauThais, setCauThais] = useState<CauThai[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cau thai from API
  useEffect(() => {
    const fetchCauThai = async () => {
      try {
        setLoading(true);
        const response = await getTodayCauThai();
        // Transform API response to CauThai format
        const transformed: CauThai[] = (response.cauThais || []).map((item: CauThaiItem) => ({
          id: item.id,
          thaiId: item.thai_id,
          content: item.description || '',
          imageUrl: item.image_url,
          date: item.created_at
        }));
        setCauThais(transformed);
      } catch (error) {
        console.error('Failed to fetch cau thai:', error);
        setCauThais([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCauThai();
  }, []);

  return (
    <div
      className="min-h-screen py-12 relative"
      style={{
        backgroundImage: 'url(/assets/decorations/bg-cau-thai-co-nhon.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
          Câu thai trong ngày
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 rounded-lg p-2 inline-flex">
            {THAIS.map((thai) => (
              <button
                key={thai.id}
                onClick={() => setActiveTab(thai.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === thai.id
                  ? 'bg-tet-red-800 text-white'
                  : 'text-gray-700 hover:bg-red-50'
                  }`}
              >
                {thai.name}
              </button>
            ))}
          </div>
        </div>

        {/* Current Cau Thai */}
        <div className="max-w-4xl mx-auto mb-12">
          {cauThais
            .filter((ct) => ct.thaiId === activeTab)
            .map((cauThai) => (
              <div key={cauThai.id} className="card bg-white/95 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-tet-red-800">
                  Câu thai hôm nay
                </h2>
                {cauThai.imageUrl && (
                  <img
                    src={cauThai.imageUrl}
                    alt="Câu thai"
                    className="w-full mb-4 rounded-lg"
                  />
                )}
                <p className="text-xl text-gray-700 italic text-center">
                  {cauThai.content}
                </p>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Ngày: {new Date(cauThai.date).toLocaleDateString('vi-VN')}
                </p>
              </div>
            ))}
        </div>

        {/* History */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg text-center">
            Lịch sử câu thai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cauThais
              .filter((ct) => ct.thaiId === activeTab)
              .map((cauThai) => (
                <div key={cauThai.id} className="card bg-white/95">
                  <p className="text-gray-700 italic mb-2">{cauThai.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(cauThai.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CauThaiPage;

