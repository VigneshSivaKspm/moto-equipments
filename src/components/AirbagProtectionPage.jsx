import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import "../App.css";

const AirbagProtectionPage = ({ variant = 'grid' }) => {
  const [products, setProducts] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'Tous les produits', icon: 'ðŸ›¡ï¸' },
    { id: 'airbag_vests', label: 'Gilets Airbag', icon: 'ðŸ§¥' },
    { id: 'back_protectors', label: 'Dorsales', icon: 'ðŸ¦´' },
    { id: 'other_products', label: 'Autres Ã©quipements', icon: 'âš™ï¸' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/Product-details/Airbag_Protection.json");
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        // Transform data to include category information
        const transformedProducts = [
          ...(data.airbag_vests?.map(product => ({ ...product, category: 'airbag_vests' })) || []),
          ...(data.back_protectors?.map(product => ({ ...product, category: 'back_protectors' })) || []),
          ...(data.other_products?.map(product => ({ ...product, category: 'other_products' })) || [])
        ];
        
        setProducts(transformedProducts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter products based on active category
  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  // Format price display
  const formatPrice = (priceObj) => {
    if (!priceObj) return 'Prix non disponible';
    
    if (typeof priceObj === 'number') {
      return `${priceObj.toFixed(2)} â‚¬`;
    }
    
    const webPrice = priceObj.discounted || priceObj.web || priceObj.recommended;
    const recommendedPrice = priceObj.recommended;
    
    return {
      current: `${typeof webPrice === 'number' ? webPrice.toFixed(2) : webPrice} â‚¬`,
      original: recommendedPrice && webPrice !== recommendedPrice ? `${recommendedPrice.toFixed(2)} â‚¬` : null
    };
  };

  // Get product badge based on category
  const getProductBadge = (category) => {
    const badges = {
      airbag_vests: { label: 'Airbag', color: '#ef4444' },
      back_protectors: { label: 'Dorsale', color: '#3b82f6' },
      other_products: { label: 'Ã‰quipement', color: '#8b5cf6' }
    };
    return badges[category] || { label: 'Produit', color: '#6b7280' };
  };

  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="product-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
      <div className="skeleton-button"></div>
    </div>
  );

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">âš ï¸</div>
          <h2>Erreur de chargement</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            RÃ©essayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="airbag-protection-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-content">
          <div className="hero-badge">ðŸ›¡ï¸ Protection Maximale</div>
          <h1 className="hero-title">
            SystÃ¨mes <span className="gradient-text">Airbag</span> & Protection
          </h1>
          <p className="hero-description">
            DÃ©couvrez notre gamme complÃ¨te de gilets airbag et Ã©quipements de protection 
            derniÃ¨re gÃ©nÃ©ration pour une sÃ©curitÃ© optimale Ã  moto.
          </p>
        </div></section>

      {/* Category Filter */}
      <section className="category-filter-section">
        <div className="filter-container">
          <h3 className="filter-title">Filtrer par catÃ©gorie</h3>
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(category.id)}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-label">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">
            Nos Produits de Protection
            <span className="product-count"> ({filteredProducts.length})</span>
          </h2>
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

        {/* Products Grid/Carousel */}
        <div className={`products-container ${variant === 'carousel' ? 'carousel' : 'grid'}`}>
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : (
            filteredProducts.map((product, index) => {
              const badge = getProductBadge(product.category);
              const priceInfo = formatPrice(product.price);
              const firstImage = product.images?.[0];
              const imgSrc = firstImage 
                ? (firstImage.startsWith('/') ? firstImage : `/${firstImage}`)
                : '/assets/placeholder-product.jpg';

              return (
                <div key={index} className="product-card">
                  {/* Product Badge */}
                  <div className="product-badge" style={{ backgroundColor: badge.color }}>
                    {badge.label}
                  </div>

                  {/* Product Image */}
                  <div className="product-image-container">
                    <Link 
                      to="/product" 
                      state={{ product, source: 'Airbag-Protection' }}
                      className="product-image-link"
                    >
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                      />
                    </Link>
                    {/* Quick view overlay */}
                    <div className="image-overlay">
                      <button className="quick-view-btn">
                        ðŸ‘ï¸ Voir rapidement
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <h3 className="product-name">
                      <Link 
                        to="/product" 
                        state={{ product, source: 'Airbag-Protection' }}
                        className="product-link"
                      >
                        {product.name}
                      </Link>
                    </h3>

                    {/* Product Features */}
                    <div className="product-features">
                      {product.technology && (
                        <span className="feature-tag">ðŸš€ {product.technology}</span>
                      )}
                      {product.certifications?.[0] && (
                        <span className="feature-tag">âœ… CertifiÃ©</span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="product-rating">
                      <div className="stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="star">â˜…</span>
                        ))}
                      </div>
                      <span className="rating-count">(8 avis)</span>
                    </div>

                    {/* Price */}
                    <div className="product-pricing">
                      {typeof priceInfo === 'object' ? (
                        <>
                          {priceInfo.original && (
                            <div className="original-price">{priceInfo.original}</div>
                          )}
                          <div className="current-price">{priceInfo.current}</div>
                        </>
                      ) : (
                        <div className="current-price">{priceInfo}</div>
                      )}
                    </div>

                    {/* Payment Plan */}
                    {product.selected_payment_plan && (
                      <div className="payment-plan">
                        <span className="plan-icon">ðŸ’³</span>
                        {product.selected_payment_plan}
                      </div>
                    )}

                    {/* Action Button */}
                    <Link
                      to="/product"
                      state={{ product, source: 'Airbag-Protection' }}
                      className="product-action-btn"
                    >
                      <span className="btn-icon">ðŸ›’</span>
                      Voir le produit
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">ðŸ”</div>
            <h3>Aucun produit trouvÃ©</h3>
            <p>Aucun produit ne correspond aux filtres sÃ©lectionnÃ©s.</p>
            <button 
              className="reset-filters-btn"
              onClick={() => setActiveFilter('all')}
            >
              RÃ©initialiser les filtres
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}<style jsx>{`
        .airbag-protection-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        /* Hero Section */
        .page-hero {
          background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
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
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
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
        }

        .filter-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .filter-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .filter-icon {
          font-size: 1.125rem;
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
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
        }

        .product-count {
          color: #6b7280;
          font-weight: 600;
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
          background: #3b82f6;
          border-color: #3b82f6;
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

        /* Product Card */
        .product-card {
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

        .products-container.carousel .product-card {
          min-width: 320px;
          flex-shrink: 0;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .product-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 12px;
          border-radius: 8px;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          z-index: 2;
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

        .product-card:hover .product-image {
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

        .product-card:hover .image-overlay {
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
          color: #3b82f6;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .product-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .product-link {
          color: inherit;
          text-decoration: none;
        }

        .product-link:hover {
          color: #3b82f6;
        }

        .product-features {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .feature-tag {
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          color: #64748b;
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
          margin-bottom: 12px;
        }

        .original-price {
          font-size: 0.875rem;
          color: #9ca3af;
          text-decoration: line-through;
          margin-bottom: 2px;
        }

        .current-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ef4444;
        }

        .payment-plan {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #059669;
          margin-bottom: 16px;
          font-weight: 500;
        }

        .plan-icon {
          font-size: 0.875rem;
        }

        .product-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .btn-icon {
          font-size: 1.125rem;
        }

        /* Loading Skeletons */
        .product-card-skeleton {
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

        .skeleton-text {
          height: 16px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .skeleton-text.short {
          width: 60%;
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
          background: #3b82f6;
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
          background: #3b82f6;
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

          .products-container.grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }

          .products-container.carousel .product-card {
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

          .products-container.grid {
            grid-template-columns: 1fr;
          }

          .product-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default AirbagProtectionPage;
