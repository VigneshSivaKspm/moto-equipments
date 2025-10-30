import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../App.css";

// Small helper component to rotate through candidate image sources on error
const ImageWithFallback = ({ sources, alt, style }) => {
  const [idx, setIdx] = useState(0);
  const src = sources && sources.length > 0 ? sources[idx] : null;
  const handleError = () => {
    setIdx((i) => (i + 1 < (sources?.length || 0) ? i + 1 : i));
  };
  if (!src) return null;

  return (
    <img src={src} alt={alt} style={style} onError={handleError} />
  );
};

const SportswerePage = ({ variant = 'grid' }) => {
  const [products, setProducts] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetch("/Product-details/Sportswere.json")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive grid: 3 cards per row on desktop, 2 on tablet, 1 on mobile
  let columns = 3;
  if (windowWidth < 900) columns = 2;
  if (windowWidth < 600) columns = 1;

  const isCarousel = variant === 'carousel';
  const containerStyle = isCarousel
    ? {
        display: 'flex',
        overflowX: 'auto',
        gap: '32px',
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 24px',
        scrollbarWidth: 'thin',
      }
    : {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 24px',
      };
  const cardStyle = isCarousel
    ? {
        minWidth: 320,
        maxWidth: 340,
        flex: '0 0 auto',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        borderRadius: 16,
        background: '#fff',
        padding: 32,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.2s',
        minHeight: 420,
      }
    : {
        width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        borderRadius: 16,
        background: '#fff',
        padding: 32,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.2s',
        minHeight: 420,
      };

  return (
    <div style={{ width: '100%', background: '#f7f8fa', padding: '48px 0' }}>
      <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 32, color: '#222' }}>Vêtements de sport</h2>
      <div style={containerStyle}>
        {products.map((product, idx) => {
          const firstImage = product && product.images && product.images.length > 0 ? product.images[0] : null;
          // Build candidate image URLs with common fallback filename patterns for this dataset
          const normalize = (p) => {
            if (!p) return p;
            if (p.includes('/')) return p.startsWith('/') ? p : `/${p}`;
            return `/assets/Product-images/Sportswere/${p}`;
          };
          const candidates = [];
          if (firstImage) {
            const base = normalize(firstImage);
            candidates.push(base);
            // Swap hyphen-number to (number)
            candidates.push(base.replace(/-([1234])\.(webp|jpg)$/i, ' ($1).$2'));
            // Remove trailing -1
            candidates.push(base.replace(/-1\.(webp|jpg)$/i, '.$1'));
            // Try webp/jpg swap
            candidates.push(base.replace(/\.(webp)$/i, '.jpg'));
            candidates.push(base.replace(/\.(jpg)$/i, '.webp'));
            // t-shirt vs tee-shirt
            candidates.push(base.replace(/\bt-shirt\b/i, 'tee-shirt'));
            candidates.push(base.replace(/\btee-shirt\b/i, 't-shirt'));
            // mo-st-eq -> mosteq
            candidates.push(base.replace(/mo-st-eq/gi, 'mosteq'));
            // brand/file naming mismatch for hoodie (pritelli -> kenny)
            candidates.push(base.replace(/hoodie-zip-pritelli/gi, 'hoodie-zip-kenny'));
            // pramac naming variant
            candidates.push(base.replace(/t-shirt-ixon-ts1-pramac-replica-23/gi, 't-shirt-pramac-ts1-replica-23-l'));
            // zarco naming variant (use tee-shirt and jpg)
            candidates.push('/assets/Product-images/Sportswere/tee-shirt-ixon-ts1-zarco-25-noir.jpg');
          }
          // De-duplicate while preserving order
          const uniqueCandidates = Array.from(new Set(candidates.filter(Boolean)));
          return (
          <div key={idx} className="sportswere-card" style={cardStyle}>
            {uniqueCandidates.length > 0 && (
              <Link to="/product" state={{ product, source: 'Sportswere' }}>
                <ImageWithFallback
                  sources={uniqueCandidates}
                  alt={product.name}
                  style={{ width: '100%', maxWidth: 200, height: 180, objectFit: 'contain', marginBottom: 18, borderRadius: 12, background: '#f3f3f3' }}
                />
              </Link>
            )}
            <h3 style={{ fontWeight: 700, margin: '8px 0 4px', fontSize: 22, color: '#222' }}>{product.name}</h3>
            <div style={{ marginBottom: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: '#ffd700', fontSize: 18 }}>★</span>
              ))}
              <span style={{ marginLeft: 6, color: '#444', fontSize: 14 }}>({product.reviews || 0} avis)</span>
            </div>
            {product.originalPrice && (
              <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>Prix Conseillé : {product.originalPrice}</div>
            )}
            {product.salePrice !== undefined ? (
              <div style={{ color: '#e53935', fontWeight: 700, fontSize: 24, marginBottom: 8 }}>{product.salePrice}</div>
            ) : (
              <div style={{ color: '#e53935', fontWeight: 700, fontSize: 24, marginBottom: 8 }}>{product.price}</div>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ color: '#555', fontSize: 14, marginBottom: 16 }}>Tailles: {product.sizes.join(', ')}</div>
            )}
            <Link
              to="/product"
              state={{ product, source: 'Sportswere' }}
              style={{
                display: 'inline-block',
                background: '#27ae60',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 32px',
                fontWeight: 700,
                fontSize: 17,
                cursor: 'pointer',
                marginTop: 'auto',
                boxShadow: '0 2px 8px rgba(39,174,96,0.08)',
                textDecoration: 'none',
              }}
            >
              VOIR LE PRODUIT
            </Link>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default SportswerePage;

