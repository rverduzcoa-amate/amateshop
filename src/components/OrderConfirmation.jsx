import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function OrderConfirmation() {
  const location = useLocation();
  const { order } = location.state || {};

  return (
    <section className="view" style={{ textAlign: 'center', paddingTop: 40 }}>
      <h1>¡Gracias por tu compra!</h1>
      <p>Tu pedido ha sido recibido y está siendo procesado.</p>
      {order && (
        <div style={{ margin: '32px auto', maxWidth: 400, background: '#faf8f5', borderRadius: 10, boxShadow: '0 2px 12px rgba(199,161,106,0.07)', padding: 24 }}>
          <h2 style={{ color: '#c7a16a' }}>Resumen del pedido</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {order.items.map(item => (
              <li key={item.id} style={{ marginBottom: 10, textAlign: 'left' }}>
                <span style={{ fontWeight: 600 }}>{item.nombre}</span> x {item.qty} <span style={{ float: 'right' }}>{item.precio}</span>
              </li>
            ))}
          </ul>
          <div style={{ fontWeight: 700, fontSize: 18, marginTop: 18 }}>Total: ${order.total.toFixed(2)}</div>
        </div>
      )}
      <Link to="/" style={{ display: 'inline-block', marginTop: 32, background: '#c7a16a', color: '#fff', borderRadius: 6, padding: '10px 28px', fontWeight: 600, textDecoration: 'none', fontSize: 18 }}>Volver al inicio</Link>
    </section>
  );
}

export default OrderConfirmation;
