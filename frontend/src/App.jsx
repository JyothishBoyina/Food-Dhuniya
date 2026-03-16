import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Events from './pages/public/Events';
import Zones from './pages/public/Zones';
import Vendors from './pages/public/Vendors';
import Gallery from './pages/public/Gallery';
import Sponsors from './pages/public/PublicSponsors';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BookTicket from './pages/visitor/BookTicket';
import MyTickets from './pages/visitor/MyTickets';
import VendorRegistration from './pages/vendor/VendorRegistration';
import SponsorRegistration from './pages/vendor/SponsorRegistration';
import AdminDashboard from './pages/admin/Dashboard';
import AdminVendors from './pages/admin/Vendors';
import AdminSchedule from './pages/admin/Schedule';
import AdminTickets from './pages/admin/Tickets';
import AdminTicketScanner from './pages/admin/TicketScanner';
import AdminSponsors from './pages/admin/AdminSponsors';
import AdminGallery from './pages/admin/Gallery';
import AdminContentManager from './pages/admin/ContentManager';
import AdminUserRoles from './pages/admin/UserRoles';
import SponsorDashboard from './pages/sponsor/SponsorDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/zones" element={<Zones />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Visitor / Admin Routes */}
              <Route path="/tickets/book" element={
                <ProtectedRoute allowedRoles={['VISITOR', 'ADMIN']}>
                  <BookTicket />
                </ProtectedRoute>
              } />
              <Route path="/tickets/my" element={
                <ProtectedRoute allowedRoles={['VISITOR', 'ADMIN']}>
                  <MyTickets />
                </ProtectedRoute>
              } />

              <Route path="/vendor/register" element={
                <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
                  <VendorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/vendor/sponsor-registration" element={
                <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
                  <SponsorRegistration />
                </ProtectedRoute>
              } />
              <Route path="/vendor/dashboard" element={
                <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
                  <VendorDashboard />
                </ProtectedRoute>
              } />

              <Route path="/sponsor/dashboard" element={
                <ProtectedRoute allowedRoles={['SPONSOR', 'ADMIN']}>
                  <SponsorDashboard />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/vendors" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminVendors />
                </ProtectedRoute>
              } />
              <Route path="/admin/schedule" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminSchedule />
                </ProtectedRoute>
              } />
              <Route path="/admin/tickets" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminTickets />
                </ProtectedRoute>
              } />
              <Route path="/admin/ticket-scanner" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminTicketScanner />
                </ProtectedRoute>
              } />
              <Route path="/admin/sponsors" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminSponsors />
                </ProtectedRoute>
              } />
              <Route path="/admin/gallery" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminGallery />
                </ProtectedRoute>
              } />
              <Route path="/admin/content-manager" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminContentManager />
                </ProtectedRoute>
              } />
              <Route path="/admin/user-roles" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUserRoles />
                </ProtectedRoute>
              } />

              {/* Fallback to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
