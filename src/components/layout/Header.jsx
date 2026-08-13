import { useSelector } from 'react-redux';
import { ShoppingCart, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const cartTotalQuantity = useSelector((state) => state.ecommerce.totalQuantity);

  const getPageTitle = () => {
    if (location.pathname.startsWith('/ecommerce/cart')) return 'Cart Management';
    if (location.pathname.startsWith('/stocks')) return 'Stock Portfolio Manager';
    if (location.pathname.startsWith('/market')) return 'Real-Time Market Feed';
    return 'E-Commerce Store';
  };


  return (
    <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">{getPageTitle()}</h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-brand-primary border border-blue-200">
            <ShieldCheck size={13} /> Active Session
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <Link
          to="/ecommerce/cart"
          className="relative text-slate-600 hover:text-brand-primary transition-colors p-2 rounded-lg hover:bg-slate-100"
          title="View Cart"
        >
          <div className="relative flex items-center">
            <ShoppingCart size={22} />
            {cartTotalQuantity > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-brand-primary text-white text-[11px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-white">
                {cartTotalQuantity}
              </span>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="w-8 h-8 rounded-full bg-brand-primary text-white font-bold text-xs flex items-center justify-center shadow-xs">
            SY
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-slate-900">Sandeep Yadav</span>
            <span className="text-[11px] text-slate-500">React Developer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
