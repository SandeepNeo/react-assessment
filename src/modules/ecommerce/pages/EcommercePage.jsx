import { useState, useEffect } from 'react';
import { getCategories, getProducts } from '../services/productService';
import CategoryFilter from '../components/CategoryFilter';
import ProductList from '../components/ProductList';
import { ShoppingBag } from 'lucide-react';

export default function EcommercePage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCategories().then((cats) => {
      if (isMounted) {
        setCategories(cats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    getProducts(selectedCategory)
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 mb-1">
            <ShoppingBag size={24} className="text-brand-primary" /> E-Commerce Catalog
          </h2>
          <p className="text-sm text-slate-600">
            Browse products powered by live API data. Add items to your cart to review in AG Grid.
          </p>
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ProductList products={products} loading={loading} />
    </div>
  );
}
