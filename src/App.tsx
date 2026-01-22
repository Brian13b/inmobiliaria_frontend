import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HomePage } from './pages/Home';
import { VentasPage } from './pages/Ventas';
import { AlquileresPage } from './pages/Alquileres';
import { ContactoPage } from './pages/Contacto';
import { PropiedadDetalle } from './pages/PropiedadDetalle';

import { LoginPage } from './pages/admin/Login';
import { DashboardPage } from './pages/admin/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminPropiedades } from './pages/admin/AdminPropiedades';
import { AdminFormulario } from './pages/admin/AdminFormulario';
import { AdminMensajes } from './pages/admin/AdminMensajes';
import { AdminConfig } from './pages/admin/AdminConfig';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const esAdmin = location.pathname.startsWith('/admin') || location.pathname === '/login';

    return (
        <>
            {!esAdmin && <Navbar />}
            {!esAdmin && <WhatsAppButton />}
            {children}
            {!esAdmin && <Footer />}
        </>
    );
};

function App() {
  return (
    <main>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/alquileres" element={<AlquileresPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/propiedad/:id" element={<PropiedadDetalle />} />

            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                  <DashboardPage />
              </ProtectedRoute>
            } />

            <Route path="/admin/mensajes" element={
              <ProtectedRoute>
                  <AdminMensajes />
              </ProtectedRoute>
            } />

            <Route path="/admin/propiedades" element={
                <ProtectedRoute>
                    <AdminPropiedades />
                </ProtectedRoute>
            } />
            <Route path="/admin/propiedades/nueva" element={
                <ProtectedRoute>
                    <AdminFormulario />
                </ProtectedRoute>
            } />
            <Route path="/admin/propiedades/editar/:id" element={
                <ProtectedRoute>
                    <AdminFormulario />
                </ProtectedRoute>
            } />
            <Route path="/admin/configuracion" element={
              <ProtectedRoute>
                  <AdminConfig />
              </ProtectedRoute>
            } />

          </Routes>
        </Layout>
      </BrowserRouter>
    </main>
  );
}

export default App;