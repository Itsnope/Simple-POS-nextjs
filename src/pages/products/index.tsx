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
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { productFormSchema, type ProductFormSchema } from "@/forms/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ProductForm } from "@/components/shared/product/ProductForm";
import { toast } from "sonner";

const ProductsPage: NextPageWithLayout = () => {
  const apiUtils = api.useUtils();

  // react useState digunakan untuk simpan data di suatu state
  const [uploadedCreateProductImageUrl, setUploadedCreateProductImageUrl] = useState<string | null>(null);
  const [createProductDialogOpen, setCreateProductDialogOpen] = useState(false);
  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);



  // FORMS =====================================================================

  // CREATE FORM =============================================
    // useForm = Buat form yg type safety untuk data form sesuai ProductFormSchema.
    // resolver = validasi form field
    // zodResolver = menghubungkan validasi zod(rulesnya) dgn react hook form(formnya).
  const createProductForm = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
  });

  const editProductForm = useForm<ProductFormSchema>({
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

      toast("Successfully created a new product"); // 1. berhasil buat kategori baru
      setCreateProductDialogOpen(false); // 2. keluar dari modal saat di klik create
      createProductForm.reset(); // 3. product name modal ke reset jdi 0
    }
  });

  // EDIT
  const { mutate: editProduct } = 
    api.product.editProducts.useMutation({
      onSuccess: async () => {
        await apiUtils.product.getProducts.invalidate();

        toast("Successfully edited a new product");
        setEditProductDialogOpen(false);
        editProductForm.reset();  // 3. category name modal ke reset jdi 0
        setProductToEdit(null);
      },
    })

  // DELETE
  const { mutate: deleteProductById } = 
    api.product.deleteProductsById.useMutation({
      onSuccess: async () => {
        await apiUtils.product.getProducts.invalidate();

        toast("Successfully deleted product");
        setProductToDelete(null);
      }
    })
  


  // HANDLERS ==================================================
  // CREATE HANDLE =============================================
  const handleSubmitCreateProduct = (values: ProductFormSchema) => {
    // validasi imageUrl karena nilai uploadedCreateProductImageUrl yg bisa null
    if (!uploadedCreateProductImageUrl) {
      toast("Please upload a product image first");
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


  // EDIT HANDLE ===================================
  // values = data yg diisi user di form edit produk
  // handleSubmitEditProduct akan menjalankan mutasi editProduct dengan id produk dari productToEdit
  const handleSubmitEditProduct = (values: ProductFormSchema) => {
    if (!productToEdit) return;
    
    editProduct({
      productId: productToEdit,
      name: values.name,
      price: values.price,
      categoryId: values.categoryId,
      imageUrl: uploadedCreateProductImageUrl ?? values.imageUrl,
    });
  };

  // Klik tombol edit
  const handleClickEditProduct = (product: { id: string; name: string; price: number, categoryId: string, imageUrl: string }) => {
    setEditProductDialogOpen(true);
    setProductToEdit(product.id);

    editProductForm.reset({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl
    });
  };


  // DELETE HANDLE =================================
  const handleClickDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
  };

  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;

    deleteProductById({
      productId: productToDelete,
    })
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
                  // Pas user tekan enter handleSubmitCreateProduct jalan
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
                {/* Pas button di klik handleSubmitCreateProduct jalan */}
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

                // Pas data produk ditampilkan
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.imageUrl ?? "https://placehold.co/600x400"}
                category={product.category.name}

                // Pas edit di klik
                onEdit={() => handleClickEditProduct({
                  id : product.id,
                  name : product.name,
                  price : product.price,
                  categoryId : product.category.id,
                  imageUrl : product.imageUrl ?? "https://placehold.co/600x400",
                })}

                // Pas delete di klik
                onDelete={() => handleClickDeleteProduct(product.id)}
              />
            );
          })}
      </div>

      <AlertDialog
        open={editProductDialogOpen}
        onOpenChange={setEditProductDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Product</AlertDialogTitle>
          </AlertDialogHeader>
          <Form {...editProductForm}>
            <ProductForm
              // handleSubmitEditProduct jalan saat user tekan enter
              onSubmit={handleSubmitEditProduct}
              onChangeImageUrl={(imageUrl) => {
                setUploadedCreateProductImageUrl(imageUrl);
              }}
              // submitText="Edit Category"
            />
          </Form>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {/* handleSubmitEditProduct jalan saat user tekan tombol */}
            <Button
              onClick={editProductForm.handleSubmit(handleSubmitEditProduct)}
            >
              Edit Product
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog 
        open={!!productToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleConfirmDeleteProduct}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    </>
  );
};

ProductsPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProductsPage;
