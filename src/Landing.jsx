import { Link } from 'react-router-dom'

const cardData = [
  { icon: '🏃', title: 'दौड़ प्रतियोगिता', text: 'स्प्रिंट, मिड-डिस्टेंस और फील्ड इवेंट्स के बेहतरीन मुकाबले.' },
  { icon: '🏆', title: 'कूद प्रतियोगिता', text: 'लंबी कूद, ऊंची कूद और संतुलन पर आधारित चुनौतीपूर्ण इवेंट्स.' },
  { icon: '♟', title: 'ज्ञान एवं खेल', text: 'सामान्य ज्ञान, तर्क, रणनीति और मनोरंजक प्रतियोगिताएं.' },
  { icon: '🎨', title: 'रचनात्मक गतिविधियां', text: 'कला, टीमवर्क और प्रतिभा को उभरने का संपूर्ण मंच.' },
]

const scheduleDayOne = [
  ['09:00', '1600 मीटर दौड़', 'बालक', 'ब्लॉक स्तर'],
  ['09:15', '1000 मीटर दौड़', 'बालिका', 'कक्षा 6 से ऊपर'],
  ['09:30', '1000 मीटर दौड़', 'बालक', 'कक्षा 6 से 9 तक'],
  ['09:40', '500 मीटर दौड़', 'बालिका', 'कक्षा 5 से 8 तक'],
  ['10:00', 'लंबी कूद', 'बालक', 'कक्षा 10 तथा ऊपर'],
  ['10:30', 'ऊंची कूद', 'बालक', 'कक्षा 10 तथा ऊपर'],
  ['11:00', 'बोरी दौड़', 'बालक/बालिका', 'कक्षा 6 से 8 तक'],
  ['16:00', 'लिखित परीक्षा', 'सभी वर्ग', 'सभी'],
  ['17:00', 'शतरंज', 'सभी वर्ग', 'सभी'],
  ['18:00', 'कला/आर्ट', 'बालक/बालिका', 'कक्षा 1 से 5'],
]

const scheduleDayTwo = [
  ['07:00', 'शू-सॉक्स रेस', 'बालक/बालिका', 'कक्षा 2 से 5 तक'],
  ['07:20', 'नींबू-चम्मच रेस', 'बालक/बालिका', 'कक्षा 2 से 5 तक'],
  ['07:40', 'एनिमेशन गेम', 'बालक/बालिका', 'कक्षा 6 से 8 तक'],
  ['08:00', 'साइकिल स्लो रेस', 'बालिका', 'Open'],
  ['08:15', 'संतुलन खेल', 'बालक/बालिका', 'कक्षा 1 से 5 तक'],
  ['08:30', 'म्यूजिकल चेयर', 'बालिका', 'Open'],
  ['09:00', 'पुरस्कार वितरण', '—', '—'],
]

const stats = [
  { value: '2', label: 'दिन', tone: 'gold' },
  { value: '12+', label: 'प्रतियोगिताएं', tone: 'cyan' },
  { value: '500+', label: 'प्रतिभागी', tone: 'pink' },
  { value: '25+', label: 'पुरस्कार', tone: 'green' },
]

export default function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-container nav">
          <Link to="/" className="brand">
            <div className="brand-badge">🏆</div>
            <div>
              <strong>आरव खेलकूद</strong>
              <small>festival of sports & talent</small>
            </div>
          </Link>

          <nav className="navlinks">
            <a href="#home">होम</a>
            <a href="#schedule">कार्यक्रम</a>
            <a href="#sports">खेल</a>
            <a href="#details">विवरण</a>
            <Link className="btn btn-primary register" to="/register">पंजीकरण</Link>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="landing-hero-section">
          <div className="landing-container hero-grid">
            <div className="hero-copy">
              <div className="floating-pill">🏟️ खेल • प्रतिभा • उत्सव</div>
              <h1 className="hero-title">
                आरव दो दिवसीय <span>खेलकूद</span> एवं <span>सामान्य ज्ञान</span> उत्सव
              </h1>
              <p>
                एक ऐसा मंच जहाँ गति, रचनात्मकता, समर्पण और उत्साह एक साथ मिलकर अपनी पहचान बनाते हैं।
                अपने गांव, स्कूल और परिवार का गौरव बढ़ाने के लिए अभी जुड़ें।
              </p>

              <div className="hero-actions">
                <Link className="btn btn-primary" to="/register">🏅 अभी पंजीकरण करें</Link>
                <a className="btn btn-secondary" href="#schedule">📅 कार्यक्रम देखें</a>
              </div>

              <div className="event-meta-row">
                <div className="meta-badge">📍 ग्राम सभा सारीपट्टी</div>
                <div className="meta-badge">📅 06–07 नवम्बर 2026</div>
                <div className="meta-badge">🎉 खुला उत्सव</div>
              </div>
            </div>

            <div className="poster-wrap" aria-label="Sports festival showcase">
              <div className="poster-header">FESTIVAL HIGHLIGHTS</div>
              <div className="poster-box">
                <div className="poster-title">आरव खेलकूद उत्सव</div>
                <div className="poster-subtitle">06–07 नवम्बर 2026</div>
                <ul className="mini-list">
                  <li>🏃 दौड़ प्रतियोगिता</li>
                  <li>🏆 कूद & फील्ड</li>
                  <li>♟ सामान्य ज्ञान</li>
                  <li>🎨 रचनात्मक गतिविधियाँ</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-stat-band">
          <div className="landing-container stat-grid">
            {stats.map((item) => (
              <div key={item.label} className={`stat-card ${item.tone}`}>
                <div className="stat-value">{item.value}</div>
                <div className="stat-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-info" id="sports">
          <div className="landing-container">
            <div className="section-title">
              <div className="eyebrow">खेल & गतिविधियाँ</div>
              <h2 className="section-heading">हर प्रतिभागी के लिए कुछ खास</h2>
            </div>

            <div className="cards">
              {cardData.map((card) => (
                <div className="landing-card" key={card.title}>
                  <div className="icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="schedule" className="landing-schedule">
          <div className="landing-container">
            <div className="section-title">
              <div className="eyebrow">कार्यक्रम की समय-सारणी</div>
              <h2 className="section-heading">दो दिनों का शानदार कार्यक्रम</h2>
              <p>हर गतिविधि को thoughtfully planned किया गया है ताकि सबको सबसे अच्छा अनुभव मिले।</p>
            </div>

            <div className="day">
              <div className="day-title">प्रथम दिवस कार्यक्रम — 06/11/2026</div>
              <table>
                <thead>
                  <tr>
                    <th>समय</th>
                    <th>गतिविधि</th>
                    <th>वर्ग</th>
                    <th>योग्यता</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleDayOne.map(([time, activity, category, eligibility]) => (
                    <tr key={`${time}-${activity}`}>
                      <td>{time}</td>
                      <td>{activity}</td>
                      <td>{category}</td>
                      <td>{eligibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="day">
              <div className="day-title">द्वितीय दिवस कार्यक्रम — 07/11/2026</div>
              <table>
                <thead>
                  <tr>
                    <th>समय</th>
                    <th>गतिविधि</th>
                    <th>वर्ग</th>
                    <th>योग्यता</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleDayTwo.map(([time, activity, category, eligibility]) => (
                    <tr key={`${time}-${activity}`}>
                      <td>{time}</td>
                      <td>{activity}</td>
                      <td>{category}</td>
                      <td>{eligibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="details" className="event-details">
          <div className="landing-container details-grid">
            <div className="details-panel">
              <div className="eyebrow eyebrow-light">आयोजन विवरण</div>
              <h3>खेल और संस्कृति का संगम</h3>
              <img src="/assets/event-details.jpg" alt="आरव खेलकूद उत्सव आयोजन समिति" className="event-poster-image" />
              <p>यह उत्सव ग्रामीण प्रतिभा, स्वास्थ्य, अनुशासन, और सामुदायिक सहभागिता को बढ़ावा देता है।</p>
            </div>

            <div className="details-content">
              <div className="detail-box">
                <h3>🏅 प्रतियोगिता की विशेषताएं</h3>
                <ul>
                  <li>खेल, अनुशासन और टीमवर्क का संतुलित मंच</li>
                  <li>सामान्य ज्ञान, रणनीति और रचनात्मकता</li>
                  <li>सभी आयु वर्गों के लिए अवसर</li>
                  <li>अच्छे प्रदर्शन के लिए सम्मान और पुरस्कार</li>
                </ul>
              </div>

              <div className="detail-box detail-box-committee">
                <h3>🌟 आयोजन समिति</h3>
                <div className="committee-list">
                  <div className="committee-role">
                    <span>मुख्य आयोजक</span>
                    <strong>आरव खेलकूद समिति</strong>
                  </div>
                  <div className="committee-role">
                    <span>सहयोगी</span>
                    <strong>ग्राम सहयोगी एवं स्वयंसेवी टीम</strong>
                  </div>
                  <div className="committee-role">
                    <span>मार्गदर्शक</span>
                    <strong>समिति के वरिष्ठ मार्गदर्शक एवं प्रबुद्धजन</strong>
                  </div>
                </div>
              </div>

              <div className="detail-box">
                <h3>📅 आयोजन</h3>
                <p><strong>दिनांक:</strong> 06 एवं 07 नवम्बर 2026</p>
                <p><strong>स्थान:</strong> ग्राम सभा सारीपट्टी</p>
              </div>

              <div className="detail-box">
                <h3>📌 उद्देश्य</h3>
                <p>मुख्य आयोजक, सहयोगी, मार्गदर्शक एवं स्वयंसेवकों की पूरी जानकारी कार्यक्रम पोस्टर में दी गई है।</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="landing-cta">
          <div className="landing-container">
            <h2>अपनी प्रतिभा दिखाने के लिए तैयार हैं?</h2>
            <p>खेल चुनें, टीम बनाएं और इस उत्सव में शिरकत करें।</p>
            <Link className="btn btn-primary" to="/register">🏅 पंजीकरण शुरू करें</Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container footer-inner">
          <div>
            <strong>आरव खेलकूद उत्सव</strong>
            <p>खेलें • प्रतिस्पर्धा करें • आगे बढ़ें</p>
          </div>
          <div>
            <a href="#home">होम</a>
            <a href="#schedule">कार्यक्रम</a>
            <Link to="/register">पंजीकरण</Link>
            <Link to="/login">लॉगिन</Link>
          </div>
          <p>© 2026 Sports Management System.</p>
        </div>
      </footer>
    </div>
  )
}
