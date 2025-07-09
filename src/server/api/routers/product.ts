import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { supabaseAdmin } from "@/server/supabase-admin";
import { Bucket } from "../bucket";
import { TRPCError } from "@trpc/server";


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

  // GENERATE SIGNEDURL =======================================
  createProductImageUploadSignedUrl: protectedProcedure.mutation(async () => {
    // supabaseAdmin.storage dimanfaatkan untuk membuat (meng-generate) Signed Upload URL/tiket masuk untuk upload storage
    const { data, error } = await supabaseAdmin.storage
      .from(Bucket.ProductImages)
      .createSignedUploadUrl(
        // penamaan
        `${Date.now()}.jpeg`
      );

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message
      })
    }

    // OUTPUT : data (path, token, & signedUrl)
    // path yg dihasilkan = nama file sesuai createSignedUploadUrl
    // dipakai di uploadFileToSignedUrl (src/lib/supabase.ts)
    return data;
  }),


  // CREATE ==================================================
  createProducts: protectedProcedure
  .input(
    z.object({
      name: z.string().min(3, "Minimum of 3 characters"),
      price: z.number().min(1000),
      categoryId: z.string(),

      // multipart/form-data | JSON
      // FE harus bisa upload ke BE (sangat haram kalau publik bisa upload ke bucket(BE), jdi butuh pre-signed url dgn masa berlaku yg di set)
      // pre-signed bisa upload gambar ke bucket be kita
      imageUrl: z.string().url(),
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
        // imageUrl: "https://placehold.co/600x400"
        imageUrl: input.imageUrl,
      },
    });

    return newProduct;
  }),

  // DELETE ===================================================
  deleteProductsById: protectedProcedure
  .input(
    z.object({
      productId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { db } = ctx;

    await db.product.delete({
      where: {
        id: input.productId,
      },
    });
  }),

});