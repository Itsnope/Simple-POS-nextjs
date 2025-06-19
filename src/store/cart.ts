import { create } from 'zustand'

// CartItem adalah type yang merepresentasikan item dalam keranjang belanja.
type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// AddToCartItem adalah type yang digunakan untuk menambah item ke keranjang belanja.
// Omit = Jangan ambil property quantity dari CartItem yg diduplikat.
type AddToCartItem = Omit<CartItem, "quantity">


// CartState adalah interface yang merepresentasikan state dari keranjang belanja.
interface CartState {
  items: CartItem[];
  addToCart: (newItem: AddToCartItem) => void;
}

// useCartStore adalah hook yang digunakan untuk mengakses dan memodifikasi state cart/keranjang.
// create adalah fungsi dari Zustand untuk membuat state global.
// currying = create<CartState>()((set) => ({ ... })).
// State = immutable -> value-nya tdk boleh diubah secara langsung, jadi harus return dengan array yg terbaru.
export const useCartStore = create<CartState>()((set) => ({
  // items: [1, 2, 3, 4, 5], // contoh untuk testing state.

  // 1. Pertama, kita siapkan keranjang belanja (items) yang masih kosong.
  items: [],

  // 2. Lalu, kita buat fungsi addToCart untuk menambah barang ke keranjang.
  addToCart: (newItem) => {
    // 1. Kalau item belum ada di cart, tambahkan item baru dengan quantity 1
    // 2. Kalau item sudah ada di cart, modify quantity dengan menambahkannya 1.

    // Set untuk mengupdate state cart
    set((currentState) => {
      
      // a. Kita salin dulu isi keranjang saat ini ke variabel duplicateItems.
      const duplicateItems = [...currentState.items];
      
      // b. Setelah itu, kita masukkan barang baru ke duplicateItems, dengan jumlah (quantity) 1.
      duplicateItems.push({
        productId: newItem.productId,
        name: newItem.name,
        price: newItem.price,
        imageUrl: newItem.imageUrl,
        quantity: 1,
      })

      // c. Terakhir, kita kembalikan state baru dengan isi keranjang yang sudah diperbarui.
      return {
        ...currentState,
        items: duplicateItems,
      };

    })
    // alert(newItem.name);
    // alert("Item added to cart");
  },
}));
