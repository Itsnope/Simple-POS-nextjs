import type { Bucket } from "@/server/api/bucket";
import { createClient } from "@supabase/supabase-js";

// Supabase client memungkinkan public untuk terhubung dengan supabase kita (upload file ke bucket)
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Fungsi yang mengupload file ke signedurl terus mengambil public urlnya
  // Fungsi ini dapat kiri ProductForm
export async function uploadFileToSignedUrl({
  file,
  path,
  token,
  bucket,
}: {
  file: File;
  path: string;
  token: string;
  bucket: Bucket;
}) {
  try {

    // LANGKAH 1: Mengunggah file ke Supabase Storage menggunakan Signed URL
    // Fungsi sebagai petunjuk upload file ('file' A ke 'path' B yg ada di 'bucket'. Ini 'token'/izin nya)
    // path & token dihasilkan dri router product pada fungsi createProductImageUploadSignedUrl
    // eslint-disable-next-line
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .uploadToSignedUrl(path, token, file); 


    // LANGKAH 2: Penanganan Error setelah upaya upload
      // Kondisi klo error & data kosong 
    if (error) {throw error;};
    if (!data) {throw new Error("No data returned from uploadToSignedUrl");};


    // LANGKAH 3: Mendapatkan Public URL dari file yang baru saja diunggah
    // Fungsi untuk mengambil publicurl di bucket sesuai path data 
    // File yang berhasil diupload di bucket public akan memiliki public url (bisa diakses publik) 
    const fileUrl = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(data.path);
      

    // LANGKAH 4: Mengembalikan Public URL
    // Public url file akan di return sebagai OUTPUT dari fungsi ini ke yg panggil (ProductForm.tsx).
    return fileUrl.data.publicUrl;

  } catch (error) {
    
    throw error;

  };

};