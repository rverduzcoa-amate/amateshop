
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { products } from '../data/products';

function Search() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    // Buscar productos por nombre (case-insensitive)
    const allProducts = Object.values(products).flat();
    const results = searchTerm.trim()
        ? allProducts.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    return (
        <section id="view-search" className="view">
            <header className="header-view">
                <button onClick={() => navigate(-1)}>&larr; Back</button>
                <h1>BUSCAS PRODUCTOS</h1>
            </header>
            <div className="search-view-content">
                <div className="search-box-full">
                   <input 
                        type="text" 
                        id="searchInput" 
                        placeholder="Type product name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <section id="searchResults">
                    {searchTerm.trim() && results.length === 0 && (
                        <div className="no">No se encontraron productos.</div>
                    )}
                    {results.map(prod => (
                        <Link to={`/products/${prod.id}`} key={prod.id} className="card show" style={{ display: 'block', marginBottom: 16, textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <img
                                    src={Array.isArray(prod.img) ? prod.img[0] : prod.img}
                                    alt={prod.nombre}
                                    style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', background: '#f0f0f0' }}
                                />
                                <div>
                                    <h3 style={{ margin: 0 }}>{prod.nombre}</h3>
                                    <div className="precio">{prod.precio}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </section>
            </div>
        </section>
    );
}

export default Search;
