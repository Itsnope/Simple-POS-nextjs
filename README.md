# Aplikasi Kasir Sederhana (Simple POS) - Next.js

Proyek aplikasi kasir sederhana ini dibangun dengan Next.js, tRPC, Clerk (Authentication), Supabase (Database & Storage), Xendit (Payment Gateway).

## Day 1 : Setup Project & CRUD Category

### 🚀 Persiapan awal

- Pastikan menginstall Node.js dan npm terlebih dahulu
- Clone repository berikut :
  ```bash
  git clone https://github.com/Itsnope/Simple-POS-nextjs.git
  cd Simple-POS-nextjs
  ```
- Install dependency proyek :
  ```bash
  npm install
  ```
- Konfigurasikan environment variables (.env) dengan menyalin file `.env.example` menjadi `.env`

### 🔐 Clerk Setup

- Buat akun clerk di [https://clerk.com](https://clerk.com).
- Buat proyek aplikasi baru.
- Setelah proyek aplikasi dibuat, salin nilai environment variables berikut dari dashboard clerk:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
- Tempel nilai environment variables tersebut ke dalam file `.env`:
  ```bash
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk-public-key
  CLERK_SECRET_KEY=your_clerk-private-key
  ```

### 📂 Supabase Setup

- Buat akun supabase di [https://supabase.com/](https://supabase.com/)
- Klik **New Project** untuk membuat proyek baru
- Di dashboard Supabase, klik proyek yang baru dibuat
- Klik tombol **Connect** di kiri atas
- Buka tab **ORMs**
- Salin nilai connection string dari file .env.local:
  - `DATABASE_URL`
  - `DIRECT_URL`
- Tempel nilai connection string tersebut ke dalam file `.env`:
  ```bash
  # Connect to Supabase via connection pooling
  DATABASE_URL=your_supabase_connection_pooling_url

  # Direct connection to the database. Used for migrations
  DIRECT_URL=your_supabase_direct_connection_url
  ```
- Ganti `YOUR_PASSWORD` pada connection string dengan password database Anda (bisa dilihat di halaman Project Settings > Database)

### ▶️ Jalankan Proyek

Setelah semua variabel lingkungan diatur, jalankan perintah berikut:

```bash
npm run db:push
npm run dev
```


### 📝 List file changes day 1

- Setup Project : 
  - `.env`  
  Mendefinisikan variabel lokal.
  - `schema.prisma`  
  Mendefinisikan skema database dan model data aplikasi Anda.
- CRUD Category :
  - `src/server/api/routers/category.ts`  
  Mendefinisikan semua endpoint API (prosedur tRPC) yang spesifik untuk melakukan operasi CRUD pada entitas Kategori.
  - `src/server/api/root.ts`  
  Merupakan file inti yang menggabungkan semua router tRPC di backend.
    - fix : Membuat API kategori dapat digunakan oleh frontend.
  - `src/pages/categories/index.tsx`  
  Merupakan titik masuk (entry point) atau halaman utama untuk rute /categories (halaman utama kategori).
    - fix : Membuat fungsi CRUD categories aplikasi bisa sinkron dengan database.


## Day 2
- [x] Read product
- [x] Create product
- [ ] Include file uploads with signed URL
- [ ] Forms -> RHF (React Hook Form)
- [ ] Update product
- [ ] Delete product
- [ ] Filter product by category


# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.