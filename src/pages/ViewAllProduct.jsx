// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import Titles from "../components/common/Titles";
// import {
//   fetchProducts,
//   setPageIndex,
//   setPageSize,
// } from "../redux/slices/productSlice";
// import BreadcrumbNav from "../components/common/BreadcrumbNav";
// import ProductCard from "./Home/components/ProductCard";
// import { Pagination } from "antd";
// export default function ViewAllProduct() {
//   const dispatch = useDispatch();

//   const {
//     items,
//     pageIndex,
//     pageSize,
//     searchKeyword,
//     startFilterDate,
//     endFilterDate,
//     totalCount,
//   } = useSelector((state) => state.products);

//   useEffect(() => {
//     dispatch(
//       fetchProducts({
//         pageIndex,
//         pageSize,
//         searchKeyword: searchKeyword,
//         startFilterDate: startFilterDate,
//         endFilterDate: endFilterDate,
//       })
//     );
//   }, [
//     dispatch,
//     pageIndex,
//     pageSize,
//     searchKeyword,
//     startFilterDate,
//     endFilterDate,
//   ]);
//   const handlePageChange = (newPage, newPageSize) => {
//     dispatch(setPageIndex(newPage));
//     dispatch(setPageSize(newPageSize));
//   };

//   return (
//     <div className="container mx-auto p-8">
//       <BreadcrumbNav
//         items={[{ label: "Home", path: "/" }, { label: "Shop" }]}
//       />
//       <div className="container mx-auto  p-4   bg-white shadow-lg my-6">
//         <Titles
//           titleText="IOT ITEMS - VIEW ALL"
//           colorText="text-headerBg"
//           strongText="font-semibold"
//         />
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 my-4">
//           {items && items.length > 0 ? (
//             items.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))
//           ) : (
//             <p>No products available</p>
//           )}
//         </div>
//         {/* Pagination */}
//         <div className="mt-6 flex justify-end">
//           <Pagination
//             current={pageIndex}
//             pageSize={pageSize}
//             total={totalCount}
//             onChange={handlePageChange}
//             showSizeChanger={true}
//             pageSizeOptions={["10", "20", "30", "50"]}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Titles from "../components/common/Titles";
import {
  fetchProducts,
  setPageIndex,
  setPageSize,
} from "../redux/slices/productSlice";
import BreadcrumbNav from "../components/common/BreadcrumbNav";
import ProductCard from "./Home/components/ProductCard";
import { Pagination } from "antd";

export default function ViewAllProduct() {
  const dispatch = useDispatch();

  const {
    items,
    pageIndex,
    pageSize,
    searchKeyword,
    startFilterDate,
    endFilterDate,
    totalCount,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(
      fetchProducts({
        pageIndex,
        pageSize,
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

  const handlePageChange = (newPage, newPageSize) => {
    dispatch(setPageIndex(newPage));
    dispatch(setPageSize(newPageSize));
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <BreadcrumbNav
        items={[{ label: "Home", path: "/" }, { label: "Shop" }]}
      />
      <div className="container mx-auto p-2 sm:p-4 bg-white shadow-lg my-4 sm:my-6">
        <Titles
          titleText="IOT ITEMS - VIEW ALL"
          colorText="text-headerBg"
          strongText="font-semibold"
        />
        <div className="responsive-grid my-2 sm:my-4">
          {items && items.length > 0 ? (
            items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center">No products available</p>
          )}
        </div>
        <div className="mt-4 sm:mt-6 flex justify-end">
          <Pagination
            current={pageIndex}
            pageSize={pageSize}
            total={totalCount}
            onChange={handlePageChange}
            showSizeChanger={true}
            pageSizeOptions={["10", "20", "30", "50"]}
            responsive={true}
          />
        </div>
      </div>
    </div>
  );
}
