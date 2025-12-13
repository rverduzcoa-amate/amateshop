
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import resolvePublicPath from '../utils/resolvePublicPath';

function getAllProductsMap() {
    // Flatten all products into a map by id
    const map = {};
    Object.values(products).flat().forEach(p => { map[p.id] = p; });
    return map;
}


function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage or start empty
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const productsMap = getAllProductsMap();


    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = (item.qty || 1) + delta;
                if (newQty < 1) return item; // Prevent going below 1
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((sum, item) => {
        const prod = productsMap[item.id];
        if (!prod) return sum;
        const price = parseFloat((prod.precio || '').replace(/[^\d.]/g, '')) || 0;
        return sum + price * (item.qty || 1);
    }, 0);

    const handleCheckout = () => {
        // Prepare order summary
        const items = cart.map(item => {
            const prod = productsMap[item.id];
            return {
                id: item.id,
                nombre: prod?.nombre || item.id,
                qty: item.qty || 1,
                precio: prod?.precio || '',
            };
        });
        const order = { items, total };
        setCart([]);
        localStorage.setItem('cart', '[]');
        navigate('/order-confirmation', { state: { order } });
    };

    return (
        <section id="view-cart" className="view">
            <h1>Carrito</h1>
            {cart.length === 0 ? (
                <div className="no">Tu carrito está vacío.</div>
            ) : (
                <>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cart.map(item => {
                            const prod = productsMap[item.id];
                            if (!prod) return null;
                            return (
                                <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                                    <img src={resolvePublicPath(Array.isArray(prod.img) ? prod.img[0] : prod.img)} alt={prod.nombre} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', background: '#f0f0f0' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{prod.nombre}</div>
                                        <div className="precio">{prod.precio}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <button onClick={() => updateQty(item.id, -1)} style={{ padding: '2px 8px', fontSize: 18, borderRadius: 4, border: '1px solid #ccc', background: '#f8f8f8', cursor: 'pointer' }}>-</button>
                                            <span style={{ minWidth: 24, textAlign: 'center', display: 'inline-block' }}>{item.qty || 1}</span>
                                            <button onClick={() => updateQty(item.id, 1)} style={{ padding: '2px 8px', fontSize: 18, borderRadius: 4, border: '1px solid #ccc', background: '#f8f8f8', cursor: 'pointer' }}>+</button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Eliminar</button>
                                </li>
                            );
                        })}
                    </ul>
                    <div style={{ fontWeight: 700, fontSize: 18, margin: '16px 0' }}>Total: ${total.toFixed(2)}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                        <button onClick={clearCart} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' }}>Vaciar carrito</button>
                        <button onClick={handleCheckout} style={{ background: '#c7a16a', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 18 }}>Finalizar compra</button>
                    </div>
                </>
            )}
        </section>
    );
}

export default Cart;
