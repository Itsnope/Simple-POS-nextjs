import { create } from 'zustand'

// CartState adalah interface yang merepresentasikan state dari keranjang belanja.
interface CartState {
  items: number[];
  addToCart: () => void;
}

// useCartStore adalah hook yang digunakan untuk mengakses dan memodifikasi state cart/keranjang.
// create adalah fungsi dari Zustand untuk membuat state global.
// currying = create<CartState>()((set) => ({ ... })).
export const useCartStore = create<CartState>()((set) => ({
  items: [1, 2, 3, 4, 5], // contoh untuk testing state.
  addToCart: () => {},
}));
