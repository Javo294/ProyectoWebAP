import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trazabilidad from "./pages/Trazabilidad";
import AdminDashboard from "./pages/AdminDashboard";
import TransportistaDashboard from "./pages/TransportistaDashboard";
import DonanteDashboard from "./pages/DonanteDashboard";
import SeguimientoTransportistaAdmin from "./pages/SeguimientoTransportistaAdmin";
import { getCurrentUser } from "./lib/session";

function ProtegerRuta({ children, rol }: { children: React.ReactNode; rol?: string }) {
  const usuario = getCurrentUser();
  if (!usuario) return <Navigate to="/login" replace />;
  if (rol && usuario.role !== rol) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/track" element={<Trazabilidad />} />
        <Route
          path="/admin"
          element={
            <ProtegerRuta rol="admin">
              <AdminDashboard />
            </ProtegerRuta>
          }
        />
        <Route
          path="/transportista"
          element={
            <ProtegerRuta rol="transporter">
              <TransportistaDashboard />
            </ProtegerRuta>
          }
        />
        <Route
          path="/donante"
          element={
            <ProtegerRuta rol="donor">
              <DonanteDashboard />
            </ProtegerRuta>
          }
        />
        <Route
          path="/admin/seguimiento"
          element={
            <ProtegerRuta rol="admin">
              <SeguimientoTransportistaAdmin />
            </ProtegerRuta>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
