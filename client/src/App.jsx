import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TableDashboard from './pages/TableDashboard'; 
import Reserve from './pages/Reserve';
import MyReservations from './pages/MyReservations';
import Waitlist from './pages/Waitlist';
import StaffDashboard from './pages/staff/StaffDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
          <Navbar />
          <main style={{ flexGrow: 1, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '32px 16px', boxSizing: 'border-box' }}>
            <Routes>
              {/* Public Core */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Secure Customer Routing */}
              <Route path="/tables" element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <TableDashboard />
                </ProtectedRoute>
              } />
              <Route path="/reserve" element={<ProtectedRoute allowedRoles={['customer']}><Reserve /></ProtectedRoute>} />
              <Route path="/my-reservations" element={<ProtectedRoute allowedRoles={['customer']}><MyReservations /></ProtectedRoute>} />
              <Route path="/waitlist" element={<ProtectedRoute allowedRoles={['customer']}><Waitlist /></ProtectedRoute>} />

              {/* Secure Administrative Control Console */}
              <Route path="/staff/dashboard" element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <StaffDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;