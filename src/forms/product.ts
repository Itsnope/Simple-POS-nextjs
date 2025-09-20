import { z } from 'zod';

// Validasi data form (Buat aturan data yg bisa diterima itu kekmana)
  // Ini di pakai di ProductSchema.tsx
export const productFormSchema = z.object({
  name: z.string().min(3).max(30),

  // walau input type di set ke number, value yg dikirim akan tetap string (padahal, value harus number).
  // price: z.number().min(1000)

  // coerce = convert ke tipe yg di declare berikutnya/setelahnya (number)
  price: z.coerce.number().min(1000),
  categoryId: z.string(),
  imageUrl: z.string().url(),
});

// type typescript yg refleksikan product schema
export type ProductFormSchema = z.infer<typeof productFormSchema>;