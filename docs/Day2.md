# Day 2 : Read & Create Product from 0.5 (scratch + template)

## PRE-SIGNED URL

PRE-SIGNED URL -> POST https://..........
1. kirim req ke BE untuk minta presigned url (router product/createProductImageUploadSignedUrl)
2. upload image ke presigned url (supabase.ts/uploadFileToSignedUrl)
3. dapat url object (supabase.ts/uploadFileToSignedUrl)
4. kirim url image ke mutation tRPC (router/createProduct)

- cons
  - 2 kali request
  - bisa jadi img-nya gak ke pakai
- pros
  - gak bebanin server(server cuma terima url, yg dibebankan itu bucket)


## 📝 List file changes day 2

- Setup Project : 
  - `.env`  
  Mendefinisikan variabel lokal baru :
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=your_NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_ROLE_KEY=your_SUPABASE_ROLE_KEY
  ```
  - `schema.prisma`  
  Mendefinisikan model baru (model Product).

<br />

- CRUD Product :
  - `src\server\supabase-admin.ts`  
  Mendefinisikan role admin supabase via role key.
  - `src\lib\supabase.ts`  
  Mendefinisikan client yg bisa akses supabase secara public (url + anon key) & ngirim file (uploadFileToSignedUrl) 
  - `src\forms\product.ts`  
  Mendefinisikan aturan/validasi tipe data dari form product.
    - Di `ProductForm.tsx` dia validate data real-time (user ketik/pilih).
    - Di `products/index.tsx` dia validate data sebelum dikirim ke BE.
  - `src\components\shared\product\ProductForm.tsx`  
  Mendefinisikan field data untuk form product.
    - Pakai `forms\product.ts` untuk validasi data.
    - Pakai `createImageSignedUrl()` untuk request router buat bikin signed url dan kirim kembali signed urlnya.
    - Pakai `uploadFileToSignedUrl()` untuk request supabase.ts upload file dan kirim kembali public urlnya.
  - `src/server/api/routers/product.ts`  
  Mendefinisikan semua endpoint API (prosedur tRPC) yang spesifik untuk melakukan operasi CRUD pada entitas Produk.  
    - Day 2 - add : Tambah createProductImageUploadSignedUrl untuk buat sign url dgn bantuan supabase admin.
    - Day 2 - add : Membuat fungsi CRUD products aplikasi bisa sinkron dengan database.
  - `src/server/api/root.ts`  
  Merupakan file inti yang menggabungkan semua router tRPC di backend.
    - Day 2 - fix : Membuat API Produk dapat digunakan oleh frontend.
  - `src/pages/products/index.tsx`  
  Merupakan titik masuk (entry point) atau halaman utama untuk rute /products (tampilan utama produk).

## ✏️ Note Day 2 

Ketika menggunakan context RHF (React-hook-form) maka dia berasumsi ada wrapper di luar yang membungkus context. Jadi, perlu ditambah wrapper manual &lt;Form&gt;.  <br />
Misal :  
const createProductForm = useForm&lt;ProductFormSchema&gt;  
maka ditulis : &lt;Form {...createProductForm}&gt;  
dimana : 
- Form = wrapper context
- ... = spread operator
- createProductForm = bentuk form 

### Alur signedUrl -> Public Url :
![Alur signedUrl -> Public Url](https://raw.githubusercontent.com/Itsnope/Simple-POS-nextjs/main/docs/Day2-AlurGenerateSignUrl.png)
1. ProductForm (`ProductForm.tsx`) akan ditampilkan di pages products (`products/index.tsx`).
2. Di `ProductForm.tsx`, saat file gambar diupload (onChange) maka akan panggil method imageChangeHandler yg diambil dari router product (`routers/product.ts`). 
3. Method imageChangeHandler/createProductImageUploadSignedUrl akan membuat dan me-return signed url (`routers/product.ts`).
4. Di `ProductForm.tsx`, saat signed url sudah didapatkan maka akan panggil method uploadFileToSignedUrl yg diambil dari `lib/supabase.ts`. Pada tahap ini, signed url yg diterima akan di destructure menjadi komponen `path` dan `token`nya saja.
5. Method uploadFileToSignedUrl akan mengupload file sesuai dengan parameter (bucket, path, token, file) yg dikirim `ProductForm.tsx` (File A diupload di bucket B dengan path C dan ini adalah token/izinnya).
6. Method uploadFileToSignedUrl akan me-return public url dari file yg diupload.
7. Variabel public url akan diterima method imageUrl(`ProductForm.tsx`) sebagai string, yang kemudian akan dioper ke parent-nya (`products/index.tsx`) lewat props onChangeImageUrl.
8. Di `products/index.tsx`, props onChangeImageUrl akan men-set/menyimpan imageUrl ke state uploadedCreateProductImageUrl menggunakan setUploadedCreateProductImageUrl.
9. Saat handleSubmitCreateProduct ke-trigger/tombol create di klik, maka nama, price, category, serta public url yg disimpan di state uploadedCreateProductImageUrl akan diupload dengan method createProducts (`products/index.tsx`).
10. Input dari `products/index.tsx` akan diteruskan ke BE/router product (`routers/product.ts`) untuk diupload ke DB.

### Alur konfigurasi CRUD (scratch + template) 
1. Buat validasi form di `src\forms\product.ts`.
2. Buat form produk di `src\components\shared\product\ProductForm.tsx`
3. Tambahkan fungsi CRUD di `src\server\api\routers\product.ts`.
4. Koneksikan router product di appRouter `src\server\api\root.ts`.
5. Panggil router product di `src\pages\products\index.tsx`.