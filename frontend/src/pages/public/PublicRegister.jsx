import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import { api } from '../../services/api'

export default function PublicRegister() {
  const [games, setGames] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [errors, setErrors] = useState({})
  const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
  const gameDropdownRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    game_ids: [],
    class_id: '',
    village: '',
    mobile: '',
    dob: '2008-01-01',
    gender: 'Male',
    aadhaar_no: '',
    image_url: '',
    aadhaar_url: ''
  })

  const [photoPreview, setPhotoPreview] = useState('')
  const [aadhaarPreview, setAadhaarPreview] = useState('')

  // =========================================================
  // Load Games & Classes
  // =========================================================
  useEffect(() => {
    async function loadOptions() {
      try {
        const gRes = await api.getGames()

        if (gRes?.success && gRes?.data) {
          setGames(gRes.data)

          // Do not automatically select a game.
          setFormData((prev) => ({
            ...prev,
            game_ids: []
          }))
        }

        const cRes = await api.getClasses()

        if (cRes?.success && cRes?.data) {
          setClasses(cRes.data)

          if (cRes.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              class_id: String(cRes.data[0].id)
            }))
          }
        }
      } catch (error) {
        console.error('Failed to load registration options:', error)

        setErrors({
          general: 'पंजीकरण विकल्प लोड करने में समस्या हुई।'
        })
      }
    }

    loadOptions()
  }, [])

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      gameDropdownRef.current &&
      !gameDropdownRef.current.contains(event.target)
    ) {
      setGameDropdownOpen(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)

  return () => {
    document.removeEventListener(
      'mousedown',
      handleClickOutside
    )
  }
}, [])

  // =========================================================
  // Generic Input Change
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }))
    }
  }

  // =========================================================
  // Game Selection
  // =========================================================
  const handleGameSelect = (gameId) => {
    const id = String(gameId)

    setFormData((prev) => {
      const alreadySelected = prev.game_ids.includes(id)

      return {
        ...prev,
        game_ids: alreadySelected
          ? prev.game_ids.filter((game) => game !== id)
          : [...prev.game_ids, id]
      }
    })

    if (errors.game_ids) {
      setErrors((prev) => ({
        ...prev,
        game_ids: null
      }))
    }
  }

  // =========================================================
  // Remove Selected Game
  // =========================================================
  const removeGame = (gameId) => {
    setFormData((prev) => ({
      ...prev,
      game_ids: prev.game_ids.filter(
        (id) => String(id) !== String(gameId)
      )
    }))
  }

  const toggleGameDropdown = () => {
    setGameDropdownOpen((prev) => !prev)
  }

  // =========================================================
  // Photo Upload
  // =========================================================
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]

    if (file) {
      if (file.size > 2097152) {
        setErrors((prev) => ({
          ...prev,
          image: 'File exceeds maximum size limit of 2 MB'
        }))
        return
      }

      const reader = new FileReader()

      reader.onloadend = () => {
        setPhotoPreview(reader.result)

        setFormData((prev) => ({
          ...prev,
          image_url: reader.result
        }))
      }

      reader.readAsDataURL(file)
    }
  }

  // =========================================================
  // Aadhaar Upload
  // =========================================================
  const handleAadhaarUpload = (e) => {
    const file = e.target.files?.[0]

    if (file) {
      if (file.size > 2097152) {
        setErrors((prev) => ({
          ...prev,
          aadhaar_file: 'File exceeds maximum size limit of 2 MB'
        }))
        return
      }

      const reader = new FileReader()

      reader.onloadend = () => {
        setAadhaarPreview(reader.result)

        setFormData((prev) => ({
          ...prev,
          aadhaar_url: reader.result
        }))
      }

      reader.readAsDataURL(file)
    }
  }

  // =========================================================
  // Submit Registration
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({})

    // Validate Games
    if (!formData.game_ids || formData.game_ids.length === 0) {
      setErrors({
        game_ids: 'कृपया कम से कम एक प्रतियोगिता चुनें'
      })

      return
    }

    setLoading(true)

    try {
      const res = await api.registerPlayer(formData)

      setLoading(false)

      if (res?.success) {
        setSubmitted(res.data)

        setGameDropdownOpen(false)

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      } else {
        if (res?.errors) {
          setErrors(res.errors)
        } else {
          setErrors({
            general: res?.message || 'पंजीकरण विफल रहा'
          })
        }
      }
    } catch (error) {
      console.error('Registration error:', error)

      setLoading(false)

      setErrors({
        general: 'पंजीकरण करते समय सर्वर त्रुटि हुई। कृपया पुनः प्रयास करें।'
      })
    }
  }

  // =========================================================
  // Reset Form
  // =========================================================
  const resetRegistrationForm = () => {
    setSubmitted(null)

    setFormData({
      name: '',
      father_name: '',
      game_ids: [],
      class_id: classes[0]?.id
        ? String(classes[0].id)
        : '',
      village: '',
      mobile: '',
      dob: '2008-01-01',
      gender: 'Male',
      aadhaar_no: '',
      image_url: '',
      aadhaar_url: ''
    })

    setGameDropdownOpen(false)
    setPhotoPreview('')
    setAadhaarPreview('')
    setErrors({})

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-app)'
      }}
    >
      <Navbar />

      <main
        style={{
          maxWidth: '820px',
          margin: '30px auto',
          padding: '0 20px',
          width: '100%',
          flex: 1
        }}
      >
        {submitted ? (
          /* ==================================================
             SUCCESS SCREEN
          ================================================== */
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-card)',
              padding: '40px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: 'var(--emerald-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2
              style={{
                fontSize: '1.8rem',
                color: 'var(--slate-900)',
                margin: '0 0 8px'
              }}
            >
              पंजीकरण सफलतापूर्वक दर्ज हुआ!
            </h2>

            <p
              style={{
                color: 'var(--slate-600)',
                fontSize: '1.05rem',
                margin: '0 0 20px'
              }}
            >
              आपकी खिलाड़ी पंजीकरण संख्या (Player ID):{' '}
              <strong>#{submitted.playerId}</strong>
            </p>

            <div
              style={{
                background: 'var(--slate-50)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'left',
                maxWidth: '500px',
                margin: '0 auto 28px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <span style={{ color: 'var(--slate-500)' }}>
                  वर्तमान स्थिति (Status):
                </span>

                <span className="badge-pill badge-pending">
                  लंबित (Pending Review)
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <span style={{ color: 'var(--slate-500)' }}>
                  खिलाड़ी नाम:
                </span>

                <strong>{formData.name}</strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <span style={{ color: 'var(--slate-500)' }}>
                  मोबाइल नंबर:
                </span>

                <strong>{formData.mobile}</strong>
              </div>

              {/* Selected Games */}
              <div
                style={{
                  marginTop: '12px'
                }}
              >
                <span
                  style={{
                    display: 'block',
                    color: 'var(--slate-500)',
                    marginBottom: '8px'
                  }}
                >
                  प्रतियोगिताएं:
                </span>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}
                >
                  {formData.game_ids.map((gameId) => {
                    const game = games.find(
                      (g) =>
                        String(g.id) === String(gameId)
                    )

                    if (!game) return null

                    return (
                      <span
                        key={game.id}
                        style={{
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          borderRadius: '6px',
                          padding: '5px 9px',
                          fontSize: '13px',
                          color: '#334155'
                        }}
                      >
                        {game.name}
                      </span>
                    )
                  })}
                </div>
              </div>

              <p
                style={{
                  margin: '12px 0 0',
                  fontSize: '0.84rem',
                  color: 'var(--slate-600)'
                }}
              >
                {submitted.message}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetRegistrationForm}
              >
                नया पंजीकरण करें (Register Another)
              </button>

              <Link
                to="/login"
                className="btn btn-primary"
              >
                खिलाड़ी पोर्टल लॉगिन करें (Login Dashboard)
              </Link>
            </div>
          </div>
        ) : (
          /* ==================================================
             REGISTRATION FORM
          ================================================== */
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-card)',
              padding: '36px',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {/* Header */}
            <div
              style={{
                borderBottom: '1px solid var(--slate-100)',
                paddingBottom: '18px',
                marginBottom: '24px'
              }}
            >
              <Link
                to="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  color: 'var(--purple-600)',
                  marginBottom: '12px',
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={16} />
                मुख्य पृष्ठ पर वापस जाएं
              </Link>

              <h2
                style={{
                  fontSize: '1.8rem',
                  color: 'var(--slate-900)',
                  margin: '0 0 6px'
                }}
              >
                खिलाड़ी प्रवेश एवं पंजीकरण प्रपत्र
                (Athlete Registration)
              </h2>

              <p
                style={{
                  color: 'var(--slate-600)',
                  margin: 0,
                  fontSize: '0.92rem'
                }}
              >
                कृपया सभी विवरण आधार कार्ड के अनुसार
                सही-सही भरें। (All fields are strictly
                verified by field volunteers).
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div
                style={{
                  padding: '12px 16px',
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: '8px',
                  color: '#9f1239',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <AlertCircle size={18} />

                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* ==================================================
                  NAME + FATHER NAME
              ================================================== */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
                  gap: '18px'
                }}
              >
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">
                    खिलाड़ी का पूरा नाम (Full Name) *
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="उदा. रोहित कुमार (Rohit Kumar)"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  {errors.name && (
                    <div className="form-error">
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Father Name */}
                <div className="form-group">
                  <label className="form-label">
                    पिता का नाम (Father's Name) *
                  </label>

                  <input
                    type="text"
                    name="father_name"
                    className="form-input"
                    placeholder="उदा. श्री राजेन्द्र कुमार"
                    value={formData.father_name}
                    onChange={handleChange}
                    required
                  />

                  {errors.father_name && (
                    <div className="form-error">
                      {errors.father_name}
                    </div>
                  )}
                </div>
              </div>

              {/* ==================================================
                  GAME + CLASS
              ================================================== */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
                  gap: '18px',
                  marginTop: '18px'
                }}
              >
                {/* ==================================================
                    GAME MULTI SELECT
                ================================================== */}
                <div className="form-group">
                  <label className="form-label">
                    प्रतियोगिता चुनें (Select Games) *
                  </label>

                  <div
                    ref={gameDropdownRef}
                    style={{
                      position: 'relative',
                      width: '100%'
                    }}
                  >
                    {/* Selected Games Box */}
                    <div
                      onClick={toggleGameDropdown}
                      style={{
                        minHeight: '40px',
                        width: '100%',
                        boxSizing: 'border-box',
                        border: errors.game_ids
                          ? '1px solid #ef4444'
                          : '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '6px 42px 6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '6px',
                        cursor: 'pointer',
                        background: '#ffffff',
                        position: 'relative',
                        transition:
                          'border-color 0.2s'
                      }}
                    >
                      {/* Placeholder */}
                      {formData.game_ids.length === 0 && (
                        <span
                          style={{
                            color: '#94a3b8',
                            fontSize: '14px'
                          }}
                        >
                          प्रतियोगिता चुनें (Select Games)
                        </span>
                      )}

                      {/* Selected Game Chips */}
                      {formData.game_ids.map((gameId) => {
                        const game = games.find(
                          (g) =>
                            String(g.id) === String(gameId)
                        )

                        if (!game) return null

                        return (
                          <span
                            key={game.id}
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '2px 8px',
                              border:
                                '1px solid #cbd5e1',
                              borderRadius: '6px',
                              background: '#f8fafc',
                              color: '#334155',
                              fontSize: '13px',
                              lineHeight: '1.2',
                              maxWidth: '100%'
                            }}
                          >
                            <span
                              style={{
                                overflow: 'hidden',
                                textOverflow:
                                  'ellipsis',
                                whiteSpace:
                                  'nowrap'
                              }}
                            >
                              {game.name}
                            </span>

                            {game.category && (
                              <span
                                style={{
                                  color: '#64748b',
                                  fontSize: '11px'
                                }}
                              >
                                ({game.category})
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeGame(game.id)
                              }}
                              aria-label={`Remove ${game.name}`}
                              style={{
                                border: 'none',
                                background:
                                  'transparent',
                                cursor: 'pointer',
                                padding: '0 2px',
                                margin: 0,
                                fontSize: '16px',
                                lineHeight: '1',
                                color: '#64748b',
                                flexShrink: 0
                              }}
                            >
                              ×
                            </button>
                          </span>
                        )
                      })}

                      {/* Dropdown Arrow */}
                      <span
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: `translateY(-50%) ${
                            gameDropdownOpen
                              ? 'rotate(180deg)'
                              : ''
                          }`,
                          transition:
                            'transform 0.2s ease',
                          color: '#64748b',
                          fontSize: '12px',
                          pointerEvents: 'none'
                        }}
                      >
                        ▼
                      </span>
                    </div>

                    {/* Dropdown */}
                    {gameDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 5px)',
                          left: 0,
                          right: 0,
                          background: '#ffffff',
                          border:
                            '1px solid #cbd5e1',
                          borderRadius: '8px',
                          boxShadow:
                            '0 8px 24px rgba(0, 0, 0, 0.12)',
                          zIndex: 1000,
                          maxHeight: '240px',
                          overflowY: 'auto'
                        }}
                      >
                        {games.length === 0 ? (
                          <div
                            style={{
                              padding: '14px',
                              color: '#64748b',
                              fontSize: '14px',
                              textAlign: 'center'
                            }}
                          >
                            कोई प्रतियोगिता उपलब्ध
                            नहीं है
                          </div>
                        ) : (
                          games.map((game) => {
                            const selected =
                              formData.game_ids.includes(
                                String(game.id)
                              )

                            return (
                              <div
                                key={game.id}
                                onClick={() =>
                                  handleGameSelect(
                                    game.id
                                  )
                                }
                                style={{
                                  padding:
                                    '11px 12px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems:
                                    'center',
                                  gap: '10px',
                                  background:
                                    selected
                                      ? '#f1f5f9'
                                      : '#ffffff',
                                  borderBottom:
                                    '1px solid #f1f5f9',
                                  fontSize: '14px',
                                  transition:
                                    'background 0.15s'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  readOnly
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                  }}
                                />

                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection:
                                      'column',
                                    gap: '2px',
                                    minWidth: 0
                                  }}
                                >
                                  <span
                                    style={{
                                      color:
                                        '#334155',
                                      fontWeight:
                                        selected
                                          ? 600
                                          : 400
                                    }}
                                  >
                                    {game.name}
                                  </span>

                                  {game.category && (
                                    <span
                                      style={{
                                        color:
                                          '#94a3b8',
                                        fontSize:
                                          '12px'
                                      }}
                                    >
                                      {game.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected Count */}
                  {formData.game_ids.length > 0 && (
                    <div
                      style={{
                        marginTop: '6px',
                        fontSize: '12px',
                        color: '#64748b'
                      }}
                    >
                      {formData.game_ids.length}{' '}
                      {formData.game_ids.length === 1
                        ? 'प्रतियोगिता चयनित'
                        : 'प्रतियोगिताएं चयनित'}
                    </div>
                  )}

                  {errors.game_ids && (
                    <div className="form-error">
                      {errors.game_ids}
                    </div>
                  )}
                </div>

                {/* ==================================================
                    CLASS
                ================================================== */}
                <div className="form-group">
                  <label className="form-label">
                    वर्ग / श्रेणी चुनें (Class / Division) *
                  </label>

                  <select
                    name="class_id"
                    className="form-select"
                    value={formData.class_id}
                    onChange={handleChange}
                    required
                  >
                    {classes.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                      >
                        {c.class_name} ({c.class_code})
                      </option>
                    ))}
                  </select>

                  {errors.class_id && (
                    <div className="form-error">
                      {errors.class_id}
                    </div>
                  )}
                </div>
              </div>

              {/* ==================================================
                  MOBILE + VILLAGE
              ================================================== */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
                  gap: '18px',
                  marginTop: '18px'
                }}
              >
                {/* Mobile */}
                <div className="form-group">
                  <label className="form-label">
                    मोबाइल नंबर (Mobile Number) *
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    className="form-input"
                    placeholder="10 अंकों का मोबाइल (9876543210)"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    required
                  />

                  {errors.mobile && (
                    <div className="form-error">
                      {errors.mobile}
                    </div>
                  )}
                </div>

                {/* Village */}
                <div className="form-group">
                  <label className="form-label">
                    ग्राम / पता (Village / Address) *
                  </label>

                  <input
                    type="text"
                    name="village"
                    className="form-input"
                    placeholder="उदा. सारीपट्टी, बटेश्वर, मिर्जापुर"
                    value={formData.village}
                    onChange={handleChange}
                    required
                  />

                  {errors.village && (
                    <div className="form-error">
                      {errors.village}
                    </div>
                  )}
                </div>
              </div>

              {/* ==================================================
                  DOB + GENDER + AADHAAR
              ================================================== */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
                  gap: '18px',
                  marginTop: '18px'
                }}
              >
                {/* DOB */}
                <div className="form-group">
                  <label className="form-label">
                    जन्म तिथि (Date of Birth) *
                  </label>

                  <input
                    type="date"
                    name="dob"
                    className="form-input"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />

                  {errors.dob && (
                    <div className="form-error">
                      {errors.dob}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label className="form-label">
                    लिंग (Gender) *
                  </label>

                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">
                      पुरुष (Male)
                    </option>

                    <option value="Female">
                      महिला (Female)
                    </option>

                    <option value="Other">
                      अन्य (Other)
                    </option>
                  </select>
                </div>

                {/* Aadhaar Number */}
                <div className="form-group">
                  <label className="form-label">
                    आधार संख्या (12-Digit Aadhaar) *
                  </label>

                  <input
                    type="text"
                    name="aadhaar_no"
                    className="form-input"
                    placeholder="1234 5678 9012"
                    value={formData.aadhaar_no}
                    onChange={handleChange}
                    maxLength={14}
                    required
                  />

                  {errors.aadhaar_number && (
                    <div className="form-error">
                      {errors.aadhaar_number}
                    </div>
                  )}
                </div>
              </div>

              {/* ==================================================
                  PHOTO + AADHAAR UPLOAD
              ================================================== */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
                  gap: '18px',
                  marginTop: '28px'
                }}
              >
                {/* Photo */}
                <div
                  className="form-group"
                  style={{
                    border:
                      '1px dashed var(--slate-300)',
                    padding: '16px',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}
                >
                  <label
                    className="form-label"
                    style={{
                      marginBottom: '8px'
                    }}
                  >
                    खिलाड़ी पासपोर्ट फोटो
                    (Photo - Max 2MB)
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    style={{
                      fontSize: '0.85rem'
                    }}
                  />

                  {photoPreview && (
                    <div
                      style={{
                        marginTop: '10px'
                      }}
                    >
                      <img
                        src={photoPreview}
                        alt="Photo Preview"
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          margin: '0 auto',
                          border:
                            '2px solid var(--purple-500)'
                        }}
                      />
                    </div>
                  )}

                  {errors.image && (
                    <div className="form-error">
                      {errors.image}
                    </div>
                  )}
                </div>

                {/* Aadhaar Document */}
                <div
                  className="form-group"
                  style={{
                    border:
                      '1px dashed var(--slate-300)',
                    padding: '16px',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}
                >
                  <label
                    className="form-label"
                    style={{
                      marginBottom: '8px'
                    }}
                  >
                    आधार कार्ड कॉपी
                    (Aadhaar Doc - Max 2MB)
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleAadhaarUpload}
                    style={{
                      fontSize: '0.85rem'
                    }}
                  />

                  {aadhaarPreview && (
                    <div
                      style={{
                        marginTop: '10px'
                      }}
                    >
                      <img
                        src={aadhaarPreview}
                        alt="Aadhaar Preview"
                        style={{
                          width: '120px',
                          height: '70px',
                          objectFit: 'cover',
                          margin: '0 auto',
                          borderRadius: '4px',
                          border:
                            '1px solid #cbd5e1'
                        }}
                      />
                    </div>
                  )}

                  {errors.aadhaar_file && (
                    <div className="form-error">
                      {errors.aadhaar_file}
                    </div>
                  )}
                </div>
              </div>

              {/* ==================================================
                  FORM ACTIONS
              ================================================== */}
              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop:
                    '1px solid var(--slate-100)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <Link
                  to="/"
                  className="btn btn-secondary"
                >
                  रद्द करें (Cancel)
                </Link>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{
                    minWidth: '160px'
                  }}
                >
                  {loading
                    ? 'दर्ज हो रहा है...'
                    : 'पंजीकरण जमा करें (Submit)'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}