import React, { useEffect, useRef, useMemo, useState } from 'react';
import resolvePublicPath from '../utils/resolvePublicPath';
import { useNavigate } from 'react-router-dom';
import { newArrivals } from '../data/newArrivals';
import { products } from '../data/products';

export default function NewArrivals({ limit = 6 }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemRefs = useRef([]);
  const videoRefs = useRef([]);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  // Use `newArrivals` data (videos) for the carousel. If empty, fall back to
  // `products` entries flagged with `new: true`.
  const items = useMemo(() => {
    if (newArrivals && newArrivals.length > 0) return newArrivals.slice(0, limit);
    const productItems = Object.keys(products).reduce((acc, key) => {
      (products[key] || []).forEach(p => { if (p && p.new) acc.push({ ...p, category: key }); });
      return acc;
    }, []);
    return productItems.slice(0, limit);
  }, [limit]);

  // Play the active slide's video and pause/reset others. Advance on ended.
  useEffect(() => {
    if (!items || items.length === 0) return;

    const cleanup = [];
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;

      if (v._onEnded) {
        try { v.removeEventListener('ended', v._onEnded); } catch (e) {}
        v._onEnded = null;
      }

      const onEnded = () => setCurrentIndex(prev => (prev + 1) % items.length);
      v._onEnded = onEnded;
      v.addEventListener('ended', onEnded);
      cleanup.push(() => { try { v.removeEventListener('ended', onEnded); } catch (e) {} });

      if (idx === currentIndex) {
        try { v.muted = true; v.play().catch(() => {}); } catch (e) {}
      } else {
        try { v.pause(); v.currentTime = 0; } catch (e) {}
      }
    });

    // scroll active into view for visual feedback (if using inline layout)
    const activeEl = itemRefs.current[currentIndex];
    if (activeEl && activeEl.scrollIntoView) {
      try { activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } catch (e) {}
    }

    return () => cleanup.forEach(fn => fn());
  }, [currentIndex, items]);

  // IntersectionObserver to pause videos that are offscreen (performance)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (!el) return;
        if (entry.intersectionRatio < 0.25) {
          try { el.pause(); } catch (e) {}
        } else {
          // if it's the active slide ensure play
          const idx = videoRefs.current.findIndex(v => v === el);
          if (idx === currentIndex) try { el.muted = true; el.play().catch(() => {}); } catch (e) {}
        }
      });
    }, { threshold: [0, 0.25, 0.5] });

    videoRefs.current.forEach(v => { if (v) try { obs.observe(v); } catch (e) {} });
    return () => { try { obs.disconnect(); } catch (e) {} };
  }, [currentIndex, items]);

  // touch handlers for swipe (mobile)
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; touchDeltaX.current = 0; };
  const onTouchMove = (e) => { if (touchStartX.current == null) return; touchDeltaX.current = e.touches[0].clientX - touchStartX.current; };
  const onTouchEnd = () => {
    const delta = touchDeltaX.current || 0;
    const threshold = 40;
    if (Math.abs(delta) > threshold) {
      if (delta < 0) setCurrentIndex(prev => (prev + 1) % items.length);
      else setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    }
    touchStartX.current = null; touchDeltaX.current = 0;
  };

  // pointer handlers for desktop drag/swipe
  const onPointerDown = (e) => { if (e.pointerType === 'mouse' && e.button !== 0) return; touchStartX.current = e.clientX; touchDeltaX.current = 0; try { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); } catch (e) {} };
  const onPointerMove = (e) => { if (touchStartX.current == null) return; touchDeltaX.current = e.clientX - touchStartX.current; };
  const onPointerUp = (e) => { onTouchEnd(); try { e.target.releasePointerCapture && e.target.releasePointerCapture(e.pointerId); } catch (e) {} };

  if (!items || items.length === 0) return null;

  return (
    <div className="categories-section" style={{marginTop: 12}}>
      <div className="categories-header" style={{justifyContent: 'flex-start'}}>
        <div className="categories-title" style={{fontSize:16}}>NEW ARRIVALS</div>
      </div>

      <div className="categories-carousel-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="categories-track" style={{position: 'relative', width: '100%', height: '100%'}}>
          {items.map((it, idx) => (
            <div
              key={it.id || idx}
              ref={el => itemRefs.current[idx] = el}
              className={`category-slide-item ${idx === currentIndex ? 'active' : ''}`}
              style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}
            >
              <button type="button" onClick={() => { navigate(it.link || `/products/${it.id}`); try { window.scrollTo(0,0); } catch(e){} }} style={{all: 'unset', display: 'block', width: '100%', height: '100%', cursor: 'pointer'}}>
                {it.src ? (
                  <video
                    ref={el => videoRefs.current[idx] = el}
                    src={resolvePublicPath(it.src)}
                    muted
                    playsInline
                    preload="auto"
                    poster={it.poster ? resolvePublicPath(it.poster) : undefined}
                    style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                  />
                ) : (
                  <img src={it.poster ? resolvePublicPath(it.poster) : ''} alt={it.nombre} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
                )}

                <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', pointerEvents: 'none'}}>
                  <div style={{fontWeight: 700, fontSize: 18, textShadow: '0 1px 3px rgba(0,0,0,0.6)'}}>{it.nombre}</div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
