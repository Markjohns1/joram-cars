/**
 * Layout Component
 * 
 * Main layout wrapper with header, footer, and mobile bottom nav.
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen pb-[64px] md:pb-0">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
}
