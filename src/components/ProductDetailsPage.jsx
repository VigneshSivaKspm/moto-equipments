import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;
  const source = state?.source;

  const [activeIdx, setActiveIdx] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!product) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">😔</div>
          <h1>Produit introuvable</h1>
          <p>Aucune donnée de produit n'a été fournie.</p>
          <button onClick={() => navigate(-1)} className="back-button">
            ← Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const images = Array.isArray(product.images) ? product.images : [];
  const name = product.name || product.title || 'Produit';
  const brand = product.brand || product.manufacturer || '';
  const description = product.description || '';

  const resolvedImages = useMemo(() => {
    return images.map((img) => (img && img.startsWith('/') ? img : `/assets/Product-images/${(source || 'Products')}/${img}`)).filter(Boolean);
  }, [images, source]);

  const hasImages = resolvedImages.length > 0;
  const prevImage = () => setActiveIdx((i) => (i - 1 + resolvedImages.length) % resolvedImages.length);
  const nextImage = () => setActiveIdx((i) => (i + 1) % resolvedImages.length);

  // Price formatting
  const formatPrice = (price) => {
    if (!price) return null;
    if (typeof price === 'string') return price;
    if (typeof price === 'number') return `${price.toFixed(2)} €`;
    if (typeof price === 'object') {
      if (price.web != null) return `${price.web} €`;
      if (price.recommended != null) return `${price.recommended} €`;
      if (price.discounted != null) return `${price.discounted} €`;
      return '';
    }
    return '';
  };

  const p = product.price;
  const webPrice = p && typeof p === 'object' ? p.web : undefined;
  const recommendedPrice = p && typeof p === 'object' ? p.recommended : undefined;
  const salePrice = product.salePrice;
  const currentPrice = formatPrice(webPrice || salePrice || p || product.price || product.salePrice);
  const originalPrice = formatPrice(recommendedPrice || product.originalPrice);
  const hasDiscount = originalPrice && currentPrice !== originalPrice;

  // Features extraction
  const features = product.features || {};
  const characteristics = product.characteristics || {};

  // Additional info (excluding known fields)
  const additionalInfo = Object.fromEntries(
    Object.entries(product).filter(([k]) => ![
      'images','name','title','brand','manufacturer','features',
      'characteristics','sizes','color','price','salePrice',
      'originalPrice','reviews','description'
    ].includes(k))
  );

  const hasAdditionalInfo = Object.keys(additionalInfo).length > 0;

  // Rating stars
  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  return (
    <div className="product-details-page">
      {/* Navigation */}
      <nav className="breadcrumb">
        <button onClick={() => navigate(-1)} className="back-button">
          <span className="back-icon">←</span>
          Retour
        </button>
        <div className="breadcrumb-path">
          <span>Produits</span>
          <span className="separator">/</span>
          <span>{brand}</span>
          <span className="separator">/</span>
          <span className="current">{name}</span>
        </div>
      </nav>

      {/* Main Product Section */}
      <section className="product-main">
        <div className="product-container">
          {/* Image Gallery */}
          <div className="gallery-section">
            <div className="main-image-container">
              {hasImages ? (
                <img
                  src={resolvedImages[activeIdx]}
                  alt={name}
                  className="main-image"
                />
              ) : (
                <div className="image-placeholder">
                  <span className="placeholder-icon">📷</span>
                  <p>Aucune image disponible</p>
                </div>
              )}
              
              {hasImages && resolvedImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="nav-button prev" aria-label="Image précédente">
                    ‹
                  </button>
                  <button onClick={nextImage} className="nav-button next" aria-label="Image suivante">
                    ›
                  </button>
                </>
              )}

              {hasDiscount && (
                <div className="discount-badge">
                  <span className="discount-text">PROMO</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {hasImages && resolvedImages.length > 1 && (
              <div className="thumbnails">
                {resolvedImages.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`thumbnail ${idx === activeIdx ? 'active' : ''}`}
                    aria-label={`Voir l'image ${idx + 1}`}
                  >
                    <img src={src} alt={`${name} vue ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="info-section">
            <div className="product-header">
              <div className="brand-badge">{brand}</div>
              <h1 className="product-title">{name}</h1>
              
              <div className="rating-section">
                <div className="stars">{renderStars()}</div>
                <span className="rating-text">4.5/5 (128 avis)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="pricing-section">
              {hasDiscount && (
                <div className="original-price">{originalPrice}</div>
              )}
              <div className="current-price">{currentPrice}</div>
              {hasDiscount && (
                <div className="discount-tag">Économisez 25%</div>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="description-section">
                <p>{description}</p>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && Array.isArray(product.sizes) && (
              <div className="size-section">
                <h3 className="section-label">Tailles disponibles</h3>
                <div className="size-options">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.color && (
              <div className="color-section">
                <h3 className="section-label">Couleur</h3>
                <div className="color-options">
                  <div className="color-option selected">
                    <div className="color-swatch" style={{ backgroundColor: '#374151' }}></div>
                    <span>{product.color}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="action-section">
              <div className="quantity-selector">
                <label htmlFor="quantity" className="section-label">Quantité</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button className="add-to-cart-btn">
                  <span className="btn-icon">🛒</span>
                  Ajouter au panier
                </button>
                <button className="buy-now-btn">
                  <span className="btn-icon">⚡</span>
                  Acheter maintenant
                </button>
              </div>
            </div>

            {/* Features Highlights */}
            <div className="features-highlights">
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <div>
                  <div className="feature-title">Livraison gratuite</div>
                  <div className="feature-desc">Dès 100€ d'achat</div>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">↩️</span>
                <div>
                  <div className="feature-title">Retours gratuits</div>
                  <div className="feature-desc">30 jours pour changer d'avis</div>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <div>
                  <div className="feature-title">Garantie 2 ans</div>
                  <div className="feature-desc">Protection complète</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Tabs */}
      <section className="details-section">
        <div className="tabs-container">
          <div className="tabs-header">
            <button 
              className={`tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              Caractéristiques
            </button>
            <button 
              className={`tab ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Spécifications
            </button>
            {hasAdditionalInfo && (
              <button 
                className={`tab ${activeTab === 'additional' ? 'active' : ''}`}
                onClick={() => setActiveTab('additional')}
              >
                Informations
              </button>
            )}
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>Description du produit</h3>
                <p>{description || "Aucune description disponible pour ce produit."}</p>
              </div>
            )}

            {activeTab === 'features' && Object.keys(features).length > 0 && (
              <div className="tab-panel">
                <h3>Caractéristiques principales</h3>
                <div className="features-grid">
                  {Object.entries(features).map(([key, value]) => (
                    <div key={key} className="feature-row">
                      <span className="feature-key">{key}:</span>
                      <span className="feature-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specs' && Object.keys(characteristics).length > 0 && (
              <div className="tab-panel">
                <h3>Spécifications techniques</h3>
                <div className="specs-grid">
                  {Object.entries(characteristics).map(([key, value]) => (
                    <div key={key} className="spec-row">
                      <span className="spec-key">{key}</span>
                      <span className="spec-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'additional' && hasAdditionalInfo && (
              <div className="tab-panel">
                <h3>Informations supplémentaires</h3>
                <div className="additional-grid">
                  {Object.entries(additionalInfo).map(([key, value]) => (
                    <div key={key} className="additional-row">
                      <span className="additional-key">{key}</span>
                      <span className="additional-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .product-details-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding-bottom: 60px;
        }

        /* Breadcrumb Navigation */
        .breadcrumb {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 10px 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: #f8fafc;
          border-color: #d1d5db;
        }

        .back-icon {
          font-size: 1.125rem;
        }

        .breadcrumb-path {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-weight: 500;
        }

        .separator {
          color: #d1d5db;
        }

        .current {
          color: #374151;
          font-weight: 600;
        }

        /* Main Product Section */
        .product-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .product-container {
          display: grid;
          grid-template-columns: ${isDesktop ? '1fr 1fr' : '1fr'};
          gap: 48px;
          margin-bottom: 60px;
        }

        /* Gallery Section */
        .gallery-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .main-image-container {
          position: relative;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
        }

        .main-image {
          width: 100%;
          height: ${isDesktop ? '600px' : isTablet ? '500px' : '400px'};
          object-fit: contain;
          display: block;
        }

        .image-placeholder {
          height: ${isDesktop ? '600px' : isTablet ? '500px' : '400px'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          background: #f9fafb;
        }

        .placeholder-icon {
          font-size: 3rem;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          font-size: 1.25rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .nav-button:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }

        .nav-button.prev {
          left: 16px;
        }

        .nav-button.next {
          right: 16px;
        }

        .discount-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .thumbnails {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 12px;
        }

        .thumbnail {
          padding: 0;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
          height: 80px;
        }

        .thumbnail.active {
          border-color: #2563eb;
        }

        .thumbnail:hover {
          border-color: #2563eb;
          transform: scale(1.05);
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Info Section */
        .info-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .product-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: fit-content;
        }

        .product-title {
          font-size: ${isDesktop ? '2.5rem' : '2rem'};
          font-weight: 800;
          line-height: 1.2;
          color: #1f2937;
          margin: 0;
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .star {
          font-size: 1.125rem;
        }

        .star.full {
          color: #fbbf24;
        }

        .star.half {
          color: #fbbf24;
          opacity: 0.7;
        }

        .star.empty {
          color: #e5e7eb;
        }

        .rating-text {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Pricing Section */
        .pricing-section {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .original-price {
          font-size: 1.25rem;
          color: #9ca3af;
          text-decoration: line-through;
          font-weight: 600;
        }

        .current-price {
          font-size: 2.5rem;
          font-weight: 800;
          color: #ef4444;
        }

        .discount-tag {
          background: #fef3c7;
          color: #92400e;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* Description */
        .description-section {
          color: #6b7280;
          line-height: 1.6;
          font-size: 1.125rem;
        }

        /* Size & Color Sections */
        .section-label {
          font-weight: 700;
          margin-bottom: 12px;
          color: #374151;
          font-size: 1rem;
        }

        .size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .size-option {
          padding: 10px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .size-option.selected {
          border-color: #2563eb;
          background: #2563eb;
          color: white;
        }

        .size-option:hover:not(.selected) {
          border-color: #2563eb;
        }

        .color-options {
          display: flex;
          gap: 12px;
        }

        .color-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          cursor: pointer;
        }

        .color-option.selected {
          border-color: #2563eb;
        }

        .color-swatch {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Action Section */
        .action-section {
          display: grid;
          grid-template-columns: ${isDesktop ? 'auto 1fr' : '1fr'};
          gap: 24px;
          align-items: end;
        }

        .quantity-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          overflow: hidden;
          width: fit-content;
        }

        .quantity-btn {
          padding: 12px 16px;
          border: none;
          background: white;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .quantity-btn:hover {
          background: #f8fafc;
        }

        .quantity-display {
          padding: 12px 20px;
          font-weight: 700;
          min-width: 60px;
          text-align: center;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .add-to-cart-btn, .buy-now-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          justify-content: center;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        .add-to-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(37, 99, 235, 0.4);
        }

        .buy-now-btn {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
        }

        .buy-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(5, 150, 105, 0.4);
        }

        .btn-icon {
          font-size: 1.125rem;
        }

        /* Features Highlights */
        .features-highlights {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          padding: 20px;
          background: white;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feature-icon {
          font-size: 2rem;
        }

        .feature-title {
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .feature-desc {
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* Details Tabs Section */
        .details-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .tabs-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          overflow: hidden;
        }

        .tabs-header {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .tab {
          padding: 20px 32px;
          border: none;
          background: none;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 3px solid transparent;
        }

        .tab.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
          background: white;
        }

        .tab:hover:not(.active) {
          color: #374151;
          background: #f1f5f9;
        }

        .tab-content {
          padding: 32px;
        }

        .tab-panel h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #1f2937;
        }

        .features-grid, .specs-grid, .additional-grid {
          display: grid;
          gap: 12px;
        }

        .feature-row, .spec-row, .additional-row {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .feature-key, .spec-key, .additional-key {
          font-weight: 600;
          color: #374151;
        }

        .feature-value, .spec-value, .additional-value {
          color: #6b7280;
        }

        /* Error State */
        .error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 48px 24px;
        }

        .error-content {
          text-align: center;
          max-width: 400px;
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .error-content h1 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .error-content p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .breadcrumb {
            padding: 16px;
            flex-direction: column;
            align-items: flex-start;
          }

          .product-container {
            gap: 32px;
          }

          .action-section {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .tabs-header {
            flex-direction: column;
          }

          .tab {
            padding: 16px 20px;
            text-align: left;
          }

          .feature-row, .spec-row, .additional-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .features-highlights {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .product-main, .details-section {
            padding: 0 16px;
          }

          .product-title {
            font-size: 1.75rem;
          }

          .current-price {
            font-size: 2rem;
          }

          .nav-button {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .tab-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailsPage;