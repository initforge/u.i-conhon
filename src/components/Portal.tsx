import React from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
    children: React.ReactNode;
}

/**
 * Portal component - Renders children outside of the React component tree
 * Used to ensure modals/popups are rendered on top of everything
 */
const Portal: React.FC<PortalProps> = ({ children }) => {
    return ReactDOM.createPortal(
        children,
        document.body
    );
};

export default Portal;
