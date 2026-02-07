import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * HoaDonPage - Order detail page
 * Redirects to LichSuPage since detailed order view is handled there
 */
const HoaDonPage: React.FC = () => {
    // Redirect to order history page
    return <Navigate to="/user/lich-su" replace />;
};

export default HoaDonPage;
