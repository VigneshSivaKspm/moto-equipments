import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Helper to format various price shapes into a display string
const formatPrice = (price) => {
  if (!price) return '';
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

// Ensure images paths is usable by the app (prefix leading slash if missing)
const normalizeImagePath = (imgPath) => {
  if (!imgPath) return undefined;
  return imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
};

// Build a public path under assets/Product-images with URL-encoded folder
const buildAssetsPath = (folderName, fileName) => {
  if (!fileName) return undefined;
  const encodedFolder = encodeURIComponent(folderName);
  return `/assets/Product-images/${encodedFolder}/${fileName}`;
};

// Build list items from fetched data per slug
const buildProducts = (slug, data) => {
  switch (slug) {
    case 'motorcycle-helmet': {
      const items = data?.helmets || [];
      return items.map((p) => ({
        name: p.name,
        price: formatPrice(p.price),
        originalPrice: p.price?.recommended ? `${p.price.recommended} €` : null,
        image: Array.isArray(p.images)
          ? (p.images[0]?.includes('/')
              ? normalizeImagePath(p.images[0])
              : buildAssetsPath('Motorcycle-Helmets', p.images[0]))
          : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        brand: p.brand,
        features: p.features,
        raw: p,
        source: 'Motorcycle-Helmets',
      }));
    }
    case 'biker-equipment': {
      const items = data?.biker_equipment || [];
      return items.map((p) => ({
        name: p.name,
        price: formatPrice(p.price),
        image: Array.isArray(p.images)
          ? (p.images[0]?.includes('/')
              ? normalizeImagePath(p.images[0])
              : buildAssetsPath('Biker-equipments', p.images[0]))
          : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        brand: p.brand,
        features: p.features,
        raw: p,
        source: 'Biker-equipments',
      }));
    }
    case 'airbag-protection': {
      const vests = data?.airbag_vests || [];
      const backs = data?.back_protectors || [];
      const others = data?.other_products || [];
      const items = [...vests, ...backs, ...others];
      return items.map((p) => ({
        name: p.name,
        price: formatPrice(p.price),
        originalPrice: p.price?.recommended ? `${p.price.recommended} €` : null,
        image: Array.isArray(p.images)
          ? (p.images[0]?.includes('/')
              ? normalizeImagePath(p.images[0])
              : buildAssetsPath('Airbag & Protection', p.images[0]))
          : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        brand: p.brand,
        features: p,
        raw: p,
        source: 'Airbag-Protection',
      }));
    }
    case 'spare-parts-accessories': {
      const items = data?.products || [];
      return items.map((p) => ({
        name: p.name,
        price: formatPrice(p.price),
        image: Array.isArray(p.images)
          ? (p.images[0]?.includes('/')
              ? normalizeImagePath(p.images[0])
              : buildAssetsPath('Spare Parts & Accessories', p.images[0]))
          : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        brand: p.brand,
        features: p.features,
        raw: p,
        source: 'Spare Parts & Accessories',
      }));
    }
    case 'sportswear': {
      const items = data?.products || [];
      return items.map((p) => ({
        name: p.name,
        price: p.salePrice != null ? `${p.salePrice} €` : (p.originalPrice != null ? `${p.originalPrice} €` : ''),
        originalPrice: p.originalPrice && p.salePrice ? `${p.originalPrice} €` : null,
        image: Array.isArray(p.images)
          ? (p.images[0]?.includes('/')
              ? normalizeImagePath(p.images[0])
              : buildAssetsPath('Sportswere', p.images[0]))
          : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        brand: p.brand,
        features: p.features,
        raw: p,
        source: 'Sportswere',
      }));
    }
    default:
      return [];
  }
};

const prettyTitle = (slug) => {
  const titles = {
    'motorcycle-helmet': 'Casques Moto',
    'biker-equipment': 'Équipements Motard',
    'airbag-protection': 'Airbag & Protection',
    'spare-parts-accessories': 'Pièces Détachées & Accessoires',
    'sportswear': 'Vêtements de Sport',
    'scooter-equipment': 'Équipement Scooter'
  };
  return titles[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const getCategoryIcon = (slug) => {
  const icons = {
    'motorcycle-helmet': '🪖',
    'biker-equipment': '🧥',
    'airbag-protection': '🛡️',
    'spare-parts-accessories': '⚙️',
    'sportswear': '👕',
    'scooter-equipment': '🛵'
  };
  return icons[slug] || '📦';
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const urlBySlug = {
      'motorcycle-helmet': '/Product-details/Motorcycle_Helmet.json',
      'biker-equipment': '/Product-details/Biker_Equipments.json',
      'airbag-protection': '/Product-details/Airbag_Protection.json',
      'spare-parts-accessories': '/Product-details/Spare_Parts_Accessories.json',
      'sportswear': '/Product-details/Sportswere.json',
    };
    
    const url = urlBySlug[slug];
    if (!url) { 
      setData(null); 
      setLoading(false);
      return; 
    }
    
    setLoading(true);
    setError(null);
    
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch category data');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const products = buildProducts(slug, data);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = parseFloat(a.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const priceB = parseFloat(b.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    
    switch (sortBy) {
      case 'price-low': return priceA - priceB;
      case 'price-high': return priceB - priceA;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0; // featured - keep original order
    }
  });

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
    <div className="category-page">
      {/* Hero Section */}
      <section className="category-hero">
        <div className="hero-content">
          <div className="category-icon">{getCategoryIcon(slug)}</div>
          <h1 className="category-title">{prettyTitle(slug)}</h1>
          <p className="category-description">
            Découvrez notre sélection premium de {prettyTitle(slug).toLowerCase()} pour une protection et un style optimaux.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">{products.length}</div>
            <div className="stat-label">Produits</div>
          </div>
          <div className="stat">
            <div className="stat-number">⭐ 4.8</div>
            <div className="stat-label">Note moyenne</div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">
            Nos Produits
            <span className="product-count"> ({products.length})</span>
          </h2>
          
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
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : sortedProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Aucun produit trouvé</h3>
              <p>Aucun produit disponible dans cette catégorie pour le moment.</p>
            </div>
          ) : (
            sortedProducts.map((product, index) => (
              <Link
                key={index}
                to="/product"
                state={{ product: product.raw, source: product.source }}
                className="product-card"
              >
                {/* Product Image */}
                <div className="product-image-container">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span className="placeholder-icon">📷</span>
                    </div>
                  )}
                  {/* Quick View Overlay */}
                  <div className="image-overlay">
                    <span className="quick-view-text">Voir le produit</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                  {product.brand && (
                    <div className="product-brand">{product.brand}</div>
                  )}
                  
                  <h3 className="product-name">{product.name}</h3>
                  
                  {product.description && (
                    <p className="product-description">
                      {product.description.slice(0, 100)}
                      {product.description.length > 100 ? '…' : ''}
                    </p>
                  )}

                  {/* Features */}
                  <div className="product-features">
                    {product.features && (
                      <>
                        {product.features['Type de produit'] && (
                          <span className="feature-tag">
                            {product.features['Type de produit']}
                          </span>
                        )}
                        {product.features['Matière'] && (
                          <span className="feature-tag">
                            {product.features['Matière']}
                          </span>
                        )}
                        {product.features['Seasonality'] && (
                          <span className="feature-tag">
                            {product.features['Seasonality']}
                          </span>
                        )}
                      </>
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
                    {product.originalPrice && (
                      <div className="original-price">{product.originalPrice}</div>
                    )}
                    <div className="current-price">{product.price}</div>
                  </div>

                  {/* Action Button */}
                  <div className="product-action">
                    <span className="action-text">Voir les détails</span>
                    <span className="action-arrow">→</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <style jsx>{`
        .category-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        /* Hero Section */
        .category-hero {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          padding: 60px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .category-hero::before {
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

        .category-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .category-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 16px;
          line-height: 1.1;
        }

        .category-description {
          font-size: 1.125rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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
          border-color: #2563eb;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        /* Product Card */
        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1/1;
          overflow: hidden;
          background: #f8fafc;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
        }

        .placeholder-icon {
          font-size: 2rem;
          opacity: 0.5;
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

        .quick-view-text {
          color: white;
          font-weight: 600;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .product-info {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-brand {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2563eb;
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

        .product-description {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 12px;
          flex: 1;
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
          margin-bottom: 16px;
        }

        .original-price {
          font-size: 0.875rem;
          color: #9ca3af;
          text-decoration: line-through;
          margin-bottom: 2px;
        }

        .current-price {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ef4444;
        }

        .product-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }

        .action-text {
          font-weight: 600;
          color: #2563eb;
        }

        .action-arrow {
          color: #2563eb;
          font-weight: 700;
          transition: transform 0.2s ease;
        }

        .product-card:hover .action-arrow {
          transform: translateX(4px);
        }

        /* Loading Skeletons */
        .product-card-skeleton {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          animation: pulse 2s infinite;
        }

        .skeleton-image {
          height: 200px;
          background: #e5e7eb;
          border-radius: 12px;
          margin-bottom: 16px;
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
          height: 20px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-top: 16px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
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
          background: #2563eb;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .category-hero {
            padding: 40px 20px;
          }

          .hero-stats {
            gap: 32px;
          }

          .stat-number {
            font-size: 1.75rem;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .category-hero {
            padding: 32px 16px;
          }

          .hero-stats {
            gap: 24px;
          }

          .stat {
            flex: 1;
            min-width: 100px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .product-info {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;