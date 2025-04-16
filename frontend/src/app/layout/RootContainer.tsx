// src/app/layout/RouterContainer.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

export const RouterContainer = () => {
    return (
        <div className="content-container">
            {/* Puedes añadir lógica aquí (ej: manejo de errores, loading global) */}
            <Outlet />
        </div>
    );
};