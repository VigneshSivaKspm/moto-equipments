import React, { useEffect, useState } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = {
    name: !form.name ? 'Veuillez entrer votre nom' : '',
    email: !form.email ? 'Veuillez entrer votre email' : (!emailRegex.test(form.email) ? 'Email invalide' : ''),
    message: !form.message ? 'Veuillez entrer un message' : '',
  };
  const isValid = !errors.name && !errors.email && !errors.message;

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear status when user starts typing again
    if (status.msg) setStatus({ type: '', msg: '' });
  };

  const onBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    
    if (!isValid) {
      setStatus({ type: 'error', msg: 'Veuillez corriger les erreurs du formulaire.' });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus({ 
        type: 'success', 
        msg: 'Merci ! Votre message a été envoyé. Nous vous contacterons prochainement.' 
      });
      setForm({ name: '', email: '', message: '' });
      setTouched({});
    } catch (error) {
      setStatus({ 
        type: 'error', 
        msg: 'Une erreur est survenue. Veuillez réessayer plus tard.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', message: '' });
    setStatus({ type: '', msg: '' });
    setTouched({});
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <div className="hero-badge">📞 Contact</div>
          <h1 className="hero-title">Contactez-<span className="gradient-text">nous</span></h1>
          <p className="hero-description">
            Une question sur nos produits ? Notre équipe d'experts est là pour vous conseiller 
            et vous accompagner dans votre choix d'équipement moto.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">24h</div>
            <div className="stat-label">Réponse moyenne</div>
          </div>
          <div className="stat">
            <div className="stat-number">100%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
          <div className="stat">
            <div className="stat-number">5★</div>
            <div className="stat-label">Service client</div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="contact-container">
          {/* Contact Info Cards */}
          <div className="info-section">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3 className="info-title">Notre Adresse</h3>
              <div className="info-content">
                <p>6 rue de Sarrebourg</p>
                <p>18000 Bourges</p>
                <p>France</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🏢</div>
              <h3 className="info-title">Informations Légales</h3>
              <div className="info-content">
                <p><strong>SIRET:</strong> 94449286700014</p>
                <p><strong>TVA:</strong> FR 25 944492867</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🕒</div>
              <h3 className="info-title">Horaires</h3>
              <div className="info-content">
                <p><strong>Lun - Ven:</strong> 9h - 18h</p>
                <p><strong>Sam:</strong> 10h - 17h</p>
                <p><strong>Dim:</strong> Fermé</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🚚</div>
              <h3 className="info-title">Livraison</h3>
              <div className="info-content">
                <p>Livraison offerte dès 100€</p>
                <p>Retours gratuits 30 jours</p>
                <p>Expédition sous 24h</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="form-section">
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">Formulaire de Contact</h2>
                <p className="form-subtitle">
                  Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              {status.msg && (
                <div className={`status-message ${status.type}`}>
                  {status.msg}
                </div>
              )}

              <form onSubmit={onSubmit} className="contact-form" noValidate>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Nom complet <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder="Votre nom complet"
                      className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
                    />
                    {touched.name && errors.name && (
                      <div className="error-text">{errors.name}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder="vous@exemple.com"
                      className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                    />
                    {touched.email && errors.email && (
                      <div className="error-text">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="message" className="form-label">
                      Message <span className="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder="Comment pouvons-nous vous aider ? Décrivez-nous votre demande..."
                      rows={6}
                      className={`form-input form-textarea ${touched.message && errors.message ? 'error' : ''}`}
                    />
                    {touched.message && errors.message && (
                      <div className="error-text">{errors.message}</div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-button"
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <span className="button-icon">✉️</span>
                        Envoyer le message
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="reset-button"
                  >
                    <span className="button-icon">🔄</span>
                    Réinitialiser
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        /* Hero Section */
        .contact-hero {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 80px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .contact-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 16px;
          line-height: 1.1;
        }

        .gradient-text {
          background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: clamp(1rem, 2vw, 1.25rem);
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Contact Content */
        .contact-content {
          padding: 80px 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .contact-container {
          display: grid;
          grid-template-columns: ${isDesktop ? '1fr 2fr' : '1fr'};
          gap: 48px;
          align-items: start;
        }

        /* Info Section */
        .info-section {
          display: grid;
          gap: 24px;
        }

        .info-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #f1f5f9;
        }

        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }

        .info-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .info-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: #1f2937;
        }

        .info-content {
          color: #6b7280;
          line-height: 1.6;
        }

        .info-content p {
          margin-bottom: 4px;
        }

        .info-content strong {
          color: #374151;
        }

        /* Form Section */
        .form-card {
          background: white;
          border-radius: 20px;
          padding: 48px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
        }

        .form-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .form-subtitle {
          color: #6b7280;
          font-size: 1.125rem;
          line-height: 1.6;
        }

        .status-message {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-weight: 600;
          border: 1px solid;
        }

        .status-message.success {
          background: #ecfdf5;
          border-color: #10b981;
          color: #065f46;
        }

        .status-message.error {
          background: #fef2f2;
          border-color: #ef4444;
          color: #991b1b;
        }

        .contact-form {
          width: 100%;
        }

        .form-grid {
          display: grid;
          grid-template-columns: ${isDesktop ? '1fr 1fr' : '1fr'};
          gap: 20px;
          margin-bottom: 32px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-weight: 600;
          margin-bottom: 8px;
          color: #374151;
          font-size: 0.95rem;
        }

        .required {
          color: #ef4444;
        }

        .form-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          background: #fafafa;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        .error-text {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 6px;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .submit-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(37, 99, 235, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .reset-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: #374151;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 32px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reset-button:hover {
          background: #f8fafc;
          border-color: #d1d5db;
        }

        .button-icon {
          font-size: 1.125rem;
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .contact-container {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .info-section {
            grid-template-columns: ${isTablet ? '1fr 1fr' : '1fr'};
          }
        }

        @media (max-width: 768px) {
          .contact-hero {
            padding: 60px 20px;
          }

          .hero-stats {
            gap: 32px;
          }

          .stat-number {
            font-size: 2rem;
          }

          .contact-content {
            padding: 60px 20px;
          }

          .form-card {
            padding: 32px 24px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .submit-button,
          .reset-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .contact-hero {
            padding: 40px 16px;
          }

          .hero-stats {
            gap: 24px;
          }

          .stat {
            flex: 1;
            min-width: 80px;
          }

          .contact-content {
            padding: 40px 16px;
          }

          .form-card {
            padding: 24px 20px;
          }

          .info-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;