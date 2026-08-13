import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartGrid from '../components/CartGrid';
import CartSummary from '../components/CartSummary';
import { ShoppingCart, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const cartItems = useSelector((state) => state.ecommerce.items);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex flex-col gap-1.5">
        <Link
          to="/ecommerce"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-primary transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <ShoppingCart size={24} className="text-brand-primary" /> Cart & AG Grid Quantities
        </h2>
        <p className="text-sm text-slate-600">
          Directly edit product quantities in the AG Grid below. Redux store updates immediately.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-16 flex justify-center">
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center flex flex-col items-center gap-3 max-w-md w-full shadow-xs">
            <ShoppingBag size={56} className="text-slate-400 mb-2" />
            <h3 className="text-xl font-bold text-slate-900">Your Cart is Currently Empty</h3>
            <p className="text-sm text-slate-500">You have not added any products from the catalog yet.</p>
            <Link
              to="/ecommerce"
              className="mt-3 px-5 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primaryHover transition-all shadow-xs"
            >
              Explore Products Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div>
            <CartGrid cartItems={cartItems} />
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
