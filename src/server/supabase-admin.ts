import { createClient } from '@supabase/supabase-js'

// Tujuan supabase-admin => biar bisa full akses ke supabase (kyk storage yg di akses router product)
// Di router product (BE), supabaseAdmin.storage dimanfaatkan untuk membuat (meng-generate) Signed Upload URL/tiket masuk untuk upload storage.
// Signed Upload URL digunakan FE untuk upload file nantinya (fungsi createProductImageUploadSignedUrl).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,    // supabaseUrl
  process.env.SUPABASE_ROLE_KEY!,           // supabaseKey
);
