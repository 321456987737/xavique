import ProductManager from "@/components/admin/components/ProductManager";
import EditProduct from "@/components/admin/components/editproduct";
export default function ProductsManagement() {
  return (
    <div className="p-6 w-full">
      <ProductManager />
      <EditProduct />
    </div>
  );
}
