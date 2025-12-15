import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import resolvePublicPath from '../utils/resolvePublicPath';
import { products } from '../data/products';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function NewArrivalsGrid() {
  const query = useQuery();
  const category = query.get('category');
  const navigate = useNavigate();

  const items = useMemo(() => {
    // Only show products explicitly marked `new: true`.
    if (category && products[category]) {
      return (products[category] || []).filter(p => p && p.new);
    }
    const all = Object.keys(products).reduce((acc, k) => acc.concat(products[k] || []), []);
    return all.filter(p => p && p.new);
  }, [category]);

  return (
    <section id="view-newArrivals" className="view">
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
        <h2 style={{margin:0}}>New Arrivals</h2>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12}}>
        {items && items.length > 0 ? items.map((p, i) => {
          const img = Array.isArray(p.img) ? p.img[0] : p.img;
          const src = img ? resolvePublicPath(img) : undefined;
          return (
            <div key={p.id || i} style={{borderRadius:8, overflow:'hidden', background:'#fff', boxShadow:'0 6px 18px rgba(0,0,0,0.06)'}}>
              <button type="button" onClick={() => navigate(`/products/${p.id}`)} style={{all: 'unset', display:'block', width:'100%', height:'100%', cursor:'pointer'}}>
                {src ? <img src={src} alt={p.nombre} style={{width:'100%', height:160, objectFit:'cover', display:'block'}}/> : <div style={{height:160, background:'#eee'}}/>}
                <div style={{padding:8}}>
                  <div style={{fontWeight:700, fontSize:14}}>{p.nombre}</div>
                  <div style={{color:'#666', marginTop:6}}>{p.precio}</div>
                </div>
              </button>
            </div>
          );
        }) : (
          <div style={{gridColumn: '1/-1', padding: 20, background:'#fff', borderRadius:8, textAlign:'center'}}>No new arrivals found.</div>
        )}
      </div>
    </section>
  );
}
