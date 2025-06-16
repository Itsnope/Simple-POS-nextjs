import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import type { NextPageWithLayout } from "../_app";
import { useState, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/data/mock";
import { ProductMenuCard } from "@/components/shared/product/ProductMenuCard";
import { ProductCatalogCard } from "@/components/shared/product/ProductCatalogCard";
import { api } from "@/utils/api";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { productFormSchema, type ProductFormSchema } from "@/forms/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ProductForm } from "@/components/shared/product/ProductForm";

const ProductsPage: NextPageWithLayout = () => {
  const apiUtils = api.useUtils();

  // react useState digunakan untuk simpan data di suatu state
  const [uploadedCreateProductImageUrl, setUploadedCreateProductImageUrl] = useState<string | null>(null);
  const [createProductDialogOpen, setCreateProductDialogOpen] = useState(false);



  // FORMS =====================================================================

  // CREATE FORM =============================================
    // useForm = Buat form yg type safety untuk data form sesuai ProductFormSchema.
    // resolver = validasi form field
    // zodResolver = menghubungkan validasi zod(rulesnya) dgn react hook form(formnya).
  const createProductForm = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
  });



  // QUERIES AND MUTATIONS =====================================

  // READ ====================================================
  const { data: products } = api.product.getProducts.useQuery();

  // CREATE ==================================================
    // pakai fungsi createProducts-nya BE
  const { mutate: createProducts } = 
  api.product.createProducts.useMutation({
    onSuccess: async () => {
      await apiUtils.product.getProducts.invalidate(); // 4. invalidate data (data yg skrng tdk valid, harus kasi yg baru)

      alert("Successfully created a new product"); // 1. berhasil buat kategori baru
      setCreateProductDialogOpen(false); // 2. keluar dari modal saat di klik create
      createProductForm.reset(); // 3. product name modal ke reset jdi 0
    }
  });
  


  // HANDLERS ==================================================
  // CREATE HANDLE =============================================
  const handleSubmitCreateProduct = (values: ProductFormSchema) => {
    // validasi imageUrl karena nilai uploadedCreateProductImageUrl yg bisa null
    if (!uploadedCreateProductImageUrl) {
      alert("Please upload a product image first");
      return;
    };

    createProducts({
      name: values.name,
      price: values.price,
      categoryId: values.categoryId,
      imageUrl: uploadedCreateProductImageUrl,
    });
    // alert("create product");
    // alert("create product");
  };



  return (
    <>
      <DashboardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <DashboardTitle>Product Management</DashboardTitle>
            <DashboardDescription>
              View, add, edit, and delete products in your inventory.
            </DashboardDescription>
          </div>

          <AlertDialog 
            open={createProductDialogOpen}
            onOpenChange={setCreateProductDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button>Add New Product</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Product</AlertDialogTitle>
              </AlertDialogHeader>
              <Form {...createProductForm} >
                <ProductForm 
                  // Tidak digunakan secara langsung dialur create
                  onSubmit={handleSubmitCreateProduct}

                  // Props onChangeImageUrl akan nge-trigger setUploadedCreateProductImageUrl untuk simpan imageUrl ke state.
                    // imageUrl ter-set atau tersimpan ke state uploadedCreateProductImageUrl
                  onChangeImageUrl={(imageUrl) => {
                    setUploadedCreateProductImageUrl(imageUrl);
                  }}
                />

              </Form>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {/* Saat di klik createProductForm.handleSubmit diaktifkan dan handleSubmitCreateProduct dijalankan */}
                <Button 
                  onClick={createProductForm.handleSubmit(
                    handleSubmitCreateProduct,
                  )} 
                >
                  Create Product
                </Button>
              </AlertDialogFooter>

            </AlertDialogContent>
          </AlertDialog>

        </div>
      </DashboardHeader>

      {/* Tampilan daftar product */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* {products?.map((product) => (
          <ProductCatalogCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.imageUrl ?? ""}
            category={product.category.name}
            onEdit={() => void 0}
            onDelete={() => void 0}
          />
        ))} */}
        {products?.map((product) => {
            return (
              <ProductCatalogCard 
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.imageUrl ?? ""}
                category={product.category.name}
              />
            );
          })}
      </div>
    </>
  );
};

ProductsPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProductsPage;
