import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import "../App.css";

const MotorcycleHelmetsPage = ({ variant = 'grid' }) => {
  const [helmets, setHelmets] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/Product-details/Motorcycle_Helmet.json");
        const data = await response.json();
        setHelmets(data.helmets);
      } catch (error) {
        console.error("Erreur lors du chargement des données des casques :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320 + 32; // card width + gap
      carouselRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  const isCarousel = variant === 'carousel';
  
  // Enhanced responsive logic
  let columns = 4;
  if (windowWidth < 1200) columns = 3;
  if (windowWidth < 900) columns = 2;
  if (windowWidth < 600) columns = 1;

  const containerStyle = isCarousel
    ? {
        display: 'flex',
        overflowX: 'auto',
        gap: '32px',
        maxWidth: 1400,
        margin: '0 auto',
        padding: '24px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative',
        scrollBehavior: 'smooth',
      }
    : {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
        gap: '32px',
        maxWidth: 1400,
        margin: '0 auto',
        padding: '24px',
      };

  const cardStyle = (index) => ({
    width: '100%',
    boxShadow: hoveredCard === index 
      ? '0 20px 40px rgba(0,0,0,0.15), 0 8px 32px rgba(39, 174, 96, 0.2)' 
      : '0 8px 32px rgba(0,0,0,0.1)',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    padding: '32px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: '480px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.8)',
    ...(isCarousel && {
      minWidth: '320px',
      maxWidth: '340px',
      flex: '0 0 auto',
    }),
    '&:hover': {
      transform: 'translateY(-8px)',
    }
  });

  const getPriceInfo = (price) => {
    if (!price) return { current: null, original: null };
    
    if (typeof price === 'object') {
      return {
        current: price.web || price.recommended || null,
        original: price.recommended || null
      };
    }
    
    return { current: price, original: null };
  };

  const SkeletonLoader = () => (
    <div style={containerStyle}>
      {[...Array(6)].map((_, index) => (
        <div key={index} style={cardStyle(index)}>
          <div style={{
            width: '100%',
            height: '180px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s infinite',
            borderRadius: '12px',
            marginBottom: '18px'
          }} />
          <div style={{
            height: '24px',
            background: '#f0f0f0',
            borderRadius: '12px',
            marginBottom: '12px',
            width: '80%'
          }} />
          <div style={{
            height: '20px',
            background: '#f0f0f0',
            borderRadius: '10px',
            marginBottom: '16px',
            width: '60%'
          }} />
          <div style={{
            height: '32px',
            background: '#f0f0f0',
            borderRadius: '8px',
            marginBottom: '24px',
            width: '50%'
          }} />
          <div style={{
            height: '48px',
            background: '#f0f0f0',
            borderRadius: '8px',
            width: '70%',
            marginTop: 'auto'
          }} />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div style={{ 
        width: '100%', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        minHeight: '100vh'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '16px',
            color: 'white',
            textShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            Casques moto
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Découvrez notre collection premium de casques de sécurité
          </p>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '80px 0',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ 
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 800,
          marginBottom: '16px',
          color: 'white',
          textShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          Casques moto
        </h2>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'rgba(255,255,255,0.9)',
          maxWidth: '600px',
          margin: '0 auto 24px'
        }}>
          Protection premium et design de pointe
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            backdropFilter: 'blur(10px)'
          }}>
            {helmets.length} produits
          </span>
          <span style={{
            background: 'rgba(39, 174, 96, 0.3)',
            padding: '8px 16px',
            borderRadius: '20px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            backdropFilter: 'blur(10px)'
          }}>
            Livraison gratuite
          </span>
        </div>
      </div>

      {/* Carousel Navigation */}
      {isCarousel && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => scrollCarousel(-1)}
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              fontSize: '20px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ‹
          </button>
          <button
            onClick={() => scrollCarousel(1)}
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              fontSize: '20px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ›
          </button>
        </div>
      )}

      {/* Products Grid/Carousel */}
      <div 
        ref={carouselRef}
        style={containerStyle}
        className={isCarousel ? "hide-scrollbar" : ""}
      >
        {helmets.map((helmet, idx) => {
          const firstImage = helmet?.images?.[0];
          const imgSrc = firstImage
            ? (firstImage.startsWith('/')
                ? firstImage
                : `/assets/Product-images/Motorcycle-Helmets/${firstImage}`)
            : null;
          
          const { current, original } = getPriceInfo(helmet.price);
          const helmetModel = helmet.features?.["Modèle casque"];

          return (
            <div 
              key={idx} 
              className="helmet-card"
              style={cardStyle(idx)}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Product Image */}
              {imgSrc && (
                <Link 
                  to="/product" 
                  state={{ product: helmet, source: 'Motorcycle-Helmets' }}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    width: '100%',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={imgSrc}
                      alt={helmet.name}
                      style={{ 
                        width: 'auto', 
                        maxWidth: '200px', 
                        height: '160px', 
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease',
                        ...(hoveredCard === idx && { transform: 'scale(1.1)' })
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{
                      display: 'none',
                      width: '100%',
                      height: '100%',
                      background: '#f8f9fa',
                      borderRadius: '16px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      Image non disponible
                    </div>
                  </div>
                </Link>
              )}

              {/* Product Name */}
              <h3 style={{ 
                fontWeight: 700, 
                margin: '8px 0 12px', 
                fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                color: '#2d3748',
                lineHeight: '1.4',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {helmet.name}
              </h3>

              {/* Model */}
              {helmetModel && (
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: '14px', 
                  marginBottom: '16px', 
                  color: '#27ae60',
                  background: 'rgba(39, 174, 96, 0.1)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {helmetModel}
                </div>
              )}

              {/* Price */}
              <div style={{ marginBottom: '24px', width: '100%' }}>
                {original && (
                  <div style={{ 
                    color: '#718096', 
                    fontSize: '14px', 
                    marginBottom: '4px', 
                    textDecoration: 'line-through',
                    fontWeight: 500
                  }}>
                    {original}
                  </div>
                )}
                {current && (
                  <div style={{ 
                    color: '#e53e3e', 
                    fontWeight: 800, 
                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
                    marginBottom: '8px' 
                  }}>
                    {current}
                  </div>
                )}
              </div>

              {/* Features Badge */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <span style={{
                  background: 'rgba(66, 153, 225, 0.1)',
                  color: '#2b6cb0',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {helmet.features?.["Type de casque"]}
                </span>
                {helmet.features?.["Garantie"] && (
                  <span style={{
                    background: 'rgba(72, 187, 120, 0.1)',
                    color: '#276749',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {helmet.features.Garantie} Garantie
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <Link
                to="/product"
                state={{ product: helmet, source: 'Motorcycle-Helmets' }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #27ae60 0%, #219653 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  marginTop: 'auto',
                  boxShadow: '0 4px 16px rgba(39, 174, 96, 0.3)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  maxWidth: '200px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(39, 174, 96, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(39, 174, 96, 0.3)';
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>
                  VOIR LE PRODUIT
                </span>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s ease'
                }} />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Loading Animation Styles */}
      <style jsx>{`
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .helmet-card:hover .cta-overlay {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default MotorcycleHelmetsPage;