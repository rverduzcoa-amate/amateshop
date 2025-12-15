

import React, { useState, useEffect } from 'react';
import resolvePublicPath from '../utils/resolvePublicPath';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';

function findProductById(productId) {
    for (const category of Object.values(products)) {
        const found = category.find((p) => p.id === productId);
        if (found) return found;
    }
    return null;
}

function Product() {
    const { productId } = useParams();
    // All hooks must be called unconditionally
    const [, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch {
            return [];
        }
    });
    const product = findProductById(productId);
    // Soporta imágenes múltiples o una sola
    const images = Array.isArray(product?.img) ? product.img : [product?.img];
    const [mainImg, setMainImg] = useState(images[0]);

    // Lightbox state for zoomed image view
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState('');
    const [lightboxIsSquare, setLightboxIsSquare] = useState(false);

    const openLightbox = (src) => {
        if (!src) return;
        // attempt to measure image dimensions to decide square vs rectangle
        const img = new Image();
        img.onload = () => {
            const w = img.naturalWidth || 0;
            const h = img.naturalHeight || 0;
            // consider near-square if width/height within ~12%
            const near = Math.abs(w - h) <= Math.min(w, h) * 0.12;
            setLightboxIsSquare(near);
            setLightboxSrc(src);
            setLightboxOpen(true);
        };
        img.src = src;
    };

    const closeLightbox = () => { setLightboxOpen(false); setLightboxSrc(''); };

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const addToCart = (id) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === id);
            const updated = exists
                ? prev.map(item => item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item)
                : [...prev, { id, qty: 1 }];
            localStorage.setItem('cart', JSON.stringify(updated));
            return updated;
        });
    };

    if (!product) {
        return (
            <section id="view-product" className="view">
                <h1>Producto no encontrado</h1>
            </section>
        );
    }

    return (
        <section id="view-product" className="view">
            <h1>{product.nombre}</h1>
            <div className="product-main">
                <img
                    src={resolvePublicPath(mainImg)}
                    alt={product.nombre}
                    className="product-img"
                    style={{ width: 260, borderRadius: 10, objectFit: 'cover', background: '#f0f0f0', marginBottom: 8, boxShadow: '0 2px 12px rgba(199,161,106,0.10)' }}
                    loading="lazy"
                    onError={e => { e.target.style.display = 'none'; }}
                                    onClick={() => openLightbox(resolvePublicPath(mainImg))}
                />
                {images.length > 1 && (
                    <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                        {images.map((src, i) => (
                            <img
                                key={i}
                                src={resolvePublicPath(src)}
                                alt={product.nombre + ' miniatura ' + (i+1)}
                                style={{ width: 54, height: 54, borderRadius: 6, objectFit: 'cover', background: '#f0f0f0', border: mainImg === src ? '2px solid #c7a16a' : '2px solid #eee', cursor: 'pointer', transition: 'border 0.2s' }}
                                onClick={() => setMainImg(src)}
                                loading="lazy"
                                onError={e => { e.target.style.display = 'none'; }}
                                onDoubleClick={() => openLightbox(resolvePublicPath(src))}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="precio" style={{ fontSize: 24, margin: '16px 0' }}>{product.precio}</div>
            <button onClick={() => addToCart(product.id)} className="add-to-cart-btn" style={{ background: '#c7a16a', color: '#fff', border: 'none', padding: '10px 24px', fontSize: 18, cursor: 'pointer', marginTop: 16 }}>
                Añadir al carrito
            </button>

                        {lightboxOpen && (
                            <div
                                role="dialog"
                                aria-modal="true"
                                onClick={closeLightbox}
                                tabIndex={-1}
                                style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1200}}
                            >
                                <div onClick={e => e.stopPropagation()} style={{maxWidth:'92vw', maxHeight:'92vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    <div style={{position:'relative'}}>
                                        <img
                                            src={lightboxSrc}
                                            alt={product.nombre}
                                            style={lightboxIsSquare ? {width: 'min(720px, 90vw)', height: 'min(720px, 90vw)', objectFit: 'cover', display:'block', borderRadius:8} : {maxWidth:'90vw', maxHeight:'90vh', objectFit:'contain', display:'block', borderRadius:8}}
                                        />
                                        <button onClick={closeLightbox} aria-label="Cerrar" style={{position:'absolute', right:-10, top:-10, background:'#fff', borderRadius:20, border:'none', width:36, height:36, cursor:'pointer'}}>✕</button>
                                    </div>
                                </div>
                            </div>
                        )}
        </section>
    );
}

export default Product;
