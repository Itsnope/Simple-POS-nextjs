import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductFormSchema } from "@/forms/product";
import { api } from "@/utils/api";
import { useFormContext } from "react-hook-form";

type ProductFormProps = {
  onSubmit: (values: ProductFormSchema) => void;
  // namaFungsi: (argumen: TipeArgumen) => ReturnType;
}

export const ProductForm = ({ onSubmit }: ProductFormProps) => {
  // Declare form apa yg ingin dipakai/bentuk form yg dipakai seperti apa
  const form = useFormContext<ProductFormSchema>();

  // Ambil list kategori
  const { data: categories } = api.category.getCategories.useQuery();

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
    </form>
  );



};