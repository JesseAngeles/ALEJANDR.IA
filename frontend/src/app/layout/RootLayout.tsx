import { Header } from './Header';
import { Footer } from './Footer';
import { RouterContainer } from './RootContainer';
import React from 'react';

export const RootLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <RouterContainer />
            <Footer />
        </div>
    );
};