import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Shield, MapPin, Phone, Calendar, Upload, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import { api } from '../../services/api'

export default function PublicRegister() {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    game_id: '',
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

  useEffect(() => {
    async function loadOptions() {
      const gRes = await api.getGames()
      if (gRes.success && gRes.data) {
        setGames(gRes.data)
        if (gRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, game_id: String(gRes.data[0].id) }))
        }
      }

      const cRes = await api.getClasses()
      if (cRes.success && cRes.data) {
        setClasses(cRes.data)
        if (cRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, class_id: String(cRes.data[0].id) }))
        }
      }
    }
    loadOptions()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  // Handle local image file preview
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2097152) {
        setErrors((prev) => ({ ...prev, image: 'File exceeds maximum size limit of 2 MB' }))
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
        setFormData((prev) => ({ ...prev, image_url: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAadhaarUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2097152) {
        setErrors((prev) => ({ ...prev, aadhaar_file: 'File exceeds maximum size limit of 2 MB' }))
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setAadhaarPreview(reader.result)
        setFormData((prev) => ({ ...prev, aadhaar_url: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const res = await api.registerPlayer(formData)
    setLoading(false)

    if (res.success) {
      setSubmitted(res.data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (res.errors) {
        setErrors(res.errors)
      } else {
        setErrors({ general: res.message || 'पंजीकरण विफल रहा' })
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      <main style={{ maxWidth: '820px', margin: '30px auto', padding: '0 20px', width: '100%', flex: 1 }}>
        {submitted ? (
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-card)',
            padding: '40px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.8rem', color: 'var(--slate-900)', margin: '0 0 8px' }}>
              पंजीकरण सफलतापूर्वक दर्ज हुआ!
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem', margin: '0 0 20px' }}>
              आपकी खिलाड़ी पंजीकरण संख्या (Player ID): <strong>#{submitted.playerId}</strong>
            </p>

            <div style={{ background: 'var(--slate-50)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'left', maxWidth: '500px', margin: '0 auto 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--slate-500)' }}>वर्तमान स्थिति (Status):</span>
                <span className="badge-pill badge-pending">लंबित (Pending Review)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--slate-500)' }}>खिलाड़ी नाम:</span>
                <strong>{formData.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--slate-500)' }}>मोबाइल नंबर:</span>
                <strong>{formData.mobile}</strong>
              </div>
              <p style={{ margin: '12px 0 0', fontSize: '0.84rem', color: 'var(--slate-600)' }}>
                {submitted.message}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSubmitted(null)
                  setFormData({
                    name: '',
                    father_name: '',
                    game_id: games[0]?.id || '',
                    class_id: classes[0]?.id || '',
                    village: '',
                    mobile: '',
                    dob: '2008-01-01',
                    gender: 'Male',
                    aadhaar_no: '',
                    image_url: '',
                    aadhaar_url: ''
                  })
                  setPhotoPreview('')
                  setAadhaarPreview('')
                }}
              >
                नया पंजीकरण करें (Register Another)
              </button>
              <Link to="/login" className="btn btn-primary">
                खिलाड़ी पोर्टल लॉगिन करें (Login Dashboard)
              </Link>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-card)',
            padding: '36px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ borderBottom: '1px solid var(--slate-100)', paddingBottom: '18px', marginBottom: '24px' }}>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--purple-600)', marginBottom: '12px', fontWeight: 600 }}>
                <ArrowLeft size={16} /> मुख्य पृष्ठ पर वापस जाएं
              </Link>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--slate-900)', margin: '0 0 6px' }}>
                खिलाड़ी प्रवेश एवं पंजीकरण प्रपत्र (Athlete Registration)
              </h2>
              <p style={{ color: 'var(--slate-600)', margin: 0, fontSize: '0.92rem' }}>
                कृपया सभी विवरण आधार कार्ड के अनुसार सही-सही भरें। (All fields are strictly verified by field volunteers).
              </p>
            </div>

            {errors.general && (
              <div style={{ padding: '12px 16px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', color: '#9f1239', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={18} />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
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
                  {errors.name && <div className="form-error">{errors.name}</div>}
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
                  {errors.father_name && <div className="form-error">{errors.father_name}</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                {/* Game Select (Dynamic from DB) */}
                <div className="form-group">
                  <label className="form-label">
                    प्रतियोगिता चुनें (Select Game) *
                  </label>
                  <select
                    name="game_id"
                    className="form-select"
                    value={formData.game_id}
                    onChange={handleChange}
                    required
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} — {g.category}
                      </option>
                    ))}
                  </select>
                  {errors.game_id && <div className="form-error">{errors.game_id}</div>}
                </div>

                {/* Class Division Select (Dynamic from DB) */}
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
                      <option key={c.id} value={c.id}>
                        {c.class_name} ({c.class_code})
                      </option>
                    ))}
                  </select>
                  {errors.class_id && <div className="form-error">{errors.class_id}</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
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
                  {errors.mobile && <div className="form-error">{errors.mobile}</div>}
                </div>

                {/* Village / Address */}
                <div className="form-group">
                  <label className="form-label">
                    ग्राम / पता (Village / Address) *
                  </label>
                  <input
                    type="text"
                    name="village"
                    className="form-input"
                    placeholder="उदा. सारीपट्टी, बटेश्वर, आजमगढ़"
                    value={formData.village}
                    onChange={handleChange}
                    required
                  />
                  {errors.village && <div className="form-error">{errors.village}</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
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
                  {errors.dob && <div className="form-error">{errors.dob}</div>}
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
                    <option value="Male">पुरुष (Male)</option>
                    <option value="Female">महिला (Female)</option>
                    <option value="Other">अन्य (Other)</option>
                  </select>
                </div>

                {/* Aadhaar Number (12 digits) */}
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
                  {errors.aadhaar_number && <div className="form-error">{errors.aadhaar_number}</div>}
                </div>
              </div>

              {/* Photo & Aadhaar Uploads */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '10px' }}>
                <div className="form-group" style={{ border: '1px dashed var(--slate-300)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>
                    खिलाड़ी पासपोर्ट फोटो (Photo - Max 2MB)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {photoPreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={photoPreview}
                        alt="Photo Preview"
                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto', border: '2px solid var(--purple-500)' }}
                      />
                    </div>
                  )}
                  {errors.image && <div className="form-error">{errors.image}</div>}
                </div>

                <div className="form-group" style={{ border: '1px dashed var(--slate-300)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>
                    आधार कार्ड कॉपी (Aadhaar Doc - Max 2MB)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleAadhaarUpload}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {aadhaarPreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={aadhaarPreview}
                        alt="Aadhaar Preview"
                        style={{ width: '120px', height: '70px', objectFit: 'cover', margin: '0 auto', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  )}
                  {errors.aadhaar_file && <div className="form-error">{errors.aadhaar_file}</div>}
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Link to="/" className="btn btn-secondary">
                  रद्द करें (Cancel)
                </Link>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '160px' }}>
                  {loading ? 'दर्ज हो रहा है...' : 'पंजीकरण जमा करें (Submit)'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
