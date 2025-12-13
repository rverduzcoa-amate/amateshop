import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Update cart count from localStorage on mount and when location changes
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + (item.qty || 1), 0));
  }, [location]);

  return (
    <header className="persistent-header" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px', background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#c7a16a', fontWeight: 700, fontSize: 22 }}>
        Amate Jewelry
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link to="/categories" style={{ textDecoration: 'none', color: '#333' }}>Catálogo</Link>
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
      </nav>
    </header>
  );
}

export default Header;
