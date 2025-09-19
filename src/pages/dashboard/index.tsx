import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import { CategoryFilterCard } from "@/components/shared/category/CategoryFilterCard";
import { CreateOrderSheet } from "@/components/shared/CreateOrderSheet";
import { ProductMenuCard } from "@/components/shared/product/ProductMenuCard";
import { Input } from "@/components/ui/input";
import { CATEGORIES, PRODUCTS } from "@/data/mock";
import { Search, ShoppingCart } from "lucide-react";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import type { NextPageWithLayout } from "../_app";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";

const DashboardPage: NextPageWithLayout = () => {

  // Variabel global dri cart.ts
  const cartStore = useCartStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderSheetOpen, setOrderSheetOpen] = useState(false);

  // Mengambil data kategori dan produk dari API menggunakan React Query
  const { data: categories } = api.category.getCategories.useQuery();
  const { data: products } = api.product.getProducts.useQuery();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = (productId: string) => {
    // cartStore.addToCart();

    // Mencari dan mengambil objek produk dari array products yang memiliki id sama dengan nilai productId(yg di card).
    const productToAdd = products?.find(product => product.id === productId);

    if (!productToAdd) {
      toast("Product not found");
      return;
    };

    // 4 properti ini akan dikirim ke fungsi addToCart dari cart.ts
    cartStore.addToCart({
      name: productToAdd.name,
      productId: productToAdd.id,
      imageUrl: productToAdd.imageUrl ?? "https://placehold.co/600x400",
      price: productToAdd.price,
    });
  };

  // Menampilkan produk berdasarkan kategori yg di klik (id kategori)
  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      const categoryMatch =
        selectedCategory === "all" || product.category.id  === selectedCategory;

      const searchMatch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchQuery, products]);

  return (
    <>
      <DashboardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <DashboardTitle>Dashboard</DashboardTitle>
            <DashboardDescription>
              Welcome to your Simple POS system dashboard.
            </DashboardDescription>
          </div>
          
          {/* Kalau items.length > 0 atau items itu ada nilai maka setorderSheetOpen true (tombol cart muncul) */}
          {
            !!cartStore.items.length && (
              <Button
                className="animate-in slide-in-from-right"
                onClick={() => setOrderSheetOpen(true)}
              >
                <ShoppingCart /> Cart
              </Button>
            )
          }
        </div>
      </DashboardHeader>

      <div className="space-y-6">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2">
          {/* Filter card All yg menampilkan semua produk */}
          <CategoryFilterCard
            // key digunakan react untuk identifikasi elemen dalam list (biar list bisa di render)
            key="all"
            name="All"
            productCount={products?.length ?? 0}
            isSelected={selectedCategory === "all"}
            onClick={() => handleCategoryClick("all")}
          />
          {/* Filter card yg menampilkan produk sesuai kategori yg di klik */}
          {categories?.map((category) => {
            // Hitung jumlah produk untuk tiap kategori (id kategori)
            const productCategory = products?.filter((product) => product.category.id === category.id).length ?? 0;
            return (
              <CategoryFilterCard
                // key digunakan react untuk identifikasi elemen dalam list (biar list bisa di render)
                key={category.id}
                name={category.name}
                productCount={productCategory}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
            );
          })}
        </div>

        <div>
          {filteredProducts?.length === 0 ? (
            <div className="my-8 flex flex-col items-center justify-center">
              <p className="text-muted-foreground text-center">
                No products found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts?.map((product) => (
                <ProductMenuCard
                  // key digunakan react untuk identifikasi elemen dalam list (biar list bisa di render)
                  key={product.id}
                  productId={product.id}
                  name={product.name}
                  price={product.price}

                  // imageUrl cmn terima string, tapi product.imageUrl bisa null/string. Jadi, perlu nilai kedua yg PASTI string.
                  imageUrl={product.imageUrl ?? "https://placehold.co/600x400" }
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      <CreateOrderSheet
        open={orderSheetOpen}
        onOpenChange={setOrderSheetOpen}
      />
    </>
  );
};

DashboardPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;
