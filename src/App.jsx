import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Toasts from './components/Toast'
import Landing from './Landing'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GameListPage from './pages/GameListPage'
import UserListPage from './pages/UserListPage'
import AdminDashboard from './pages/AdminDashboard'
import VolunteerDashboard from './pages/VolunteerDashboard'
import UserDashboard from './pages/UserDashboard'

const API_BASE = 'http://localhost:8000/index.php'

function App() {
	const [session, setSession] = useState({
		loggedIn: false,
		role: null,
		name: '',
	})

	const [loginForm, setLoginForm] = useState({
		username: '',
		password: '',
		role: 'user',
	})

	const [registrationForm, setRegistrationForm] = useState({
		gameId: '1',
		name: '',
		fatherName: '',
		village: '',
		image: '',
		aadhaar: '',
	})

	const [games, setGames] = useState([])
	const [toasts, setToasts] = useState([])
	const [errors, setErrors] = useState({
		login: {},
		registration: {},
		game: {},
		user: {},
		volunteer: {},
		award: {},
	})

	// Load games for landing/register pages
	useEffect(() => {
		loadGames()
	}, [])

	const loadGames = async () => {
		try {
			const res = await fetch(API_BASE, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'list-games' }),
			}).then((r) => r.json())

			if (res?.success && Array.isArray(res.games)) {
				setGames(res.games.map((x) => ({ id: Number(x.id), name: x.name, description: x.description })))
				if (res.games.length > 0 && registrationForm.gameId === '1') {
					setRegistrationForm((prev) => ({ ...prev, gameId: String(res.games[0].id) }))
				}
			}
		} catch (error) {
			console.error('Load games error', error)
		}
	}

	const addToast = (message, type = 'success') => {
		const id = Date.now() + Math.floor(Math.random() * 1000)
		setToasts((c) => [...c, { id, message, type }])
	}

	const removeToast = (id) => setToasts((c) => c.filter((t) => t.id !== id))

	const setFieldError = (form, field, msg) => {
		setErrors((e) => ({ ...e, [form]: { ...(e[form] || {}), [field]: msg } }))
	}

	const clearFormErrors = (form) => {
		setErrors((e) => ({ ...e, [form]: {} }))
	}

	const handleLogin = async (event) => {
		event.preventDefault()
		clearFormErrors('login')

		if (!loginForm.username?.trim()) {
			setFieldError('login', 'username', 'Username required')
			return
		}
		if (!loginForm.password) {
			setFieldError('login', 'password', 'Password required')
			return
		}

		try {
			const response = await fetch(API_BASE, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'login', ...loginForm }),
			})
			const data = await response.json()

			if (data.success) {
				setSession({ loggedIn: true, role: data.user.role, name: data.user.name })
				addToast('Logged in successfully', 'success')
				clearFormErrors('login')
			} else {
				setFieldError('login', 'general', data.message || 'Invalid username or password')
			}
		} catch (error) {
			console.error('Login error', error)
			setFieldError('login', 'general', 'Login failed')
		}
	}

	const handleRegistration = async (event) => {
		event.preventDefault()
		clearFormErrors('registration')

		// Validate
		if (!registrationForm.name.trim()) {
			setFieldError('registration', 'name', 'Name is required')
			return
		}
		if (!registrationForm.fatherName.trim()) {
			setFieldError('registration', 'fatherName', 'Father name is required')
			return
		}
		if (!registrationForm.village.trim()) {
			setFieldError('registration', 'village', 'Village is required')
			return
		}
		if (!registrationForm.aadhaar.trim()) {
			setFieldError('registration', 'aadhaar', 'Aadhaar is required')
			return
		}

		const payload = {
			...registrationForm,
			gameId: Number(registrationForm.gameId),
			image: registrationForm.image || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
		}

		try {
			const res = await fetch(API_BASE, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'register', participant: payload }),
			}).then((r) => r.json())

			if (res?.success) {
				addToast('Registration submitted successfully', 'success')
				setRegistrationForm({
					gameId: registrationForm.gameId,
					name: '',
					fatherName: '',
					village: '',
					image: '',
					aadhaar: '',
					aadhaarImage: '',
				})
			} else {
				addToast(res?.message || 'Registration failed', 'error')
			}
		} catch (error) {
			addToast('Registration failed', 'error')
			console.error('Registration save failed', error)
		}
	}

	const logout = () => {
		setSession({ loggedIn: false, role: null, name: '' })
		setLoginForm({ username: '', password: '', role: 'user' })
	}

	// Protected route wrapper
	const ProtectedRoute = ({ children, requiredRole }) => {
		if (!session.loggedIn) {
			return <Navigate to="/" replace />
		}
		if (requiredRole && session.role !== requiredRole) {
			return <Navigate to="/" replace />
		}
		return children
	}

	return (
		<Router>
			<div className="app">
				{session.loggedIn && (
					<header className="topbar">
						<div>
							<span className="eyebrow">Sports Management</span>
							<h1>Dashboard</h1>
						</div>
						<div className="topbar-actions">
							<span className="role-pill">{session.role}</span>
							<button type="button" className="ghost-btn" onClick={logout}>
								Logout
							</button>
						</div>
					</header>
				)}

				<main className="app-shell">
					<Routes>
						<Route
							path="/"
							element={
								session.loggedIn ? <Navigate to={`/${session.role}`} replace /> : <Landing loginForm={loginForm} setLoginForm={setLoginForm} handleLogin={handleLogin} registrationForm={registrationForm} setRegistrationForm={setRegistrationForm} handleRegistration={handleRegistration} games={games} addToast={addToast} errors={errors} />
							}
						/>

						<Route
							path="/login"
							element={session.loggedIn ? <Navigate to={`/${session.role}`} replace /> : <LoginPage loginForm={loginForm} setLoginForm={setLoginForm} handleLogin={handleLogin} errors={errors} addToast={addToast} />}
						/>

						<Route
							path="/register"
							element={
								session.loggedIn ? <Navigate to={`/${session.role}`} replace /> : <RegisterPage registrationForm={registrationForm} setRegistrationForm={setRegistrationForm} handleRegistration={handleRegistration} games={games} addToast={addToast} errors={errors} />
							}
						/>

						<Route path="/games" element={<GameListPage />} />
						<Route path="/users" element={<UserListPage />} />

						<Route
							path="/admin"
							element={
								<ProtectedRoute requiredRole="admin">
									<AdminDashboard session={session} addToast={addToast} logout={logout} />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/volunteer"
							element={
								<ProtectedRoute requiredRole="volunteer">
									<VolunteerDashboard session={session} addToast={addToast} logout={logout} />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/user"
							element={
								<ProtectedRoute requiredRole="user">
									<UserDashboard session={session} addToast={addToast} logout={logout} />
								</ProtectedRoute>
							}
						/>

						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>

				<Toasts toasts={toasts} removeToast={removeToast} />
			</div>
		</Router>
	)
}

export default App
