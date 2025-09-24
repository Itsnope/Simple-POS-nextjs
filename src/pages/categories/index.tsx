import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import { CategoryCatalogCard } from "@/components/shared/category/CategoryCatalogCard";
import { CategoryForm } from "@/components/shared/category/CategoryForm";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CATEGORIES, type Category } from "@/data/mock";
import { categoryFormSchema, type CategoryFormSchema } from "@/forms/category";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { NextPageWithLayout } from "../_app";
import { api } from "@/utils/api";
import { toast } from "sonner";

const CategoriesPage: NextPageWithLayout = () => {
  // menggunakan alat untuk mengelola data yg di cache trpc sisi klien
  const apiUtils = api.useUtils();


  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] =
    useState(false);
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);

  const { data: products } = api.product.getProducts.useQuery();

  // FORMS =====================================================================
  const createCategoryForm = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
  });

  const editCategoryForm = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
  });

  // QUERIES & MUTATIONS =========================================================
  
  // READ
  // function untuk mengambil data dari db.
    // category diambil dari root.ts (createTRPCRouter).
    // data: categories, mengganti nama data menjadi categories.
  const { data: categories, isLoading: categoriesIsLoading } = 
    api.category.getCategories.useQuery();

    
  // CREATE
  // function untuk mengambil data yg akan di input dri category.ts
  // mutate function untuk create category
  const { mutate: createCategory } = 
    api.category.createCategory.useMutation({
      // reflect perubahan/interaksi frontend sesuai
      onSuccess: async () => {
        // promise jdi merupakan async 
        await apiUtils.category.getCategories.invalidate(); // 4. invalidate data (data yg skrng tdk valid, harus kasi yg baru)
        toast("Successfully created a new category"); // 1. berhasil buat kategori baru
        setCreateCategoryDialogOpen(false); // 2. keluar dari modal saat di klik create
        createCategoryForm.reset(); // 3. category name modal ke reset jdi 0
      },
    });
  

  // EDIT
  const { mutate: editCategory } = 
    api.category.editCategory.useMutation({
      onSuccess: async () => {
        await apiUtils.category.getCategories.invalidate();

        toast("Successfully edited a new category");
        setEditCategoryDialogOpen(false);
        editCategoryForm.reset();  // 3. category name modal ke reset jdi 0
        setCategoryToEdit(null);
      },
    });

  // DELETE
  const { mutate: deleteCategoryById } = 
    api.category.deleteCategoryById.useMutation({
      onSuccess: async () => {
        await apiUtils.category.getCategories.invalidate();

        toast("Successfully deleted a new category");
        setCategoryToDelete(null);
      }
    });


  // HANDLERS =====================================================
  // Submit create
  // CategoryFormSchema untuk validasi form
  const handleSubmitCreateCategory = (data: CategoryFormSchema) => {
    createCategory({
      name: data.name, // object diambil dari createCategory category.ts
    });
    // alert(data.name)
    // console.log(data);
  };

  // Submit hasil edit
  const handleSubmitEditCategory = (data: CategoryFormSchema) => {
    // console.log(data);
    if (!categoryToEdit) return;

    editCategory({
      name: data.name,
      categoryId: categoryToEdit,
    });
  };

  // Klik tombol edit
  const handleClickEditCategory = (category: { id: string; name: string }) => {
    setEditCategoryDialogOpen(true);
    setCategoryToEdit(category.id);

    editCategoryForm.reset({
      name: category.name,
    });
  };

  // fungsi untuk modal delete
  const handleClickDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
  };

  // fungsi untuk konfirmasi delete
  const handleConfirmDeleteCategory = () => {
    // karena nilai categoryId adalah string, sedangkan nilai categoryToDelete bisa string atau null
    if (!categoryToDelete) return;

    deleteCategoryById({
      categoryId: categoryToDelete,
    })
  };

  return (
    <>
      <DashboardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <DashboardTitle>Category Management</DashboardTitle>
            <DashboardDescription>
              Organize your products with custom categories.
            </DashboardDescription>
          </div>

          <AlertDialog
            open={createCategoryDialogOpen}
            onOpenChange={setCreateCategoryDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button>Add New Category</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Category</AlertDialogTitle>
              </AlertDialogHeader>
              <Form {...createCategoryForm}>
                <CategoryForm
                  onSubmit={handleSubmitCreateCategory}
                  submitText="Create Category"
                />
              </Form>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={createCategoryForm.handleSubmit(
                    handleSubmitCreateCategory,
                  )}
                >
                  Create Category
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardHeader>

      {/* Tampilan UI categoriesnya */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories?.map((category) => {

          // Hitung jumlah produk untuk tiap kategori (id kategori)
          const productCategory = products?.filter((product) => product.category.id === category.id).length ?? 0;
          
          return (
            <CategoryCatalogCard 
              key={category.id} 
              name={category.name} 
              productCount={productCategory}
              // tombol edit (handleClickEditCategory nerima type category= ada id, name, count)
              onEdit={() => handleClickEditCategory({ 
                  id: category.id, 
                  name: category.name 
                })
              }
              // tombol delete
              onDelete={() => handleClickDeleteCategory(category.id)}
            />
          );
        })}
      </div>

      <AlertDialog
        open={editCategoryDialogOpen}
        onOpenChange={setEditCategoryDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Category</AlertDialogTitle>
          </AlertDialogHeader>
          <Form {...editCategoryForm}>
            <CategoryForm
              onSubmit={handleSubmitEditCategory}
              submitText="Edit Category"
            />
          </Form>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={editCategoryForm.handleSubmit(handleSubmitEditCategory)}
            >
              Edit Category
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleConfirmDeleteCategory}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

CategoriesPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CategoriesPage;
