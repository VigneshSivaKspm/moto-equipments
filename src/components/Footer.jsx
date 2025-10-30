import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-features">
        <div className="feature">
          <span className="feature-icon">📞</span>
          <div className="feature-info">
            <h3>SERVICE CLIENT</h3>
            <p>04 699 699 16</p>
            <p className="subtitle">Lundi au samedi 9h-18h30</p>
            <p className="small-text">(prix d'un appel local)</p>
          </div>
        </div>
        
        <div className="feature">
          <span className="feature-icon">🚚</span>
          <div className="feature-info">
            <h3>LIVRAISON GRATUITE</h3>
            <p>DÈS 49 € D'ACHAT</p>
          </div>
        </div>
        
        <div className="feature">
          <span className="feature-icon">↩️</span>
          <div className="feature-info">
            <h3>RETOURS GRATUITS*</h3>
            <p>30 jours pour changer d'avis</p>
          </div>
        </div>
        
        <div className="feature">
          <span className="feature-icon">💳</span>
          <div className="feature-info">
            <h3>PAIEMENT EN 3X</h3>
            <p>SANS FRAIS OU EN 4X</p>
            <p className="subtitle">avec nos partenaires Alma & PayPal</p>
          </div>
        </div>
        
        <div className="feature">
          <span className="feature-icon">🏪</span>
          <div className="feature-info">
            <h3>CLICK & COLLECT</h3>
            <p>Commandez en ligne et</p>
            <p>récupérez votre colis 2 h</p>
            <p>plus tard en magasin</p>
          </div>
        </div>
      </div>

      <div className="social-section">
  <h3>RETROUVEZ-NOUS SUR :</h3>
        <div className="social-links">
          <a href="#" className="social-link">Facebook</a>
          <a href="#" className="social-link">Instagram</a>
          <a href="#" className="social-link">YouTube</a>
          <a href="#" className="social-link">Twitter</a>
          <a href="#" className="social-link">TikTok</a>
          <a href="#" className="social-link">LinkedIn</a>
        </div>
      </div>

      <div className="copyright">
  <p>&copy; 2025 SPEEDWAY ÉQUIPEMENTS MOTO & SCOOTER. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
