import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + (item.qty || 1), 0));
  }, [location]);

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY || window.pageYOffset;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const upward = lastY.current - currentY; // positive when scrolling up
          const downward = currentY - lastY.current; // positive when scrolling down
          const UP_THRESHOLD = 8; // show header after ~8px upward
          const DOWN_THRESHOLD = 12; // hide header after ~12px downward

          if (downward > DOWN_THRESHOLD && currentY > 80) {
            setHidden(true);
          } else if (upward > UP_THRESHOLD) {
            setHidden(false);
          }

          lastY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`persistent-header${hidden ? ' hidden' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', position: 'relative' }}>
        <div style={{ flex: 1, display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link to="/categories" style={{ textDecoration: 'none', color: '#333' }}>Catálogo</Link>
        </div>

        <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
          <Link to="/" className="site-logo-text" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Amate
            <div className="site-logo-sub">JEWELRY</div>
          </Link>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 24, alignItems: 'center' }}>
          <Link to="/search" style={{ textDecoration: 'none', color: '#333' }}>Buscar</Link>
          <Link to="/account" style={{ textDecoration: 'none', color: '#333' }}>Cuenta</Link>
          <Link to="/cart" style={{ position: 'relative', textDecoration: 'none', color: '#333', fontWeight: 600 }}>
            🛒
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -8, right: -12, background: '#c7a16a', color: '#fff', borderRadius: '50%',
                padding: '2px 7px', fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: 'center', lineHeight: '18px'
              }}>{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
