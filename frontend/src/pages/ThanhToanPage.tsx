import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ThanhToanPage - Checkout page
 * Redirects to mua-con-vat with cart drawer open
 * Payment is handled via CartDrawer component
 */
const ThanhToanPage: React.FC = () => {
    // Redirect to purchase page - payment handled via CartDrawer
    return <Navigate to="/user/mua-con-vat" replace />;
};

export default ThanhToanPage;
