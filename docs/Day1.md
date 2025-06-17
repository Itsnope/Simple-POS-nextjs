# Day 1 : Setup Project & CRUD Category

## 📝 List file changes day 1

- Setup Project : 
  - `.env`  
  Mendefinisikan variabel lokal :
  ```bash
  DATABASE_URL="postgresql://postgres:password@localhost:5432/simple-pos"
  DIRECT_URL="postgresql://postgres:password@localhost:5432/simple-pos"

  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=clerk-public-key
  CLERK_SECRET_KEY=clerl-private-key
  ```
  - `schema.prisma`  
  Mendefinisikan skema database dan model data aplikasi (model Category).
  <br />
- CRUD Category :
  - `src/server/api/routers/category.ts`  
  Mendefinisikan semua endpoint API (prosedur tRPC) yang spesifik untuk melakukan operasi CRUD pada entitas Kategori.
    - fix : Membuat fungsi CRUD categories aplikasi bisa sinkron dengan database.
  - `src/server/api/root.ts`  
  Merupakan file inti yang menggabungkan semua router tRPC di backend (Biar router bisa diaskes file lain juga). 
    - fix : Membuat API/router kategori dapat digunakan oleh FE.
  - `src/pages/categories/index.tsx`  
  Merupakan titik masuk (entry point) atau halaman utama untuk rute /categories (Tampilan utama kategori).

## ✏️ Note Day 2 
    
### Codebase
1. prisma.schema :  
  ORM (Object-Relational Mappers) yang bisa koneksikan db(SQL/NoSQL) dengan bahasa OOP (represantasi table jadi object).
2. folder data/mock :  
  Data dummy.

### Clerk
Clerk adalah dedicated authentication services. Jadi, error karena pw kurang aman meski aplikasi masih lokal adalah wajar.

### Supabase
prisma-client hasil `npm run db:push` :  
Otomatis generate types dan interface ts sesuai bentuk database biar muncul suggestion di Text Editor (built in type-safe).

### Alur konfigurasi CRUD (Form template) 
1. Buat fungsi CRUD di `src\server\api\routers\category.ts`.
2. Koneksikan router category di appRouter `src\server\api\root.ts`.
3. Panggil router category di `src\pages\categories\index.tsx`.