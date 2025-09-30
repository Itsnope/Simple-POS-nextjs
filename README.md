# Aplikasi Kasir Sederhana (Simple POS) - Next.js

Proyek aplikasi kasir sederhana ini dibangun dengan Next.js, tRPC, Clerk (Authentication), Supabase (Database & Storage), Xendit (Payment Gateway).

## 🛠️ How Setup Project (WIP)

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
- Klik **New Project** untuk membuat proyek baru (Pastikan pilih **Only Connection String** di bagian **SECURITY OPTIONS**).
- Connection string :
  - Di dashboard Supabase, klik proyek yang baru dibuat
  - Klik tombol **Connect** di kiri atas
  - Buka tab **ORMs**
  - Salin nilai connection string dari file .env.local :
    - `DATABASE_URL`
    - `DIRECT_URL`
  - Tempel nilai connection string tersebut ke dalam file `.env` :
    ```bash
    # Connect to Supabase via connection pooling
    DATABASE_URL=your_supabase_connection_pooling_url

    # Direct connection to the database. Used for migrations
    DIRECT_URL=your_supabase_direct_connection_url
    ```
  - Ganti `YOUR_PASSWORD` pada connection string dengan password database Anda (bisa dilihat di halaman Project Settings > Database).
- Supabase anon & role key : 
  - Kembali ke bagian **Connect**, buka tab **App Frameworks**.
  - Sesuaikan bagian Framework ke Next.js dan Using ke Pages Router.
  - Salin nilai berikut dari file `.env.local` :
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Tempel nilainya ke dalam file `.env` :
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_NEXT_PUBLIC_SUPABASE_ANON_KEY
    ```
  - Buka **Project Settings > API Keys**.
  - Reveal dan salin bagian `service_role`.
  - Tempel nilainya ke dalam file `.env` :
    ```bash
    SUPABASE_ROLE_KEY=your_SUPABASE_ROLE_KEY
    ```
- Supabase Storage :
  - Kembali ke dashboard project, lalu masuk ke bagian Storage.
  - Klik **New bucket** untuk membuat bucket baru.
  - Ketikkan nama bucket `product-images` dan centang bagian **Public bucket**.
  - klik bagian **Additional configuration** dan centang **Restrict file upload size for bucket**.
  - Isi ukuran upload menjadi 10 MB.
  - Ketik `images/*` di bagian **Allowed MIME types**.
  - Klik **Save** untuk menyimpan bucket.

### 💱 Xendit Setup
- Buat akun Xendit di [https://www.xendit.co/id/](https://www.xendit.co/id/).  
(Tidak perlu verifikasi bisnis kalau hanya untuk development.)
- Xendit secret API key :
  - Dari dashboard Xendit, cari dan klik **Settings**.
  - Pada bagian **Developers** klik **API Keys**.
  - Pada bagian **Secret keys** klik **Generate secret key**.
  - Isi bagian **API key name**.
  - Pada bagian **Permissions/Money-in products** pilih **Write**.
  - Klik **Generate key**.
  - Salin nilai `Secret API Key` hasil generate.
  - Tempel nilainya ke dalam file `.env` :
    ```bash
    XENDIT_MONEY_IN_KEY=YOUR_XENDIT_MONEY_IN_KEY
    ```
- Xendit webhook token :
  - Kembali ke **Settings** > **Developers** klik **Webhooks**.
  - Klik **🔒 View Webhook verification token**, verifikasi password, kemudian klik **Copy** untuk menyalin token.
  - Tempel nilainya ke dalam file `.env` :
    ```bash
    XENDIT_WEBHOOK_TOKEN=YOUR_XENDIT_WEBHOOK_TOKEN
    ```


### Ngrok Setup
- Buat akun ngrok di [https://ngrok.com/](https://ngrok.com/)
- Download `ngrok.exe` dari website ngrok.
- Tambahkan `ngrok.exe` ke **System Variable PATH** agar bisa diakses dari terminal.
**(Pastikan proyek sdh berjalan sebelum mengikuti panduan dibawah)**
- Buka terminal, jalankan perintah: `ngrok http localhost:3000`.
- Salin link **forwarding** yang muncul, misal: `https://string.ngrok-free.app`.
- Buka Xendit :
  - Masuk ke Settings > Developers > Webhooks/Callback.
  - Cari bagian **PAYMENT REQUESTS V2 (/v2/payment_requests)**
  - Pada **Payment Succeeded**, isi dengan: forwarding link + `/api/payments/webhook` (contoh: `https://string.ngrok-free.app/api/payments/webhook`).
  - Klik `Test and save`


### ▶️ Jalankan Proyek

Setelah semua variabel lingkungan diatur, jalankan perintah berikut:

```bash
npm run db:push
npm run dev
```

## 📅 Daily Notes

### Day 1 : Setup Project & CRUD Category
[Day1 - Documentation](https://github.com/Itsnope/Simple-POS-nextjs/blob/main/docs/Day1.md)

- [x] Setup project NextJS, tRPC, Clerk, Supabase Storage
- [x] flow dasar project
- [x] Setup database schemas
- [x] CRUD Categories


### Day 2 : Read & Create Product
[Day2 - Documentation](https://github.com/Itsnope/Simple-POS-nextjs/blob/main/docs/Day2.md)

- [x] Create product
- [x] Read product
- [x] Include file uploads with signed URL
- [x] Forms -> RHF (React Hook Form)
- [ ] Update product
- [ ] Delete product
- [ ] Filter product by category


### Day 3 : Cart & QRIS
[Day3 - Documentation](https://github.com/Itsnope/Simple-POS-nextjs/blob/main/docs/Day3.md)

- [x] Filter product by category
- [x] Add to cart (global state zustand)
- [x] Generate QRIS (Xendit) -> Berjalan bila transaksi &lt; Rp10.000.000 (kalau lebih akan error)
- [ ] Handle Payment (webhook -> NGROK | Localtunnel)


### Day 4 : Payment & Order
[Day4 - Documentation](https://github.com/Itsnope/Simple-POS-nextjs/blob/main/docs/Day4.md)

- [x] Handle Payment (webhook -> NGROK | Localtunnel)
- [x] Simulate Payment
- [x] Fetch orders
- [x] Filter orders
- [x] Update order status
- [x] Data sales
- [x] Toast notification

### Day 5 : Complete
[Day5 - Complete]()
- [x] Edit Product 
- [x] Delete product


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