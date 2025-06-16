import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const productRouter = createTRPCRouter({
  
  // READ =====================================================
  getProducts: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,

        // category adalah koneksi ke model lain (model category)
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return products;
  }),

  // CREATE ==================================================
  createProducts: protectedProcedure
  .input(
    z.object({
      name: z.string().min(3, "Minimum of 3 characters"),
      price: z.number().min(1000),
      categoryId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { db } = ctx;

    // Kirim ke DB
    const newProduct = await db.product.create({
      data: {
        name: input.name,
        price: input.price,
        // categoryId: input.categoryId, => sama aja dgn yg dibawah
        category: {
          connect: {
            id: input.categoryId,
          },
        },
      },
    });

    return newProduct;
  }),

});