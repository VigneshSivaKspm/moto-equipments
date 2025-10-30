import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import "../App.css";

// Enhanced translation helpers
const translateName = (name) => {
  if (!name) return name;
  return name
    .replace(/Women's/gi, 'Femme')
    .replace(/Men's/gi, 'Homme')
    .replace(/Lady/gi, 'Femme')
    .replace(/Jacket/gi, 'Blouson')
    .replace(/Gloves?/gi, 'Gants')
    .replace(/Black/gi, 'Noir')
    .replace(/White/gi, 'Blanc')
    .replace(/Red/gi, 'Rouge')
    .replace(/Blue/gi, 'Bleu')
    .replace(/Navy/gi, 'Navy')
    .replace(/Brown/gi, 'Marron')
    .replace(/Fushia/gi, 'Fuchsia');
};

const translateValue = (val) => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/Summer\s*\/\s*Mid-season/gi, 'Été / Mi-saison')
    .replace(/All seasons/gi, 'Toutes saisons')
    .replace(/Summer/gi, 'Été')
    .replace(/Leather/gi, 'Cuir')
    .replace(/Textile/gi, 'Textile')
    .replace(/Man/gi, 'Homme')
    .replace(/Women/gi, 'Femme')
    .replace(/Male/gi, 'Homme')
    .replace(/Female/gi, 'Femme')
    .replace(/Black/gi, 'Noir')
    .replace(/White/gi, 'Blanc')
    .replace(/Red/gi, 'Rouge')
    .replace(/Blue/gi, 'Bleu')
    .replace(/Fuchsia/gi, 'Fuchsia')
    .replace(/Urban/gi, 'Urbain')
    .replace(/Racing/gi, 'Racing')
    .replace(/Roadster\/?Sport/gi, 'Roadster/Sport')
    .replace(/Predisposed back/gi, 'Prédisposé(e) dorsale')
    .replace(/Trouser\/jacket connection/gi, 'Raccord pantalon/veste')
    .replace(/Fixed lining/gi, 'Doublure fixe')
    .replace(/Waterproof/gi, 'Imperméable')
    .replace(/Removable Lining/gi, 'Doublure Amovible')
    .replace(/CE Elbow Protections/gi, 'Protections CE Coudes')
    .replace(/CE Shoulder Protections/gi, 'Protections CE Epaules')
    .replace(/Guarantee/gi, 'Garantie')
    .replace(/Jacket approval/gi, 'Homologation blouson / veste')
    .replace(/Gloves approval/gi, 'Homologation gants')
    .replace(/Motorcycle gloves/gi, 'Gants moto')
    .replace(/Sweatshirt/gi, 'Sweat-shirt')
    .replace(/Veste/gi, 'Veste')
    .replace(/Adventure\/Touring/gi, 'Adventure/Touring')
    .replace(/Vintage\/Néo rétro/gi, 'Vintage/Néo rétro');
};

const getFeature = (features, frKey, enKey) => {
  if (!features) return undefined;
  const v = features[frKey] ?? features[enKey];
  return translateValue(v);
};

const BikerEquipmentsPage = ({ variant = 'grid' }) => {
  const [equipments, setEquipments] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Product categories for filtering
  const categories = [
    { id: 'all', label: 'Tous les produits', icon: '🧥', count: 0 },
    { id: 'blouson', label: 'Blousons', icon: '🧥', count: 0 },
    { id: 'veste', label: 'Vestes', icon: '🛡️', count: 0 },
    { id: 'gants', label: 'Gants', icon: '✋', count: 0 },
    { id: 'dorsale', label: 'Dorsales', icon: '🦴', count: 0 },
    { id: 'gilet_airbag', label: 'Gilets Airbag', icon: '💥', count: 0 },
    { id: 'sweat-shirt', label: 'Sweat-shirts', icon: '👕', count: 0 }
  ];

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        const response = await fetch("/Product-details/Biker_Equipments.json");
        if (!response.ok) throw new Error('Failed to fetch equipment data');
        const data = await response.json();
        setEquipments(data.biker_equipment || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching equipment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Categorize products and count them
  const categorizedEquipments = equipments.map(equipment => {
    const productType = getFeature(equipment.features, "Type de produit", "Product type")?.toLowerCase();
    let category = 'blouson'; // default
    
    if (productType?.includes('gants')) category = 'gants';
    else if (productType?.includes('veste')) category = 'veste';
    else if (productType?.includes('dorsale')) category = 'dorsale';
    else if (productType?.includes('gilet airbag')) category = 'gilet_airbag';
    else if (productType?.includes('sweat')) category = 'sweat-shirt';
    
    return { ...equipment, category };
  });

  // Update category counts
  categories.forEach(cat => {
    if (cat.id !== 'all') {
      cat.count = categorizedEquipments.filter(eq => eq.category === cat.id).length;
    }
  });
  categories[0].count = categorizedEquipments.length;

  // Filter and sort products
  const filteredEquipments = activeFilter === 'all' 
    ? categorizedEquipments 
    : categorizedEquipments.filter(eq => eq.category === activeFilter);

  const sortedEquipments = [...filteredEquipments].sort((a, b) => {
    const priceA = parseFloat(a.price.replace(/[^\d,]/g, '').replace(',', '.'));
    const priceB = parseFloat(b.price.replace(/[^\d,]/g, '').replace(',', '.'));
    
    switch (sortBy) {
      case 'price-low': return priceA - priceB;
      case 'price-high': return priceB - priceA;
      case 'name': return translateName(a.name).localeCompare(translateName(b.name));
      default: return 0; // featured - keep original order
    }
  });

  // Format price for display
  const formatPrice = (priceStr) => {
    if (!priceStr) return 'Prix sur demande';
    return priceStr.replace('€', '€');
  };

  // Get product type icon
  const getProductIcon = (category) => {
    const icons = {
      blouson: '🧥',
      veste: '🛡️',
      gants: '✋',
      dorsale: '🦴',
      gilet_airbag: '💥',
      'sweat-shirt': '👕'
    };
    return icons[category] || '🧥';
  };

  // Get gender icon and color
  const getGenderInfo = (features) => {
    const gender = getFeature(features, "Genre", "Gender");
    if (gender?.toLowerCase().includes('femme')) {
      return { icon: '👩', color: '#ec4899', label: 'Femme' };
    } else if (gender?.toLowerCase().includes('homme')) {
      return { icon: '👨', color: '#3b82f6', label: 'Homme' };
    } else {
      return { icon: '👥', color: '#6b7280', label: 'Unisexe' };
    }
  };

  // Loading skeleton component
  const EquipmentSkeleton = () => (
    <div className="equipment-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-badge"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
      <div className="skeleton-features">
        <div className="skeleton-feature"></div>
        <div className="skeleton-feature"></div>
      </div>
      <div className="skeleton-button"></div>
    </div>
  );

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Erreur de chargement</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="biker-equipments-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-content">
          <div className="hero-badge">🏍️ Équipement Pro</div>
          <h1 className="hero-title">
            Équipements <span className="gradient-text">Motard</span>
          </h1>
          <p className="hero-description">
            Découvrez notre sélection premium de blousons, vestes, gants et équipements de protection 
            pour rouler en toute sécurité avec style et confort.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-filter-section">
        <div className="filter-container">
          <h3 className="filter-title">Filtrer par catégorie</h3>
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(category.id)}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-label">{category.label}</span>
                {category.count > 0 && (
                  <span className="filter-count">{category.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="section-header">
          <div className="section-title-container">
            <h2 className="section-title">
              Nos Équipements
              <span className="product-count"> ({sortedEquipments.length})</span>
            </h2>
            <p className="section-subtitle">
              Des équipements de qualité pour une protection optimale
            </p>
          </div>
          
          <div className="controls-container">
            <div className="sort-control">
              <label htmlFor="sort-select" className="sort-label">Trier par:</label>
              <select 
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">En vedette</option>
                <option value="name">Nom (A-Z)</option>
                <option value="price-low">Prix (Croissant)</option>
                <option value="price-high">Prix (Décroissant)</option>
              </select>
            </div>
            
            <div className="view-controls">
              <span className="view-label">Affichage:</span>
              <button 
                className={`view-btn ${variant === 'grid' ? 'active' : ''}`}
                onClick={() => window.variantChange?.('grid')}
              >
                Grille
              </button>
              <button 
                className={`view-btn ${variant === 'carousel' ? 'active' : ''}`}
                onClick={() => window.variantChange?.('carousel')}
              >
                Carousel
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/Carousel */}
        <div className={`products-container ${variant === 'carousel' ? 'carousel' : 'grid'}`}>
          {loading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <EquipmentSkeleton key={index} />
            ))
          ) : (
            sortedEquipments.map((equipment, index) => {
              const firstImage = equipment.images?.[0];
              const imgSrc = firstImage 
                ? (firstImage.startsWith('/') ? firstImage : `/${firstImage}`)
                : '/assets/placeholder-equipment.jpg';
              
              const genderInfo = getGenderInfo(equipment.features);
              const productType = getFeature(equipment.features, "Type de produit", "Product type");
              const seasonality = getFeature(equipment.features, "Saisonnalité", "Seasonality");
              const material = getFeature(equipment.features, "Matière", "Matter");

              return (
                <div key={index} className="equipment-card">
                  {/* Product Badges */}
                  <div className="card-badges">
                    <div className="product-type-badge">
                      <span className="badge-icon">{getProductIcon(equipment.category)}</span>
                      {productType}
                    </div>
                    <div 
                      className="gender-badge"
                      style={{ backgroundColor: genderInfo.color }}
                    >
                      {genderInfo.icon} {genderInfo.label}
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="product-image-container">
                    <Link 
                      to="/product" 
                      state={{ product: equipment, source: 'Biker-equipments' }}
                      className="product-image-link"
                    >
                      <img
                        src={imgSrc}
                        alt={translateName(equipment.name)}
                        className="product-image"
                        loading="lazy"
                      />
                    </Link>
                    {/* Quick view overlay */}
                    <div className="image-overlay">
                      <button className="quick-view-btn">
                        👁️ Voir rapidement
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <div className="product-brand">
                      {equipment.features?.Brand || equipment.brand || 'Marque Premium'}
                    </div>
                    
                    <h3 className="product-name">
                      <Link 
                        to="/product" 
                        state={{ product: equipment, source: 'Biker-equipments' }}
                        className="product-link"
                      >
                        {translateName(equipment.name)}
                      </Link>
                    </h3>

                    {/* Product Description */}
                    <p className="product-description">
                      {equipment.description?.substring(0, 100)}...
                    </p>

                    {/* Product Features */}
                    <div className="product-features">
                      {seasonality && (
                        <div className="feature-item">
                          <span className="feature-icon">🌤️</span>
                          <span className="feature-text">{seasonality}</span>
                        </div>
                      )}
                      {material && (
                        <div className="feature-item">
                          <span className="feature-icon">🔍</span>
                          <span className="feature-text">{material}</span>
                        </div>
                      )}
                      {equipment.features?.["Homologation blouson / veste"] && (
                        <div className="feature-item">
                          <span className="feature-icon">✅</span>
                          <span className="feature-text">Certifié CE</span>
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="product-rating">
                      <div className="stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="star">★</span>
                        ))}
                      </div>
                      <span className="rating-count">(8 avis)</span>
                    </div>

                    {/* Price */}
                    <div className="product-pricing">
                      <div className="current-price">{formatPrice(equipment.price)}</div>
                      {equipment.features?.["Exclusivité Speedway"] === 'Oui' && (
                        <div className="exclusive-badge">Exclusivité</div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      to="/product"
                      state={{ product: equipment, source: 'Biker-equipments' }}
                      className="product-action-btn"
                    >
                      <span className="btn-icon">🛒</span>
                      Voir le produit
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Empty State */}
        {!loading && sortedEquipments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Aucun équipement trouvé</h3>
            <p>Aucun produit ne correspond aux filtres sélectionnés.</p>
            <button 
              className="reset-filters-btn"
              onClick={() => setActiveFilter('all')}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      

      <style jsx>{`
        .biker-equipments-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        /* Hero Section */
        .page-hero {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          padding: 80px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .page-hero::before {
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
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
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

        /* Category Filter */
        .category-filter-section {
          padding: 48px 24px;
          background: white;
        }

        .filter-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .filter-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 20px;
          text-align: center;
          color: #1f2937;
        }

        .filter-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          color: #6b7280;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .filter-btn:hover {
          border-color: #dc2626;
          color: #dc2626;
          transform: translateY(-2px);
        }

        .filter-btn.active {
          background: #dc2626;
          border-color: #dc2626;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
        }

        .filter-icon {
          font-size: 1.125rem;
        }

        .filter-count {
          background: #ef4444;
          color: white;
          border-radius: 10px;
          padding: 2px 8px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-left: 4px;
        }

        .filter-btn.active .filter-count {
          background: white;
          color: #dc2626;
        }

        /* Products Section */
        .products-section {
          padding: 48px 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 24px;
        }

        .section-title-container {
          flex: 1;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .product-count {
          color: #6b7280;
          font-weight: 600;
        }

        .section-subtitle {
          color: #6b7280;
          font-size: 1.125rem;
        }

        .controls-container {
          display: flex;
          gap: 24px;
          align-items: center;
          flex-wrap: wrap;
        }

        .sort-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-label {
          color: #6b7280;
          font-weight: 500;
          white-space: nowrap;
        }

        .sort-select {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .sort-select:focus {
          outline: none;
          border-color: #dc2626;
        }

        .view-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .view-label {
          color: #6b7280;
          font-weight: 500;
        }

        .view-btn {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn.active {
          background: #dc2626;
          border-color: #dc2626;
          color: white;
        }

        /* Products Container */
        .products-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .products-container.carousel {
          display: flex;
          overflow-x: auto;
          gap: 24px;
          padding: 16px 0;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }

        .products-container.carousel::-webkit-scrollbar {
          height: 8px;
        }

        .products-container.carousel::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .products-container.carousel::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        /* Equipment Card */
        .equipment-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          height: fit-content;
        }

        .products-container.carousel .equipment-card {
          min-width: 320px;
          flex-shrink: 0;
        }

        .equipment-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-badges {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          z-index: 2;
        }

        .product-type-badge {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .badge-icon {
          font-size: 0.875rem;
        }

        .gender-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .product-image-container {
          position: relative;
          margin-bottom: 20px;
          border-radius: 12px;
          overflow: hidden;
          background: #f8fafc;
        }

        .product-image-link {
          display: block;
          text-decoration: none;
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .equipment-card:hover .product-image {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .equipment-card:hover .image-overlay {
          opacity: 1;
        }

        .quick-view-btn {
          background: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .quick-view-btn:hover {
          transform: scale(1.05);
        }

        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-brand {
          font-size: 0.875rem;
          font-weight: 600;
          color: #dc2626;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .product-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .product-link {
          color: inherit;
          text-decoration: none;
        }

        .product-link:hover {
          color: #dc2626;
        }

        .product-description {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-features {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #64748b;
        }

        .feature-icon {
          font-size: 0.875rem;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .stars {
          color: #fbbf24;
        }

        .star {
          font-size: 0.875rem;
        }

        .rating-count {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .product-pricing {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .current-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: #dc2626;
        }

        .exclusive-badge {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .product-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: auto;
        }

        .product-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
        }

        .btn-icon {
          font-size: 1.125rem;
        }

        /* Loading Skeletons */
        .equipment-card-skeleton {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          animation: pulse 2s infinite;
        }

        .skeleton-image {
          height: 200px;
          background: #e5e7eb;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .skeleton-badge {
          height: 24px;
          width: 80px;
          background: #e5e7eb;
          border-radius: 6px;
          margin-bottom: 12px;
        }

        .skeleton-text {
          height: 16px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .skeleton-text.short {
          width: 60%;
        }

        .skeleton-features {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }

        .skeleton-feature {
          height: 12px;
          background: #e5e7eb;
          border-radius: 4px;
          width: 70%;
        }

        .skeleton-button {
          height: 44px;
          background: #e5e7eb;
          border-radius: 12px;
          margin-top: auto;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 24px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 8px;
          color: #374151;
        }

        .reset-filters-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 16px;
        }

        /* Features Section */
        .features-section {
          padding: 80px 24px;
          background: white;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 32px;
        }

        .feature-card {
          text-align: center;
          padding: 32px 24px;
          border-radius: 16px;
          background: #f8fafc;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .feature-card h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .feature-card p {
          color: #6b7280;
          line-height: 1.5;
        }

        /* Error State */
        .error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
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

        .error-content h2 {
          font-size: 1.5rem;
          margin-bottom: 8px;
          color: #dc2626;
        }

        .error-content p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        .retry-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-hero {
            padding: 60px 20px;
          }

          .hero-stats {
            gap: 32px;
          }

          .stat-number {
            font-size: 2rem;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .controls-container {
            width: 100%;
            justify-content: space-between;
          }

          .products-container.grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }

          .products-container.carousel .equipment-card {
            min-width: 280px;
          }

          .features-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 480px) {
          .page-hero {
            padding: 40px 16px;
          }

          .hero-stats {
            gap: 24px;
          }

          .stat {
            flex: 1;
            min-width: 80px;
          }

          .filter-buttons {
            justify-content: flex-start;
          }

          .controls-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .products-container.grid {
            grid-template-columns: 1fr;
          }

          .equipment-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default BikerEquipmentsPage;