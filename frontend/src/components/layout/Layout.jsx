/**
 * Layout Component
 * 
 * Main layout wrapper with header, footer, and mobile bottom nav.
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';

import { Suspense } from 'react';
import { LoadingPage } from '../common';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen pb-[64px] md:pb-0">
            <Header />
            <main className="flex-grow">
                <Suspense fallback={<LoadingPage />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
}
