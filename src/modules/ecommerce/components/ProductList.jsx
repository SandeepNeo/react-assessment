import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

export default function ProductList({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl h-[320px] p-4 flex flex-col gap-3 animate-pulse">
            <div className="h-[180px] bg-slate-100 rounded-lg"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center p-14 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center gap-3">
        <PackageOpen size={48} className="text-slate-400" />
        <h3 className="text-lg font-bold text-slate-900">No Products Found</h3>
        <p className="text-sm text-slate-500">Try selecting a different category from the filter above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
