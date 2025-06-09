import { createTRPCRouter, protectedProcedure } from "../trpc";


// query() -> fetching data
// mutation() => creating, updating, deleting data

export const categoryRouter = createTRPCRouter({
  // Setiap method harus panggil 1 procedure dri trpc.ts (../trpc)
  // public (akses dgn auth) atau protected (akses tanpa auth)


  // 'get' hitungannya untuk dapat data, jadi pakai 'query()'
  getCategories: protectedProcedure.query(async ({ ctx }) => {

    // untuk mendapatkan database
    const { db } = ctx;

    // query untuk mendapatkan semua categories 
    // 'await' digunakan karena 'findMany()' adalah operasi asinkron (akan menunggu hasil dari database).
    // db yg dari prisma beserta tabel/modelnya (category)
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        productCount: true,
      },
    });

    // Mengembalikan data 'categories' yang ditemukan dari database.
    return categories;
  }),
});