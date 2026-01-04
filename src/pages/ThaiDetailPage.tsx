import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockThais, mockAnimals } from '../mock-data/mockData';
import CountdownTimer from '../components/CountdownTimer';
import SocialTaskGate from '../components/SocialTaskGate';
import AnimalCard from '../components/AnimalCard';
import CartModal from '../components/CartModal';

const ThaiDetailPage: React.FC = () => {
  const { thaiId } = useParams<{ thaiId: string }>();
  const navigate = useNavigate();
  const [showCartModal, setShowCartModal] = useState(false);
  
  const thai = mockThais.find((t) => t.id === thaiId);
  const animals = mockAnimals.filter((a) => a.thaiId === thaiId);

  if (!thai) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Không tìm thấy Thai</h1>
        <button onClick={() => navigate('/chon-thai')} className="btn-primary mt-4">
          Quay lại chọn Thai
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="section-title text-tet-red-800 mb-4">
          {thai.name}
        </h1>
        <CountdownTimer thai={thai} />
      </div>

      <SocialTaskGate>
        <div className="mt-6">
          <h2 className="section-title text-tet-red-800 mb-6 text-2xl">
            Danh sách 40 con vật
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {animals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onAddToCart={() => setShowCartModal(true)}
              />
            ))}
          </div>
        </div>
      </SocialTaskGate>

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onContinueShopping={() => {
          // Stay on page
        }}
      />
    </div>
  );
};

export default ThaiDetailPage;

