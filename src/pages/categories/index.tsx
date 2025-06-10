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

const CategoriesPage: NextPageWithLayout = () => {
  // menggunakan alat untuk mengelola data yg di cache trpc sisi klien
  const apiUtils = api.useUtils();


  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] =
    useState(false);
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const createCategoryForm = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
  });

  const editCategoryForm = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
  });

  // function untuk mengambil data dari db
  // category diambil dari root.ts (createTRPCRouter)
  // data: categories, mengganti nama data menjadi categories
  const { data: categories, isLoading: categoriesIsLoading } = 
    api.category.getCategories.useQuery();

  // function untuk mengambil data yg akan di input dri category.ts
  // mutate function untuk create category
  const { mutate: createCategory } = 
    api.category.createCategory.useMutation({
      // reflect perubahan/interaksi frontend sesuai
      onSuccess: async () => {
        // 4. invalidate data (data yg skrng tdk valid, harus kasi yg baru)
        // promise jdi merupakan async 
        await apiUtils.category.getCategories.invalidate();
        // 1. berhasil buat kategori baru
        alert("Successfully created a new category");
        // 2. keluar dari modal saat di klik create
        setCreateCategoryDialogOpen(false);
        // 3. category name modal ke reset jdi 0
        createCategoryForm.reset();
      },
    });

  // CategoryFormSchema untuk validasi form
  const handleSubmitCreateCategory = (data: CategoryFormSchema) => {
    createCategory({
      // object diambil dari createCategory category.ts
      name: data.name,
    });
    // alert(data.name)
    // console.log(data);
  };

  const { mutate: deleteCategoryById } = 
    api.category.deleteCategoryById.useMutation({
      onSuccess: async () => {
        await apiUtils.category.getCategories.invalidate();

        alert("Successfully deleted a new category");
        setCategoryToDelete(null);
      }
    });

  const handleSubmitEditCategory = (data: CategoryFormSchema) => {
    console.log(data);
  };

  const handleClickEditCategory = (category: Category) => {
    setEditCategoryDialogOpen(true);

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
    // karena categoryId harus string, sedangkan categoryToDelete bisa string bisa null
    if (!categoryToDelete) return;

    deleteCategoryById({
      categoryId: categoryToDelete
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
      <div className="grid grid-cols-4 gap-4">
        {categories?.map((category) => {
          return (
            <CategoryCatalogCard 
              key={category.id} 
              name={category.name} 
              productCount={category.productCount}
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
