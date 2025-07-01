# Day 4 : Payment & Order

## 📝 List file changes day 4

- Setup Project : 
  - `.env`  
  Mendefinisikan variabel lokal baru :
  ```bash
  XENDIT_WEBHOOK_TOKEN=YOUR_XENDIT_WEBHOOK_TOKEN
  ```

<br />

- Webhook & sales page :

  - `src\middleware.ts`  
  Mengatur middleware autentikasi Clerk, agar route `/api/payments` bisa diakses tanpa login, sementara route lain tetap membutuhkan autentikasi. 
  - `src\pages\api\payments\webhook.ts`  
  Sebagai endpoint yg menerima notifikasi (webhook) dari Xendit ketika ada update status pembayaran.
  - `src\server\xendit.ts` 
    - Day 4 - add : Fitur simulate payment.
  - `src\server\api\routers\order.ts`  
  Mendefinisikan semua endpoint API (prosedur tRPC) yang spesifik untuk melakukan operasi Create order.  
    - Day 4 - add : 
      - router simulatePayment.
      - router getOrders.
      - router finishOrder.
      - support filter order (getOrders).
      - router gesSalesReport.
  - `src\components\shared\CreateOrderSheet.tsx`
  Merupakan UI dan logic utama untuk proses checkout dan pembayaran order.
    - Day 4 - add : 
      - Fitur simulate payment
      - Check payment status
      - implement clearCart 
  - `src\store\cart.ts`  
  Mendefinisikan global state dari cart/keranjang menggunakan zustand. 
    - Day 4 - add : 
      - fungsi clearCart
  - `src\components\OrderCard.tsx`  
  Menampilkan ringkasan detail satu order/transaksi, termasuk status, jumlah item, total harga, dan tombol finish.
    - Day 4 - fix : 
      - Ganti properti interface OrderCardProps.
      - Finish order button
  - `src\pages\sales\index.tsx`
  Merupakan titik masuk (entry point) atau halaman utama untuk rute /sales (tampilan utama sales).
    - Day 4 - add :
      - Implement filter order by status.
      - Implement finish order.
      - Implement sales report (total revenue, order ongoing & completed).


## ✏️ Note Day 4

Aplikasi yang production ready = Error Handling & Validasi data optimal.