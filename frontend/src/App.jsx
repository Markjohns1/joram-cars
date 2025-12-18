/**
 * Main Application Component
 * 
 * Sets up routing and context providers.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context';
import { Layout } from './components/layout';
import { LoadingPage, ScrollToTop } from './components/common';

// Public Pages
import {
  Home,
  VehiclesListing,
  VehicleDetail,
  SellCar,
  About,
  Contact,
  FAQ
} from './pages';

// Admin Pages (lazy loaded)
import { lazy, Suspense } from 'react';

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminVehicles = lazy(() => import('./pages/admin/Vehicles'));
const AdminVehicleForm = lazy(() => import('./pages/admin/VehicleForm'));
const AdminEnquiries = lazy(() => import('./pages/admin/Enquiries'));
const AdminSellRequests = lazy(() => import('./pages/admin/SellRequests'));

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Admin Layout
function AdminLayout({ children }) {
  return (
    <Suspense fallback={<LoadingPage />}>
      {children}
    </Suspense>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<VehiclesListing />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        {/* Route updated to match links */}
        <Route path="/sell-car" element={<SellCar />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={
        <AdminLayout>
          <AdminLogin />
        </AdminLayout>
      } />

      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/vehicles" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminVehicles />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/vehicles/new" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminVehicleForm />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/vehicles/:id/edit" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminVehicleForm />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/enquiries" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminEnquiries />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/sell-requests" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminSellRequests />
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <a href="/" className="btn btn-primary">Go Home</a>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
