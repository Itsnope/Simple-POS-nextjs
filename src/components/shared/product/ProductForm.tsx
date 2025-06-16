import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductFormSchema } from "@/forms/product";
import { uploadFileToSignedUrl } from "@/lib/supabase";
import { Bucket } from "@/server/api/bucket";
import { api } from "@/utils/api";
import type { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

type ProductFormProps = {
  onSubmit: (values: ProductFormSchema) => void;
  onChangeImageUrl: (imageUrl: string) => void;
  // namaFungsi: (argumen: TipeArgumen) => ReturnType;
}

export const ProductForm = ({ onSubmit, onChangeImageUrl }: ProductFormProps) => {
  // Declare form apa yg ingin dipakai/bentuk form yg dipakai seperti apa
  const form = useFormContext<ProductFormSchema>();

  // Ambil list kategori
  const { data: categories } = api.category.getCategories.useQuery();

  // Buat signedUrl untuk gambar
    // mutateasync = bisa await dan proses data secara manual
  const { mutateAsync: createImageSignedUrl } = api.product.createProductImageUploadSignedUrl.useMutation();
  

  // HANDLER : saat upload image lewat <Input type="file"> (dari lokal).
    // Ketika berhasil upload, maka akan mentrigger props onChangeImageUrl di product pages (src/pages/products/index.tsx).
  const imageChangeHandlder = async (e: ChangeEvent<HTMLInputElement>) => {

    // 1. Mengambil file dri <Input> setelah onChange ke-trigger
    const files = e.target.files;
    
    // 2. KONDISI/validasi files yg diambil
    if (files && files?.length > 0) {

      // 3. Ambil file urutan 1 di daftar files
      const file = files[0];

      // 3a. klo file yg diambil ternyata kosong(walau files.length menunjukkan ada file), mka hentikan fungsi/tdk return apa-apa
      if (!file) return;


      // 3b. klo file yg diambil ada, maka....

      // 4. Panggil createImageSignedUrl() dan suruh buat signed url untuk upload file (src\server\api\routers\product.ts).
        // Terima hasil data dri router lalu ambil `path` dan `token` saja(Destructure).
      const { path, token } = await createImageSignedUrl();

      // 5. Panggil uploadFileToSignedUrl() terus kirim 4 parameter (src\lib\supabase.ts).
        // Terima hasil berupa publicUrl
      const imageUrl = await uploadFileToSignedUrl({
        bucket: Bucket.ProductImages,
        file,
        path,
        token
      })

      // alert(imageUrl);
      // Mengoper publicUrl dri fungsi imageUrl ke komponen luar (ke parent/product pages)
      onChangeImageUrl(imageUrl);
      alert("Uploaded image!");
    };
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        // berisi salah satu dri nilai ProductFormSchema (name, price, categoryId)
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        // berisi salah satu dri nilai ProductFormSchema (name, price, categoryId)
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        // name ="" berisi salah satu dri nilai ProductFormSchema (name, price, categoryId)
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              {/* ditambah value dan onValueChange untuk menyimpan value saat ini dan cara dia merespon ketika value diubah */}
              <Select
                value={field.value} 
                onValueChange={(value: string) => {
                field.onChange(value);
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>

                <SelectContent>
                  {categories?.map((category) => {
                      // ambil category name
                      // value = yg mau dikirim(id)/selectitem nerima value id category
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      );
                  })}
                </SelectContent>
                
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-1">
        <Label>Product Image</Label>

        {/* onChange hanya ke-trigger saat user sdh pilih file */}
        <Input onChange={imageChangeHandlder} type="file" accept="image/*" />
      </div>

    </form>
  );



};