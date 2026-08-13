import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { addToCart } from '../store/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const cartItems = useSelector((state) => state.ecommerce.items);
  const inCartItem = cartItems.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-md">
      <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider shadow-2xs">
          {product.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded shrink-0">
            <Star size={13} fill="#d97706" color="#d97706" />
            <span>{product.rating}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed flex-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-semibold text-brand-primary">$</span>
            <span className="text-lg font-extrabold text-slate-900">
              {Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-brand-primary text-white hover:bg-brand-primaryHover shadow-xs'
            }`}
          >
            {added ? (
              <>
                <Check size={15} /> Added ({inCartItem ? inCartItem.quantity : 1})
              </>
            ) : (
              <>
                <ShoppingCart size={15} /> {inCartItem ? `Add More (${inCartItem.quantity})` : 'Add to Cart'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
