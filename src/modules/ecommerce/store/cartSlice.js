import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  subtotal: 0,
};

const calculateTotals = (items) => {
  return items.reduce(
    (acc, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      acc.totalQuantity += qty;
      acc.subtotal += qty * price;
      return acc;
    },
    { totalQuantity: 0, subtotal: 0 }
  );
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex((i) => i.id === product.id);

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }

      const { totalQuantity, subtotal } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.subtotal = subtotal;
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const parsedQty = parseInt(quantity, 10);

      if (isNaN(parsedQty) || parsedQty < 1) {
        return;
      }

      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = parsedQty;
        const { totalQuantity, subtotal } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.subtotal = subtotal;
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      const { totalQuantity, subtotal } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.subtotal = subtotal;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.subtotal = 0;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
