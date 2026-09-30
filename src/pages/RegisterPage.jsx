import React from 'react'

export default function RegisterPage({ registrationForm, setRegistrationForm, handleRegistration, games, errors }) {
  const handleFileChange = (field) => (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setRegistrationForm((prev) => ({ ...prev, [field]: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="page-shell auth-page-shell">
      <div className="landing-container auth-layout">
        <div className="auth-hero-panel">
          <div className="eyebrow">Event Registration</div>
          <h1>Join the sports festival</h1>
          <p>
            Register for your preferred competition and upload your identity proof and profile image in a few simple steps.
          </p>

          <div className="mini-info-grid">
            <div>
              <strong>2 Days</strong>
              <span>Festival schedule</span>
            </div>
            <div>
              <strong>12+</strong>
              <span>Competitions</span>
            </div>
            <div>
              <strong>Open</strong>
              <span>For all categories</span>
            </div>
          </div>
        </div>

        <div className="auth-card register-card">
          <span className="eyebrow">Registration Form</span>
          <h2>Participant Details</h2>

          <form onSubmit={handleRegistration} className="stack-form">
            <label>
              Select Game
              <select
                value={registrationForm.gameId}
                onChange={(e) => setRegistrationForm({ ...registrationForm, gameId: e.target.value })}
                className={errors.registration?.gameId ? 'input-invalid' : ''}
              >
                <option value="">-- Choose a game --</option>
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.registration?.gameId && <span className="field-error">{errors.registration.gameId}</span>}
            </label>

            <div className="two-col-form">
              <label>
                Name
                <input
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                  placeholder="Player name"
                  className={errors.registration?.name ? 'input-invalid' : ''}
                />
                {errors.registration?.name && <span className="field-error">{errors.registration.name}</span>}
              </label>

              <label>
                Father Name
                <input
                  value={registrationForm.fatherName}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, fatherName: e.target.value })}
                  placeholder="Father name"
                  className={errors.registration?.fatherName ? 'input-invalid' : ''}
                />
                {errors.registration?.fatherName && <span className="field-error">{errors.registration.fatherName}</span>}
              </label>
            </div>

            <label>
              Village
              <input
                value={registrationForm.village}
                onChange={(e) => setRegistrationForm({ ...registrationForm, village: e.target.value })}
                placeholder="Village name"
                className={errors.registration?.village ? 'input-invalid' : ''}
              />
              {errors.registration?.village && <span className="field-error">{errors.registration.village}</span>}
            </label>

            <label>
              Aadhaar Number
              <input
                value={registrationForm.aadhaar}
                onChange={(e) => setRegistrationForm({ ...registrationForm, aadhaar: e.target.value })}
                placeholder="12-digit aadhaar"
                className={errors.registration?.aadhaar ? 'input-invalid' : ''}
              />
              {errors.registration?.aadhaar && <span className="field-error">{errors.registration.aadhaar}</span>}
            </label>

            <div className="upload-grid">
              <label className="upload-box">
                <span>Profile Image</span>
                <input type="file" accept="image/*" onChange={handleFileChange('image')} />
                {registrationForm.image && <img src={registrationForm.image} alt="Profile preview" className="upload-preview" />}
              </label>

              <label className="upload-box">
                <span>Aadhaar Upload</span>
                <input type="file" accept="image/*" onChange={handleFileChange('aadhaarImage')} />
                {registrationForm.aadhaarImage && <img src={registrationForm.aadhaarImage} alt="Aadhaar preview" className="upload-preview" />}
              </label>
            </div>

            {errors.registration?.aadhaarImage && <span className="field-error">{errors.registration.aadhaarImage}</span>}

            <button className="primary-btn" type="submit">
              Submit Registration
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
