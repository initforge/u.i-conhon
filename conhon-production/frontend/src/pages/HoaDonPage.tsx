import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

/**
 * HoaDonPage - Legacy page, redirects to InvoicePage
 * Real invoice functionality is in InvoicePage which uses getOrderDetail API
 */
const HoaDonPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Redirect to the real invoice page
    return <Navigate to={`/invoice/${id || ''}`} replace />;
};

export default HoaDonPage;
