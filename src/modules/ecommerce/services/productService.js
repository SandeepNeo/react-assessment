const API_URL = 'https://dummyjson.com/products?limit=18';

let cachedMappedProducts = null;

const fetchAndMapProducts = async () => {
  if (cachedMappedProducts) {
    return cachedMappedProducts;
  }

  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  const rawProducts = data.products || [];

  // Filter and extract ONLY the required UI fields
  cachedMappedProducts = rawProducts.map((item) => ({
    id: item.id,
    name: item.title,
    category: item.category
      ? item.category.charAt(0).toUpperCase() + item.category.slice(1)
      : 'General',
    price: item.price,
    rating: item.rating,
    description: item.description,
    image: item.thumbnail || (item.images && item.images[0]) || '',
  }));

  return cachedMappedProducts;
};

export const getProducts = async (category = 'All') => {
  const products = await fetchAndMapProducts();
  if (!category || category === 'All') {
    return products;
  }
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
};

export const getCategories = async () => {
  const products = await fetchAndMapProducts();
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
  return ['All', ...uniqueCategories];
};
