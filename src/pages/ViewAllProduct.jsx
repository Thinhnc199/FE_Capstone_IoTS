import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Titles from "../components/common/Titles";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "./Home/components/ProductCard";

export default function ViewAllProduct() {
  const dispatch = useDispatch();

  const {
    items,

    pageIndex,
    pageSize,

    searchKeyword,
    startFilterDate,
    endFilterDate,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(
      fetchProducts({
        pageIndex,
        pageSize: 100,
        searchKeyword: searchKeyword,
        startFilterDate: startFilterDate,
        endFilterDate: endFilterDate,
      })
    );
  }, [
    dispatch,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
  ]);

  return (
    <div className="container mx-auto  p-4  bg-white shadow-lg my-6">
      <Titles
        titleText="IOT ITEMS - VIEW ALL"
        colorText="text-headerBg"
        strongText="font-semibold"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 my-4">
        {items && items.length > 0 ? (
          items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
}
// className="w-full h-48 object-cover rounded-t-lg"
