import { z } from "zod";
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

  createCategory: protectedProcedure
  .input(
    // input() bisa declare schema object, makanya digunakan zod(z) untuk memastikan tipe data sesuai(runtime type checker)
    z.object({
      name: z.string().min(3, "Minimum of 3 characters"),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { db } = ctx;

    const newCategory = await db.category.create({
      // Berdasarkan model category, cuman data name yg diisi manual, karena yg lain punya nilai default/auto generated
      data: {
        name: input.name
      },
      select: {
        id: true,
        name: true,
        productCount: true,
      }
    });
     
    return newCategory;
  }),

  deleteCategoryById: protectedProcedure
  .input(
    z.object({
      categoryId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { db } = ctx;

    await db.category.delete({
      where: {
        id: input.categoryId,
      },
    });
  }),
});