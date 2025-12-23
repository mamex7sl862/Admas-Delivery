import { create } from "zustand";

const useCartStore = create((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i._id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i._id === id ? { ...i, quantity } : i)),
    })),
  clearCart: () => set({ items: [] }),
  getTotalItems: () =>
    useCartStore.getState().items.reduce((sum, i) => sum + i.quantity, 0),
  getTotalPrice: () =>
    useCartStore
      .getState()
      .items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));

export default useCartStore;
