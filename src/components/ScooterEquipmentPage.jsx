import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const ScooterEquipmentPage = () => {
  const [items, setItems] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // If you add a JSON file later, keep this path consistent with others
    fetch('/Product-details/Scooter_Equipment.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        // Expecting a structure like { products: [...] }
        if (data && Array.isArray(data.products)) {
          setItems(data.products);
        } else {
          setItems([]);
        }
      })
      .catch(() => setItems([]));

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive grid (same layout style as other pages)
  let columns = 3;
  if (windowWidth < 900) columns = 2;
  if (windowWidth < 600) columns = 1;

  return (
    <div style={{ width: '100%', background: '#f7f8fa', padding: '48px 0' }}>
      <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 32, color: '#222' }}>Scooter Equipment</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {items.length === 0 && (
          <div style={{ color: '#555' }}>No data yet. Add "src/Product-details/Scooter Equipment.json" with a products array.</div>
        )}
        {items.map((item, idx) => {
          const firstImage = item && item.images && item.images.length > 0 ? item.images[0] : null;
          const imgSrc = firstImage
            ? (firstImage.startsWith('/')
                ? firstImage
                : `/assets/Product-images/Scooter-Equipment/${firstImage}`)
            : null;
          return (
            <div
              key={idx}
              className="scooter-card"
              style={{
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
              }}
            >
              {imgSrc && (
                <Link to="/product" state={{ product: item, source: 'Scooter-Equipment' }}>
                  <img
                    src={imgSrc}
                    alt={item.name}
                    style={{ width: '100%', maxWidth: 200, height: 180, objectFit: 'contain', marginBottom: 18, borderRadius: 12, background: '#f3f3f3' }}
                  />
                </Link>
              )}
              <h3 style={{ fontWeight: 700, margin: '8px 0 4px', fontSize: 22, color: '#222' }}>{item.name}</h3>
              <div style={{ marginBottom: 8 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: '#ffd700', fontSize: 18 }}>★</span>
                ))}
                <span style={{ marginLeft: 6, color: '#444', fontSize: 14 }}>(0 avis)</span>
              </div>
              <div style={{ color: '#e53935', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>{item.price || ''}</div>
              <Link
                to="/product"
                state={{ product: item, source: 'Scooter-Equipment' }}
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

export default ScooterEquipmentPage;
