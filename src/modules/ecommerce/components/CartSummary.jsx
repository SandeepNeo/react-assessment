import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { CreditCard, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function CartSummary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, subtotal } = useSelector((state) => state.ecommerce);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const gstTax = Math.round(subtotal * 0.18 * 100) / 100;
  const grandTotal = Math.round((subtotal + gstTax) * 100) / 100;

  const handleCheckout = () => {
    alert(`Order Placed Successfully! Total: $${grandTotal.toFixed(2)}`);
    dispatch(clearCart());
    navigate('/ecommerce');
  };

  const handleConfirmClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-5 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-200">Order Summary</h3>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Unique Products</span>
            <span className="font-semibold text-slate-900">{items.length} items</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Total Units</span>
            <span className="font-semibold text-slate-900">{totalQuantity} units</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Estimated Tax (18%)</span>
            <span className="font-semibold text-slate-900">${gstTax.toFixed(2)}</span>
          </div>

          <div className="h-px bg-slate-200 my-1.5"></div>

          <div className="flex justify-between items-baseline text-base font-bold text-slate-900">
            <span>Grand Total</span>
            <span className="text-2xl font-extrabold text-emerald-600">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <button
            onClick={handleCheckout}
            className="w-full py-3 px-4 rounded-xl bg-brand-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-brand-primaryHover transition-all shadow-xs text-sm cursor-pointer"
          >
            <CreditCard size={18} /> Proceed to Checkout
          </button>

          <div className="flex gap-2.5">
            <button
              onClick={() => navigate('/ecommerce')}
              className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <ShoppingBag size={14} /> Catalog
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex-1 py-2 px-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
            >
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Cart"
        message="Are you sure you want to delete?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmClearCart}
        onClose={() => setShowClearConfirm(false)}
      />
    </>
  );
}
