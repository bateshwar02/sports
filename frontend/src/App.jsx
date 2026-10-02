import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'

// Public Portal Pages
import LandingPage from './pages/public/LandingPage'
import PublicRegister from './pages/public/PublicRegister'
import LoginPage from './pages/public/LoginPage'
import PublicGames from './pages/public/PublicGames'
import PublicWinners from './pages/public/PublicWinners'

// Admin Suite Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPlayers from './pages/admin/AdminPlayers'
import AdminVolunteers from './pages/admin/AdminVolunteers'
import AdminGames from './pages/admin/AdminGames'
import AdminClasses from './pages/admin/AdminClasses'
import AdminWinners from './pages/admin/AdminWinners'
import AdminReports from './pages/admin/AdminReports'

// Volunteer Desk Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard'
import VolunteerPlayers from './pages/volunteer/VolunteerPlayers'
import VolunteerGames from './pages/volunteer/VolunteerGames'
import VolunteerClasses from './pages/volunteer/VolunteerClasses'
import VolunteerWinners from './pages/volunteer/VolunteerWinners'

// Player Hub Pages
import PlayerDashboard from './pages/player/PlayerDashboard'
import PlayerProfile from './pages/player/PlayerProfile'
import PlayerRegistration from './pages/player/PlayerRegistration'
import PlayerResults from './pages/player/PlayerResults'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ===============================================================
            1. Public Portal (Blueprint Section 12)
            /, /register, /login, /games, /winners
            =============================================================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<PublicRegister />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/games" element={<PublicGames />} />
        <Route path="/winners" element={<PublicWinners />} />

        {/* ===============================================================
            2. Admin Suite (Blueprint Section 12: Role Admin Only)
            /admin/dashboard, /admin/players, /admin/volunteers, /admin/games,
            /admin/classes, /admin/winners, /admin/reports
            =============================================================== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/players"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPlayers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/volunteers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminVolunteers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/games"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminGames />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/winners"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminWinners />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* ===============================================================
            3. Volunteer Desk (Blueprint Section 12: Role Volunteer Only)
            /volunteer/dashboard, /volunteer/players, /volunteer/games,
            /volunteer/classes, /volunteer/winners
            =============================================================== */}
        <Route
          path="/volunteer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/players"
          element={
            <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
              <VolunteerPlayers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/games"
          element={
            <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
              <VolunteerGames />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/classes"
          element={
            <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
              <VolunteerClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/winners"
          element={
            <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
              <VolunteerWinners />
            </ProtectedRoute>
          }
        />

        {/* ===============================================================
            4. Player Hub (Blueprint Section 12: Role Authenticated Player)
            /player/dashboard, /player/profile, /player/registration, /player/results
            =============================================================== */}
        <Route
          path="/player/dashboard"
          element={
            <ProtectedRoute allowedRoles={['player', 'admin', 'volunteer']}>
              <PlayerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/profile"
          element={
            <ProtectedRoute allowedRoles={['player', 'admin', 'volunteer']}>
              <PlayerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/registration"
          element={
            <ProtectedRoute allowedRoles={['player', 'admin', 'volunteer']}>
              <PlayerRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/results"
          element={
            <ProtectedRoute allowedRoles={['player', 'admin', 'volunteer']}>
              <PlayerResults />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
