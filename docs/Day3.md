# Day 3 : Cart & payment

## 📝 List file changes day 3

- Setup Project : 
  - `.env`  
  Mendefinisikan variabel lokal baru :
  ```bash
  XENDIT_SECRET_KEY=YOUR_XENDIT_SECRET_KEY
  ```
  - `schema.prisma`  
  Mendefinisikan model baru (model Order & OrderItem).

<br />

- CRUD Product :

  - `src\store\cart.ts`  
  Mendefinisikan global state dari cart/keranjang menggunakan zustand. 
  - `src\components\shared\product\ProductMenuCard.tsx`  
  Mendefinisikan tampilan beserta value pada product card di dashboard.
  - `src\components\shared\CreateOrderSheet.tsx`  
  Mendefinisikan tampilan beserta value dari order sheet (saat cart di klik).
  - `src/server/api/routers/order.ts`  
  Mendefinisikan semua endpoint API (prosedur tRPC) yang spesifik untuk melakukan operasi Create order.  
    - Day 3 - add : Tambah createOrder dengan output berupa order(transaksi), order item(produk orderan), dan qr string/QRIS dari generate Xendit.
  - `src/server/api/root.ts`  
  Merupakan file inti yang menggabungkan semua router tRPC di backend.
    - Day 3 - fix : Membuat API Order dapat digunakan oleh frontend.
  - `src/pages/dashboard/index.tsx`  
  Merupakan titik masuk (entry point) atau halaman utama untuk rute /dashboard (tampilan utama dashboard).
    - Day 3 - fix : Memunculkan fitur cart saat terdapat item yg di tambah di keranjang.
  - `src\server\xendit.ts`
  Digunakan untuk membuat permintaan pembayaran QRIS melalui API Xendit dengan parameter jumlah, ID pesanan, dan waktu kedaluwarsa.

## ✏️ Note Day 3

Webhook -> POST Request dari Xendit yg dikirim ke API NextJs ketika pembayaran dilakukan

tRPC -> Tanstack Query / React Query
- Handle caching (Cukup sekali fetch dan simpan datanya, meskipun ada fungsi fetch yang sama di halaman lain). 

### Alur add to cart :
1. handler add to cart (`src/pages/dashboard/index.tsx`) kirim properti ke `src\store\cart.ts` melalui fungsi `addToCart`.
2. Fungsi `addToCart` berada di dalam sebuah hook `useCartStore` dan akan memberikan output berupa items(kumpulan item dalam cart).
3. `src\components\shared\CreateOrderSheet.tsx` akan memanggil hook `useCartStore` dan me-mapping semua items di &lt;div&gt; `Order Items`.