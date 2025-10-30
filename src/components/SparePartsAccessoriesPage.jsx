import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Truck, Shield, CreditCard, Store, Zap, CheckCircle, Volume2, Palette, Cpu } from 'lucide-react';
import "../App.css";
import "./sparepartsandaccessories.css";

const SparePartsAccessoriesPage = ({ variant = 'grid', featured = false }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const carouselRef = useRef(null);
  const observerRef = useRef(null);

  // Filters configuration
  const filters = [
    { id: 'all', label: 'Tous les produits', count: 0, icon: '🛍️' },
    { id: 'backpack', label: 'Sacs à dos', count: 0, icon: '🎒' },
    { id: 'topcase', label: 'Top Cases', count: 0, icon: '📦' },
    { id: 'legbag', label: 'Saccoches de jambe', count: 0, icon: '🦵' },
    { id: 'saddlebag', label: 'Saccoches cavalières', count: 0, icon: '🏍️' },
    { id: 'waterproof', label: 'Étanches', count: 0, icon: '💧' },
    { id: 'premium', label: 'Premium', count: 0, icon: '⭐' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/Product-details/Spare_Parts_Accessories.json");
        if (!response.ok) throw new Error('Échec du chargement des produits');
        const data = await response.json();
        const productsData = data.products || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Update filter counts
        updateFilterCounts(productsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const updateFilterCounts = (products) => {
    const counts = {
      all: products.length,
      backpack: products.filter(p => p.name.toLowerCase().includes('sac à dos') || p.characteristics?.type === 'Sac à dos').length,
      topcase: products.filter(p => p.name.toLowerCase().includes('top case') || p.characteristics?.type === 'Top case').length,
      legbag: products.filter(p => p.name.toLowerCase().includes('sacoche de jambe') || p.characteristics?.type === 'Sacoche de jambe').length,
      saddlebag: products.filter(p => p.name.toLowerCase().includes('sacoche cavalière') || p.characteristics?.type === 'Sacoche cavalière').length,
      waterproof: products.filter(p => p.characteristics?.advantages?.toLowerCase().includes('étanche') || p.description?.toLowerCase().includes('étanche')).length,
      premium: products.filter(p => parseFloat(p.price.replace('€', '').replace(',', '.')) > 100).length
    };

    // Update filters with counts
    filters.forEach(filter => {
      filter.count = counts[filter.id];
    });
  };

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.characteristics?.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch (activeFilter) {
          case 'backpack':
            return product.name.toLowerCase().includes('sac à dos') || product.characteristics?.type === 'Sac à dos';
          case 'topcase':
            return product.name.toLowerCase().includes('top case') || product.characteristics?.type === 'Top case';
          case 'legbag':
            return product.name.toLowerCase().includes('sacoche de jambe') || product.characteristics?.type === 'Sacoche de jambe';
          case 'saddlebag':
            return product.name.toLowerCase().includes('sacoche cavalière') || product.characteristics?.type === 'Sacoche cavalière';
          case 'waterproof':
            return product.characteristics?.advantages?.toLowerCase().includes('étanche') || product.description?.toLowerCase().includes('étanche');
          case 'premium':
            return parseFloat(product.price.replace('€', '').replace(',', '.')) > 100;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price.replace('€', '').replace(',', '.')) - parseFloat(b.price.replace('€', '').replace(',', '.'));
        case 'price-high':
          return parseFloat(b.price.replace('€', '').replace(',', '.')) - parseFloat(a.price.replace('€', '').replace(',', '.'));
        case 'rating':
          return (b.reviews || 0) - (a.reviews || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default: // featured
          return (b.reviews || 0) - (a.reviews || 0);
      }
    });

    setFilteredProducts(filtered);
  }, [products, activeFilter, sortBy, searchTerm]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = windowWidth < 768 ? 280 : 340;
      carouselRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  const isCarousel = variant === 'carousel';

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className={`spareparts-page ${featured ? 'featured-mode' : ''}`}>
      {/* Enhanced Header with Parallax */}
      <ParallaxHeader 
        productCount={products.length}
        isScrolled={isScrolled}
      />

      {/* Sticky Filter Bar */}
      <StickyFilterBar
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={filteredProducts.length}
        isScrolled={isScrolled}
      />

      {/* Enhanced Products Section */}
      <EnhancedProductsSection
        products={filteredProducts}
        isCarousel={isCarousel}
        carouselRef={carouselRef}
        scrollCarousel={scrollCarousel}
        windowWidth={windowWidth}
      />

      {/* Premium Features Section */}
      <PremiumFeaturesSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Trust Badges */}
      <TrustBadgesSection />
    </div>
  );
};

// Sub-components for better organization
const ParallaxHeader = ({ productCount, isScrolled }) => (
  <section className={`parallax-header ${isScrolled ? 'scrolled' : ''}`}>
    <div className="parallax-background">
      <div className="floating-element element-1">🏍️</div>
      <div className="floating-element element-2">🎒</div>
      <div className="floating-element element-3">📦</div>
      <div className="floating-element element-4">⭐</div>
    </div>
    <div className="header-content">
      <div className="badge">🚀 NOUVELLE COLLECTION 2024</div>
      <h1 className="page-title">
        <span className="title-gradient">Accessoires Moto</span>
        <span className="title-sub">Premium</span>
      </h1>
      <p className="page-subtitle">
        Découvrez notre collection exclusive de sacs, top cases et accessoires 
        conçus pour les passionnés de moto exigeants
      </p>
      <div className="header-stats">
        <div className="stat">
          <div className="stat-number">{productCount}+</div>
          <div className="stat-label">Produits Premium</div>
        </div>
        <div className="stat">
          <div className="stat-number">⭐ 4.8/5</div>
          <div className="stat-label">Avis Clients</div>
        </div>
        <div className="stat">
          <div className="stat-number">🚚 24h</div>
          <div className="stat-label">Expédition Express</div>
        </div>
      </div>
    </div>
    <div className="scroll-indicator">
      <div className="scroll-arrow"></div>
    </div>
  </section>
);

const StickyFilterBar = ({ filters, activeFilter, setActiveFilter, sortBy, setSortBy, searchTerm, setSearchTerm, resultsCount, isScrolled }) => (
  <div className={`sticky-filter-bar ${isScrolled ? 'sticky' : ''}`}>
    <div className="filter-container">
      {/* Search Bar */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filter Chips */}
      <div className="filter-chips">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            <span className="filter-icon">{filter.icon}</span>
            <span className="filter-label">{filter.label}</span>
            <span className="filter-count">{filter.count}</span>
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="sort-dropdown">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="featured">Tendance</option>
          <option value="price-low">Prix: Croissant</option>
          <option value="price-high">Prix: Décroissant</option>
          <option value="rating">Meilleures notes</option>
          <option value="name">Nom A-Z</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="results-count">
        {resultsCount} produit{resultsCount !== 1 ? 's' : ''} trouvé{resultsCount !== 1 ? 's' : ''}
      </div>
    </div>
  </div>
);

const EnhancedProductsSection = ({ products, isCarousel, carouselRef, scrollCarousel, windowWidth }) => (
  <section className="products-section">
    {isCarousel && windowWidth > 768 && (
      <div className="carousel-controls">
        <button 
          className="carousel-btn prev" 
          onClick={() => scrollCarousel(-1)}
          aria-label="Produits précédents"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="carousel-btn next" 
          onClick={() => scrollCarousel(1)}
          aria-label="Produits suivants"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    )}

    <div 
      className={`products-container ${isCarousel ? 'carousel' : 'masonry-grid'}`}
      ref={carouselRef}
    >
      {products.map((product, idx) => (
        <EnhancedProductCard 
          key={`${product.name}-${idx}`} 
          product={product} 
          index={idx}
          isCarousel={isCarousel}
        />
      ))}
    </div>

    {products.length === 0 && (
      <EmptyState />
    )}
  </section>
);

const EnhancedProductCard = ({ product, index, isCarousel }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const firstImage = product?.images?.[0];
  const imgSrc = firstImage
    ? firstImage.includes('/')
      ? (firstImage.startsWith('/') ? firstImage : `/${firstImage}`)
      : `/assets/Product-images/Spare Parts & Accessories/${firstImage}`
    : null;

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const getProductBadges = (product) => {
    const badges = [];
    
    if (product.discount_price) {
      badges.push({ type: 'discount', label: 'PROMO', color: '#ef4444' });
    }
    
    if (product.characteristics?.exclusivity === 'Oui') {
      badges.push({ type: 'exclusive', label: 'EXCLUSIF', color: '#8b5cf6' });
    }
    
    if (product.characteristics?.advantages?.includes('Étanche')) {
      badges.push({ type: 'waterproof', label: 'ÉTANCHE', color: '#06b6d4' });
    }
    
    if (parseFloat(product.price.replace('€', '').replace(',', '.')) > 150) {
      badges.push({ type: 'premium', label: 'PREMIUM', color: '#f59e0b' });
    }

    if (product.payment_options?.available?.length > 0) {
      badges.push({ type: 'financing', label: '3X SANS FRAIS', color: '#10b981' });
    }

    return badges.slice(0, 3); // Max 3 badges
  };

  const badges = getProductBadges(product);

  return (
    <div 
      className={`enhanced-product-card ${isCarousel ? 'carousel-card' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image with Enhanced Overlay */}
      <div className="product-image-container">
        <Link 
          to="/product" 
          state={{ product, source: 'Spare Parts & Accessories' }}
          className="image-link"
        >
          {!imageError && imgSrc ? (
            <>
              {!imageLoaded && <div className="image-skeleton shimmer"></div>}
              <img
                src={imgSrc}
                alt={product.name}
                className={`product-image ${imageLoaded ? 'loaded' : ''}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </>
          ) : (
            <div className="image-placeholder">
              <div className="placeholder-icon">🏍️</div>
            </div>
          )}
        </Link>
        
        {/* Enhanced Badges */}
        <div className="badges-container">
          {badges.map((badge, idx) => (
            <div 
              key={idx}
              className="product-badge"
              style={{ '--badge-color': badge.color }}
            >
              {badge.label}
            </div>
          ))}
        </div>

        {/* Quick Actions Overlay */}
        <div className="quick-actions">
          <button className="quick-action-btn wishlist" aria-label="Ajouter aux favoris">
            ♡
          </button>
          <button className="quick-action-btn compare" aria-label="Comparer">
            ⇄
          </button>
        </div>

        {/* Hover Effect Layer */}
        <div className="hover-overlay">
          <div className="view-details">Voir détails →</div>
        </div>
      </div>

      {/* Enhanced Product Info */}
      <div className="enhanced-product-info">
        {/* Category & Brand */}
        <div className="product-meta">
          <span className="product-category">
            {product.characteristics?.type || 'Accessoire Moto'}
          </span>
          <span className="product-brand">
            {product.name.split(' ')[0]}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="enhanced-product-name">
          <Link 
            to="/product" 
            state={{ product, source: 'Spare Parts & Accessories' }}
            className="product-link"
          >
            {product.name}
          </Link>
        </h3>

        {/* Key Features */}
        <div className="key-features">
          {product.characteristics?.volume && (
            <div className="feature">
              <Volume2 size={14} />
              <span>{product.characteristics.volume}</span>
            </div>
          )}
          {product.characteristics?.material && (
            <div className="feature">
              <Palette size={14} />
              <span>{product.characteristics.material.split('(')[0]}</span>
            </div>
          )}
          {product.technical_specs?.features?.[0] && (
            <div className="feature">
              <Cpu size={14} />
              <span>{product.technical_specs.features[0]}</span>
            </div>
          )}
        </div>

        {/* Enhanced Rating */}
        <EnhancedRating reviews={product.reviews || 0} />

        {/* Smart Pricing */}
        <SmartPricing product={product} />

        {/* Payment Options */}
        {product.payment_options && (
          <PaymentOptions paymentOptions={product.payment_options} />
        )}

        {/* Enhanced Action Button */}
        <Link
          to="/product"
          state={{ product, source: 'Spare Parts & Accessories' }}
          className="enhanced-action-btn"
        >
          <span className="btn-text">Découvrir le produit</span>
          <div className="btn-arrow">→</div>
        </Link>
      </div>
    </div>
  );
};

const EnhancedRating = ({ reviews }) => {
  const rating = Math.min(5, Math.max(0, reviews / 2));
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="enhanced-rating">
      <div className="stars-container">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`star-wrapper ${i < filledStars ? 'filled' : ''} ${hasHalfStar && i === filledStars ? 'half' : ''}`}
          >
            <Star 
              size={16} 
              fill={i < filledStars ? "currentColor" : "none"}
              color={i < filledStars ? "#fbbf24" : "#d1d5db"}
            />
          </div>
        ))}
      </div>
      <div className="rating-info">
        <span className="rating-text">{rating.toFixed(1)}</span>
        <span className="reviews-count">({reviews} avis)</span>
      </div>
    </div>
  );
};

const SmartPricing = ({ product }) => {
  const getPriceValue = (priceStr) => {
    return parseFloat(priceStr.replace('€', '').replace(',', '.').replace('TTC', '').trim());
  };

  const currentPrice = getPriceValue(product.price);
  const hasDiscount = product.discount_price || product.original_price;
  const discountPrice = product.discount_price ? 
    getPriceValue(product.discount_price.split('Avec le code')[0].trim()) : null;
  const originalPrice = product.original_price ? 
    getPriceValue(product.original_price.replace('Prix public conseillé', '').trim()) : null;

  const displayPrice = discountPrice || currentPrice;
  const displayOriginal = discountPrice ? currentPrice : originalPrice;

  return (
    <div className="smart-pricing">
      {hasDiscount && displayOriginal && (
        <div className="original-price-wrapper">
          <span className="original-price">
            {displayOriginal.toFixed(2)}€
          </span>
          {discountPrice && (
            <span className="discount-percent">
              -{Math.round((1 - discountPrice / displayOriginal) * 100)}%
            </span>
          )}
        </div>
      )}
      <div className="current-price-wrapper">
        <span className="current-price">
          {displayPrice.toFixed(2)}€
        </span>
        {product.price.includes('TTC') && (
          <span className="price-note">TTC</span>
        )}
      </div>
    </div>
  );
};

const PaymentOptions = ({ paymentOptions }) => (
  <div className="payment-options-enhanced">
    <div className="payment-badges">
      {paymentOptions.available.slice(0, 2).map((option, idx) => (
        <span key={idx} className="payment-badge">
          {option}
        </span>
      ))}
      {paymentOptions.available.length > 2 && (
        <span className="payment-badge more">+{paymentOptions.available.length - 2}</span>
      )}
    </div>
    {paymentOptions.selected_plan && (
      <div className="selected-plan">
        <CreditCard size={14} />
        <span>{paymentOptions.selected_plan}</span>
      </div>
    )}
  </div>
);

const PremiumFeaturesSection = () => (
  <section className="premium-features">
    <div className="features-header">
      <h2>Pourquoi choisir nos accessoires ?</h2>
      <p>Excellence, durabilité et innovation au service des passionnés</p>
    </div>
    <div className="features-grid">
      <div className="premium-feature">
        <div className="feature-icon-wrapper">
          <Shield className="feature-icon" />
        </div>
        <h3>Garantie Premium</h3>
        <p>2 ans de garantie constructeur sur tous nos produits</p>
      </div>
      <div className="premium-feature">
        <div className="feature-icon-wrapper">
          <Truck className="feature-icon" />
        </div>
        <h3>Livraison Express</h3>
        <p>Expédition sous 24h et suivi en temps réel</p>
      </div>
      <div className="premium-feature">
        <div className="feature-icon-wrapper">
          <CheckCircle className="feature-icon" />
        </div>
        <h3>Qualité Certifiée</h3>
        <p>Tous nos produits répondent aux normes de sécurité européennes</p>
      </div>
      <div className="premium-feature">
        <div className="feature-icon-wrapper">
          <Zap className="feature-icon" />
        </div>
        <h3>Innovation Continue</h3>
        <p>Des designs optimisés pour les motards exigeants</p>
      </div>
    </div>
  </section>
);

const NewsletterSection = () => (
  <section className="newsletter-section">
    <div className="newsletter-content">
      <div className="newsletter-text">
        <h2>🚀 Restez informé</h2>
        <p>Recevez en avant-première nos nouveautés et offres exclusives</p>
      </div>
      <div className="newsletter-form">
        <input 
          type="email" 
          placeholder="votre@email.com" 
          className="newsletter-input"
        />
        <button className="newsletter-btn">S'abonner</button>
      </div>
    </div>
  </section>
);

const TrustBadgesSection = () => (
  <section className="trust-badges">
    <div className="badges-grid">
      <div className="trust-badge">
        <div className="badge-icon">🔒</div>
        <span>Paiement Sécurisé</span>
      </div>
      <div className="trust-badge">
        <div className="badge-icon">↩️</div>
        <span>Retour 30 Jours</span>
      </div>
      <div className="trust-badge">
        <div className="badge-icon">🏪</div>
        <span>Retrait Magasin</span>
      </div>
      <div className="trust-badge">
        <div className="badge-icon">💬</div>
        <span>Support 7j/7</span>
      </div>
    </div>
  </section>
);

const LoadingState = () => (
  <div className="enhanced-loading">
    <div className="loading-animation">
      <div className="loading-bike">🏍️</div>
      <div className="loading-progress"></div>
    </div>
    <h3>Chargement des produits...</h3>
    <p>Préparation de votre expérience shopping premium</p>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="enhanced-error">
    <div className="error-animation">⚠️</div>
    <h3>Oups ! Une erreur est survenue</h3>
    <p>{error}</p>
    <button onClick={onRetry} className="retry-btn-enhanced">
      <Zap size={16} />
      Réessayer
    </button>
  </div>
);

const EmptyState = () => (
  <div className="enhanced-empty">
    <div className="empty-illustration">
      <div className="empty-icon">🔍</div>
      <div className="empty-animation"></div>
    </div>
    <h3>Aucun produit trouvé</h3>
    <p>Essayez de modifier vos critères de recherche ou de filtrage</p>
    <button 
      onClick={() => window.location.reload()} 
      className="reset-filters-btn"
    >
      Réinitialiser les filtres
    </button>
  </div>
);

export default SparePartsAccessoriesPage;